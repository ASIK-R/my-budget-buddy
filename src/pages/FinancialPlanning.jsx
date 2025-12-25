import { motion } from 'framer-motion';
import { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  PieChart, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Target, 
  PiggyBank,
  Wallet,
  BarChart3,
  Plus,
  Edit3,
  Trash2,
  CheckCircle,
  X,
  Save
} from 'lucide-react';
import { format, addMonths, parseISO } from 'date-fns';
import ResponsiveCard from '../components/ResponsiveCard';
import ResponsiveStatCard from '../components/ResponsiveStatCard';
import { getIconClass } from '../utils/iconUtils';

const FinancialPlanning = () => {
  const { isOnline, budgets, transactions, upsertBudget, deleteBudget, error, clearError } = useAppContext();
  const [activeTab, setActiveTab] = useState('budgets');
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [newBudget, setNewBudget] = useState({
    category: '',
    limit: '',
    period: 'Monthly'
  });

  // Calculate actual budget data with spent amounts
  const budgetData = useMemo(() => {
    // Calculate current month's expenses by category
    const currentMonth = new Date().toISOString().slice(0, 7);
    const categoryTotals = transactions
      .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    // Map budgets with actual spent data
    return budgets.map(budget => {
      const spent = categoryTotals[budget.category] || 0;
      const remaining = budget.limit - spent;
      return {
        ...budget,
        allocated: budget.limit,
        spent,
        remaining,
        period: 'Monthly',
      };
    });
  }, [budgets, transactions]);

  const [goals, setGoals] = useState([
    {
      id: 1,
      title: 'Emergency Fund',
      target: 10000,
      current: 7500,
      deadline: '2024-12-31',
      progress: 75,
    },
    {
      id: 2,
      title: 'Vacation Savings',
      target: 3000,
      current: 1200,
      deadline: '2024-08-15',
      progress: 40,
    },
    {
      id: 3,
      title: 'New Laptop',
      target: 1500,
      current: 800,
      deadline: '2024-06-30',
      progress: 53,
    },
  ]);

  const [recurring, setRecurring] = useState([
    {
      id: 1,
      title: 'Rent',
      amount: 1200,
      frequency: 'Monthly',
      nextDate: '2024-06-01',
      category: 'Housing',
    },
    {
      id: 2,
      title: 'Gym Membership',
      amount: 45,
      frequency: 'Monthly',
      nextDate: '2024-06-05',
      category: 'Health',
    },
    {
      id: 3,
      title: 'Netflix',
      amount: 15,
      frequency: 'Monthly',
      nextDate: '2024-06-10',
      category: 'Entertainment',
    },
    {
      id: 4,
      title: 'Salary',
      amount: 3500,
      frequency: 'Monthly',
      nextDate: '2024-06-01',
      category: 'Income',
    },
  ]);

  const tabs = [
    { id: 'budgets', label: 'Budgets', icon: PieChart },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'recurring', label: 'Recurring', icon: TrendingUp },
  ];

  // Handle budget form submission
  const handleBudgetSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const budgetData = {
        category: newBudget.category,
        limit: parseFloat(newBudget.limit),
        period: newBudget.period
      };
      
      await upsertBudget(budgetData);
      
      // Reset form
      setNewBudget({ category: '', limit: '', period: 'Monthly' });
      setShowBudgetForm(false);
      setEditingBudget(null);
    } catch (err) {
      console.error('Error saving budget:', err);
    }
  };

  // Handle budget edit
  const handleEditBudget = (budget) => {
    setEditingBudget(budget);
    setNewBudget({
      category: budget.category,
      limit: budget.limit.toString(),
      period: budget.period || 'Monthly'
    });
    setShowBudgetForm(true);
  };

  // Handle budget delete
  const handleDeleteBudget = async (budgetId) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await deleteBudget(budgetId);
      } catch (err) {
        console.error('Error deleting budget:', err);
      }
    }
  };

  // Get available categories from transactions
  const availableCategories = useMemo(() => {
    const categories = [...new Set((transactions || []).map(t => t.category))];
    return categories.filter(cat => cat !== 'Uncategorized');
  }, [transactions]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-6 bg-red-50 dark:bg-red-900/20 rounded-2xl max-w-md">
          <div className="text-red-500 dark:text-red-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Data</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={clearError}
              className="px-4 py-2 bg-[#076653] text-white rounded-lg hover:bg-[#076653]/90 transition-colors"
            >
              Try Again
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderBudgets = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">Budget Management</h3>
        <button 
          onClick={() => {
            setEditingBudget(null);
            setNewBudget({ category: '', limit: '', period: 'Monthly' });
            setShowBudgetForm(true);
          }}
          className="flex items-center gap-2 px-4 py-3 bg-[#076653] text-white rounded-xl hover:bg-[#076653]/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Plus size={20} />
          <span className="font-semibold">New Budget</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-5 shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                ${(budgetData || []).reduce((sum, budget) => sum + budget.allocated, 0).toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-[#076653]/10">
              <DollarSign size={24} className="text-[#076653]" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-5 shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                ${(budgetData || []).reduce((sum, budget) => sum + budget.spent, 0).toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-red-500/10">
              <TrendingUp size={24} className="text-red-500" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-5 shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Remaining</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                ${(budgetData || []).reduce((sum, budget) => sum + budget.remaining, 0).toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-500/10">
              <CheckCircle size={24} className="text-green-500" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-5 shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Categories</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {(budgetData || []).length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-[#076653]/10">
              <BarChart3 size={24} className="text-[#076653]" />
            </div>
          </div>
        </div>
      </div>

      {/* Budget Form Modal */}
      {showBudgetForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
                  {editingBudget ? 'Edit Budget' : 'Create New Budget'}
                </h3>
                <button 
                  onClick={() => setShowBudgetForm(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Close modal"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleBudgetSubmit} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                <select
                  value={newBudget.category}
                  onChange={(e) => setNewBudget({...newBudget, category: e.target.value})}
                  className="w-full px-3 py-3 sm:px-4 sm:py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#076653] focus:border-transparent text-base sm:text-lg min-h-[44px]"
                  required
                >
                  <option value="">Select a category</option>
                  {availableCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Budget Limit ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newBudget.limit}
                  onChange={(e) => setNewBudget({...newBudget, limit: e.target.value})}
                  className="w-full px-3 py-3 sm:px-4 sm:py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#076653] focus:border-transparent text-base sm:text-lg min-h-[44px]"
                  placeholder="Enter budget limit"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Period</label>
                <select
                  value={newBudget.period}
                  onChange={(e) => setNewBudget({...newBudget, period: e.target.value})}
                  className="w-full px-3 py-3 sm:px-4 sm:py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#076653] focus:border-transparent text-base sm:text-lg min-h-[44px]"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
              
              <div className="flex gap-2 sm:gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBudgetForm(false)}
                  className="flex-1 px-3 py-3 sm:px-4 sm:py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-3 py-3 sm:px-4 sm:py-3 rounded-xl bg-gradient-to-r from-[#076653] to-[#076653]/90 text-white font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Save size={16} />
                  {editingBudget ? 'Update Budget' : 'Create Budget'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-white/80 dark:bg-gray-800/60 p-5 sm:p-6 md:p-7 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">
                  Category
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">
                  Allocated
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">
                  Spent
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">
                  Remaining
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">
                  Progress
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {budgetData.map((budget) => (
                <tr key={budget.id} className="border-b border-gray-100 dark:border-gray-700/50 last:border-0">
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                    {budget.category}
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    ${budget.allocated.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    ${budget.spent.toLocaleString()}
                  </td>
                  <td className={`py-3 px-4 font-medium ${budget.remaining >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    ${budget.remaining.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${budget.spent / budget.allocated > 0.9 ? 'bg-red-500' : budget.spent / budget.allocated > 0.75 ? 'bg-yellow-500' : 'bg-[#076653]'}`}
                        style={{ width: `${Math.min(100, (budget.spent / budget.allocated) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {((budget.spent / budget.allocated) * 100).toFixed(1)}% used
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditBudget(budget)}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <Edit3 size={16} className="text-gray-600 dark:text-gray-300" />
                      </button>
                      <button
                        onClick={() => handleDeleteBudget(budget.id)}
                        className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
                      >
                        <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderGoals = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">Financial Goals</h3>
        <button className="flex items-center gap-2 px-4 py-3 bg-[#076653] text-white rounded-xl hover:bg-[#076653]/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
          <Plus size={20} />
          <span className="font-semibold">New Goal</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {goals.map((goal) => (
          <div key={goal.id} className="rounded-2xl bg-white/80 dark:bg-gray-800/60 p-5 sm:p-6 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-bold text-lg text-gray-900 dark:text-white">{goal.title}</h4>
              <div className="p-2 rounded-lg bg-[#076653]/10">
                <Target size={20} className="text-[#076653]" />
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Progress</span>
                <span className="font-medium text-gray-900 dark:text-white">{goal.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-[#076653] to-[#076653]/80"
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Saved</p>
                <p className="font-bold text-gray-900 dark:text-white">${goal.current.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">Target</p>
                <p className="font-bold text-gray-900 dark:text-white">${goal.target.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700/50">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Deadline: {format(parseISO(goal.deadline), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRecurring = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">Recurring Transactions</h3>
        <button className="flex items-center gap-2 px-4 py-3 bg-[#076653] text-white rounded-xl hover:bg-[#076653]/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
          <Plus size={20} />
          <span className="font-semibold">Add Recurring</span>
        </button>
      </div>

      <div className="rounded-2xl bg-white/80 dark:bg-gray-800/60 p-5 sm:p-6 md:p-7 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">
                  Description
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">
                  Amount
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">
                  Frequency
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">
                  Next Date
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">
                  Category
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {recurring.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 dark:border-gray-700/50 last:border-0">
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                    {item.title}
                  </td>
                  <td className={`py-3 px-4 font-medium ${item.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {item.amount > 0 ? '+' : ''}${Math.abs(item.amount).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    {item.frequency}
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    {format(parseISO(item.nextDate), 'MMM dd, yyyy')}
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    {item.category}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        <Edit3 size={16} className="text-gray-600 dark:text-gray-300" />
                      </button>
                      <button className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors">
                        <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-responsive w-full max-w-full overflow-x-hidden bg-gray-50 dark:bg-gray-900">
          {/* Mobile-specific spacing adjustments */}
      <div className="sm:hidden mt-16"></div>
      
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-[#076653]/10 to-[#076653]/5 p-5 sm:p-6 md:p-7 backdrop-blur-sm border border-[#076653]/20 dark:border-[#076653]/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#076653]/5 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#076653]/5 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Financial Planning</h1>
          <p className="text-gray-600 dark:text-gray-300">Plan your budget, goals, and recurring transactions</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[#076653] text-[#076653] dark:text-[#076653]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'budgets' && renderBudgets()}
        {activeTab === 'goals' && renderGoals()}
        {activeTab === 'recurring' && renderRecurring()}
      </div>
    </div>
  );
};

export default FinancialPlanning;