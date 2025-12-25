import { useEffect, useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { format } from 'date-fns';
import { Plus, Target, Edit3, Trash2, X } from 'lucide-react';

const BudgetProgress = () => {
  const { budgets, transactions, upsertBudget, deleteBudget } = useAppContext();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [formData, setFormData] = useState({ category: '', limit: 0 });
  const categories = ['Groceries', 'Utilities', 'Entertainment', 'Transportation'];

  const budgetUsage = useMemo(() => {
    const currentMonth = format(new Date(), 'yyyy-MM');
    const categoryTotals = transactions
      .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    return budgets.map(budget => ({
      ...budget,
      spent: categoryTotals[budget.category] || 0,
      percentage: Math.min(
        100,
        Math.round(((categoryTotals[budget.category] || 0) / budget.limit) * 100)
      ),
    }));
  }, [budgets, transactions]);

  const onAddBudget = () => {
    setShowAddModal(true);
    setEditingBudget(null);
    setFormData({ category: '', limit: 0 });
  };

  const onEditBudget = budget => {
    setShowAddModal(true);
    setEditingBudget(budget);
    setFormData({ category: budget.category, limit: budget.limit });
  };

  const onDeleteBudget = budgetId => {
    deleteBudget(budgetId);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!formData.category || formData.limit <= 0) {
      return;
    }
    upsertBudget(formData.category, formData.limit);
    setShowAddModal(false);
    setEditingBudget(null);
    setFormData({ category: '', limit: 0 });
  };

  const formatCurrency = amount => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const calculatePercentage = (spent, limit) => {
    return Math.min(100, Math.round((spent / limit) * 100));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Budget Progress</h2>
        <button
          onClick={onAddBudget}
          className="p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      {budgets.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <Target size={24} className="text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No budgets yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Start tracking your spending by creating a budget
          </p>
          <button
            onClick={onAddBudget}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
          >
            Create Budget
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {budgetUsage.map((budget) => {
            const spent = budget.spent;
            const percentage = budget.percentage;
            return (
              <div
                key={budget.id}
                className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">{budget.category}</h3>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(spent)} / {formatCurrency(budget.limit)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-primary-500 h-2.5 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {percentage}% used
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEditBudget(budget)}
                      className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded transition-colors"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => onDeleteBudget(budget.id)}
                      className="p-1.5 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Budget Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  {editingBudget ? 'Edit Budget' : 'Add Budget'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingBudget(null);
                  }}
                  className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-3 sm:px-4 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-base sm:text-lg min-h-[44px]"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Limit
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.limit}
                    onChange={(e) => setFormData({ ...formData, limit: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-3 sm:px-4 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-base sm:text-lg min-h-[44px]"
                    required
                  />
                </div>

                <div className="flex gap-2 sm:gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingBudget(null);
                    }}
                    className="flex-1 py-3 px-3 sm:px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-3 sm:px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors text-sm sm:text-base"
                  >
                    {editingBudget ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetProgress;
