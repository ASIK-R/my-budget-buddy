import { Plus, Minus, Repeat, Menu, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { useState } from 'react';
import useHapticFeedback from '../hooks/useHapticFeedback.js';

const MobileFAB = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setShowTransactionModal, setTransactionModalType, setShowTransferModal } = useAppContext();
  const { triggerHapticFeedback } = useHapticFeedback();

  // Show FAB on key pages: wallet, analysis, and transactions (NOT on home page '/')
  // But show simplified FAB on transactions page
  const showFAB = ['/wallet', '/analysis', '/transactions', '/ai'].includes(location.pathname);
  const isTransactionsPage = location.pathname === '/transactions';
  const isDashboardPage = location.pathname === '/';
  const isAIPage = location.pathname === '/ai';
  
  // State for expanded options
  const [isVisible, setIsVisible] = useState(false);

  const handleTransactionClick = (type) => {
    triggerHapticFeedback('tap');
    setTransactionModalType(type);
    setShowTransactionModal(true);
    setIsVisible(false); // Close expanded view
  };
  
  const handleTransferMoney = () => {
    triggerHapticFeedback('tap');
    setShowTransferModal(true);
    setIsVisible(false); // Close expanded view
  };

  const handleGoToAI = () => {
    triggerHapticFeedback('tap');
    navigate('/ai');
    setIsVisible(false); // Close expanded view
  };

  const handleGoToTransactions = () => {
    triggerHapticFeedback('tap');
    navigate('/transactions');
    setIsVisible(false); // Close expanded view
  };

  const toggleVisibility = () => {
    triggerHapticFeedback('tap');
    setIsVisible(!isVisible);
  };

  // Simplified FAB for transactions page - only one button to add expense
  if (isTransactionsPage) {
    return (
      <div className="fixed bottom-20 right-4 z-40 md:hidden max-w-full safe-area-inset-bottom">
        <motion.button
          onClick={() => handleTransactionClick('expense')}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-[#076653] to-teal-700 text-white shadow-2xl flex items-center justify-center hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#076653]/30 border-2 border-white dark:border-gray-800 touch-target-large"
          aria-label="Add transaction"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={28} className="font-bold" />
        </motion.button>
      </div>
    );
  }

  // Special FAB for AI page - direct access to financial tools
  if (isAIPage) {
    return (
      <div className="fixed bottom-20 right-4 z-40 md:hidden max-w-full safe-area-inset-bottom">
        <motion.button
          onClick={handleGoToTransactions}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-[#076653] to-teal-700 text-white shadow-2xl flex items-center justify-center hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#076653]/30 border-2 border-white dark:border-gray-800 touch-target-large"
          aria-label="Add transaction"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={28} className="font-bold" />
        </motion.button>
      </div>
    );
  }

  // Don't show FAB on home page or when not in showFAB list
  if (!showFAB || isDashboardPage) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 z-40 md:hidden max-w-full safe-area-inset-bottom">
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="mb-4 flex flex-col items-end space-y-2"
        >
          <button
            onClick={() => handleTransactionClick('transfer')}
            className="flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 touch-target border border-gray-200 dark:border-gray-700"
          >
            <span className="text-sm font-medium whitespace-nowrap">Transfer</span>
            <Repeat size={16} />
          </button>
          
          <button
            onClick={() => handleTransactionClick('expense')}
            className="flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 touch-target border border-gray-200 dark:border-gray-700"
          >
            <span className="text-sm font-medium whitespace-nowrap">Expense</span>
            <Minus size={16} />
          </button>
          
          <button
            onClick={() => handleTransactionClick('income')}
            className="flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 touch-target border border-gray-200 dark:border-gray-700"
          >
            <span className="text-sm font-medium whitespace-nowrap">Income</span>
            <Plus size={16} />
          </button>
        </motion.div>
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
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default MobileFAB;