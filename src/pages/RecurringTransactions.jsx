import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import { Plus, Edit3, Trash2, Repeat, Calendar, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { format, parseISO, addDays, addWeeks, addMonths, addYears } from 'date-fns';
import ResponsiveCard from '../components/ResponsiveCard';

const RecurringTransactions = () => {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: 'Food',
    frequency: 'monthly',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: '',
    nextDate: format(new Date(), 'yyyy-MM-dd'),
  });

  // Filter recurring transactions
  const recurringTransactions = transactions.filter(t => t.recurring);

  // Categories for dropdown
  const categories = [
    'Food',
    'Transport',
    'Shopping',
    'Bills',
    'Entertainment',
    'Health',
    'Education',
    'Travel',
    'Salary',
    'Freelance',
    'Other',
  ];

  // Frequency options
  const frequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'bimonthly', label: 'Bi-monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' },
  ];

  // Calculate next occurrence date
  const calculateNextDate = (startDate, frequency) => {
    const date = new Date(startDate);
    switch (frequency) {
      case 'daily':
        return addDays(date, 1);
      case 'weekly':
        return addWeeks(date, 1);
      case 'biweekly':
        return addWeeks(date, 2);
      case 'monthly':
        return addMonths(date, 1);
      case 'bimonthly':
        return addMonths(date, 2);
      case 'quarterly':
        return addMonths(date, 3);
      case 'yearly':
        return addYears(date, 1);
      default:
        return date;
    }
  };

  // Handle form input changes
  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Auto-calculate next date when frequency or start date changes
    if (name === 'frequency' || name === 'startDate') {
      const newStartDate = name === 'startDate' ? value : formData.startDate;
      const newFrequency = name === 'frequency' ? value : formData.frequency;
      const nextDate = calculateNextDate(newStartDate, newFrequency);
      setFormData(prev => ({
        ...prev,
        nextDate: format(nextDate, 'yyyy-MM-dd'),
      }));
    }
  };

  // Handle form submission
  const handleSubmit = e => {
    e.preventDefault();

    const transactionData = {
      ...formData,
      amount: parseFloat(formData.amount),
      recurring: true,
      date: formData.startDate,
    };

    if (editingTransaction) {
      updateTransaction(editingTransaction.id, transactionData);
    } else {
      addTransaction(transactionData);
    }

    // Reset form
    setFormData({
      description: '',
      amount: '',
      type: 'expense',
      category: 'Food',
      frequency: 'monthly',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: '',
      nextDate: format(new Date(), 'yyyy-MM-dd'),
    });
    setEditingTransaction(null);
    setShowModal(false);
  };

  // Edit a transaction
  const handleEdit = transaction => {
    setEditingTransaction(transaction);
    setFormData({
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      frequency: transaction.frequency || 'monthly',
      startDate: transaction.date,
      endDate: transaction.endDate || '',
      nextDate: transaction.nextDate || format(new Date(), 'yyyy-MM-dd'),
    });
    setShowModal(true);
  };

  // Delete a transaction
  const handleDelete = id => {
    if (window.confirm('Are you sure you want to delete this recurring transaction?')) {
      deleteTransaction(id);
    }
  };

  // Format frequency for display
  const formatFrequency = frequency => {
    const freq = frequencies.find(f => f.value === frequency);
    return freq ? freq.label : frequency;
  };

  return (
    <div className="p-3 sm:p-4 md:p-5 lg:p-6 space-y-5 sm:space-y-6 md:space-y-7 lg:space-y-8 fade-in">
      {/* Mobile-specific spacing adjustments */}
      <div className="sm:hidden mt-16"></div>
      
      {/* Modern Header with Gradient Background */}
      <div className="rounded-2xl bg-gradient-to-r from-[#076653]/10 to-[#076653]/5 p-5 sm:p-6 md:p-7 backdrop-blur-sm border border-[#076653]/20 dark:border-[#076653]/10 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#076653]/5 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#076653]/5 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Recurring Transactions</h1>
              <p className="text-gray-600 dark:text-gray-300">Manage your regular income and expenses</p>
            </div>
            <button
              onClick={() => {
                setEditingTransaction(null);
                setFormData({
                  description: '',
                  amount: '',
                  type: 'expense',
                  category: 'Food',
                  frequency: 'monthly',
                  startDate: format(new Date(), 'yyyy-MM-dd'),
                  endDate: '',
                  nextDate: format(new Date(), 'yyyy-MM-dd'),
                });
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-4 py-3 bg-[#076653] text-white rounded-xl hover:bg-[#076653]/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus size={20} />
              <span className="font-semibold hidden sm:inline">Add Recurring Transaction</span>
              <span className="font-semibold sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards with Modern Design */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-5 shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Total Recurring</h3>
            <div className="p-2 rounded-lg bg-blue-100/80 dark:bg-blue-900/30">
              <Repeat size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{recurringTransactions.length}</p>
          <div className="mt-2 flex items-center text-xs text-blue-600 dark:text-blue-400">
            <Repeat size={14} className="mr-1" />
            <span>Active transactions</span>
          </div>
        </div>
        
        <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-5 shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Monthly Income</h3>
            <div className="p-2 rounded-lg bg-green-100/80 dark:bg-green-900/30">
              <TrendingUp size={20} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            $
            {recurringTransactions
              .filter(t => t.type === 'income')
              .reduce((sum, t) => sum + t.amount, 0)
              .toLocaleString()}
          </p>
          <div className="mt-2 flex items-center text-xs text-green-600 dark:text-green-400">
            <TrendingUp size={14} className="mr-1" />
            <span>Recurring income</span>
          </div>
        </div>
        
        <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-5 shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Monthly Expenses</h3>
            <div className="p-2 rounded-lg bg-red-100/80 dark:bg-red-900/30">
              <TrendingDown size={20} className="text-red-600 dark:text-red-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            $
            {recurringTransactions
              .filter(t => t.type === 'expense')
              .reduce((sum, t) => sum + t.amount, 0)
              .toLocaleString()}
          </p>
          <div className="mt-2 flex items-center text-xs text-red-600 dark:text-red-400">
            <TrendingDown size={14} className="mr-1" />
            <span>Recurring expenses</span>
          </div>
        </div>
      </div>

      {/* Recurring Transactions List */}
      <div className="rounded-2xl bg-white/80 dark:bg-gray-800/60 p-5 sm:p-6 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Your Recurring Transactions</h2>
          <span className="text-sm font-medium text-[#076653]">
            {recurringTransactions.length} transactions
          </span>
        </div>
        
        {recurringTransactions.length === 0 ? (
          <div className="text-center py-12">
            <Repeat className="mx-auto text-gray-400" size={48} />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">
              No recurring transactions yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Add your first recurring transaction to automate your finances.
            </p>
            <button
              onClick={() => {
                setEditingTransaction(null);
                setFormData({
                  description: '',
                  amount: '',
                  type: 'expense',
                  category: 'Food',
                  frequency: 'monthly',
                  startDate: format(new Date(), 'yyyy-MM-dd'),
                  endDate: '',
                  nextDate: format(new Date(), 'yyyy-MM-dd'),
                });
                setShowModal(true);
              }}
              className="mt-4 px-4 py-2 bg-[#076653] text-white rounded-lg hover:bg-[#076653]/90 transition-colors duration-300"
            >
              Add Recurring Transaction
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {recurringTransactions.map(transaction => (
              <div key={transaction.id} className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/40 backdrop-blur-sm border border-gray-100/50 dark:border-gray-700/30 hover:bg-white/80 dark:hover:bg-gray-800/60 transition-all duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${transaction.type === 'income' ? 'bg-green-100/80 dark:bg-green-900/30' : 'bg-red-100/80 dark:bg-red-900/30'}`}>
                      {transaction.type === 'income' ? 
                        <TrendingUp size={20} className="text-green-600 dark:text-green-400" /> : 
                        <TrendingDown size={20} className="text-red-600 dark:text-red-400" />
                      }
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200">{transaction.description}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {format(parseISO(transaction.date), 'MMM dd, yyyy')} • {transaction.category}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="text-right">
                      <p className={`font-bold ${transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFrequency(transaction.frequency || 'monthly')}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="text-xs px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          <span>
                            {transaction.nextDate
                              ? format(parseISO(transaction.nextDate), 'MMM dd')
                              : 'N/A'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors duration-200"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors duration-200"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                {editingTransaction ? 'Edit Recurring Transaction' : 'Add Recurring Transaction'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors duration-200"
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 sm:px-4 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#076653] focus:border-transparent transition-all duration-200 text-base sm:text-lg min-h-[44px]"
                  placeholder="e.g., Monthly rent payment"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full px-3 py-3 sm:px-4 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#076653] focus:border-transparent transition-all duration-200 text-base sm:text-lg min-h-[44px]"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 sm:px-4 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#076653] focus:border-transparent transition-all duration-200 text-base sm:text-lg min-h-[44px]"
                    required
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 sm:px-4 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#076653] focus:border-transparent transition-all duration-200 text-base sm:text-lg min-h-[44px]"
                  required
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Frequency</label>
                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 sm:px-4 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#076653] focus:border-transparent transition-all duration-200 text-base sm:text-lg min-h-[44px]"
                  required
                >
                  {frequencies.map(freq => (
                    <option key={freq.value} value={freq.value}>
                      {freq.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 sm:px-4 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#076653] focus:border-transparent transition-all duration-200 text-base sm:text-lg min-h-[44px]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Next Date</label>
                  <input
                    type="date"
                    name="nextDate"
                    value={formData.nextDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 sm:px-4 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#076653] focus:border-transparent transition-all duration-200 text-base sm:text-lg min-h-[44px]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Date (Optional)</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 sm:px-4 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#076653] focus:border-transparent transition-all duration-200 text-base sm:text-lg min-h-[44px]"
                />
              </div>

              <div className="flex gap-2 sm:gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 px-3 sm:px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-xl transition-colors duration-200 text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 px-3 sm:px-4 bg-[#076653] hover:bg-[#076653]/90 text-white font-semibold rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  {editingTransaction ? 'Update' : 'Add'} Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecurringTransactions;