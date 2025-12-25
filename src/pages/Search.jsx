import { useState, useMemo } from 'react';
import { Search as SearchIcon, X, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import TransactionTable from '../components/TransactionTable';
import TransactionFilters from '../components/TransactionFilters';
import ResponsiveCard from '../components/ResponsiveCard';
import useHapticFeedback from '../hooks/useHapticFeedback.js';

const Search = () => {
  const navigate = useNavigate();
  const { transactions, accounts, categories } = useAppContext();
  const { triggerHapticFeedback } = useHapticFeedback();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    accountId: 'all',
    dateRange: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Filter transactions based on search query and filters
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      // Search filter - check description and category
      if (searchQuery && 
          !transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !transaction.category.toLowerCase().includes(searchQuery.toLowerCase())) {
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
  }, [transactions, searchQuery, filters]);

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

  const clearSearch = () => {
    setSearchQuery('');
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
    <div className="p-responsive w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Search</h1>
        <p className="text-gray-600 dark:text-gray-400">Find transactions, categories, and more</p>
      </div>

      {/* Search Bar */}
      <div className="card-mobile mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <SearchIcon className="text-gray-400" size={20} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transactions, categories, descriptions..."
            className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#076653] focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      {searchQuery && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="card-mobile">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Results Found</h3>
            <p className="text-2xl font-bold text-[#076653] dark:text-teal-400">
              {sortedTransactions.length}
            </p>
          </div>
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
        </div>
      )}

      {/* Filters Toggle */}
      {searchQuery && (
        <div className="card-mobile mb-6">
          <button
            onClick={() => {
              setShowFilters(!showFilters);
              triggerHapticFeedback('tap');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors touch-target"
          >
            <Filter size={16} />
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          </button>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <TransactionFilters
                filters={filters}
                onChange={handleFilterChange}
                transactions={transactions}
              />
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {searchQuery && (
        <div className="card-mobile">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Search Results
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {sortedTransactions.length} items
              </span>
            </div>
          </div>

          {sortedTransactions.length > 0 ? (
            <TransactionTable 
              transactions={sortedTransactions} 
              onEdit={(transaction) => {
                // Navigate to edit transaction
                navigate(`/transactions`);
                triggerHapticFeedback('tap');
              }}
            />
          ) : (
            <div className="text-center py-12">
              <SearchIcon size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No results found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!searchQuery && (
        <div className="card-mobile text-center py-12">
          <SearchIcon size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Search Transactions</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Enter a search term above to find transactions by description, category, or amount
          </p>
        </div>
      )}
    </div>
  );
};

export default Search;