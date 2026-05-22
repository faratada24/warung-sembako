<template>
  <div class="space-y-6">
    <!-- Date Range Filter -->
    <div class="card">
      <h2 class="text-lg font-bold mb-4">📅 Filter Laporan</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-semibold mb-2">Dari Tanggal</label>
          <input v-model="filterFrom" type="date" class="input-field" @change="generateReport" />
        </div>
        <div>
          <label class="block text-sm font-semibold mb-2">Sampai Tanggal</label>
          <input v-model="filterTo" type="date" class="input-field" @change="generateReport" />
        </div>
        <div>
          <label class="block text-sm font-semibold mb-2">Tipe</label>
          <select v-model="filterType" class="input-field" @change="generateReport">
            <option value="">Semua Transaksi</option>
            <option value="income">Pemasukan</option>
            <option value="expense">Pengeluaran</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Summary Report -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="card bg-gradient-to-br from-secondary to-green-500 text-white">
        <p class="text-sm font-semibold opacity-80">Total Pemasukan</p>
        <p class="text-3xl font-bold mt-2">Rp {{ formatCurrency(reportSummary.income) }}</p>
      </div>
      <div class="card bg-gradient-to-br from-warning to-orange-500 text-white">
        <p class="text-sm font-semibold opacity-80">Total Pengeluaran</p>
        <p class="text-3xl font-bold mt-2">Rp {{ formatCurrency(reportSummary.expense) }}</p>
      </div>
      <div class="card bg-gradient-to-br from-primary to-cyan-500 text-white">
        <p class="text-sm font-semibold opacity-80">Laba/Rugi</p>
        <p :class="['text-3xl font-bold mt-2', reportSummary.profit >= 0 ? 'text-green-300' : 'text-red-300']">
          Rp {{ formatCurrency(reportSummary.profit) }}
        </p>
      </div>
    </div>

    <!-- Category Breakdown -->
    <div class="card">
      <h2 class="text-lg font-bold mb-4">📊 Rincian per Kategori</h2>
      <div class="space-y-3">
        <div v-if="categoryBreakdown.length === 0" class="text-center py-8">
          <p class="text-gray-400">Tidak ada data untuk periode ini</p>
        </div>
        <div v-for="item in categoryBreakdown" :key="item.categoryId" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div class="flex-1">
            <p class="font-semibold">{{ item.categoryName }}</p>
            <p class="text-xs text-gray-500">{{ item.count }} transaksi</p>
          </div>
          <div class="text-right">
            <p class="font-bold">Rp {{ formatCurrency(item.total) }}</p>
            <p class="text-xs text-gray-500">{{ ((item.total / reportSummary.total) * 100).toFixed(1) }}%</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Daily Summary -->
    <div class="card">
      <h2 class="text-lg font-bold mb-4">📅 Ringkasan Harian</h2>
      <div class="space-y-2">
        <div v-if="dailySummary.length === 0" class="text-center py-8">
          <p class="text-gray-400">Tidak ada data untuk periode ini</p>
        </div>
        <div v-for="day in dailySummary" :key="day.date" class="grid grid-cols-12 gap-2 items-center p-3 bg-gray-50 rounded-lg">
          <div class="col-span-3">
            <p class="font-semibold text-sm">{{ formatDate(day.date) }}</p>
          </div>
          <div class="col-span-3">
            <p class="text-sm"><span class="text-green-600 font-semibold">+Rp {{ formatCurrency(day.income) }}</span></p>
          </div>
          <div class="col-span-3">
            <p class="text-sm"><span class="text-red-600 font-semibold">-Rp {{ formatCurrency(day.expense) }}</span></p>
          </div>
          <div class="col-span-3 text-right">
            <p :class="['text-sm font-bold', day.balance >= 0 ? 'text-primary' : 'text-danger']">
              Rp {{ formatCurrency(day.balance) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Export Options -->
    <div class="card">
      <h2 class="text-lg font-bold mb-4">💾 Ekspor Data</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button @click="exportToCSV" class="btn-primary">📥 Unduh CSV</button>
        <button @click="exportToJSON" class="btn-secondary">📥 Unduh JSON</button>
        <button @click="printReport" class="btn-primary">🖨️ Cetak Laporan</button>
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
  const today = new Date()
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
  filterFrom.value = firstDay.toISOString().split('T')[0]
  filterTo.value = today.toISOString().split('T')[0]
  generateReport()
})

const filterFrom = ref('')
const filterTo = ref('')
const filterType = ref('')

const transactions = computed(() => store.transactions)

const reportTransactions = computed(() =>
  transactions.value.filter(t => {
    if (t.date < filterFrom.value || t.date > filterTo.value) return false
    if (filterType.value && t.type !== filterType.value) return false
    return true
  })
)

const reportSummary = computed(() => {
  const income = reportTransactions.value
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  const expense = reportTransactions.value
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  return {
    income,
    expense,
    profit: income - expense,
    total: income + expense
  }
})

const categoryBreakdown = computed(() => {
  const categories = {}
  reportTransactions.value.forEach(t => {
    if (!categories[t.categoryId]) {
      categories[t.categoryId] = { total: 0, count: 0, categoryId: t.categoryId }
    }
    categories[t.categoryId].total += t.amount
    categories[t.categoryId].count += 1
  })
  return Object.values(categories).map(cat => ({
    ...cat,
    categoryName: getCategoryName(cat.categoryId)
  }))
})

const dailySummary = computed(() => {
  const daily = {}
  reportTransactions.value.forEach(t => {
    if (!daily[t.date]) {
      daily[t.date] = { income: 0, expense: 0 }
    }
    if (t.type === 'income') daily[t.date].income += t.amount
    else daily[t.date].expense += t.amount
  })
  return Object.entries(daily).map(([date, data]) => ({
    date,
    ...data,
    balance: data.income - data.expense
  })).sort((a, b) => new Date(b.date) - new Date(a.date))
})

let categories = []

async function generateReport() {
  categories = await db.categories.toArray()
}

function getCategoryName(categoryId) {
  const cat = categories.find(c => c.id === categoryId)
  return cat?.name || 'Unknown'
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

function exportToCSV() {
  let csv = 'Tanggal,Tipe,Kategori,Jumlah,Keterangan\n'
  reportTransactions.value.forEach(t => {
    csv += `${t.date},${t.type},${getCategoryName(t.categoryId)},${t.amount},"${t.description}"\n`
  })
  downloadFile(csv, 'laporan.csv', 'text/csv')
}

function exportToJSON() {
  const data = {
    periode: `${filterFrom.value} - ${filterTo.value}`,
    summary: reportSummary.value,
    transactions: reportTransactions.value
  }
  downloadFile(JSON.stringify(data, null, 2), 'laporan.json', 'application/json')
}

function downloadFile(content, filename, type) {
  const element = document.createElement('a')
  element.setAttribute('href', `data:${type};charset=utf-8,${encodeURIComponent(content)}`)
  element.setAttribute('download', filename)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

function printReport() {
  window.print()
}
</script>
