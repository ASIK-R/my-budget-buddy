import { motion } from 'framer-motion';
import { Plus, Target, Edit3, Trash2, X, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import ResponsiveCard from '../components/ResponsiveCard';
import ResponsiveStatCard from '../components/ResponsiveStatCard';

const Budgets = () => {
  const { budgets, upsertBudget, transactions } = useAppContext();
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category: '',
    limit: 0,
  });
  const [error, setError] = useState('');

  const handleAddBudget = e => {
    e.preventDefault();
    if (newBudget.category && newBudget.limit > 0) {
      upsertBudget(newBudget.category, newBudget.limit);
      setNewBudget({ category: '', limit: 0 });
      setShowAddBudget(false);
      setError('');
    } else {
      setError('Please enter a valid category and limit.');
    }
  };

  const handleDeleteBudget = id => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      upsertBudget(id, 0);
    }
  };

  const totalBudget = (budgets || []).reduce((sum, budget) => sum + budget.limit, 0);
  const totalSpent = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const remaining = totalBudget - totalSpent;

  return (
    <div className="w-full max-w-full overflow-x-hidden bg-gray-50 dark:bg-gray-900">
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
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Budgets</h1>
              <p className="text-gray-600 dark:text-gray-300">Set and track your spending limits for different categories.</p>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-3 bg-[#076653] text-white rounded-xl hover:bg-[#076653]/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              onClick={() => setShowAddBudget(true)}
            >
              <Plus size={20} />
              <span className="font-semibold">Add Budget</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Budget Summary with Modern Design */}
      <div className="rounded-2xl bg-white/80 dark:bg-gray-800/60 p-5 sm:p-6 md:p-7 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 md:gap-6 lg:gap-8">
          <div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Budget Overview</h3>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">
              {(budgets || []).length} active budgets
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 md:gap-6">
            <div className="text-center bg-green-50/80 dark:bg-green-900/20 p-3 rounded-xl border border-green-100/50 dark:border-green-800/30">
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-600 dark:text-green-400">
                ${totalBudget.toLocaleString()}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">Total Budget</p>
            </div>
            <div className="text-center bg-red-50/80 dark:bg-red-900/20 p-3 rounded-xl border border-red-100/50 dark:border-red-800/30">
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-red-600 dark:text-red-400">
                ${totalSpent.toLocaleString()}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">Total Spent</p>
            </div>
            <div className="text-center bg-blue-50/80 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100/50 dark:border-blue-800/30">
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">
                ${remaining.toLocaleString()}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">Remaining</p>
            </div>
          </div>
        </div>
      </div>

      {/* Budgets Grid */}
      {(budgets || []).length === 0 ? (
        <div className="rounded-2xl bg-white/80 dark:bg-gray-800/60 p-5 sm:p-6 md:p-7 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-xl text-center">
          <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-[#076653]/10 dark:bg-[#076653]/20 rounded-full flex items-center justify-center mb-4 sm:mb-5 md:mb-6 border border-[#076653]/20 dark:border-[#076653]/10">
            <Target className="text-[#076653]" size={32} />
          </div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 md:mb-5">
            No budgets yet
          </h3>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-5 md:mb-6 max-w-md mx-auto">
            Create your first budget to start tracking your spending.
          </p>
          <button 
            className="flex items-center gap-2 px-5 py-3 bg-[#076653] text-white rounded-xl hover:bg-[#076653]/90 transition-all duration-300 shadow-lg hover:shadow-xl mx-auto font-semibold"
            onClick={() => setShowAddBudget(true)}
          >
            <Plus size={20} />
            Add Budget
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {(budgets || []).map((budget, index) => {
            const spent = (transactions || [])
              .filter(t => t.type === 'expense' && t.category === budget.category)
              .reduce((sum, t) => sum + t.amount, 0);

            const percentage = Math.min(100, (spent / budget.limit) * 100);
            const remaining = budget.limit - spent;

            return (
              <motion.div
                key={budget.id}
                className="rounded-2xl bg-white/80 dark:bg-gray-800/60 p-4 sm:p-5 md:p-6 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg md:text-xl truncate">
                      {budget.category}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
                      ${spent.toLocaleString()} of ${budget.limit.toLocaleString()} spent
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteBudget(budget.id)}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="mt-4 sm:mt-5 md:mt-6">
                  <div className="flex justify-between text-xs sm:text-sm mb-2 sm:mb-2.5">
                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {Math.round(percentage)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-2.5 sm:h-3 md:h-3.5">
                    <motion.div
                      className={`h-2.5 sm:h-3 md:h-3.5 rounded-full ${
                        percentage > 90
                          ? 'bg-red-500'
                          : percentage > 75
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                <div className="mt-4 sm:mt-5 md:mt-6 pt-4 sm:pt-5 md:pt-6 border-t border-gray-200/50 dark:border-gray-700/50 flex justify-between">
                  <div className="text-center min-w-[80px]">
                    <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-white">
                      ${remaining.toLocaleString()}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Remaining</p>
                  </div>
                  <div className="text-center min-w-[80px]">
                    <p
                      className={`text-sm sm:text-base md:text-lg font-bold ${
                        remaining < 0
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-green-600 dark:text-green-400'
                      }`}
                    >
                      {remaining < 0 ? '-' : ''}${Math.abs(remaining).toLocaleString()}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Available</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add Budget Modal */}
      {showAddBudget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4">
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg sm:text-xl font-semibold">Add New Budget</h2>
              <button
                onClick={() => setShowAddBudget(false)}
                className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                aria-label="Close modal"
              >
                <X size={16} className="sm:size-20" />
              </button>
            </div>
            <form onSubmit={handleAddBudget} className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <input
                  type="text"
                  value={newBudget.category}
                  onChange={e => setNewBudget({ ...newBudget, category: e.target.value })}
                  className="w-full px-3 py-3 sm:px-4 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base sm:text-lg min-h-[44px]"
                  placeholder="e.g., Food, Entertainment"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Monthly Limit</label>
                <input
                  type="number"
                  step="0.01"
                  value={newBudget.limit}
                  onChange={e =>
                    setNewBudget({ ...newBudget, limit: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-3 sm:px-4 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base sm:text-lg min-h-[44px]"
                  placeholder="0.00"
                  required
                />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddBudget(false)}
                  className="flex-1 py-3 px-3 sm:px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-xl transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn btn-primary btn-md text-sm sm:text-base">
                  Add Budget
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Budgets;

