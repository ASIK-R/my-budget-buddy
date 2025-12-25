// Simple test script to verify backend API
const fetch = require('node-fetch')

const API_BASE = 'http://localhost:5000/api'

async function testAPI() {
  try {
    console.log('Testing Expense Tracker API...\n')
    
    // Test root endpoint
    console.log('1. Testing root endpoint...')
    const rootResponse = await fetch('http://localhost:5000')
    const rootData = await rootResponse.json()
    console.log('   Response:', rootData.message)
    
    // Test user registration
    console.log('\n2. Testing user registration...')
    const registerResponse = await fetch(`${API_BASE}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword'
      })
    })
    
    if (registerResponse.ok) {
      const registerData = await registerResponse.json()
      console.log('   Registration successful!')
      console.log('   User ID:', registerData.user.id)
      
      // Test login
      console.log('\n3. Testing user login...')
      const loginResponse = await fetch(`${API_BASE}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'testpassword'
        })
      })
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json()
        console.log('   Login successful!')
        console.log('   Token:', loginData.token.substring(0, 20) + '...')
        
        // Test getting transactions (should be empty)
        console.log('\n4. Testing transactions endpoint...')
        const transactionsResponse = await fetch(`${API_BASE}/transactions?userId=${loginData.user.id}`, {
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${loginData.token}`
          }
        })
        
        if (transactionsResponse.ok) {
          const transactionsData = await transactionsResponse.json()
          console.log('   Transactions retrieved successfully!')
          console.log('   Number of transactions:', transactionsData.length)
        } else {
          console.log('   Failed to get transactions')
        }
      } else {
        console.log('   Login failed')
      }
    } else {
      console.log('   Registration failed')
    }
    
    console.log('\nAPI test completed!')
  } catch (error) {
    console.error('API test failed:', error.message)
  }
}

testAPI()