// Test Supabase connection
import { supabase } from './src/utils/supabaseClient.js';

async function testSupabase() {
  console.log('Testing Supabase connection...');
  
  if (!supabase) {
    console.log('Supabase is not configured. Please add your credentials to the .env file.');
    return;
  }
  
  try {
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