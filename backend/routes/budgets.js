const express = require('express')
const router = express.Router()
const Budget = require('../models/Budget')

// Get all budgets for a user
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' })
    }
    
    const budgets = await Budget.find({ userId })
    res.json(budgets)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get a specific budget
router.get('/:id', async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id)
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' })
    }
    res.json(budget)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create a new budget
router.post('/', async (req, res) => {
  try {
    const { category, limit, userId } = req.body
    
    // Validate required fields
    if (!userId || !category || limit === undefined) {
      return res.status(400).json({ message: 'Missing required fields' })
    }
    
    // Check if budget already exists for this category and user
    const existingBudget = await Budget.findOne({ category, userId })
    if (existingBudget) {
      return res.status(400).json({ message: 'Budget already exists for this category' })
    }
    
    const budget = new Budget({
      category,
      limit,
      userId
    })
    
    const newBudget = await budget.save()
    res.status(201).json(newBudget)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Update a budget
router.put('/:id', async (req, res) => {
  try {
    const { category, limit, userId } = req.body
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' })
    }
    
    const budget = await Budget.findById(req.params.id)
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' })
    }
    
    // Check if budget belongs to user
    if (budget.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Budget does not belong to this user' })
    }
    
    // Update fields
    budget.category = category || budget.category
    budget.limit = limit !== undefined ? limit : budget.limit
    
    const updatedBudget = await budget.save()
    res.json(updatedBudget)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Delete a budget
router.delete('/:id', async (req, res) => {
  try {
    const { userId } = req.body
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' })
    }
    
    const budget = await Budget.findById(req.params.id)
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' })
    }
    
    // Check if budget belongs to user
    if (budget.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Budget does not belong to this user' })
    }
    
    await budget.remove()
    res.json({ message: 'Budget deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router