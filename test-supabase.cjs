// Test Supabase connection using CommonJS
require('dotenv').config();

// Since we can't easily import the supabase client in a Node.js script,
// we'll create a simple test using the Supabase JS library directly
const { createClient } = require('@supabase/supabase-js');

async function testSupabase() {
  console.log('Testing Supabase connection...');
  
  // Get credentials from environment variables
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_actual_supabase_url_here' || supabaseAnonKey === 'your_actual_supabase_anon_key_here') {
    console.log('Supabase is not configured. Please add your credentials to the .env file.');
    console.log('Current values:');
    console.log('VITE_SUPABASE_URL:', supabaseUrl);
    console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'SET' : 'NOT SET');
    return;
  }
  
  try {
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Test connection by querying the users table (which should exist in Supabase by default)
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (error) {
      console.log('Supabase connection test failed:', error.message);
      return;
    }
    
    console.log('Supabase connection successful!');
    console.log('Test query result:', data);
  } catch (error) {
    console.log('Supabase connection test failed:', error.message);
  }
}

testSupabase();