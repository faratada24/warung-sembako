import Dexie from 'dexie'

export const db = new Dexie('KeuanganSembakoDB')

// Schema definition
db.version(1).stores({
  transactions: '++id, date, type',
  debts: '++id, customerId, dueDate',
  customers: '++id, name',
  categories: '++id, name',
  backups: '++id, timestamp'
})

export async function initDatabase() {
  try {
    // Create default categories if not exist
    const categoryCount = await db.categories.count()
    if (categoryCount === 0) {
      await db.categories.bulkAdd([
        { id: 1, name: 'Beras', type: 'expense' },
        { id: 2, name: 'Minyak', type: 'expense' },
        { id: 3, name: 'Gula', type: 'expense' },
        { id: 4, name: 'Telur', type: 'expense' },
        { id: 5, name: 'Bumbu', type: 'expense' },
        { id: 6, name: 'Penjualan', type: 'income' },
        { id: 7, name: 'Hutang Terbayar', type: 'income' },
        { id: 8, name: 'Lainnya', type: 'expense' }
      ])
    }
    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Database initialization error:', error)
  }
}

// Transaction interface
export const TransactionSchema = {
  id: 'auto increment',
  date: 'YYYY-MM-DD',
  type: 'income|expense',
  categoryId: 'number',
  amount: 'number',
  description: 'string',
  paymentMethod: 'cash|transfer|debit'
}

// Debt interface
export const DebtSchema = {
  id: 'auto increment',
  customerId: 'number',
  amount: 'number',
  dueDate: 'YYYY-MM-DD',
  status: 'pending|paid|overdue',
  notes: 'string',
  createdAt: 'YYYY-MM-DD'
}

// Customer interface
export const CustomerSchema = {
  id: 'auto increment',
  name: 'string',
  phone: 'string',
  address: 'string',
  totalDebt: 'number'
}
