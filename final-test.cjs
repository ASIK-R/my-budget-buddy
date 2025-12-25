// Final test script to verify Supabase setup
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function finalTest() {
  console.log('Final Supabase test...');
  
  // Get credentials from environment variables
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase credentials not found in environment variables.');
    return;
  }
  
  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  // Test a simple query to verify connection
  try {
    const { data, error } = await supabase.rpc('now');
    if (error) {
      console.log('❌ Connection test failed:', error.message);
    } else {
      console.log('✅ Connection successful! Server time:', data);
    }
  } catch (error) {
    console.log('❌ Connection test failed:', error.message);
  }
  
  // Test table access
  const tables = ['transactions', 'budgets', 'wallets'];
  for (const table of tables) {
    try {
      // Try a simple count query
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ Error accessing ${table}:`, error.message);
      } else {
        console.log(`✅ ${table} table accessible. Record count: ${count}`);
      }
    } catch (error) {
      console.log(`❌ Exception accessing ${table}:`, error.message);
    }
  }
  
  console.log('\n🎉 Supabase setup verification complete!');
  console.log('\nNext steps:');
  console.log('1. Enable Email authentication in your Supabase dashboard');
  console.log('2. Start your application with: npm run dev');
}

finalTest();