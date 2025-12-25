// Script to verify Supabase setup
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function verifySupabaseSetup() {
  console.log('Verifying Supabase setup...');
  
  // Get credentials from environment variables
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase credentials not found in environment variables.');
    console.log('Please make sure your .env file contains VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
    return;
  }
  
  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  // Test connection by checking if we can access the tables
  const tablesToCheck = ['transactions', 'budgets', 'wallets'];
  
  for (const table of tablesToCheck) {
    try {
      console.log(`Checking table: ${table}...`);
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1);
      
      if (error) {
        console.log(`❌ Table '${table}' not accessible: ${error.message}`);
        if (error.message.includes('not found') || error.message.includes('relation')) {
          console.log(`   Please make sure you've run the SQL schema from SUPABASE_SCHEMA.sql`);
        }
      } else {
        console.log(`✅ Table '${table}' is accessible`);
      }
    } catch (error) {
      console.log(`❌ Error checking table '${table}': ${error.message}`);
    }
  }
  
  console.log('\nVerification complete.');
  console.log('\nNext steps:');
  console.log('1. Enable Email authentication in your Supabase dashboard');
  console.log('2. Start your application with: npm run dev');
  console.log('3. The app will automatically use Supabase when properly configured');
}

verifySupabaseSetup();