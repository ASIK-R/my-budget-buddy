// Script to initialize Supabase database with the required schema
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function initSupabase() {
  console.log('Initializing Supabase database...');
  
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
  
  // Read the SQL schema file
  const schemaPath = path.join(__dirname, 'SUPABASE_SCHEMA.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  
  console.log('Executing SQL schema...');
  
  // Split the SQL into individual statements (basic splitting by semicolon)
  // Note: This is a simple approach and might not work for complex SQL with semicolons in strings
  const statements = schemaSql
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0);
  
  // Execute each statement
  for (const [index, statement] of statements.entries()) {
    if (statement.startsWith('--') || statement.trim().length === 0) {
      // Skip comments and empty statements
      continue;
    }
    
    console.log(`Executing statement ${index + 1}/${statements.length}...`);
    console.log(`SQL: ${statement.substring(0, 100)}${statement.length > 100 ? '...' : ''}`);
    
    try {
      // For table creation and alterations, we need to use the Supabase SQL interface
      // Since the JS client doesn't support raw SQL execution, we'll need to use the REST API
      // or manually create the tables through the Supabase dashboard
      
      // For now, let's inform the user to manually execute the SQL in the Supabase dashboard
      console.log('\n⚠️  Manual step required:');
      console.log('Please go to your Supabase dashboard and execute the following SQL:');
      console.log('1. Go to https://app.supabase.com/project/[your-project-id]/sql');
      console.log('2. Paste the entire content of SUPABASE_SCHEMA.sql into the SQL editor');
      console.log('3. Click "Run" to execute the SQL commands\n');
      
      // Break after the first iteration since we're providing manual instructions
      break;
    } catch (error) {
      console.error(`Error executing statement ${index + 1}:`, error.message);
      // Continue with other statements
    }
  }
  
  console.log('\n✅ Supabase initialization instructions provided.');
  console.log('Please follow the manual steps above to complete the database setup.');
}

initSupabase();