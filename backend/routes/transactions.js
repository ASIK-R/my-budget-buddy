const express = require('express')
const router = express.Router()
const Transaction = require('../models/Transaction')
const Wallet = require('../models/Wallet')

// Get all transactions for a user
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' })
    }
    
    const transactions = await Transaction.find({ userId }).sort({ date: -1 })
    res.json(transactions)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get a specific transaction
router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' })
    }
    res.json(transaction)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create a new transaction
router.post('/', async (req, res) => {
  try {
    const { type, category, amount, description, date, fromWallet, toWallet, userId } = req.body
    
    // Validate required fields
    if (!userId || !type || !amount || !description) {
      return res.status(400).json({ message: 'Missing required fields' })
    }
    
    // For transfer transactions, validate wallets
    if (type === 'transfer') {
      if (!fromWallet || !toWallet) {
        return res.status(400).json({ message: 'Transfer transactions require both fromWallet and toWallet' })
      }
      
      // Update wallet balances
      const fromWalletDoc = await Wallet.findById(fromWallet)
      const toWalletDoc = await Wallet.findById(toWallet)
      
      if (!fromWalletDoc || !toWalletDoc) {
        return res.status(404).json({ message: 'One or both wallets not found' })
      }
      
      if (fromWalletDoc.userId.toString() !== userId || toWalletDoc.userId.toString() !== userId) {
        return res.status(403).json({ message: 'Wallets do not belong to this user' })
      }
      
      if (fromWalletDoc.balance < amount) {
        return res.status(400).json({ message: 'Insufficient funds in source wallet' })
      }
      
      fromWalletDoc.balance -= amount
      toWalletDoc.balance += amount
      
      await fromWalletDoc.save()
      await toWalletDoc.save()
    } else if (!category) {
      return res.status(400).json({ message: 'Category is required for income/expense transactions' })
    }
    
    const transaction = new Transaction({
      type,
      category,
      amount,
      description,
      date: date || new Date(),
      fromWallet: type === 'transfer' ? fromWallet : undefined,
      toWallet: type === 'transfer' ? toWallet : undefined,
      userId
    })
    
    const newTransaction = await transaction.save()
    res.status(201).json(newTransaction)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Update a transaction
router.put('/:id', async (req, res) => {
  try {
    const { type, category, amount, description, date, fromWallet, toWallet, userId } = req.body
    
    // Validate required fields
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' })
    }
    
    const transaction = await Transaction.findById(req.params.id)
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' })
    }
    
    // Check if transaction belongs to user
    if (transaction.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Transaction does not belong to this user' })
    }
    
    // Update fields
    transaction.type = type || transaction.type
    transaction.category = category || transaction.category
    transaction.amount = amount || transaction.amount
    transaction.description = description || transaction.description
    transaction.date = date || transaction.date
    transaction.fromWallet = fromWallet || transaction.fromWallet
    transaction.toWallet = toWallet || transaction.toWallet
    
    const updatedTransaction = await transaction.save()
    res.json(updatedTransaction)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Delete a transaction
router.delete('/:id', async (req, res) => {
  try {
    const { userId } = req.body
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' })
    }
    
    const transaction = await Transaction.findById(req.params.id)
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' })
    }
    
    // Check if transaction belongs to user
    if (transaction.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Transaction does not belong to this user' })
    }
    
    await transaction.remove()
    res.json({ message: 'Transaction deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router