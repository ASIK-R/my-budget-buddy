import { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import { Wallet as WalletIcon, TrendingUp, TrendingDown, ArrowUpDown, Plus, Edit3, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import WalletTransactionHistory from '../components/WalletTransactionHistory';
import TransactionFilters from '../components/TransactionFilters';
import TransactionTable from '../components/TransactionTable';
import BudgetProgress from '../components/BudgetProgress';
import TransactionModal from '../components/TransactionModal';

const WalletPage = () => {
  const { transactions } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    startDate: '',
    endDate: '',
  });

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      if (filters.type !== 'all' && transaction.type !== filters.type) {
        return false;
      }
      if (filters.category !== 'all' && transaction.category !== filters.category) {
        return false;
      }
      if (filters.startDate && new Date(transaction.date) < new Date(filters.startDate)) {
        return false;
      }
      if (filters.endDate && new Date(transaction.date) > new Date(filters.endDate)) {
        return false;
      }
      return true;
    });
  }, [transactions, filters]);

  // Calculate wallet statistics
  const walletStats = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const balance = income - expenses;
    
    return { income, expenses, balance };
  }, [transactions]);

  return (
    <div className="p-responsive w-full max-w-full overflow-x-hidden bg-gray-50 dark:bg-gray-900">
          {/* Mobile-specific spacing adjustments */}
          <div class="sm:hidden mt-16"></div>
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
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Wallet</h1>
              <p className="text-gray-600 dark:text-gray-300">Manage your cash flow, track budgets, and review transaction history</p>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-3 bg-[#076653] text-white rounded-xl hover:bg-[#076653]/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              onClick={() => setShowModal(true)}
            >
              <Plus size={20} />
              <span className="font-semibold hidden sm:inline">Add Transaction</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Wallet Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-5 shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Total Balance</h3>
            <div className="p-2 rounded-lg bg-blue-100/80 dark:bg-blue-900/30">
              <WalletIcon size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${walletStats.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="mt-2 flex items-center text-xs text-blue-600 dark:text-blue-400">
            <ArrowUpDown size={14} className="mr-1" />
            <span>Current balance</span>
          </div>
        </div>
        
        <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-5 shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Total Income</h3>
            <div className="p-2 rounded-lg bg-green-100/80 dark:bg-green-900/30">
              <TrendingUp size={20} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${walletStats.income.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="mt-2 flex items-center text-xs text-green-600 dark:text-green-400">
            <TrendingUp size={14} className="mr-1" />
            <span>All time income</span>
          </div>
        </div>
        
        <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-5 shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Total Expenses</h3>
            <div className="p-2 rounded-lg bg-red-100/80 dark:bg-red-900/30">
              <TrendingDown size={20} className="text-red-600 dark:text-red-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${walletStats.expenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="mt-2 flex items-center text-xs text-red-600 dark:text-red-400">
            <TrendingDown size={14} className="mr-1" />
            <span>All time expenses</span>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="rounded-2xl bg-white/80 dark:bg-gray-800/60 p-5 sm:p-6 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Filters</h2>
        </div>
        <TransactionFilters transactions={transactions} filters={filters} onChange={setFilters} />
      </div>

      {/* Transaction History and Budget Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-7">
        <div className="lg:col-span-2 rounded-2xl bg-white/80 dark:bg-gray-800/60 p-5 sm:p-6 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Transaction History</h2>
            <span className="text-sm font-medium text-[#076653]">
              {filteredTransactions.length} records
            </span>
          </div>
          <TransactionTable transactions={filteredTransactions} />
        </div>

        <div className="rounded-2xl bg-white/80 dark:bg-gray-800/60 p-5 sm:p-6 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Budget Progress</h2>
          </div>
          <BudgetProgress />
        </div>
      </div>

      <TransactionModal isOpen={showModal} type="expense" onClose={() => setShowModal(false)} />
    </div>
  );
};

export default WalletPage;