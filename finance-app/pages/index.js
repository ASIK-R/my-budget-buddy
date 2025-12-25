import { useState } from 'react';
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon, 
  WalletIcon, 
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('month');

  // Mock data for financial stats
  const financialStats = {
    totalBalance: 12560.75,
    income: 8500.50,
    expenses: 3245.25,
    savings: 9255.50
  };

  // Mock data for recent transactions
  const recentTransactions = [
    { id: 1, title: 'Salary Deposit', amount: 2500.00, type: 'income', date: '2023-06-15', category: 'Salary' },
    { id: 2, title: 'Grocery Shopping', amount: 85.30, type: 'expense', date: '2023-06-14', category: 'Food' },
    { id: 3, title: 'Electricity Bill', amount: 120.75, type: 'expense', date: '2023-06-12', category: 'Utilities' },
    { id: 4, title: 'Freelance Work', amount: 1200.00, type: 'income', date: '2023-06-10', category: 'Work' },
  ];

  // Mock data for spending by category
  const spendingData = [
    { name: 'Food', value: 400 },
    { name: 'Transport', value: 150 },
    { name: 'Utilities', value: 200 },
    { name: 'Entertainment', value: 100 },
    { name: 'Shopping', value: 300 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Mock data for income vs expenses
  const incomeExpenseData = [
    { name: 'Jan', income: 4000, expenses: 2400 },
    { name: 'Feb', income: 3000, expenses: 1398 },
    { name: 'Mar', income: 2000, expenses: 9800 },
    { name: 'Apr', income: 2780, expenses: 3908 },
    { name: 'May', income: 1890, expenses: 4800 },
    { name: 'Jun', income: 2390, expenses: 3800 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gradient">Dashboard</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => setTimeRange('week')}
            className={`px-4 py-2 rounded-lg ${timeRange === 'week' ? 'bg-gradient-1 text-brand-dark' : 'bg-white dark:bg-gray-700'}`}
          >
            Week
          </button>
          <button 
            onClick={() => setTimeRange('month')}
            className={`px-4 py-2 rounded-lg ${timeRange === 'month' ? 'bg-gradient-1 bg-gradient-1 text-brand-dark' : 'bg-white dark:bg-gray-700'}`}
          >
            Month
          </button>
          <button 
            onClick={() => setTimeRange('year')}
            className={`px-4 py-2 rounded-lg ${timeRange === 'year' ? 'bg-gradient-1 text-brand-dark' : 'bg-white dark:bg-gray-700'}`}
          >
            Year
          </button>
        </div>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600 dark:text-gray-300">Total Balance</p>
              <h3 className="text-2xl font-bold">${financialStats.totalBalance.toFixed(2)}</h3>
            </div>
            <div className="p-3 bg-white/30 rounded-xl">
              <WalletIcon className="h-8 w-8 text-brand-dark" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600 dark:text-gray-300">Income</p>
              <h3 className="text-2xl font-bold text-green-600">${financialStats.income.toFixed(2)}</h3>
            </div>
            <div className="p-3 bg-white/30 rounded-xl">
              <ArrowTrendingUpIcon className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600 dark:text-gray-300">Expenses</p>
              <h3 className="text-2xl font-bold text-red-600">${financialStats.expenses.toFixed(2)}</h3>
            </div>
            <div className="p-3 bg-white/30 rounded-xl">
              <ArrowTrendingDownIcon className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600 dark:text-gray-300">Savings</p>
              <h3 className="text-2xl font-bold text-blue-600">${financialStats.savings.toFixed(2)}</h3>
            </div>
            <div className="p-3 bg-white/30 rounded-xl">
              <CurrencyDollarIcon className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Income vs Expenses</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={incomeExpenseData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="income" fill="#10B981" name="Income" />
                <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spending by Category */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Spending by Category</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={spendingData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {spendingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Transactions</h2>
          <button className="text-brand-accent hover:underline">View All</button>
        </div>
        <div className="space-y-4">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-700/50 rounded-xl">
              <div>
                <h3 className="font-medium">{transaction.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.date} • {transaction.category}</p>
              </div>
              <div className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}