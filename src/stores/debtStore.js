import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db } from '../db/init'

export const useDebtStore = defineStore('debt', () => {
  const debts = ref([])
  const customers = ref([])
  const loading = ref(false)

  // Load debts
  async function loadDebts() {
    loading.value = true
    try {
      debts.value = await db.debts.toArray()
    } catch (error) {
      console.error('Error loading debts:', error)
    } finally {
      loading.value = false
    }
  }

  // Load customers
  async function loadCustomers() {
    try {
      customers.value = await db.customers.toArray()
    } catch (error) {
      console.error('Error loading customers:', error)
    }
  }

  // Add customer
  async function addCustomer(customer) {
    try {
      const id = await db.customers.add(customer)
      await loadCustomers()
      return id
    } catch (error) {
      console.error('Error adding customer:', error)
      throw error
    }
  }

  // Add debt
  async function addDebt(debt) {
    try {
      const id = await db.debts.add({
        ...debt,
        dueDate: new Date(debt.dueDate).toISOString().split('T')[0],
        createdAt: new Date().toISOString().split('T')[0]
      })
      await loadDebts()
      return id
    } catch (error) {
      console.error('Error adding debt:', error)
      throw error
    }
  }

  // Update debt status
  async function updateDebtStatus(debtId, status) {
    try {
      await db.debts.update(debtId, { status })
      await loadDebts()
    } catch (error) {
      console.error('Error updating debt:', error)
    }
  }

  // Delete debt
  async function deleteDebt(debtId) {
    try {
      await db.debts.delete(debtId)
      await loadDebts()
    } catch (error) {
      console.error('Error deleting debt:', error)
    }
  }

  // Get customer debts
  function getCustomerDebts(customerId) {
    return debts.value.filter(d => d.customerId === customerId)
  }

  // Computed properties
  const totalDebt = computed(() =>
    debts.value
      .filter(d => d.status !== 'paid')
      .reduce((sum, d) => sum + d.amount, 0)
  )

  const paidDebt = computed(() =>
    debts.value
      .filter(d => d.status === 'paid')
      .reduce((sum, d) => sum + d.amount, 0)
  )

  const overdueDebts = computed(() =>
    debts.value.filter(d => {
      if (d.status === 'paid') return false
      const today = new Date().toISOString().split('T')[0]
      return d.dueDate < today
    })
  )

  return {
    debts,
    customers,
    loading,
    totalDebt,
    paidDebt,
    overdueDebts,
    loadDebts,
    loadCustomers,
    addCustomer,
    addDebt,
    updateDebtStatus,
    deleteDebt,
    getCustomerDebts
  }
})
