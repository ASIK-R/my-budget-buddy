# Supabase Setup Guide

This guide will help you set up Supabase for the Expense Tracker application.

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click on "Get Started" or "Sign up"
3. Create your account using your email or GitHub

## Step 2: Create a New Project

1. After logging in, click on "New Project"
2. Choose a name for your project
3. Select a region closest to your users
4. Set a secure password for the database
5. Click "Create new project"

## Step 3: Get Your Project Credentials

1. Once your project is created, go to the project dashboard
2. Navigate to "Project Settings" > "API"
3. Copy the following values:
   - **Project URL**: This is your `VITE_SUPABASE_URL`
   - **anon key**: This is your `VITE_SUPABASE_ANON_KEY`

## Step 4: Configure Environment Variables

1. In your project root, update the `.env` file with your credentials:
   ```
   VITE_SUPABASE_URL=your_actual_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_actual_supabase_anon_key_here
   ```

## Step 5: Set Up Database Tables

1. In your Supabase dashboard, go to "SQL Editor"
2. Copy the content from `SUPABASE_SCHEMA.sql` file in your project
3. Paste it into the SQL editor
4. Click "Run" to execute the SQL commands

## Step 6: Configure Authentication

1. In your Supabase dashboard, go to "Authentication" > "Settings"
2. Under "Providers", enable "Email" authentication
3. You can also configure other providers if needed

## Step 7: Test Your Setup

1. Make sure your Supabase project is properly configured
2. Run the verification script: `node verify-supabase-setup.cjs`
3. Start your application: `npm run dev`

## Troubleshooting

### Common Issues:

1. **Connection Refused**: Make sure your Supabase project is active and not in a paused state
2. **Authentication Errors**: Verify that email authentication is enabled in your Supabase dashboard
3. **Table Not Found**: Ensure you've run the SQL schema in your Supabase SQL editor

### Need Help?

- Check the Supabase documentation: [https://supabase.com/docs](https://supabase.com/docs)
- Look at the browser console for specific error messages
- Verify all your environment variables are correctly set