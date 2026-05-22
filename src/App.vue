<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-gradient-to-r from-primary to-secondary text-white shadow-lg sticky top-0 z-40">
      <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="text-2xl font-bold">💰</div>
          <h1 class="text-xl font-bold">Manajemen Keuangan</h1>
        </div>
        <nav class="flex gap-4">
          <button 
            v-for="item in navItems" 
            :key="item.id"
            @click="currentPage = item.id"
            :class="['px-4 py-2 rounded transition', currentPage === item.id ? 'bg-white text-primary font-semibold' : 'hover:bg-white hover:bg-opacity-20']"
          >
            {{ item.label }}
          </button>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto px-4 py-6">
      <Dashboard v-if="currentPage === 'dashboard'" />
      <TransactionForm v-else-if="currentPage === 'transaction'" />
      <DebtManagement v-else-if="currentPage === 'debt'" />
      <Reports v-else-if="currentPage === 'reports'" />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-100 text-gray-600 text-center py-4 mt-12">
      <p class="text-sm">© 2024 Manajemen Keuangan Sembako v1.0</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Dashboard from './pages/Dashboard.vue'
import TransactionForm from './pages/TransactionForm.vue'
import DebtManagement from './pages/DebtManagement.vue'
import Reports from './pages/Reports.vue'

const currentPage = ref('dashboard')

const navItems = [
  { id: 'dashboard', label: '📊 Dashboard' },
  { id: 'transaction', label: '💳 Transaksi' },
  { id: 'debt', label: '📝 Hutang' },
  { id: 'reports', label: '📈 Laporan' }
]
</script>
