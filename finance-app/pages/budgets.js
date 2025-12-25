import { useState } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function Budgets() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  // Mock budget data
  const budgets = [
    { id: 1, category: 'Food & Dining', limit: 500, spent: 320, color: 'bg-blue-500' },
    { id: 2, category: 'Transportation', limit: 200, spent: 150, color: 'bg-green-500' },
    { id: 3, category: 'Entertainment', limit: 150, spent: 120, color: 'bg-purple-500' },
    { id: 4, category: 'Utilities', limit: 300, spent: 280, color: 'bg-yellow-500' },
    { id: 5, category: 'Shopping', limit: 400, spent: 180, color: 'bg-pink-500' },
  ];

  const calculatePercentage = (spent, limit) => {
    return Math.min(100, (spent / limit) * 100);
  };

  const getStatus = (spent, limit) => {
    const percentage = calculatePercentage(spent, limit);
    if (percentage >= 100) return 'exceeded';
    if (percentage >= 90) return 'warning';
    return 'normal';
  };

  const handleAddBudget = (e) => {
    e.preventDefault();
    // In a real app, this would call an API to add the budget
    alert('Budget added successfully!');
    setShowAddModal(false);
  };

  const handleEditBudget = (budget) => {
    setEditingBudget(budget);
    setShowAddModal(true);
  };

  const handleDeleteBudget = (id) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      // In a real app, this would call an API to delete the budget
      alert('Budget deleted successfully!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gradient">Budgets</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>New Budget</span>
        </button>
      </div>

      {/* Budget Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Total Budget</p>
              <h3 className="text-2xl font-bold">$1,550</h3>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Total Spent</p>
              <h3 className="text-2xl font-bold text-red-600">$1,050</h3>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Remaining</p>
              <h3 className="text-2xl font-bold text-green-600">$500</h3>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Budgets List */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Your Budgets</h2>
        <div className="space-y-6">
          {budgets.map((budget) => {
            const percentage = calculatePercentage(budget.spent, budget.limit);
            const status = getStatus(budget.spent, budget.limit);
            
            return (
              <div key={budget.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{budget.category}</h3>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEditBudget(budget)}
                      className="p-2 text-gray-500 hover:text-brand-accent rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteBudget(budget.id)}
                      className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between text-sm mb-2">
                  <span>${budget.spent.toFixed(2)} spent</span>
                  <span>${budget.limit.toFixed(2)} limit</span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${budget.color} ${status === 'warning' ? 'bg-yellow-500' : status === 'exceeded' ? 'bg-red-500' : ''}`}
                    style={{ width: `${Math.min(100, percentage)}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {percentage.toFixed(0)}% of budget used
                  </span>
                  {status === 'warning' && (
                    <span className="flex items-center text-yellow-600 text-sm">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      Approaching limit
                    </span>
                  )}
                  {status === 'exceeded' && (
                    <span className="flex items-center text-red-600 text-sm">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      Budget exceeded
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add/Edit Budget Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{editingBudget ? 'Edit Budget' : 'New Budget'}</h2>
                <button 
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingBudget(null);
                  }}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleAddBudget}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <input
                      type="text"
                      defaultValue={editingBudget?.category || ''}
                      placeholder="Enter category"
                      className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-brand-accent focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Budget Limit</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        defaultValue={editingBudget?.limit || ''}
                        placeholder="0.00"
                        className="w-full pl-8 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-brand-accent focus:border-transparent"
                        required
                        min="0.01"
                        step="0.01"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Color</label>
                    <div className="flex space-x-2">
                      {['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500'].map((color) => (
                        <div 
                          key={color}
                          className={`w-8 h-8 rounded-full ${color} cursor-pointer border-2 ${editingBudget?.color === color ? 'border-white' : 'border-transparent'}`}
                          onClick={() => {
                            // In a real app, you would set the selected color
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingBudget(null);
                    }}
                    className="flex-1 py-3 px-4 bg-gray-200 dark:bg-gray-700 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-gradient-1 text-brand-dark rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    {editingBudget ? 'Update Budget' : 'Create Budget'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}