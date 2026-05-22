<template>
  <div class="space-y-6">
    <!-- Add Transaction Form -->
    <div class="card">
      <h2 class="text-lg font-bold mb-4">💳 Tambah Transaksi Baru</h2>
      <form @submit.prevent="submitTransaction" class="space-y-4">
        <!-- Transaction Type -->
        <div>
          <label class="block text-sm font-semibold mb-2">Jenis Transaksi</label>
          <div class="flex gap-4">
            <label class="flex items-center">
              <input v-model="form.type" type="radio" value="income" class="mr-2" />
              <span>➕ Pemasukan</span>
            </label>
            <label class="flex items-center">
              <input v-model="form.type" type="radio" value="expense" class="mr-2" />
              <span>➖ Pengeluaran</span>
            </label>
          </div>
        </div>

        <!-- Category -->
        <div>
          <label class="block text-sm font-semibold mb-2">Kategori</label>
          <select v-model="form.categoryId" class="input-field">
            <option value="">Pilih Kategori</option>
            <option v-for="cat in filteredCategories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <!-- Amount -->
        <div>
          <label class="block text-sm font-semibold mb-2">Jumlah (Rp)</label>
          <input
            v-model.number="form.amount"
            type="number"
            placeholder="Masukkan jumlah"
            class="input-field"
            required
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-semibold mb-2">Keterangan</label>
          <textarea
            v-model="form.description"
            placeholder="Masukkan keterangan transaksi"
            class="input-field"
            rows="3"
          ></textarea>
        </div>

        <!-- Date -->
        <div>
          <label class="block text-sm font-semibold mb-2">Tanggal</label>
          <input v-model="form.date" type="date" class="input-field" required />
        </div>

        <!-- Payment Method -->
        <div>
          <label class="block text-sm font-semibold mb-2">Metode Pembayaran</label>
          <select v-model="form.paymentMethod" class="input-field">
            <option value="cash">💵 Tunai</option>
            <option value="transfer">🏦 Transfer</option>
            <option value="debit">💳 Debit</option>
          </select>
        </div>

        <!-- Submit -->
        <button type="submit" class="btn-primary w-full">Simpan Transaksi</button>
      </form>
    </div>

    <!-- Recent Transactions -->
    <div class="card">
      <h2 class="text-lg font-bold mb-4">📝 Daftar Transaksi</h2>
      <div v-if="transactions.length === 0" class="text-center py-8">
        <p class="text-gray-400">Belum ada transaksi</p>
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="transaction in sortedTransactions"
          :key="transaction.id"
          class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4"
          :class="transaction.type === 'income' ? 'border-green-500' : 'border-red-500'"
        >
          <div class="flex-1">
            <p class="font-semibold">{{ transaction.description }}</p>
            <p class="text-xs text-gray-500">{{ formatDate(transaction.date) }} • {{ transaction.paymentMethod }}</p>
          </div>
          <div class="flex items-center gap-3">
            <span :class="['font-bold text-lg', transaction.type === 'income' ? 'text-green-600' : 'text-red-600']">
              {{ transaction.type === 'income' ? '+' : '-' }} Rp {{ formatCurrency(transaction.amount) }}
            </span>
            <button @click="deleteTransaction(transaction.id)" class="text-red-600 hover:text-red-700">❌</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTransactionStore } from '../stores/transactionStore'
import { db } from '../db/init'

const store = useTransactionStore()

onMounted(() => {
  store.loadTransactions()
  loadCategories()
})

const form = ref({
  type: 'expense',
  categoryId: '',
  amount: '',
  description: '',
  date: new Date().toISOString().split('T')[0],
  paymentMethod: 'cash'
})

const categories = ref([])

async function loadCategories() {
  categories.value = await db.categories.toArray()
}

const transactions = computed(() => store.transactions)

const sortedTransactions = computed(() =>
  [...transactions.value].sort((a, b) => new Date(b.date) - new Date(a.date))
)

const filteredCategories = computed(() =>
  categories.value.filter(c => c.type === form.value.type)
)

async function submitTransaction() {
  if (!form.value.categoryId || !form.value.amount) {
    alert('Lengkapi semua data!')
    return
  }

  try {
    await store.addTransaction(form.value)
    alert('Transaksi berhasil disimpan!')
    form.value = {
      type: 'expense',
      categoryId: '',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'cash'
    }
  } catch (error) {
    alert('Gagal menyimpan transaksi!')
  }
}

function deleteTransaction(id) {
  if (confirm('Yakin hapus transaksi ini?')) {
    store.deleteTransaction(id)
  }
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount || 0)
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('id-ID', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}
</script>
