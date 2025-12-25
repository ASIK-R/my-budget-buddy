const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const auth = require('../middleware/auth')
const router = express.Router()

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body
    
    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email or username' })
    }
    
    // Create new user
    const user = new User({ username, email, password })
    const newUser = await user.save()
    
    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET || 'expense_tracker_secret', {
      expiresIn: '7d'
    })
    
    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }
    
    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }
    
    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }
    
    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'expense_tracker_secret', {
      expiresIn: '7d'
    })
    
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    // Return the authenticated user's profile
    res.json({
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        createdAt: req.user.createdAt
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router