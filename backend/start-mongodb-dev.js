const { MongoMemoryServer } = require('mongodb-memory-server');

async function startMongoMemoryServer() {
  try {
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    
    console.log('MongoDB Memory Server started');
    console.log('Connection URI:', uri);
    
    // Set environment variable for the server
    process.env.MONGODB_URI = uri;
    
    // Start the main server
    require('./server');
    
    // Initialize database with sample data after server starts
    setTimeout(async () => {
      try {
        // Import models after mongoose is connected
        const User = require('./models/User');
        const Transaction = require('./models/Transaction');
        const Budget = require('./models/Budget');
        const Wallet = require('./models/Wallet');
        
        // Sample data
        const sampleUsers = [
          {
            username: 'john_doe',
            email: 'john@example.com',
            password: 'password123' // In a real app, this would be hashed
          },
          {
            username: 'jane_smith',
            email: 'jane@example.com',
            password: 'password123' // In a real app, this would be hashed
          }
        ];
        
        const sampleWallets = [
          {
            name: 'Main Bank Account',
            type: 'Bank',
            initialBalance: 5000,
            balance: 5000
          },
          {
            name: 'Cash Wallet',
            type: 'Cash',
            initialBalance: 200,
            balance: 200
          },
          {
            name: 'Credit Card',
            type: 'Credit',
            initialBalance: 0,
            balance: 0
          }
        ];
        
        const sampleCategories = ['Food', 'Transport', 'Bills', 'Shopping', 'Entertainment', 'Health', 'Salary', 'Freelance', 'Investment'];
        const sampleTypes = ['expense', 'expense', 'expense', 'expense', 'expense', 'expense', 'income', 'income', 'income'];
        
        const sampleBudgets = [
          { category: 'Food', limit: 400 },
          { category: 'Transport', limit: 150 },
          { category: 'Bills', limit: 600 },
          { category: 'Entertainment', limit: 200 }
        ];
        
        // Clear existing data
        await User.deleteMany({});
        await Transaction.deleteMany({});
        await Budget.deleteMany({});
        await Wallet.deleteMany({});
        
        console.log('Existing data cleared');
        
        // Create sample users
        const users = await User.insertMany(sampleUsers);
        console.log('Sample users created:', users.length);
        
        // Create sample wallets for each user
        const walletsData = [];
        users.forEach(user => {
          sampleWallets.forEach(wallet => {
            walletsData.push({
              ...wallet,
              userId: user._id
            });
          });
        });
        
        const wallets = await Wallet.insertMany(walletsData);
        console.log('Sample wallets created:', wallets.length);
        
        // Create sample transactions for each user
        const transactionsData = [];
        users.forEach(user => {
          for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const categoryIndex = Math.floor(Math.random() * sampleCategories.length);
            const type = sampleTypes[categoryIndex];
            const amount = type === 'income' 
              ? Math.floor(Math.random() * 5000) + 1000
              : Math.floor(Math.random() * 500) + 10;

            transactionsData.push({
              type,
              category: sampleCategories[categoryIndex],
              amount,
              description: `${sampleCategories[categoryIndex]} transaction ${i + 1}`,
              date: date,
              userId: user._id
            });
          }
        });
        
        const transactions = await Transaction.insertMany(transactionsData);
        console.log('Sample transactions created:', transactions.length);
        
        // Create sample budgets for each user
        const budgetsData = [];
        users.forEach(user => {
          sampleBudgets.forEach(budget => {
            // Ensure unique category names per user to avoid duplicate key error
            budgetsData.push({
              category: `${budget.category}_${user.username}`,
              limit: budget.limit,
              userId: user._id
            });
          });
        });
        
        const budgets = await Budget.insertMany(budgetsData);
        console.log('Sample budgets created:', budgets.length);
        
        console.log('Database initialization completed successfully!');
      } catch (error) {
        console.error('Database initialization failed:', error);
      }
    }, 2000); // Wait 2 seconds for server to start
    
    // Keep the process running
    process.on('exit', async () => {
      await mongod.stop();
    });
    
    process.on('SIGINT', async () => {
      await mongod.stop();
      process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
      await mongod.stop();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('Error starting MongoDB Memory Server:', error);
    process.exit(1);
  }
}

startMongoMemoryServer();