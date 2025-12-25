import { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Minus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useHapticFeedback from '../hooks/useHapticFeedback.js';

const QuickTransactionInput = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addTransaction, accounts, categories: appCategories, transferBetweenWallets } = useAppContext();
  const { triggerHapticFeedback } = useHapticFeedback();
  const [isVisible, setIsVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(0);
  const inputRef = useRef(null);

  // Only show on home page
  const showQuickTransaction = location.pathname === '/';

  // Use app categories or fallback to defaults - with proper safeguards
  const categories = (() => {
    try {
      // Check if appCategories is valid
      if (!appCategories || !Array.isArray(appCategories)) {
        return {
          expense: ['Food', 'Transport', 'Bills', 'Shopping', 'Entertainment', 'Health', 'Other'],
          income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other']
        };
      }
      
      // Process categories safely
      const result = { expense: [], income: [] };
      
      appCategories.forEach(cat => {
        // Safeguard against undefined/null category objects
        if (cat && typeof cat === 'object' && cat.type) {
          // Initialize array if it doesn't exist
          if (!result[cat.type]) result[cat.type] = [];
          
          // Add category name if it exists
          if (cat.name) {
            result[cat.type].push(cat.name);
          }
        }
      });
      
      // Ensure we have default categories if none were processed
      if (result.expense.length === 0) {
        result.expense = ['Food', 'Transport', 'Bills', 'Shopping', 'Entertainment', 'Health', 'Other'];
      }
      
      if (result.income.length === 0) {
        result.income = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];
      }
      
      return result;
    } catch (error) {
      console.warn('Error processing categories, using defaults:', error);
      return {
        expense: ['Food', 'Transport', 'Bills', 'Shopping', 'Entertainment', 'Health', 'Other'],
        income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other']
      };
    }
  })();

  // Get available accounts for selection - with proper safeguards
  const availableAccounts = (accounts && Array.isArray(accounts) && accounts.length > 0) 
    ? accounts 
    : [{ id: 'default', name: 'Default Account', balance: 0, type: 'Cash' }];

  // Set default account when accounts load - prioritize Cash Wallet
  useEffect(() => {
    if (availableAccounts.length > 0) {
      // Look for Cash Wallet first
      const cashWallet = availableAccounts.find(acc => acc && acc.type === 'Cash');
      if (cashWallet && !selectedAccount) {
        setSelectedAccount(cashWallet.id);
      } else if (!selectedAccount) {
        // Fallback to first account
        setSelectedAccount(availableAccounts[0].id);
      }
    }
    
    // Set default target account if different from selected account
    if (availableAccounts.length > 1 && !targetAccount && selectedAccount) {
      const otherAccount = availableAccounts.find(acc => acc && acc.id !== selectedAccount);
      if (otherAccount) {
        setTargetAccount(otherAccount.id);
      }
    }
  }, [availableAccounts, selectedAccount, targetAccount]);

  // Handle click functionality (single vs double click)
  const handleClick = () => {
    triggerHapticFeedback('tap');
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - lastClickTime;

    if (timeDiff < 300) {
      // Double click - navigate to transactions page
      navigate('/transactions');
      setIsVisible(false); // Close popup if open
      triggerHapticFeedback('tap');
    } else {
      // Single click - show popup
      setIsVisible(true);
      
      // Focus input when popup appears
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
    
    setLastClickTime(currentTime);
  };

  const handleClose = () => {
    triggerHapticFeedback('tap');
    setIsVisible(false);
  };

  const toggleVisibility = () => {
    triggerHapticFeedback('tap');
    setIsVisible(!isVisible);
  };

  const handleSubmit = async (type) => {
    if (!amount) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Handle expense/income
      if (!description || !selectedAccount || (type === 'expense' && !selectedCategory)) {
        throw new Error('Please fill all required fields');
      }
      
      // For income, we don't require a category
      const category = type === 'income' ? 'Income' : selectedCategory;
      
      await addTransaction({
        type: type,
        amount: parseFloat(amount),
        description,
        accountId: selectedAccount,
        category,
        date: new Date().toISOString().split('T')[0],
      });

      // Reset form
      setAmount('');
      setDescription('');
      setSelectedCategory('');
      
      // Close after successful submission
      handleClose();
      
      // Trigger success haptic feedback
      triggerHapticFeedback('success');
    } catch (error) {
      console.error('Error processing transaction:', error);
      // Could add user-facing error handling here
      // Trigger error haptic feedback
      triggerHapticFeedback('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render anything if not on home page
  if (!showQuickTransaction) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 z-[9999] md:hidden max-w-full">
      {isVisible && (
        <div className="fixed bottom-36 right-4 mb-4 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 transform transition-all duration-300 max-w-[calc(100vw-2rem)]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Quick Transaction
            </h3>
            <button
              onClick={handleClose}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 touch-target"
            >
              <X size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="input-mobile w-full"
                autoFocus
                ref={inputRef}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What was this for?"
                className="input-mobile w-full"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSubmit('income')}
                className="btn-mobile btn-mobile-primary flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                Income
              </button>
              
              <button
                onClick={() => handleSubmit('expense')}
                className="btn-mobile bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Minus size={16} />
                Expense
              </button>
            </div>
          </div>
        </div>
      )}
      
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={toggleVisibility}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-[#076653] to-teal-700 text-white shadow-xl flex items-center justify-center hover:shadow-2xl transition-all duration-200 touch-target"
      >
        <AnimatePresence mode="wait">
          {isVisible ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="plus"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Plus size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default QuickTransactionInput;