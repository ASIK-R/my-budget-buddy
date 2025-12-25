# Using Supabase with Expense Tracker

This document explains how to use the Supabase integration in your Expense Tracker application.

## Overview

The Expense Tracker application has been enhanced with Supabase integration, which provides:

1. **Authentication** - Secure user registration and login
2. **Database** - Cloud-based PostgreSQL database with real-time syncing
3. **Security** - Row Level Security to ensure users only access their own data

## How It Works

The application uses a hybrid approach:
- **Local Storage** - For offline functionality and fast UI updates
- **Supabase** - For persistent storage and synchronization across devices

## Key Components

### 1. Supabase Client (`src/utils/supabaseClient.js`)

Initializes the Supabase client with your project credentials.

### 2. Authentication Utilities (`src/utils/supabaseAuth.js`)

Provides functions for:
- User registration
- User login
- User logout
- Getting current user
- Listening to auth state changes

### 3. Database Utilities (`src/utils/supabaseDB.js`)

Provides functions for:
- Transactions management (CRUD operations)
- Budgets management (CRUD operations)
- Wallets management (CRUD operations)
- Wallet transfers

### 4. Context Integration (`src/context/AppContext.jsx`)

The AppContext has been updated to:
- Use Supabase for authentication
- Sync data between local storage and Supabase
- Handle offline/online transitions

## Setting Up Your Supabase Project

### 1. Create Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project

### 2. Get Your Credentials

1. In your Supabase dashboard, go to "Project Settings" > "API"
2. Copy your:
   - Project URL
   - anon key

### 3. Update Environment Variables

Update your `.env` file:

```env
VITE_SUPABASE_URL=your_actual_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_actual_supabase_anon_key_here
```

### 4. Create Database Tables

Run the SQL commands from `SUPABASE_SCHEMA.sql` in your Supabase SQL editor.

### 5. Enable Authentication

Enable the Email authentication provider in your Supabase dashboard.

## Using Supabase Features

### Authentication

The Login component already uses Supabase authentication:

```javascript
import { signUp, signIn } from '../utils/supabaseAuth'

// Register a new user
const result = await signUp(email, password, username)

// Login an existing user
const result = await signIn(email, password)
```

### Database Operations

Use the database utilities for CRUD operations:

```javascript
import * as supabaseDB from '../utils/supabaseDB'

// Get user's transactions
const transactions = await supabaseDB.getTransactions(userId)

// Add a new transaction
const newTransaction = await supabaseDB.addTransaction(transactionData)

// Update a transaction
const updatedTransaction = await supabaseDB.updateTransaction(id, updates)

// Delete a transaction
await supabaseDB.deleteTransaction(id)
```

### Data Synchronization

The AppContext automatically handles synchronization:
- Data is saved locally for fast UI updates
- Data is synced with Supabase when online
- Offline changes are synced when connection is restored

## Testing Your Setup

Run the verification script to check if everything is set up correctly:

```bash
node verify-supabase-setup.cjs
```

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Make sure your `.env` file is in the root directory
   - Restart your development server after updating environment variables

2. **Database Connection Errors**
   - Verify your Supabase URL and anon key are correct
   - Check that you've created the database tables

3. **Authentication Issues**
   - Ensure the Email provider is enabled in Supabase Auth
   - Check that your environment variables are set correctly

### Need Help?

If you encounter any issues:
1. Check the browser console for error messages
2. Check the Supabase dashboard for any errors
3. Refer to the [Supabase Documentation](https://supabase.com/docs)