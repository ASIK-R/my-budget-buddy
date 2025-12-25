import { useState, useMemo, memo } from 'react';
import { Plus, Filter, Search, Download, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import TransactionTable from '../components/TransactionTable';
import TransactionModal from '../components/TransactionModal';
import TransactionFilters from '../components/TransactionFilters';
import ResponsiveCard from '../components/ResponsiveCard';
import useHapticFeedback from '../hooks/useHapticFeedback.js';

const Transactions = () => {
  const navigate = useNavigate();
  const { transactions, accounts, categories, addTransaction, updateTransaction } = useAppContext();
  const { triggerHapticFeedback } = useHapticFeedback();
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    category: 'all',
    accountId: 'all',
    dateRange: 'all'
  });
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Filter transactions based on filters
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      // Search filter
      if (filters.search && 
          !transaction.description.toLowerCase().includes(filters.search.toLowerCase()) &&
          !transaction.category.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Type filter
      if (filters.type !== 'all' && transaction.type !== filters.type) {
        return false;
      }

      // Category filter
      if (filters.category !== 'all' && transaction.category !== filters.category) {
        return false;
      }

      // Account filter
      if (filters.accountId !== 'all' && transaction.accountId !== filters.accountId) {
        return false;
      }

      // Date range filter
      if (filters.dateRange !== 'all') {
        const transactionDate = new Date(transaction.date);
        const now = new Date();
        let startDate;

        switch (filters.dateRange) {
          case 'today':
            startDate = new Date(now.setHours(0, 0, 0, 0));
            if (transactionDate < startDate) return false;
            break;
          case 'week':
            startDate = new Date(now.setDate(now.getDate() - 7));
            if (transactionDate < startDate) return false;
            break;
          case 'month':
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            if (transactionDate < startDate) return false;
            break;
          case 'year':
            startDate = new Date(now.setFullYear(now.getFullYear() - 1));
            if (transactionDate < startDate) return false;
            break;
          default:
            break;
        }
      }

      return true;
    });
  }, [transactions, filters]);

  // Sort transactions
  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Handle date sorting
      if (sortBy === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      // Handle amount sorting
      if (sortBy === 'amount') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [filteredTransactions, sortBy, sortOrder]);

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setShowTransactionModal(true);
    triggerHapticFeedback('tap');
  };

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setShowTransactionModal(true);
    triggerHapticFeedback('tap');
  };

  const handleSaveTransaction = async (transactionData) => {
    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, transactionData);
      } else {
        await addTransaction(transactionData);
      }
      setShowTransactionModal(false);
      triggerHapticFeedback('success');
    } catch (error) {
      console.error('Error saving transaction:', error);
      triggerHapticFeedback('error');
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    triggerHapticFeedback('tap');
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    triggerHapticFeedback('tap');
  };

  // Calculate totals
  const totals = useMemo(() => {
    return sortedTransactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'income') {
          acc.income += transaction.amount;
        } else {
          acc.expense += transaction.amount;
        }
        return acc;
      },
      { income: 0, expense: 0 }
    );
  }, [sortedTransactions]);

  const netTotal = totals.income - totals.expense;

  return (
    <div className="w-full max-w-full overflow-x-hidden bg-gray-50 dark:bg-gray-900">
          {/* Mobile-specific spacing adjustments */}
          <div className="sm:hidden mt-16"></div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Transactions</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your income and expenses</p>
        </div>
        <button
          onClick={handleAddTransaction}
          className="flex items-center gap-2 px-4 py-3 bg-[#076653] hover:bg-[#076653]/90 text-white rounded-xl font-semibold shadow-lg transition-all duration-200 touch-target-large"
        >
          <Plus size={20} />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Summary Cards - Mobile optimized */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-5 sm:mb-6 md:mb-8">
        <div className="card-mobile">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Income</h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            ${totals.income.toFixed(2)}
          </p>
        </div>
        <div className="card-mobile">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            ${totals.expense.toFixed(2)}
          </p>
        </div>
        <div className="card-mobile">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Net Total</h3>
          <p className={`text-2xl font-bold ${netTotal >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            ${netTotal.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Filters and Actions - Mobile optimized */}
      <div className="card-mobile mb-5 sm:mb-6 md:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <TransactionFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            accounts={accounts}
            categories={categories}
          />
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => triggerHapticFeedback('tap')}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors touch-target"
            >
              <Download size={16} />
              <span>Export</span>
            </button>
            <button 
              onClick={() => triggerHapticFeedback('tap')}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors touch-target"
            >
              <Upload size={16} />
              <span>Import</span>
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table - Mobile optimized */}
      <div className="card-mobile mb-5 sm:mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Transaction History</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {sortedTransactions.length} transactions
            </span>
          </div>
        </div>
        
        <TransactionTable 
          transactions={sortedTransactions} 
          onEdit={handleEditTransaction}
        />
      </div>

      {/* Transaction Modal */}
      {showTransactionModal && (
        <TransactionModal
          isOpen={showTransactionModal}
          onClose={() => {
            setShowTransactionModal(false);
            triggerHapticFeedback('tap');
          }}
          onSave={handleSaveTransaction}
          transaction={editingTransaction}
        />
      )}
    </div>
  );
};

export default memo(Transactions);