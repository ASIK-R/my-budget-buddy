# Expense Tracker Backend

This is the backend API for the Expense Tracker application, built with Node.js, Express, and MongoDB.

## Features

- User authentication (register/login)
- Transaction management (create, read, update, delete)
- Budget management
- Wallet management
- Data synchronization between frontend and backend

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/expenseTracker
   JWT_SECRET=your_jwt_secret_here
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. For production:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user

### Transactions
- `GET /api/transactions` - Get all transactions for a user
- `GET /api/transactions/:id` - Get a specific transaction
- `POST /api/transactions` - Create a new transaction
- `PUT /api/transactions/:id` - Update a transaction
- `DELETE /api/transactions/:id` - Delete a transaction

### Budgets
- `GET /api/budgets` - Get all budgets for a user
- `GET /api/budgets/:id` - Get a specific budget
- `POST /api/budgets` - Create a new budget
- `PUT /api/budgets/:id` - Update a budget
- `DELETE /api/budgets/:id` - Delete a budget

### Wallets
- `GET /api/wallets` - Get all wallets for a user
- `GET /api/wallets/:id` - Get a specific wallet
- `POST /api/wallets` - Create a new wallet
- `PUT /api/wallets/:id` - Update a wallet
- `DELETE /api/wallets/:id` - Delete a wallet

## Database Schema

### User
- `username` (String, required, unique)
- `email` (String, required, unique)
- `password` (String, required)
- `createdAt` (Date, default: Date.now)

### Transaction
- `type` (String, required, enum: ['income', 'expense', 'transfer'])
- `category` (String, required for income/expense)
- `amount` (Number, required, min: 0)
- `description` (String, required)
- `date` (Date, default: Date.now)
- `fromWallet` (String, required for transfers)
- `toWallet` (String, required for transfers)
- `userId` (ObjectId, ref: User, required)

### Budget
- `category` (String, required, unique)
- `limit` (Number, required, min: 0)
- `userId` (ObjectId, ref: User, required)

### Wallet
- `name` (String, required)
- `type` (String, required)
- `balance` (Number, required, default: 0, min: 0)
- `initialBalance` (Number, required, default: 0, min: 0)
- `userId` (ObjectId, ref: User, required)

## Development

To run the backend in development mode with auto-reload:
```bash
npm run dev
```

## Production

To run the backend in production mode:
```bash
npm start
```