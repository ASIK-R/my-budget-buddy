import { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { X, Plus, Edit3, Wallet, ArrowDownCircle, ArrowUpCircle, Tag, Calendar } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import useHapticFeedback from '../hooks/useHapticFeedback.js';

const TransactionModal = ({ isOpen, type, transaction = null, onClose }) => {
  const { addTransaction, updateTransaction, accounts, categories: appCategories } = useAppContext();
  const { triggerHapticFeedback } = useHapticFeedback();
  const [formData, setFormData] = useState({
    type: transaction?.type || type || 'expense',
    category: transaction?.category || '',
    amount: transaction?.amount || '',
    description: transaction?.description || '',
    date: transaction?.date ? new Date(transaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    accountId: transaction?.accountId || accounts[0]?.id || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Use app categories or fallback to defaults
  const categories = appCategories.length > 0 
    ? appCategories.reduce((acc, cat) => {
      if (!acc[cat.type]) acc[cat.type] = [];
      acc[cat.type].push(cat.name);
      return acc;
    }, { expense: [], income: [] })
    : {
      expense: ['Food', 'Transport', 'Bills', 'Shopping', 'Entertainment', 'Health', 'Other'],
      income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'],
    };

  // Get available accounts for selection
  const availableAccounts = accounts.length > 0 ? accounts : [
    { id: 'default', name: 'Default Account', balance: 0 }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!formData.description) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.accountId) {
      newErrors.accountId = 'Account is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (transaction) {
        await updateTransaction(transaction.id, {
          ...formData,
          amount: parseFloat(formData.amount),
        });
      } else {
        await addTransaction({
          ...formData,
          amount: parseFloat(formData.amount),
        });
      }
      // Reset form errors on success
      setErrors({});
      onClose();
      triggerHapticFeedback('success');
    } catch (error) {
      console.error('Error saving transaction:', error);
      setErrors({ general: 'Failed to save transaction. Please try again.' });
      triggerHapticFeedback('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render if not open
  if (!isOpen) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => {
          onClose();
          triggerHapticFeedback('tap');
        }}
      >
        <motion.div 
          className="bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
              {transaction ? 'Edit' : 'Add'} {formData.type === 'income' ? 'Income' : 'Expense'}
            </h2>
            <button
              onClick={() => {
                onClose();
                triggerHapticFeedback('tap');
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              aria-label="Close modal"
            >
              <X size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {errors.general && (
              <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
                {errors.general}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Wallet size={16} className="sm:size-18" />
                Transaction Type
              </label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, type: 'expense', category: '' });
                    triggerHapticFeedback('tap');
                  }}
                  className={`py-3 px-3 sm:px-4 rounded-xl border-2 transition-all ${
                    formData.type === 'expense'
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                      <ArrowDownCircle size={18} className="text-red-600 dark:text-red-400" />
                    </div>
                    <span className="font-medium text-sm sm:text-base">Expense</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, type: 'income', category: '' });
                    triggerHapticFeedback('tap');
                  }}
                  className={`py-3 px-3 sm:px-4 rounded-xl border-2 transition-all ${
                    formData.type === 'income'
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/40">
                      <ArrowUpCircle size={18} className="text-green-600 dark:text-green-300" />
                    </div>
                    <span className="font-medium text-sm sm:text-base">Income</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                <Wallet size={16} className="sm:size-18" />
                Account
              </label>
              {errors.accountId && (
                <div className="text-red-500 text-sm">{errors.accountId}</div>
              )}
              <select
                value={formData.accountId}
                onChange={(e) => {
                  setFormData({ ...formData, accountId: e.target.value });
                  triggerHapticFeedback('tap');
                }}
                className={`w-full px-3 py-3 sm:px-4 sm:py-3 border rounded-xl bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-base sm:text-lg ${
                  errors.accountId 
                    ? 'border-red-500' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                {availableAccounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.name} {account.balance !== undefined ? `($${account.balance.toFixed(2)})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                <Tag size={16} className="sm:size-18" />
                Category
              </label>
              {errors.category && (
                <div className="text-red-500 text-sm">{errors.category}</div>
              )}
              <select
                value={formData.category}
                onChange={(e) => {
                  setFormData({ ...formData, category: e.target.value });
                  triggerHapticFeedback('tap');
                }}
                required
                className={`w-full px-3 py-3 sm:px-4 sm:py-3 border rounded-xl bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-base sm:text-lg ${
                  errors.category 
                    ? 'border-red-500' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <option value="">Select category</option>
                {(categories[formData.type] || []).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                <Wallet size={16} className="sm:size-18" />
                Amount
              </label>
              {errors.amount && (
                <div className="text-red-500 text-sm">{errors.amount}</div>
              )}
              <div className="relative">
                <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-base sm:text-lg">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  className={`w-full pl-8 sm:pl-10 pr-4 py-3 sm:py-3 border rounded-xl bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-base sm:text-lg ${
                    errors.amount 
                      ? 'border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                <Edit3 size={16} className="sm:size-18" />
                Description
              </label>
              {errors.description && (
                <div className="text-red-500 text-sm">{errors.description}</div>
              )}
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className={`w-full px-3 py-3 sm:px-4 sm:py-3 border rounded-xl bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-base sm:text-lg ${
                  errors.description 
                    ? 'border-red-500' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter description"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                <Calendar size={16} className="sm:size-18" />
                Date
              </label>
              {errors.date && (
                <div className="text-red-500 text-sm">{errors.date}</div>
              )}
              <input
                type="date"
                value={formData.date}
                onChange={(e) => {
                  setFormData({ ...formData, date: e.target.value });
                  triggerHapticFeedback('tap');
                }}
                required
                className={`w-full px-3 py-3 sm:px-4 sm:py-3 border rounded-xl bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-base sm:text-lg ${
                  errors.date 
                    ? 'border-red-500' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              />
            </div>

            <div className="flex gap-2 sm:gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  triggerHapticFeedback('tap');
                }}
                className="flex-1 py-3 px-3 sm:px-4 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 py-3 px-3 sm:px-4 rounded-xl font-medium transition-all text-sm sm:text-base ${
                  isSubmitting
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-1 text-brand-dark hover:shadow-lg'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  'Save Transaction'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TransactionModal;