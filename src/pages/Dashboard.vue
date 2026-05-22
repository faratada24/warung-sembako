<template>
  <div class="space-y-6">
    <!-- Main Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Balance Card -->
      <div class="card bg-gradient-to-br from-primary to-cyan-500 text-white">
        <p class="text-sm font-semibold opacity-80">Saldo Akhir</p>
        <p class="text-3xl font-bold mt-2">Rp {{ formatCurrency(balance) }}</p>
      </div>

      <!-- Income Card -->
      <div class="card bg-gradient-to-br from-secondary to-green-500 text-white">
        <p class="text-sm font-semibold opacity-80">Total Pemasukan</p>
        <p class="text-3xl font-bold mt-2">Rp {{ formatCurrency(income) }}</p>
      </div>

      <!-- Expense Card -->
      <div class="card bg-gradient-to-br from-warning to-orange-500 text-white">
        <p class="text-sm font-semibold opacity-80">Total Pengeluaran</p>
        <p class="text-3xl font-bold mt-2">Rp {{ formatCurrency(expense) }}</p>
      </div>
    </div>

    <!-- Debt Summary -->
    <div class="card">
      <h2 class="text-lg font-bold mb-4">📊 Ringkasan Hutang</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-blue-50 p-4 rounded-lg">
          <p class="text-gray-600 text-sm">Total Hutang Aktif</p>
          <p class="text-2xl font-bold text-blue-600 mt-1">Rp {{ formatCurrency(totalDebt) }}</p>
        </div>
        <div class="bg-green-50 p-4 rounded-lg">
          <p class="text-gray-600 text-sm">Hutang Terbayar</p>
          <p class="text-2xl font-bold text-green-600 mt-1">Rp {{ formatCurrency(paidDebt) }}</p>
        </div>
        <div class="bg-red-50 p-4 rounded-lg">
          <p class="text-gray-600 text-sm">Hutang Jatuh Tempo</p>
          <p class="text-2xl font-bold text-red-600 mt-1">{{ overdueDebts.length }}</p>
        </div>
      </div>
    </div>

    <!-- Recent Transactions -->
    <div class="card">
      <h2 class="text-lg font-bold mb-4">📋 Transaksi Terbaru</h2>
      <div v-if="recentTransactions.length === 0" class="text-center py-8">
        <p class="text-gray-400">Belum ada transaksi. Mulai dengan menambah transaksi baru.</p>
      </div>
      <div v-else class="space-y-2">
        <div
          v-for="transaction in recentTransactions"
          :key="transaction.id"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
        >
          <div>
            <p class="font-semibold text-gray-900">{{ transaction.description }}</p>
            <p class="text-xs text-gray-500">{{ formatDate(transaction.date) }}</p>
          </div>
          <span :class="['font-bold', transaction.type === 'income' ? 'text-green-600' : 'text-red-600']">
            {{ transaction.type === 'income' ? '+' : '-' }} Rp {{ formatCurrency(transaction.amount) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <button class="btn-primary text-center py-3">➕ Tambah Pemasukan</button>
      <button class="btn-danger text-center py-3">➖ Tambah Pengeluaran</button>
      <button class="btn-secondary text-center py-3">👥 Kelola Hutang</button>
      <button class="btn-primary text-center py-3">📊 Lihat Laporan</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useTransactionStore } from '../stores/transactionStore'
import { useDebtStore } from '../stores/debtStore'

const transactionStore = useTransactionStore()
const debtStore = useDebtStore()

onMounted(() => {
  transactionStore.loadTransactions()
  debtStore.loadDebts()
  debtStore.loadCustomers()
})

const income = computed(() => transactionStore.income)
const expense = computed(() => transactionStore.expense)
const balance = computed(() => transactionStore.balance)

const totalDebt = computed(() => debtStore.totalDebt)
const paidDebt = computed(() => debtStore.paidDebt)
const overdueDebts = computed(() => debtStore.overdueDebts)

const recentTransactions = computed(() =>
  [...transactionStore.transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
)

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
