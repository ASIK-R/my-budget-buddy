import fetch from 'node-fetch';

async function testBackend() {
  try {
    // Test GET /
    console.log('Testing GET /');
    let response = await fetch('http://localhost:5006/');
    let data = await response.json();
    console.log('Response:', data);
    
    // Test GET /api/users/profile
    console.log('\nTesting GET /api/users/profile');
    response = await fetch('http://localhost:5006/api/users/profile');
    data = await response.json();
    console.log('Response:', data);
    
    // Test POST /api/wallets
    console.log('\nTesting POST /api/wallets');
    response = await fetch('http://localhost:5006/api/wallets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Wallet',
        type: 'bank',
        userId: 'user123'
      })
    });
    
    data = await response.json();
    console.log('Response:', data);
    console.log('Status:', response.status);
    
    // Test GET /api/wallets
    console.log('\nTesting GET /api/wallets');
    response = await fetch('http://localhost:5006/api/wallets?userId=user123');
    data = await response.json();
    console.log('Response:', data);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testBackend();