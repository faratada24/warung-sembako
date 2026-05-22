<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Add Customer Form -->
      <div class="card">
        <h2 class="text-lg font-bold mb-4">👥 Tambah Pelanggan Baru</h2>
        <form @submit.prevent="submitCustomer" class="space-y-4">
          <input
            v-model="customerForm.name"
            type="text"
            placeholder="Nama Pelanggan"
            class="input-field"
            required
          />
          <input
            v-model="customerForm.phone"
            type="tel"
            placeholder="Nomor HP (opsional)"
            class="input-field"
          />
          <textarea
            v-model="customerForm.address"
            placeholder="Alamat (opsional)"
            class="input-field"
            rows="3"
          ></textarea>
          <button type="submit" class="btn-primary w-full">Tambah Pelanggan</button>
        </form>
      </div>

      <!-- Add Debt Form -->
      <div class="card">
        <h2 class="text-lg font-bold mb-4">📝 Catat Hutang Baru</h2>
        <form @submit.prevent="submitDebt" class="space-y-4">
          <select v-model.number="debtForm.customerId" class="input-field" required>
            <option value="">Pilih Pelanggan</option>
            <option v-for="customer in customers" :key="customer.id" :value="customer.id">
              {{ customer.name }}
            </option>
          </select>
          <input
            v-model.number="debtForm.amount"
            type="number"
            placeholder="Jumlah Hutang (Rp)"
            class="input-field"
            required
          />
          <input v-model="debtForm.dueDate" type="date" class="input-field" required />
          <textarea
            v-model="debtForm.notes"
            placeholder="Catatan"
            class="input-field"
            rows="2"
          ></textarea>
          <button type="submit" class="btn-secondary w-full">Catat Hutang</button>
        </form>
      </div>
    </div>

    <!-- Customers List -->
    <div class="card">
      <h2 class="text-lg font-bold mb-4">👫 Daftar Pelanggan</h2>
      <div v-if="customers.length === 0" class="text-center py-8">
        <p class="text-gray-400">Belum ada pelanggan</p>
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="customer in customers"
          :key="customer.id"
          class="p-4 bg-gray-50 rounded-lg border-l-4 border-primary"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <p class="font-bold text-lg">{{ customer.name }}</p>
              <p class="text-sm text-gray-600">{{ customer.phone }}</p>
              <p class="text-xs text-gray-500">{{ customer.address }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-600">Total Hutang</p>
              <p class="font-bold text-lg text-danger">Rp {{ formatCurrency(customer.totalDebt || 0) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Debts List -->
    <div class="card">
      <h2 class="text-lg font-bold mb-4">💳 Daftar Hutang</h2>
      <div class="space-y-2 mb-4">
        <button
          v-for="tab in debtTabs"
          :key="tab.status"
          @click="selectedDebtStatus = tab.status"
          :class="['px-4 py-2 rounded', selectedDebtStatus === tab.status ? 'btn-primary' : 'bg-gray-200']"
        >
          {{ tab.label }} ({{ getDebtCount(tab.status) }})
        </button>
      </div>

      <div v-if="filteredDebts.length === 0" class="text-center py-8">
        <p class="text-gray-400">Belum ada hutang</p>
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="debt in filteredDebts"
          :key="debt.id"
          class="p-4 bg-gray-50 rounded-lg"
          :class="debt.status === 'overdue' ? 'border-2 border-danger' : ''"
        >
          <div class="flex items-start justify-between mb-2">
            <div class="flex-1">
              <p class="font-bold">{{ getCustomerName(debt.customerId) }}</p>
              <p class="text-sm text-gray-600">Jatuh tempo: {{ formatDate(debt.dueDate) }}</p>
            </div>
            <div class="text-right">
              <p class="font-bold text-lg">Rp {{ formatCurrency(debt.amount) }}</p>
              <span :class="['text-xs font-semibold px-2 py-1 rounded', getStatusClass(debt.status)]">
                {{ debt.status }}
              </span>
            </div>
          </div>
          <div class="flex gap-2 mt-3">
            <button
              v-if="debt.status !== 'paid'"
              @click="markAsPaid(debt.id)"
              class="flex-1 btn-secondary text-sm"
            >
              ✓ Tandai Lunas
            </button>
            <button @click="deleteDebt(debt.id)" class="flex-1 btn-danger text-sm">❌ Hapus</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDebtStore } from '../stores/debtStore'

const store = useDebtStore()

onMounted(() => {
  store.loadCustomers()
  store.loadDebts()
})

const customerForm = ref({
  name: '',
  phone: '',
  address: ''
})

const debtForm = ref({
  customerId: '',
  amount: '',
  dueDate: '',
  notes: ''
})

const selectedDebtStatus = ref('pending')

const debtTabs = [
  { status: 'pending', label: '⏳ Hutang Aktif' },
  { status: 'overdue', label: '⚠️ Jatuh Tempo' },
  { status: 'paid', label: '✓ Lunas' }
]

const customers = computed(() => store.customers)
const debts = computed(() => store.debts)

const filteredDebts = computed(() =>
  debts.value.filter(d => {
    if (selectedDebtStatus.value === 'overdue') {
      return d.status !== 'paid' && d.dueDate < new Date().toISOString().split('T')[0]
    }
    return d.status === selectedDebtStatus.value
  })
)

async function submitCustomer() {
  if (!customerForm.value.name.trim()) {
    alert('Nama pelanggan harus diisi!')
    return
  }

  try {
    await store.addCustomer({
      ...customerForm.value,
      totalDebt: 0
    })
    alert('Pelanggan berhasil ditambahkan!')
    customerForm.value = { name: '', phone: '', address: '' }
  } catch (error) {
    alert('Gagal menambahkan pelanggan!')
  }
}

async function submitDebt() {
  if (!debtForm.value.customerId || !debtForm.value.amount || !debtForm.value.dueDate) {
    alert('Lengkapi semua data!')
    return
  }

  try {
    await store.addDebt({
      ...debtForm.value,
      status: 'pending'
    })
    alert('Hutang berhasil dicatat!')
    debtForm.value = { customerId: '', amount: '', dueDate: '', notes: '' }
  } catch (error) {
    alert('Gagal mencatat hutang!')
  }
}

function getCustomerName(customerId) {
  const customer = customers.value.find(c => c.id === customerId)
  return customer?.name || 'Unknown'
}

function getStatusClass(status) {
  if (status === 'paid') return 'bg-green-100 text-green-800'
  if (status === 'overdue') return 'bg-red-100 text-red-800'
  return 'bg-yellow-100 text-yellow-800'
}

function getDebtCount(status) {
  if (status === 'overdue') {
    return debts.value.filter(d => d.status !== 'paid' && d.dueDate < new Date().toISOString().split('T')[0]).length
  }
  return debts.value.filter(d => d.status === status).length
}

async function markAsPaid(debtId) {
  if (confirm('Tandai hutang sebagai lunas?')) {
    await store.updateDebtStatus(debtId, 'paid')
  }
}

function deleteDebt(debtId) {
  if (confirm('Hapus hutang ini?')) {
    store.deleteDebt(debtId)
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
