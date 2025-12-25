import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { X, TrendingUp, RefreshCw, ArrowDownRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TransferModal = () => {
  const { showTransferModal, setShowTransferModal, accounts, transferBetweenWallets } = useAppContext();
  const [transferData, setTransferData] = useState({
    fromWallet: '',
    toWallet: '',
    amount: '',
    note: '',
  });
  const [errors, setErrors] = useState({});
  const [isTransferring, setIsTransferring] = useState(false);

  const handleTransfer = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!transferData.fromWallet || !transferData.toWallet) {
      setErrors({ general: 'Please select both source and destination wallets' });
      return;
    }
    
    if (transferData.fromWallet === transferData.toWallet) {
      setErrors({ general: 'Source and destination wallets must be different' });
      return;
    }
    
    const amount = parseFloat(transferData.amount);
    if (isNaN(amount) || amount <= 0) {
      setErrors({ general: 'Please enter a valid transfer amount' });
      return;
    }
    
    // Check if source wallet has sufficient funds
    const fromWallet = accounts.find(w => w.id === transferData.fromWallet);
    if (fromWallet && fromWallet.balance < amount) {
      setErrors({ general: 'Insufficient funds in source wallet' });
      return;
    }
    
    setIsTransferring(true);
    setErrors({});
    
    try {
      await transferBetweenWallets(
        transferData.fromWallet,
        transferData.toWallet,
        amount,
        transferData.note
      );
      
      // Reset form
      setTransferData({
        fromWallet: '',
        toWallet: '',
        amount: '',
        note: '',
      });
      
      // Close modal
      setShowTransferModal(false);
    } catch (error) {
      setErrors({ general: error.message || 'Failed to transfer money. Please try again.' });
    } finally {
      setIsTransferring(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Don't render if not open
  if (!showTransferModal) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShowTransferModal(false)}
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
              Transfer Money
            </h2>
            <button
              onClick={() => setShowTransferModal(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              aria-label="Close modal"
            >
              <X size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          
          <form onSubmit={handleTransfer} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {errors.general && (
              <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
                {errors.general}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">From Wallet</label>
              <select
                value={transferData.fromWallet}
                onChange={e => setTransferData({ ...transferData, fromWallet: e.target.value })}
                className="w-full px-3 py-3 sm:px-4 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-base sm:text-lg"
                required
              >
                <option value="">Select source wallet</option>
                {(accounts || []).map(wallet => (
                  <option key={wallet.id} value={wallet.id}>
                    {wallet.name} ({formatCurrency(wallet.balance)})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-center">
              <ArrowDownRight className="text-gray-400" size={20} />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">To Wallet</label>
              <select
                value={transferData.toWallet}
                onChange={e => setTransferData({ ...transferData, toWallet: e.target.value })}
                className="w-full px-3 py-3 sm:px-4 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-base sm:text-lg"
                required
              >
                <option value="">Select destination wallet</option>
                {(accounts || []).map(wallet => (
                  <option key={wallet.id} value={wallet.id}>
                    {wallet.name} ({formatCurrency(wallet.balance)})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Amount</label>
              <div className="relative">
                <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-base sm:text-lg">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={transferData.amount}
                  onChange={e => setTransferData({ ...transferData, amount: e.target.value })}
                  className="w-full pl-8 sm:pl-10 pr-4 py-3 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-base sm:text-lg"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Note (Optional)</label>
              <input
                type="text"
                value={transferData.note}
                onChange={e => setTransferData({ ...transferData, note: e.target.value })}
                className="w-full px-3 py-3 sm:px-4 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-base sm:text-lg"
                placeholder="Add a note for this transfer"
              />
            </div>
            
            <div className="flex gap-2 sm:gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowTransferModal(false)}
                className="flex-1 py-3 px-3 sm:px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-xl transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isTransferring}
                className={`flex-1 py-3 px-3 sm:px-4 font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm sm:text-base ${
                  isTransferring
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white hover:shadow-lg'
                }`}
              >
                {isTransferring ? (
                  <>
                    <RefreshCw className="animate-spin" size={16} />
                    <span>Transferring...</span>
                  </>
                ) : (
                  <>
                    <TrendingUp size={16} />
                    <span>Transfer Money</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TransferModal;