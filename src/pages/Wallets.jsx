import { motion, useSpring } from 'framer-motion';
import {
  ArrowDownRight,
  Banknote,
  CreditCard,
  Eye,
  EyeOff,
  PiggyBank,
  Plus,
  RefreshCw,
  Smartphone,
  TrendingUp,
  Wallet,
  Edit3,
  Trash2,
} from 'lucide-react';
import { useEffect, useState, useMemo, memo } from 'react';
import { useAppContext } from '../context/AppContext';
import WalletCard from '../components/WalletCard';
import WalletTransactionHistory from '../components/WalletTransactionHistory';
import { debounce, throttle } from '../utils/performance';
import { getIconClass } from '../utils/iconUtils';

/**
 * @typedef {Object} WalletErrors
 * @property {string} [general]
 * @property {string} [fromWallet]
 * @property {string} [toWallet]
 * @property {string} [amount]
 */

const Wallets = () => {
  const { accounts: wallets, addAccount: addWallet, updateAccount: updateWallet, deleteAccount: deleteWallet, transferBetweenWallets, error, clearError } = useAppContext();
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [showEditWallet, setShowEditWallet] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [hideBalances, setHideBalances] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [newWalletData, setNewWalletData] = useState({
    name: '',
    type: 'Bank',
    initialBalance: '',
  });
  const [editWalletData, setEditWalletData] = useState({
    name: '',
    type: 'Bank',
  });
  const [transferData, setTransferData] = useState({
    fromWallet: '',
    toWallet: '',
    amount: '',
    note: '',
  });
  /** @type {[WalletErrors, Function]} */
  const [errors, setErrors] = useState({});
  const [isTransferring, setIsTransferring] = useState(false);

  // Animated balance counters
  const balanceAnimations = useMemo(() => 
    wallets.map(() => useSpring(0, { stiffness: 300, damping: 30 })), 
  [wallets.length]
  );

  useEffect(() => {
    wallets.forEach((wallet, index) => {
      balanceAnimations[index].set(wallet.balance);
    });
  }, [wallets, balanceAnimations]);

  // Memoized wallet types
  const walletTypes = useMemo(() => [
    { id: 'Bank', name: 'Bank Account', icon: Banknote },
    { id: 'Cash', name: 'Cash', icon: PiggyBank },
    { id: 'Mobile', name: 'Mobile Wallet', icon: Smartphone },
    { id: 'Card', name: 'Credit/Debit Card', icon: CreditCard },
  ], []);

  // Memoized currency formatter
  const formatCurrency = useMemo(() => {
    return (amount) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
    };
  }, []);

  // Memoized wallet totals
  const walletTotals = useMemo(() => {
    const total = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
    const walletCounts = {};
    wallets.forEach(wallet => {
      walletCounts[wallet.type] = (walletCounts[wallet.type] || 0) + 1;
    });
    return { total, walletCounts };
  }, [wallets]);

  // Debounced form handlers
  const debouncedHandleAddWallet = useMemo(() => debounce(handleAddWallet, 300), []);
  const debouncedHandleEditWallet = useMemo(() => debounce(handleEditWallet, 300), []);
  const debouncedHandleTransfer = useMemo(() => debounce(handleTransfer, 300), []);

  async function handleAddWallet(e) {
    e.preventDefault();

    // Validate form data
    if (!newWalletData.name) {
      setErrors({ general: 'Wallet name is required' });
      return;
    }

    if (parseFloat(newWalletData.initialBalance) < 0) {
      setErrors({ general: 'Initial balance cannot be negative' });
      return;
    }

    try {
      await addWallet({
        name: newWalletData.name,
        type: newWalletData.type,
        initialBalance: parseFloat(newWalletData.initialBalance) || 0,
      });
      setNewWalletData({ name: '', type: 'Bank', initialBalance: '' });
      setShowAddWallet(false);
      setErrors({});
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : String(error) });
    }
  }

  async function handleEditWallet(e) {
    e.preventDefault();

    // Validate form data
    if (!editWalletData.name) {
      setErrors({ general: 'Wallet name is required' });
      return;
    }

    try {
      await updateWallet(selectedWallet.id, {
        name: editWalletData.name,
        type: editWalletData.type,
      });
      setShowEditWallet(false);
      setSelectedWallet(null);
      setEditWalletData({ name: '', type: 'Bank' });
      setErrors({});
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : String(error) });
    }
  }

  async function handleDeleteWallet(wallet) {
    if (window.confirm(`Are you sure you want to delete the wallet "${wallet.name}"?`)) {
      try {
        await deleteWallet(wallet.id);
      } catch (error) {
        setErrors({ general: error instanceof Error ? error.message : String(error) });
      }
    }
  }

  async function handleTransfer(e) {
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
    const fromWallet = wallets.find(w => w.id === transferData.fromWallet);
    if (fromWallet && fromWallet.balance < amount) {
      setErrors({ general: 'Insufficient funds in source wallet' });
      return;
    }

    setIsTransferring(true);

    try {
      const result = await transferBetweenWallets(
        transferData.fromWallet,
        transferData.toWallet,
        amount,
        transferData.note
      );

      // Animate balance changes
      const fromWalletIndex = wallets.findIndex(w => w.id === transferData.fromWallet);
      const toWalletIndex = wallets.findIndex(w => w.id === transferData.toWallet);

      if (fromWalletIndex !== -1) {
        balanceAnimations[fromWalletIndex].set(wallets[fromWalletIndex].balance - amount);
      }

      if (toWalletIndex !== -1) {
        balanceAnimations[toWalletIndex].set(wallets[toWalletIndex].balance + amount);
      }

      setTransferData({ fromWallet: '', toWallet: '', amount: '', note: '' });
      setShowTransfer(false);
      setErrors({});

      // Reset transferring state after a delay to show success state
      setTimeout(() => {
        setIsTransferring(false);
      }, 1500);
    } catch (error) {
      setIsTransferring(false);
      setErrors({ general: error instanceof Error ? error.message : String(error) });
    }
  }

  const openEditWallet = (wallet) => {
    setSelectedWallet(wallet);
    setEditWalletData({ name: wallet.name, type: wallet.type });
    setShowEditWallet(true);
  };

  // Throttled toggle functions
  const toggleHideBalances = useMemo(() => throttle(() => {
    setHideBalances(prev => !prev);
  }, 300), []);

  const toggleAddWallet = useMemo(() => throttle(() => {
    setShowAddWallet(prev => !prev);
    if (showAddWallet) {
      setNewWalletData({ name: '', type: 'Bank', initialBalance: '' });
      setErrors({});
    }
  }, 300), [showAddWallet]);

  const toggleTransfer = useMemo(() => throttle(() => {
    setShowTransfer(prev => !prev);
    if (showTransfer) {
      setTransferData({ fromWallet: '', toWallet: '', amount: '', note: '' });
      setErrors({});
    }
  }, 300), [showTransfer]);

  return (
    <div className="w-full space-y-4">
      {/* Error Message Display - Mobile optimized */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={clearError}
                  className="text-sm font-medium text-red-800 dark:text-red-200 hover:text-red-900 dark:hover:text-red-100"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header with gradient background - Mobile optimized */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-700 rounded-2xl p-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-mobile-title text-white">Wallet Management</h1>
            <p className="text-mobile-body text-teal-100">Manage your wallets and track transactions</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={toggleHideBalances}
              className="btn-mobile flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm touch-target"
            >
              {hideBalances ? <Eye size={16} /> : <EyeOff size={16} />}
              {hideBalances ? 'Show' : 'Hide'} Balances
            </button>
            <button
              onClick={toggleTransfer}
              className="btn-mobile flex items-center gap-2 bg-white text-teal-700 hover:bg-gray-100 font-medium touch-target"
            >
              <ArrowDownRight size={16} />
              Transfer
            </button>
            <button
              onClick={toggleAddWallet}
              className="btn-mobile flex items-center gap-2 bg-white text-teal-700 hover:bg-gray-100 font-medium touch-target"
            >
              <Plus size={16} />
              Add Wallet
            </button>
          </div>
        </div>
      </div>

      {/* Wallet Summary - Mobile optimized */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="card-mobile">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-mobile-caption text-gray-600 dark:text-gray-300">Total Balance</p>
              <h3 className="text-xl font-bold text-teal-800 dark:text-teal-200">
                {hideBalances ? '••••••' : formatCurrency(walletTotals.total)}
              </h3>
            </div>
            <div className="p-3 rounded-lg bg-white/50 dark:bg-white/10 backdrop-blur-sm">
              <Wallet size={24} className={`${getIconClass()} text-teal-700 dark:text-teal-300`} />
            </div>
          </div>
        </div>
        
        {walletTypes.map(type => (
          <div key={type.id} className="card-mobile">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-mobile-caption text-gray-600 dark:text-gray-300">{type.name}</p>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  {walletTotals.walletCounts[type.id] || 0}
                </h3>
              </div>
              <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700/50 backdrop-blur-sm">
                <type.icon size={24} className={`${getIconClass()} text-gray-600 dark:text-gray-300`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Wallets Grid - Mobile optimized */}
      <div className="grid grid-cols-1 gap-4">
        {wallets.map((wallet, index) => (
          <WalletCard
            key={wallet.id}
            wallet={wallet}
            balanceAnimation={balanceAnimations[index]}
            hideBalances={hideBalances}
            onEdit={openEditWallet}
            onDelete={handleDeleteWallet}
            onTransfer={() => {}}
            maskedCurrency={(amount) => hideBalances ? '••••••' : formatCurrency(amount)}
          />
        ))}
      </div>

      {/* Transaction History - Mobile optimized */}
      <WalletTransactionHistory wallets={wallets} />

      {/* Add Wallet Modal - Mobile optimized */}
      {showAddWallet && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2">
          <div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-mobile-subtitle text-gray-800 dark:text-white">Add New Wallet</h3>
                <button 
                  onClick={toggleAddWallet}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            
            <form onSubmit={debouncedHandleAddWallet} className="p-4 space-y-4">
              {errors.general && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm">
                  {errors.general}
                </div>
              )}
              
              <div>
                <label className="block text-mobile-caption text-gray-700 dark:text-gray-300 mb-1">Wallet Name</label>
                <input
                  type="text"
                  value={newWalletData.name}
                  onChange={(e) => setNewWalletData({...newWalletData, name: e.target.value})}
                  className="input-mobile"
                  placeholder="e.g., Main Checking"
                />
              </div>
              
              <div>
                <label className="block text-mobile-caption text-gray-700 dark:text-gray-300 mb-1">Wallet Type</label>
                <select
                  value={newWalletData.type}
                  onChange={(e) => setNewWalletData({...newWalletData, type: e.target.value})}
                  className="select-mobile"
                >
                  {walletTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-mobile-caption text-gray-700 dark:text-gray-300 mb-1">Initial Balance</label>
                <input
                  type="number"
                  step="0.01"
                  value={newWalletData.initialBalance}
                  onChange={(e) => setNewWalletData({...newWalletData, initialBalance: e.target.value})}
                  className="input-mobile"
                  placeholder="0.00"
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={toggleAddWallet}
                  className="btn-mobile btn-mobile-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-mobile btn-mobile-primary flex-1"
                >
                  Add Wallet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Wallet Modal - Mobile optimized */}
      {showEditWallet && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2">
          <div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-mobile-subtitle text-gray-800 dark:text-white">Edit Wallet</h3>
                <button 
                  onClick={() => {
                    setShowEditWallet(false);
                    setSelectedWallet(null);
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            
            <form onSubmit={debouncedHandleEditWallet} className="p-4 space-y-4">
              {errors.general && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm">
                  {errors.general}
                </div>
              )}
              
              <div>
                <label className="block text-mobile-caption text-gray-700 dark:text-gray-300 mb-1">Wallet Name</label>
                <input
                  type="text"
                  value={editWalletData.name}
                  onChange={(e) => setEditWalletData({...editWalletData, name: e.target.value})}
                  className="input-mobile"
                  placeholder="e.g., Main Checking"
                />
              </div>
              
              <div>
                <label className="block text-mobile-caption text-gray-700 dark:text-gray-300 mb-1">Wallet Type</label>
                <select
                  value={editWalletData.type}
                  onChange={(e) => setEditWalletData({...editWalletData, type: e.target.value})}
                  className="select-mobile"
                >
                  {walletTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditWallet(false);
                    setSelectedWallet(null);
                  }}
                  className="btn-mobile btn-mobile-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-mobile btn-mobile-primary flex-1"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Money Modal - Mobile optimized */}
      {showTransfer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2">
          <div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-mobile-subtitle text-gray-800 dark:text-white">Transfer Money</h3>
                <button 
                  onClick={toggleTransfer}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Close modal"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            
            <form onSubmit={debouncedHandleTransfer} className="p-4 space-y-4">
              {errors.general && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm">
                  {errors.general}
                </div>
              )}
              
              <div>
                <label className="block text-mobile-caption text-gray-700 dark:text-gray-300 mb-2">From Wallet</label>
                <select
                  value={transferData.fromWallet}
                  onChange={(e) => setTransferData({...transferData, fromWallet: e.target.value})}
                  className="select-mobile"
                >
                  <option value="">Select source wallet</option>
                  {wallets
                    .filter(wallet => wallet.id !== transferData.toWallet)
                    .map(wallet => (
                      <option key={wallet.id} value={wallet.id}>
                        {wallet.name} ({formatCurrency(wallet.balance)})
                      </option>
                    ))}
                </select>
              </div>
              
              <div>
                <label className="block text-mobile-caption text-gray-700 dark:text-gray-300 mb-2">To Wallet</label>
                <select
                  value={transferData.toWallet}
                  onChange={(e) => setTransferData({...transferData, toWallet: e.target.value})}
                  className="select-mobile"
                >
                  <option value="">Select destination wallet</option>
                  {wallets
                    .filter(wallet => wallet.id !== transferData.fromWallet)
                    .map(wallet => (
                      <option key={wallet.id} value={wallet.id}>
                        {wallet.name} ({formatCurrency(wallet.balance)})
                      </option>
                    ))}
                </select>
              </div>
              
              <div>
                <label className="block text-mobile-caption text-gray-700 dark:text-gray-300 mb-2">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={transferData.amount}
                  onChange={(e) => setTransferData({...transferData, amount: e.target.value})}
                  className="input-mobile"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-mobile-caption text-gray-700 dark:text-gray-300 mb-2">Note (Optional)</label>
                <textarea
                  value={transferData.note}
                  onChange={(e) => setTransferData({...transferData, note: e.target.value})}
                  className="input-mobile"
                  placeholder="Add a note for this transfer"
                  rows="3"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={toggleTransfer}
                  className="btn-mobile btn-mobile-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isTransferring}
                  className={`btn-mobile flex-1 ${
                    isTransferring
                      ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                      : 'btn-mobile-primary'
                  }`}
                >
                  {isTransferring ? (
                    <div className="flex items-center justify-center">
                      <RefreshCw className="animate-spin mr-2" size={16} />
                      Transferring...
                    </div>
                  ) : (
                    'Transfer Money'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(Wallets);