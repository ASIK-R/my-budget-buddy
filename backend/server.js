const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5006

// Middleware
app.use(cors())
app.use(express.json())

// Connect to MongoDB with fallback to in-memory array
let dbConnected = false
const inMemoryDB = {
  users: [],
  transactions: [],
  budgets: [],
  wallets: []
}

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/expenseTracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected')
    dbConnected = true
  })
  .catch(err => {
    console.log('MongoDB connection error, using in-memory database:', err.message)
    dbConnected = false
  })

// Simple in-memory database functions
const generateId = () => Date.now().toString()

// Import and use routes
const userRoutes = require('./routes/users');
const transactionRoutes = require('./routes/transactions');
const budgetRoutes = require('./routes/budgets');
const walletRoutes = require('./routes/wallets');

// API routes
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/wallets', walletRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Expense Tracker API is running!',
    database: dbConnected ? 'MongoDB' : 'In-Memory'
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  console.log(`Database: ${dbConnected ? 'MongoDB' : 'In-Memory (development only)'}`)
})