const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/User');

async function testDB() {
  try {
    console.log('Testing database connection...');
    
    // Check connection status
    console.log('Connection ready state:', mongoose.connection.readyState);
    
    if (mongoose.connection.readyState === 1) {
      console.log('Connected to database successfully!');
      
      // Test by getting user count
      const userCount = await User.countDocuments();
      console.log('Current user count:', userCount);
      
      console.log('Database test completed successfully!');
    } else {
      console.log('Not connected to database. Ready state:', mongoose.connection.readyState);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Database test failed:', error);
    process.exit(1);
  }
}

testDB();