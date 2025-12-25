import { motion } from 'framer-motion';
import { Target, Plus, Edit3, Trash2, TrendingUp, Calendar, DollarSign, Trophy } from 'lucide-react';
import { format } from 'date-fns';
import { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import ResponsiveCard from '../components/ResponsiveCard';

/**
 * @typedef {Object} Goal
 * @property {string} id
 * @property {string} name
 * @property {number} target
 * @property {number} current
 * @property {string} deadline
 * @property {string} category
 */

const Goals = () => {
  const { transactions } = useAppContext();
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(/** @type {Goal|null} */ (null));
  /** @type {[Goal[], Function]} */
  const [goals, setGoals] = useState([
    {
      id: '1',
      name: 'Emergency Fund',
      target: 5000,
      current: 1200,
      deadline: '2024-12-31',
      category: 'Savings',
    },
    {
      id: '2',
      name: 'Vacation Trip',
      target: 3000,
      current: 800,
      deadline: '2024-08-15',
      category: 'Travel',
    },
  ]);
  const [goalData, setGoalData] = useState({
    name: '',
    target: '',
    deadline: '',
    category: 'Savings',
  });

  const categories = [
    'Savings',
    'Travel',
    'Education',
    'Home',
    'Car',
    'Health',
    'Retirement',
    'Other',
  ];

  /**
   * @param {React.FormEvent} e
   */
  const handleAddGoal = e => {
    e.preventDefault();
    if (goalData.name && goalData.target && goalData.deadline) {
      const newGoal = {
        id: Date.now().toString(),
        ...goalData,
        target: parseFloat(goalData.target),
        current: 0,
      };

      if (editingGoal) {
        setGoals(goals.map(g => (g.id === editingGoal.id ? newGoal : g)));
      } else {
        setGoals([...goals, newGoal]);
      }

      setGoalData({ name: '', target: '', deadline: '', category: 'Savings' });
      setShowAddGoal(false);
      setEditingGoal(null);
    }
  };

  /**
   * @param {Goal} goal
   */
  const handleEditGoal = goal => {
    setEditingGoal(goal);
    setGoalData({
      name: goal.name,
      target: goal.target.toString(),
      deadline: goal.deadline,
      category: goal.category,
    });
    setShowAddGoal(true);
  };

  /**
   * @param {string} id
   */
  const handleDeleteGoal = id => {
    setGoals(goals.filter(g => g.id !== id));
  };

  /**
   * @param {number} amount
   */
  const formatCurrency = amount => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  /**
   * @param {string} dateString
   */
  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  /**
   * @param {string} deadline
   */
  const getDaysRemaining = deadline => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="p-responsive w-full max-w-full overflow-x-hidden bg-gray-50 dark:bg-gray-900">
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
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Goals</h1>
              <p className="text-gray-600 dark:text-gray-300">Set and track your financial goals with progress visualization</p>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-3 bg-[#076653] text-white rounded-xl hover:bg-[#076653]/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              onClick={() => setShowAddGoal(true)}
            >
              <Plus size={20} />
              <span className="font-semibold">Add Goal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {goals.map((goal, index) => {
          const percentage = Math.min((goal.current / goal.target) * 100, 100);
          const daysRemaining = getDaysRemaining(goal.deadline);

          return (
            <motion.div
              key={goal.id}
              className="card p-3 sm:p-4 md:p-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="card-content">
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-brand-dark text-sm sm:text-base md:text-lg truncate">
                      {goal.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
                      {goal.category}
                    </p>
                  </div>
                  <div className="flex gap-1 sm:gap-2 md:gap-3">
                    <button
                      onClick={() => handleEditGoal(goal)}
                      className="p-1.5 sm:p-2 md:p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Edit3 size={14} className="sm:size-3 md:size-4 text-gray-500 dark:text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-1.5 sm:p-2 md:p-2.5 rounded-lg hover:bg-error-100 dark:hover:bg-error-900/20 transition-colors"
                    >
                      <Trash2 size={14} className="sm:size-3 md:size-4 text-error-500" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 sm:mt-4 md:mt-5">
                  <div className="flex justify-between text-xs md:text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">
                      {formatCurrency(goal.current)} of {formatCurrency(goal.target)}
                    </span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 md:h-2.5">
                    <motion.div
                      className="h-2 md:h-2.5 rounded-full bg-gradient-2"
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                </div>

                <div className="mt-3 md:mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <div className="flex items-center gap-1 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                    <Calendar size={14} className="md:size-3" />
                    <span>Due {formatDate(goal.deadline)}</span>
                  </div>
                  <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-200">
                    {daysRemaining} days
                  </span>
                </div>

                <button className="w-full mt-3 md:mt-4 btn btn-secondary btn-md">Add Funds</button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 md:p-4">
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg md:text-xl font-semibold">
                {editingGoal ? 'Edit Goal' : 'Add New Goal'}
              </h2>
              <button
                onClick={() => {
                  setShowAddGoal(false);
                  setEditingGoal(null);
                  setGoalData({ name: '', target: '', deadline: '', category: 'Savings' });
                }}
                className="p-1.5 md:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 md:h-5 md:w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddGoal} className="p-4 md:p-6 space-y-3 md:space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 md:mb-2">Goal Name</label>
                <input
                  type="text"
                  value={goalData.name}
                  onChange={e => setGoalData({ ...goalData, name: e.target.value })}
                  className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm md:text-base"
                  placeholder="e.g. Emergency Fund"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 md:mb-2">Target Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={goalData.target}
                  onChange={e => setGoalData({ ...goalData, target: e.target.value })}
                  className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm md:text-base"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 md:mb-2">Category</label>
                <select
                  value={goalData.category}
                  onChange={e => setGoalData({ ...goalData, category: e.target.value })}
                  className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm md:text-base"
                  required
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 md:mb-2">Deadline</label>
                <input
                  type="date"
                  value={goalData.deadline}
                  onChange={e => setGoalData({ ...goalData, deadline: e.target.value })}
                  className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm md:text-base"
                  required
                />
              </div>
              <div className="flex gap-2 md:gap-3 pt-3 md:pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddGoal(false);
                    setEditingGoal(null);
                    setGoalData({ name: '', target: '', deadline: '', category: 'Savings' });
                  }}
                  className="flex-1 py-2.5 md:py-3 px-3 md:px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-xl transition-colors text-sm md:text-base"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn btn-primary btn-md">
                  {editingGoal ? 'Update' : 'Add'} Goal
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Goals;

