import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db } from '../db/init'

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref([])
  const loading = ref(false)

  // Load all transactions
  async function loadTransactions() {
    loading.value = true
    try {
      transactions.value = await db.transactions.toArray()
    } catch (error) {
      console.error('Error loading transactions:', error)
    } finally {
      loading.value = false
    }
  }

  // Add transaction
  async function addTransaction(transaction) {
    try {
      const id = await db.transactions.add({
        ...transaction,
        date: new Date(transaction.date).toISOString().split('T')[0]
      })
      await loadTransactions()
      return id
    } catch (error) {
      console.error('Error adding transaction:', error)
      throw error
    }
  }

  // Delete transaction
  async function deleteTransaction(id) {
    try {
      await db.transactions.delete(id)
      await loadTransactions()
    } catch (error) {
      console.error('Error deleting transaction:', error)
    }
  }

  // Get transactions by date range
  async function getTransactionsByDateRange(startDate, endDate) {
    try {
      return await db.transactions
        .where('date')
        .between(startDate, endDate, true, true)
        .toArray()
    } catch (error) {
      console.error('Error fetching transactions:', error)
      return []
    }
  }

  // Calculate totals
  const income = computed(() => 
    transactions.value
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
  )

  const expense = computed(() =>
    transactions.value
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
  )

  const balance = computed(() => income.value - expense.value)

  return {
    transactions,
    loading,
    income,
    expense,
    balance,
    loadTransactions,
    addTransaction,
    deleteTransaction,
    getTransactionsByDateRange
  }
})
