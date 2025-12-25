const express = require('express')
const router = express.Router()
const Wallet = require('../models/Wallet')

// Get all wallets for a user
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' })
    }
    
    const wallets = await Wallet.find({ userId })
    res.json(wallets)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get a specific wallet
router.get('/:id', async (req, res) => {
  try {
    const wallet = await Wallet.findById(req.params.id)
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' })
    }
    res.json(wallet)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create a new wallet
router.post('/', async (req, res) => {
  try {
    const { name, type, initialBalance, userId } = req.body
    
    // Validate required fields
    if (!userId || !name || !type) {
      return res.status(400).json({ message: 'Missing required fields' })
    }
    
    const wallet = new Wallet({
      name,
      type,
      initialBalance: initialBalance || 0,
      balance: initialBalance || 0,
      userId
    })
    
    const newWallet = await wallet.save()
    res.status(201).json(newWallet)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Update a wallet
router.put('/:id', async (req, res) => {
  try {
    const { name, type, initialBalance, userId } = req.body
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' })
    }
    
    const wallet = await Wallet.findById(req.params.id)
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' })
    }
    
    // Check if wallet belongs to user
    if (wallet.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Wallet does not belong to this user' })
    }
    
    // Update fields
    wallet.name = name || wallet.name
    wallet.type = type || wallet.type
    wallet.initialBalance = initialBalance !== undefined ? initialBalance : wallet.initialBalance
    
    const updatedWallet = await wallet.save()
    res.json(updatedWallet)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Delete a wallet
router.delete('/:id', async (req, res) => {
  try {
    const { userId } = req.body
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' })
    }
    
    const wallet = await Wallet.findById(req.params.id)
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' })
    }
    
    // Check if wallet belongs to user
    if (wallet.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Wallet does not belong to this user' })
    }
    
    await wallet.remove()
    res.json({ message: 'Wallet deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router