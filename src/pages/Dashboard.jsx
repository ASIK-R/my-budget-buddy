import { useState, useMemo, memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, TrendingUp, TrendingDown, DollarSign, Wallet, BarChart3, Bot, User, Bell, MoreHorizontal, Plus, Shield, FileText, Target, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { debounce } from '../utils/performance';
import QuickAccessGrid from '../components/QuickAccessGrid';
import CardSlider from '../components/CardSlider';
import TransactionModal from '../components/TransactionModal';
import { useAppContext } from '../context/AppContext';
import useHapticFeedback from '../hooks/useHapticFeedback.js';

const Dashboard = () => {
  const navigate = useNavigate();
  const appContext = useAppContext();
  const {
    accounts = [],
    transactions = [],
    budgets = [],
    isSyncing = false,
    syncAllData = async () => {},
    appInitialized = false,
    error = null,
    clearError = () => {},
    isOnline = true
  } = appContext || {};
  const { triggerHapticFeedback } = useHapticFeedback();
  
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionModalType, setTransactionModalType] = useState('expense');

  // Listen for custom event from MobileFAB
  useEffect(() => {
    const handleOpenTransactionModal = (event) => {
      setTransactionModalType(event.detail.type);
      setShowTransactionModal(true);
    };

    window.addEventListener('openTransactionModal', handleOpenTransactionModal);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('openTransactionModal', handleOpenTransactionModal);
    };
  }, []);

  // Calculate real stats from app context
  const financialData = useMemo(() => {
    const totalBalance = (accounts || []).reduce((sum, account) => sum + account.balance, 0);
    const incomeTransactions = (transactions || []).filter(t => t.type === 'income');
    const expenseTransactions = (transactions || []).filter(t => t.type === 'expense');
    
    const income = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
    const expenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    const savings = totalBalance; // For now, we'll use total balance as savings
    
    return { totalBalance, income, expenses, savings };
  }, [accounts, transactions]);

  // Recent transactions
  const recentTransactions = useMemo(() => {
    return [...(transactions || [])]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 4);
  }, [transactions]);

  // Budget data
  const budgetData = useMemo(() => {
    return (budgets || []).map(budget => {
      const spent = (transactions || [])
        .filter(t => t.type === 'expense' && t.category === budget.category)
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        ...budget,
        spent,
        percentage: Math.min(100, (spent / budget.amount) * 100)
      };
    });
  }, [budgets, transactions]);

  // Featured insights cards for the slider
  const featuredInsights = useMemo(() => [
    { 
      id: 'insight1', 
      title: 'Spending Analysis', 
      icon: <PieChart size={20} className="text-[#076653]" />, 
      description: 'Your food expenses are 15% below average this month.', 
      value: '$420.50', 
      trend: 15 
    },
    { 
      id: 'insight2', 
      title: 'Savings Rate', 
      icon: <TrendingUp size={20} className="text-[#076653]" />, 
      description: 'You\'ve saved 8% more compared to last month.', 
      value: '22.5%', 
      trend: 8 
    },
    { 
      id: 'insight3', 
      title: 'Budget Health', 
      icon: <Wallet size={20} className="text-[#076653]" />, 
      description: 'All budgets are on track for this quarter.', 
      value: 'Good', 
      trend: 5 
    },
    { 
      id: 'insight4', 
      title: 'Income Sources', 
      icon: <BarChart3 size={20} className="text-[#076653]" />, 
      description: 'Diversified income streams show stability.', 
      value: '3 Active', 
      trend: 12 
    },
    { 
      id: 'insight5', 
      title: 'Debt Reduction', 
      icon: <TrendingDown size={20} className="text-[#076653]" />, 
      description: 'Credit card debt decreased by 5% this month.', 
      value: '-$120', 
      trend: -5 
    },
    { 
      id: 'insight6', 
      title: 'Investment Growth', 
      icon: <PieChart size={20} className="text-[#076653]" />, 
      description: 'Portfolio showing positive returns this quarter.', 
      value: '+$450', 
      trend: 3 
    },
    { 
      id: 'insight7', 
      title: 'Cash Flow', 
      icon: <DollarSign size={20} className="text-[#076653]" />, 
      description: 'Positive cash flow maintained for 3 months.', 
      value: '$1,250', 
      trend: 7 
    },
    { 
      id: 'insight8', 
      title: 'Emergency Fund', 
      icon: <Shield size={20} className="text-[#076653]" />, 
      description: 'Emergency fund meets 4-month expense target.', 
      value: '95%', 
      trend: 10 
    },
    { 
      id: 'insight9', 
      title: 'Subscription Audit', 
      icon: <FileText size={20} className="text-[#076653]" />, 
      description: 'Potential savings of $45/month from unused subs.', 
      value: '$45/mo', 
      trend: 0 
    },
    { 
      id: 'insight10', 
      title: 'Financial Goal', 
      icon: <Target size={20} className="text-[#076653]" />, 
      description: 'Vacation fund is 75% funded for Q3 trip.', 
      value: '75%', 
      trend: 25 
    },
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

  // Memoized budget percentage calculator
  const calculateBudgetPercentage = useMemo(() => {
    return (spent, budget) => {
      return Math.min(100, (spent / budget) * 100);
    };
  }, []);

  // Navigation items for the quick access section (4-column by 2-row grid layout)
  const navigationItems = useMemo(() => [
    { id: 'dashboard', icon: <PieChart size={20} className="text-[#076653]" />, label: 'Dashboard', path: '/', color: 'bg-[#076653]/20' },
    { id: 'wallet', icon: <Wallet size={20} className="text-[#076653]" />, label: 'Wallets', path: '/wallet', color: 'bg-[#076653]/20' },
    { id: 'transactions', icon: <BarChart3 size={20} className="text-[#076653]" />, label: 'Transactions', path: '/transactions', color: 'bg-[#076653]/20' },
    { id: 'planning', icon: <TrendingUp size={20} className="text-[#076653]" />, label: 'Planning', path: '/planning', color: 'bg-[#076653]/20' },
    { id: 'analytics', icon: <PieChart size={20} className="text-[#076653]" />, label: 'Analytics', path: '/analytics', color: 'bg-[#076653]/20' },
    { id: 'ai', icon: <Bot size={20} className="text-[#076653]" />, label: 'AI Assistant', path: '/ai', color: 'bg-[#076653]/20' },
    { id: 'profile', icon: <User size={20} className="text-[#076653]" />, label: 'Profile', path: '/profile', color: 'bg-[#076653]/20' },
    { id: 'notifications', icon: <Bell size={20} className="text-[#076653]" />, label: 'Notifications', path: '/notifications', color: 'bg-[#076653]/20' },
  ], []);

  // Debounced navigation function
  const debouncedNavigate = useMemo(() => debounce(navigate, 300), [navigate]);
  
  const openTransactionModal = (type) => {
    // Dispatch custom event for MobileFAB to handle
    const event = new CustomEvent('openTransactionModal', { detail: { type } });
    window.dispatchEvent(event);
  };

  // Handle data sync
  const handleSync = async () => {
    try {
      await syncAllData();
      triggerHapticFeedback('success');
    } catch (error) {
      console.error('Sync failed:', error);
      triggerHapticFeedback('error');
    }
  };

  // Show loading state while app is initializing
  if (!appInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#076653] mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your financial data...</p>
        </div>
      </div>
    );
  }

  // Show error if there's an error
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-6 bg-red-50 dark:bg-red-900/20 rounded-2xl max-w-md">
          <div className="text-red-500 dark:text-red-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-red-800 dark:text-red-200 mb-2">Something went wrong</h3>
          <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={clearError}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 touch-target"
            >
              Dismiss
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 touch-target"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-full overflow-x-hidden bg-gray-50 dark:bg-gray-900">
        {/* Financial Overview Cards - 2x2 grid for mobile, 4-column for desktop */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6 md:mb-8">
          <div className="bg-gradient-to-br from-[#076653] to-[#076653]/80 text-white rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg transition-all duration-300 hover:shadow-xl card-mobile">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <h3 className="text-sm font-semibold">Total Balance</h3>
              <Wallet size={20} className="sm:size-24" />
            </div>
            <p className="text-xl sm:text-2xl font-bold">{formatCurrency(financialData.totalBalance)}</p>
            <p className="text-green-200 text-xs mt-1">+2.5% from last month</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-md card-mobile">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Income</h3>
              <TrendingUp size={16} className="sm:size-20 text-green-500" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(financialData.income)}</p>
            <p className="text-green-500 text-xs mt-1">+5.2% from last month</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-md card-mobile">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Expenses</h3>
              <TrendingDown size={16} className="sm:size-20 text-red-500" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(financialData.expenses)}</p>
            <p className="text-red-500 text-xs mt-1">+1.8% from last month</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-md card-mobile">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Savings</h3>
              <DollarSign size={16} className="sm:size-20 text-blue-500" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(financialData.savings)}</p>
            <p className="text-blue-500 text-xs mt-1">+3.7% from last month</p>
          </div>
        </div>

        {/* Action Buttons - Enhanced for desktop */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => {
              openTransactionModal('income');
              triggerHapticFeedback('tap');
            }}
            className="flex-1 min-w-[110px] flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 touch-target"
          >
            <Plus size={16} />
            <span className="text-sm">Add Income</span>
          </button>
          
          <button
            onClick={() => {
              openTransactionModal('expense');
              triggerHapticFeedback('tap');
            }}
            className="flex-1 min-w-[110px] flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 touch-target"
          >
            <Plus size={16} />
            <span className="text-sm">Add Expense</span>
          </button>
          
          <button
            onClick={() => {
              navigate('/wallet');
              triggerHapticFeedback('tap');
            }}
            className="flex-1 min-w-[110px] flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 touch-target"
          >
            <Wallet size={16} />
            <span className="text-sm">Transfer</span>
          </button>
        </div>

        {/* Quick Access - Enhanced for desktop */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-mobile-subtitle mb-3 sm:mb-4 md:mb-6">Quick Access</h2>
          <QuickAccessGrid items={navigationItems} onNavigate={debouncedNavigate} />
        </div>

        {/* Recent Activity and Budgets - Enhanced for desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 mb-6 sm:mb-8">
          {/* Recent Transactions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 sm:p-6 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-mobile-subtitle">Recent Activity</h2>
              <button 
                onClick={() => {
                  navigate('/analysis');
                  triggerHapticFeedback('tap');
                }}
                className="text-[#076653] hover:text-[#076653]/80 dark:text-[#076653] dark:hover:text-[#076653]/80 font-medium text-sm touch-target"
              >
                View All
              </button>
            </div>
            
            {(recentTransactions || []).length > 0 ? (
              <div className="space-y-4">
                {recentTransactions.map(transaction => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg sm:rounded-xl touch-target transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700/50">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${
                        transaction.type === 'income' 
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                          : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                      }`}>
                        {transaction.type === 'income' ? (
                          <TrendingUp size={16} className="sm:size-20" />
                        ) : (
                          <TrendingDown size={16} className="sm:size-20" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-base md:text-lg">{transaction.description}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className={`font-bold text-base md:text-lg ${
                      transaction.type === 'income' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-10">
                <DollarSign size={40} className="sm:size-52 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-mobile-subtitle mb-2">No transactions yet</h3>
                <p className="text-mobile-caption mb-4">Add your first transaction to get started</p>
                <button
                  onClick={() => {
                    openTransactionModal('expense');
                    triggerHapticFeedback('tap');
                  }}
                  className="px-5 py-2.5 bg-[#076653] hover:bg-[#076653]/90 text-white rounded-lg sm:rounded-xl font-medium transition-colors duration-200 touch-target"
                >
                  Add Transaction
                </button>
              </div>
            )}
          </div>

          {/* Budget Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 sm:p-6 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-mobile-subtitle">Budget Progress</h2>
              <button 
                onClick={() => {
                  navigate('/budgets');
                  triggerHapticFeedback('tap');
                }}
                className="text-[#076653] hover:text-[#076653]/80 dark:text-[#076653] dark:hover:text-[#076653]/80 font-medium text-sm touch-target"
              >
                Manage
              </button>
            </div>
            
            {(budgetData || []).length > 0 ? (
              <div className="space-y-5">
                {budgetData.map(budget => (
                  <div key={budget.id}>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-gray-900 dark:text-white text-base md:text-lg">{budget.category}</span>
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        {formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${
                          budget.percentage > 90 
                            ? 'bg-red-500' 
                            : budget.percentage > 75 
                              ? 'bg-yellow-500' 
                              : 'bg-green-500'
                        } transition-all duration-500`}
                        style={{ width: `${Math.min(100, budget.percentage)}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-sm text-gray-500 dark:text-gray-400 mt-1.5">
                      {Math.round(budget.percentage)}% used
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-10">
                <Target size={40} className="sm:size-52 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-mobile-subtitle mb-2">No budgets set</h3>
                <p className="text-mobile-caption mb-4">Create your first budget to track your spending</p>
                <button
                  onClick={() => {
                    navigate('/budgets');
                    triggerHapticFeedback('tap');
                  }}
                  className="px-5 py-2.5 bg-[#076653] hover:bg-[#076653]/90 text-white rounded-lg sm:rounded-xl font-medium transition-colors duration-200 touch-target"
                >
                  Create Budget
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Featured Insights Slider - Enhanced for desktop */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-mobile-subtitle mb-4 md:mb-6">Financial Insights</h2>
          <CardSlider cards={featuredInsights} />
        </div>

        {/* Transaction Modal */}
        {showTransactionModal && (
          <TransactionModal
            isOpen={showTransactionModal}
            onClose={() => setShowTransactionModal(false)}
            type={transactionModalType}
          />
        )}
      </div>
    </>
  );
};

export default memo(Dashboard);