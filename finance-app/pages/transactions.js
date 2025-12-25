import { useState } from 'react';
import { 
  ArrowsRightLeftIcon, 
  PlusIcon, 
  FunnelIcon, 
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock transaction data
  const transactions = [
    { id: 1, title: 'Salary Deposit', amount: 2500.00, type: 'income', date: '2023-06-15', category: 'Salary', wallet: 'Bank Account' },
    { id: 2, title: 'Grocery Shopping', amount: 85.30, type: 'expense', date: '2023-06-14', category: 'Food', wallet: 'bKash' },
    { id: 3, title: 'Electricity Bill', amount: 120.75, type: 'expense', date: '2023-06-12', category: 'Utilities', wallet: 'Bank Account' },
    { id: 4, title: 'Freelance Work', amount: 1200.00, type: 'income', date: '2023-06-10', category: 'Work', wallet: 'Nagad' },
    { id: 5, title: 'Restaurant Dinner', amount: 65.50, type: 'expense', date: '2023-06-08', category: 'Food', wallet: 'Cash Fund' },
    { id: 6, title: 'Investment Return', amount: 320.00, type: 'income', date: '2023-06-05', category: 'Investment', wallet: 'Savings' },
    { id: 7, title: 'Gasoline', amount: 45.00, type: 'expense', date: '2023-06-03', category: 'Transport', wallet: 'bKash' },
    { id: 8, title: 'Online Shopping', amount: 120.00, type: 'expense', date: '2023-06-01', category: 'Shopping', wallet: 'Bank Account' },
  ];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || transaction.type === filter;
    return matchesSearch && matchesFilter;
  });

  const handleAddTransaction = (e) => {
    e.preventDefault();
    // In a real app, this would call an API to add the transaction
    alert('Transaction added successfully!');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gradient">Transactions</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-transparent"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 pr-8 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-transparent appearance-none"
            >
              <option value="all">All Transactions</option>
              <option value="income">Income</option>
              <option value="expense">Expenses</option>
            </select>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="py-3 px-4 text-left text-gray-500 dark:text-gray-400 font-medium">Description</th>
                <th className="py-3 px-4 text-left text-gray-500 dark:text-gray-400 font-medium">Category</th>
                <th className="py-3 px-4 text-left text-gray-500 dark:text-gray-400 font-medium">Date</th>
                <th className="py-3 px-4 text-left text-gray-500 dark:text-gray-400 font-medium">Wallet</th>
                <th className="py-3 px-4 text-right text-gray-500 dark:text-gray-400 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium">{transaction.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{transaction.type}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-500 dark:text-gray-400">
                    {transaction.date}
                  </td>
                  <td className="py-4 px-4 text-gray-500 dark:text-gray-400">
                    {transaction.wallet}
                  </td>
                  <td className={`py-4 px-4 text-right font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Add Transaction</h2>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleAddTransaction}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <input
                      type="text"
                      placeholder="Enter description"
                      className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-brand-accent focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Amount</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        className="w-full pl-8 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-brand-accent focus:border-transparent"
                        required
                        min="0.01"
                        step="0.01"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Type</label>
                      <select className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-brand-accent focus:border-transparent">
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <select className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-brand-accent focus:border-transparent">
                        <option value="food">Food</option>
                        <option value="transport">Transport</option>
                        <option value="utilities">Utilities</option>
                        <option value="shopping">Shopping</option>
                        <option value="salary">Salary</option>
                        <option value="investment">Investment</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <input
                      type="date"
                      className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-brand-accent focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-3 px-4 bg-gray-200 dark:bg-gray-700 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-gradient-1 text-brand-dark rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    Add Transaction
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}