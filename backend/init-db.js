const mongoose = require('mongoose')
require('dotenv').config()

// Import models
const User = require('./models/User')
const Transaction = require('./models/Transaction')
const Budget = require('./models/Budget')
const Wallet = require('./models/Wallet')

// Check if already connected, otherwise connect
if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/expenseTracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err))
} else {
  console.log('MongoDB already connected')
}

// Sample data
const sampleUsers = [
  {
    username: 'john_doe',
    email: 'john@example.com',
    password: 'password123'
  },
  {
    username: 'jane_smith',
    email: 'jane@example.com',
    password: 'password123'
  }
]

const sampleWallets = [
  {
    name: 'Main Bank Account',
    type: 'Bank',
    initialBalance: 5000,
    balance: 5000
  },
  {
    name: 'Cash Wallet',
    type: 'Cash',
    initialBalance: 200,
    balance: 200
  },
  {
    name: 'Credit Card',
    type: 'Credit',
    initialBalance: 0,
    balance: 0
  }
]

const sampleCategories = ['Food', 'Transport', 'Bills', 'Shopping', 'Entertainment', 'Health', 'Salary', 'Freelance', 'Investment']
const sampleTypes = ['expense', 'expense', 'expense', 'expense', 'expense', 'expense', 'income', 'income', 'income']

const sampleBudgets = [
  { category: 'Food', limit: 400 },
  { category: 'Transport', limit: 150 },
  { category: 'Bills', limit: 600 },
  { category: 'Entertainment', limit: 200 }
]

async function initDB() {
  try {
    // Clear existing data
    await User.deleteMany({})
    await Transaction.deleteMany({})
    await Budget.deleteMany({})
    await Wallet.deleteMany({})
    
    console.log('Existing data cleared')
    
    // Create sample users
    const users = await User.insertMany(sampleUsers)
    console.log('Sample users created:', users.length)
    
    // Create sample wallets for each user
    const walletsData = []
    users.forEach(user => {
      sampleWallets.forEach(wallet => {
        walletsData.push({
          ...wallet,
          userId: user._id
        })
      })
    })
    
    const wallets = await Wallet.insertMany(walletsData)
    console.log('Sample wallets created:', wallets.length)
    
    // Create sample transactions for each user
    const transactionsData = []
    users.forEach(user => {
      for (let i = 0; i < 30; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const categoryIndex = Math.floor(Math.random() * sampleCategories.length)
        const type = sampleTypes[categoryIndex]
        const amount = type === 'income' 
          ? Math.floor(Math.random() * 5000) + 1000
          : Math.floor(Math.random() * 500) + 10

        transactionsData.push({
          type,
          category: sampleCategories[categoryIndex],
          amount,
          description: `${sampleCategories[categoryIndex]} transaction ${i + 1}`,
          date: date,
          userId: user._id
        })
      }
    })
    
    const transactions = await Transaction.insertMany(transactionsData)
    console.log('Sample transactions created:', transactions.length)
    
    // Create sample budgets for each user
    const budgetsData = []
    users.forEach(user => {
      sampleBudgets.forEach(budget => {
        budgetsData.push({
          ...budget,
          userId: user._id
        })
      })
    })
    
    const budgets = await Budget.insertMany(budgetsData)
    console.log('Sample budgets created:', budgets.length)
    
    console.log('Database initialization completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Database initialization failed:', error)
    process.exit(1)
  }
}

// Run the initialization
initDB()