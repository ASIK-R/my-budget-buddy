import { motion } from 'framer-motion';
import { DollarSign, Edit3, Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { useState } from 'react';
import { getIconClass } from '../utils/iconUtils';

const Investments = () => {
  const [showAddInvestment, setShowAddInvestment] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState(null);
  const [investments, setInvestments] = useState([
    {
      id: '1',
      name: 'Tech Stocks',
      type: 'Stocks',
      amount: 5000,
      currentValue: 5400,
      purchaseDate: '2023-01-15',
      lastUpdated: '2023-06-15',
    },
    {
      id: '2',
      name: 'Real Estate Fund',
      type: 'Mutual Fund',
      amount: 10000,
      currentValue: 10500,
      purchaseDate: '2022-03-20',
      lastUpdated: '2023-06-15',
    },
    {
      id: '3',
      name: 'Crypto Portfolio',
      type: 'Cryptocurrency',
      amount: 2000,
      currentValue: 1800,
      purchaseDate: '2021-11-10',
      lastUpdated: '2023-06-15',
    },
  ]);
  const [investmentData, setInvestmentData] = useState({
    name: '',
    type: 'Stocks',
    amount: '',
    currentValue: '',
  });

  const investmentTypes = [
    'Stocks',
    'Bonds',
    'Mutual Fund',
    'ETF',
    'Cryptocurrency',
    'Real Estate',
    'Commodities',
    'Other',
  ];

  const handleAddInvestment = e => {
    e.preventDefault();
    if (investmentData.name && investmentData.amount && investmentData.currentValue) {
      const newInvestment = {
        id: Date.now().toString(),
        ...investmentData,
        amount: parseFloat(investmentData.amount),
        currentValue: parseFloat(investmentData.currentValue),
        purchaseDate: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0],
      };

      if (editingInvestment) {
        setInvestments(investments.map(i => (i.id === editingInvestment.id ? newInvestment : i)));
      } else {
        setInvestments([...investments, newInvestment]);
      }

      setInvestmentData({ name: '', type: 'Stocks', amount: '', currentValue: '' });
      setShowAddInvestment(false);
      setEditingInvestment(null);
    }
  };

  const handleEditInvestment = investment => {
    setEditingInvestment(investment);
    setInvestmentData({
      name: investment.name,
      type: investment.type,
      amount: investment.amount.toString(),
      currentValue: investment.currentValue.toString(),
    });
    setShowAddInvestment(true);
  };

  const handleDeleteInvestment = id => {
    setInvestments(investments.filter(i => i.id !== id));
  };

  const formatCurrency = amount => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const calculateProfit = investment => {
    return investment.currentValue - investment.amount;
  };

  const calculateProfitPercentage = investment => {
    return ((investment.currentValue - investment.amount) / investment.amount) * 100;
  };

  return (
    <div className="p-responsive w-full max-w-full overflow-x-hidden bg-gray-50 dark:bg-gray-900">
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
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Investments</h1>
              <p className="text-gray-600 dark:text-gray-300">Track your investments, profits, and withdrawals</p>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-3 bg-[#076653] text-white rounded-xl hover:bg-[#076653]/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              onClick={() => setShowAddInvestment(true)}
            >
              <Plus size={20} />
              <span className="font-semibold hidden sm:inline">Add Investment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Portfolio Summary with Modern Design */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        <motion.div 
          className="rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-5 shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Total Invested</h3>
            <div className="p-2 rounded-lg bg-blue-100/80 dark:bg-blue-900/30">
              <DollarSign size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(investments.reduce((sum, inv) => sum + inv.amount, 0))}
          </p>
          <div className="mt-2 flex items-center text-xs text-blue-600 dark:text-blue-400">
            <DollarSign size={14} className="mr-1" />
            <span>Portfolio value</span>
          </div>
        </motion.div>

        <motion.div
          className="rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-5 shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Current Value</h3>
            <div className="p-2 rounded-lg bg-green-100/80 dark:bg-green-900/30">
              <TrendingUp size={20} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(investments.reduce((sum, inv) => sum + inv.currentValue, 0))}
          </p>
          <div className="mt-2 flex items-center text-xs text-green-600 dark:text-green-400">
            <TrendingUp size={14} className="mr-1" />
            <span>Market value</span>
          </div>
        </motion.div>

        <motion.div
          className="rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-5 shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Total Profit</h3>
            <div className="p-2 rounded-lg bg-purple-100/80 dark:bg-purple-900/30">
              <TrendingDown size={20} className="text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(investments.reduce((sum, inv) => sum + calculateProfit(inv), 0))}
          </p>
          <div className="mt-2 flex items-center text-xs text-purple-600 dark:text-purple-400">
            <TrendingDown size={14} className="mr-1" />
            <span>Unrealized gains</span>
          </div>
        </motion.div>
      </div>

      {/* Investments Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {investments.map((investment, index) => {
          const profit = calculateProfit(investment);
          const profitPercentage = calculateProfitPercentage(investment);
          const isProfit = profit >= 0;

          return (
            <motion.div
              key={investment.id}
              className="rounded-2xl bg-white/80 dark:bg-gray-800/60 p-5 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">{investment.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{investment.type}</p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEditInvestment(investment)}
                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors duration-200"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteInvestment(investment.id)}
                    className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors duration-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Invested</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(investment.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Current Value</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(investment.currentValue)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Profit/Loss</span>
                  <span className={`font-semibold ${isProfit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {isProfit ? '+' : ''}{formatCurrency(profit)} ({isProfit ? '+' : ''}{profitPercentage.toFixed(2)}%)
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700/50">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Purchased: {investment.purchaseDate}</span>
                  <span>Updated: {investment.lastUpdated}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add/Edit Investment Modal */}
      {showAddInvestment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingInvestment ? 'Edit Investment' : 'Add Investment'}
              </h2>
              <button
                onClick={() => {
                  setShowAddInvestment(false);
                  setEditingInvestment(null);
                  setInvestmentData({ name: '', type: 'Stocks', amount: '', currentValue: '' });
                }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors duration-200"
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

            <form onSubmit={handleAddInvestment} className="p-5 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Investment Name</label>
                <input
                  type="text"
                  value={investmentData.name}
                  onChange={e => setInvestmentData({ ...investmentData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#076653] focus:border-transparent transition-all duration-200"
                  placeholder="e.g. Tech Stocks"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Investment Type</label>
                <select
                  value={investmentData.type}
                  onChange={e => setInvestmentData({ ...investmentData, type: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#076653] focus:border-transparent transition-all duration-200"
                  required
                >
                  {investmentTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Initial Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={investmentData.amount}
                  onChange={e => setInvestmentData({ ...investmentData, amount: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#076653] focus:border-transparent transition-all duration-200"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Value</label>
                <input
                  type="number"
                  step="0.01"
                  value={investmentData.currentValue}
                  onChange={e => setInvestmentData({ ...investmentData, currentValue: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#076653] focus:border-transparent transition-all duration-200"
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddInvestment(false);
                    setEditingInvestment(null);
                    setInvestmentData({ name: '', type: 'Stocks', amount: '', currentValue: '' });
                  }}
                  className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-xl transition-colors duration-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 px-4 bg-[#076653] hover:bg-[#076653]/90 text-white font-semibold rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  {editingInvestment ? 'Update' : 'Add'} Investment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Investments;