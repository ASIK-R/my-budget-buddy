import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from 'date-fns';
import { useState, useMemo, memo, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  BarChart3, 
  Filter,
  Calendar,
  Download,
  Eye,
  EyeOff,
  AlertTriangle,
  Target,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Clock,
  Zap,
  Sun,
  Moon
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import ResponsiveCard from '../components/ResponsiveCard';
import ResponsiveStatCard from '../components/ResponsiveStatCard';
import { debounce, throttle } from '../utils/performance';
import useHapticFeedback from '../hooks/useHapticFeedback.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Create memoized chart components for better performance
const MemoizedLineChart = memo(({ data, options }) => (
  <Line data={data} options={options} />
));

const MemoizedBarChart = memo(({ data, options }) => (
  <Bar data={data} options={options} />
));

const MemoizedDoughnutChart = memo(({ data, options }) => (
  <Doughnut data={data} options={options} />
));

const Analysis = () => {
  const { transactions, wallets, budgets, error, clearError } = useAppContext();
  const { darkMode, toggleTheme } = useTheme();
  const { triggerHapticFeedback } = useHapticFeedback();
  const [timeRange, setTimeRange] = useState('monthly'); // daily, weekly, monthly, yearly
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hideSmallCategories, setHideSmallCategories] = useState(false);
  const [comparisonPeriod, setComparisonPeriod] = useState('previous'); // previous, last_year
  const [showInsights, setShowInsights] = useState(true);

  // Memoized currency formatter
  const formatCurrency = useMemo(() => {
    return (amount) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
    };
  }, []);

  // Filter transactions based on time range with memoization
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    let startDate, endDate;

    switch (timeRange) {
      case 'daily':
        startDate = startOfDay(now);
        endDate = endOfDay(now);
        break;
      case 'weekly':
        startDate = startOfWeek(now, { weekStartsOn: 1 });
        endDate = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case 'monthly':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case 'yearly':
        startDate = startOfYear(now);
        endDate = endOfYear(now);
        break;
      default:
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
    }

    return transactions.filter(t => {
      const transactionDate = parseISO(t.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  }, [transactions, timeRange]);

  // Get comparison period data
  const comparisonTransactions = useMemo(() => {
    const now = new Date();
    let startDate, endDate;

    switch (timeRange) {
      case 'daily':
        startDate = comparisonPeriod === 'previous' 
          ? startOfDay(subDays(now, 1))
          : startOfDay(subDays(now, 365));
        endDate = comparisonPeriod === 'previous'
          ? endOfDay(subDays(now, 1))
          : endOfDay(subDays(now, 364));
        break;
      case 'weekly':
        startDate = comparisonPeriod === 'previous'
          ? startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 })
          : startOfWeek(subWeeks(now, 52), { weekStartsOn: 1 });
        endDate = comparisonPeriod === 'previous'
          ? endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 })
          : endOfWeek(subWeeks(now, 51), { weekStartsOn: 1 });
        break;
      case 'monthly':
        startDate = comparisonPeriod === 'previous'
          ? startOfMonth(subMonths(now, 1))
          : startOfMonth(subMonths(now, 12));
        endDate = comparisonPeriod === 'previous'
          ? endOfMonth(subMonths(now, 1))
          : endOfMonth(subMonths(now, 11));
        break;
      case 'yearly':
        startDate = comparisonPeriod === 'previous'
          ? startOfYear(subYears(now, 1))
          : startOfYear(subYears(now, 1));
        endDate = comparisonPeriod === 'previous'
          ? endOfYear(subYears(now, 1))
          : endOfYear(subYears(now, 1));
        break;
      default:
        startDate = startOfMonth(subMonths(now, 1));
        endDate = endOfMonth(subMonths(now, 1));
    }

    return transactions.filter(t => {
      const transactionDate = parseISO(t.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  }, [transactions, timeRange, comparisonPeriod]);

  // Helper functions for financial analysis
  const calculateSpendingVolatility = (transactions) => {
    // Calculate standard deviation of daily spending
    const dailySpending = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const date = parseISO(t.date).toDateString();
        dailySpending[date] = (dailySpending[date] || 0) + t.amount;
      });
    
    const amounts = Object.values(dailySpending);
    if (amounts.length === 0) return 0;
    
    const mean = amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;
    const squaredDiffs = amounts.map(amount => Math.pow(amount - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((sum, squaredDiff) => sum + squaredDiff, 0) / squaredDiffs.length;
    return Math.sqrt(avgSquaredDiff);
  };

  // Calculate financial metrics
  const financialMetrics = useMemo(() => {
    const expenseTransactions = filteredTransactions.filter(t => t.type === 'expense');
    const incomeTransactions = filteredTransactions.filter(t => t.type === 'income');
    
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
    const netCashFlow = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (netCashFlow / totalIncome) * 100 : 0;
    const volatility = calculateSpendingVolatility(filteredTransactions);
    
    // Comparison period metrics
    const comparisonExpenseTransactions = comparisonTransactions.filter(t => t.type === 'expense');
    const comparisonIncomeTransactions = comparisonTransactions.filter(t => t.type === 'income');
    
    const comparisonTotalExpenses = comparisonExpenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    const comparisonTotalIncome = comparisonIncomeTransactions.reduce((sum, t) => sum + t.amount, 0);
    const comparisonNetCashFlow = comparisonTotalIncome - comparisonTotalExpenses;
    
    // Calculate trends
    const expenseTrend = comparisonTotalExpenses > 0 ? 
      ((totalExpenses - comparisonTotalExpenses) / comparisonTotalExpenses) * 100 : 0;
    const incomeTrend = comparisonTotalIncome > 0 ? 
      ((totalIncome - comparisonTotalIncome) / comparisonTotalIncome) * 100 : 0;
    
    return {
      totalExpenses,
      totalIncome,
      netCashFlow,
      savingsRate,
      volatility,
      expenseTrend,
      incomeTrend,
      comparison: {
        totalExpenses: comparisonTotalExpenses,
        totalIncome: comparisonTotalIncome,
        netCashFlow: comparisonNetCashFlow
      }
    };
  }, [filteredTransactions, comparisonTransactions]);

  // Spending by category data
  const spendingByCategory = useMemo(() => {
    const expenseTransactions = filteredTransactions.filter(t => t.type === 'expense');
    
    const categoryTotals = expenseTransactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
    
    // Convert to array and sort by amount
    const sortedCategories = Object.entries(categoryTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
    
    // Filter small categories if enabled
    const filteredCategories = hideSmallCategories 
      ? sortedCategories.filter(c => c.amount > financialMetrics.totalExpenses * 0.02) // Hide < 2%
      : sortedCategories;
    
    // Limit to top 10 categories
    const topCategories = filteredCategories.slice(0, 10);
    
    return topCategories;
  }, [filteredTransactions, hideSmallCategories, financialMetrics.totalExpenses]);

  // Chart data configurations
  const spendingByCategoryChartData = useMemo(() => {
    const labels = spendingByCategory.map(item => item.category);
    const data = spendingByCategory.map(item => item.amount);
    
    // Generate distinct colors for each category
    const backgroundColors = [
      '#076653', '#10B981', '#34D399', '#6EE7B7', '#A7F3D0',
      '#FBBF24', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'
    ];
    
    return {
      labels,
      datasets: [{
        label: 'Spending by Category',
        data,
        backgroundColor: backgroundColors.slice(0, labels.length),
        borderColor: darkMode ? '#1F2937' : '#FFFFFF',
        borderWidth: 2,
        hoverOffset: 10
      }]
    };
  }, [spendingByCategory, darkMode]);

  // Daily spending trend data
  const dailySpendingTrendData = useMemo(() => {
    const expenseTransactions = filteredTransactions.filter(t => t.type === 'expense');
    
    // Group by day
    const dailyTotals = {};
    expenseTransactions.forEach(t => {
      const date = format(parseISO(t.date), 'MMM dd');
      dailyTotals[date] = (dailyTotals[date] || 0) + t.amount;
    });
    
    // Sort by date
    const sortedEntries = Object.entries(dailyTotals).sort((a, b) => {
      const dateA = parseISO(a[0]);
      const dateB = parseISO(b[0]);
      return dateA - dateB;
    });
    
    const labels = sortedEntries.map(entry => entry[0]);
    const data = sortedEntries.map(entry => entry[1]);
    
    return {
      labels,
      datasets: [{
        label: 'Daily Spending',
        data,
        fill: true,
        backgroundColor: darkMode ? 'rgba(7, 102, 83, 0.2)' : 'rgba(7, 102, 83, 0.1)',
        borderColor: '#076653',
        tension: 0.4,
        pointBackgroundColor: '#076653',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#076653'
      }]
    };
  }, [filteredTransactions, darkMode]);

  // Monthly spending trend data
  const monthlySpendingTrendData = useMemo(() => {
    const expenseTransactions = filteredTransactions.filter(t => t.type === 'expense');
    
    // Group by month
    const monthlyTotals = {};
    expenseTransactions.forEach(t => {
      const month = format(parseISO(t.date), 'MMM yyyy');
      monthlyTotals[month] = (monthlyTotals[month] || 0) + t.amount;
    });
    
    // Sort by date
    const sortedEntries = Object.entries(monthlyTotals).sort((a, b) => {
      const dateA = new Date('01 ' + a[0]);
      const dateB = new Date('01 ' + b[0]);
      return dateA - dateB;
    });
    
    const labels = sortedEntries.map(entry => entry[0]);
    const data = sortedEntries.map(entry => entry[1]);
    
    return {
      labels,
      datasets: [{
        label: 'Monthly Spending',
        data,
        fill: true,
        backgroundColor: darkMode ? 'rgba(7, 102, 83, 0.2)' : 'rgba(7, 102, 83, 0.1)',
        borderColor: '#076653',
        tension: 0.4,
        pointBackgroundColor: '#076653',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#076653'
      }]
    };
  }, [filteredTransactions, darkMode]);

  // Chart options
  const doughnutChartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: darkMode ? '#D1D5DB' : '#4B5563',
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
        titleColor: darkMode ? '#F9FAFB' : '#111827',
        bodyColor: darkMode ? '#D1D5DB' : '#4B5563',
        borderColor: darkMode ? '#374151' : '#E5E7EB',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: ${formatCurrency(value)}`;
          }
        }
      }
    },
    cutout: '60%'
  }), [darkMode, formatCurrency]);

  const lineChartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: darkMode ? '#D1D5DB' : '#4B5563',
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
        titleColor: darkMode ? '#F9FAFB' : '#111827',
        bodyColor: darkMode ? '#D1D5DB' : '#4B5563',
        borderColor: darkMode ? '#374151' : '#E5E7EB',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y || 0;
            return `${label}: ${formatCurrency(value)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: darkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(229, 231, 235, 0.5)'
        },
        ticks: {
          color: darkMode ? '#9CA3AF' : '#6B7280'
        }
      },
      y: {
        grid: {
          color: darkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(229, 231, 235, 0.5)'
        },
        ticks: {
          color: darkMode ? '#9CA3AF' : '#6B7280',
          callback: function(value) {
            return formatCurrency(value);
          }
        }
      }
    }
  }), [darkMode, formatCurrency]);

  const barChartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: darkMode ? '#D1D5DB' : '#4B5563',
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
        titleColor: darkMode ? '#F9FAFB' : '#111827',
        bodyColor: darkMode ? '#D1D5DB' : '#4B5563',
        borderColor: darkMode ? '#374151' : '#E5E7EB',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y || 0;
            return `${label}: ${formatCurrency(value)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: darkMode ? '#9CA3AF' : '#6B7280'
        }
      },
      y: {
        grid: {
          color: darkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(229, 231, 235, 0.5)'
        },
        ticks: {
          color: darkMode ? '#9CA3AF' : '#6B7280',
          callback: function(value) {
            return formatCurrency(value);
          }
        }
      }
    }
  }), [darkMode, formatCurrency]);

  // Financial insights
  const financialInsights = useMemo(() => {
    const insights = [];
    
    // High spending categories
    const highSpendingCategories = spendingByCategory
      .filter(cat => cat.amount > financialMetrics.totalExpenses * 0.1) // > 10% of total
      .map(cat => cat.category);
    
    if (highSpendingCategories.length > 0) {
      insights.push({
        type: 'warning',
        title: 'High Spending Categories',
        message: `You're spending heavily on: ${highSpendingCategories.join(', ')}. Consider reviewing these categories.`,
        icon: AlertTriangle
      });
    }
    
    // Savings rate insight
    if (financialMetrics.savingsRate < 10) {
      insights.push({
        type: 'info',
        title: 'Low Savings Rate',
        message: 'Your savings rate is below 10%. Try to increase your savings by reducing discretionary spending.',
        icon: TrendingDownIcon
      });
    } else if (financialMetrics.savingsRate > 20) {
      insights.push({
        type: 'success',
        title: 'Great Savings Rate!',
        message: `Excellent work! Your savings rate of ${financialMetrics.savingsRate.toFixed(1)}% is above 20%.`,
        icon: TrendingUpIcon
      });
    }
    
    // Spending volatility
    if (financialMetrics.volatility > financialMetrics.totalExpenses * 0.1) { // > 10% of total expenses
      insights.push({
        type: 'warning',
        title: 'High Spending Volatility',
        message: 'Your spending varies significantly day to day. Creating a budget may help stabilize your expenses.',
        icon: Zap
      });
    }
    
    // Income vs expense trend
    if (financialMetrics.expenseTrend > 10 && financialMetrics.incomeTrend < 5) {
      insights.push({
        type: 'warning',
        title: 'Rising Expenses',
        message: 'Your expenses are growing faster than your income. Review your spending habits.',
        icon: TrendingUp
      });
    }
    
    return insights;
  }, [spendingByCategory, financialMetrics]);

  // Time range options
  const timeRangeOptions = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'yearly', label: 'Yearly' }
  ];

  // Comparison period options
  const comparisonOptions = [
    { id: 'previous', label: 'Previous Period' },
    { id: 'last_year', label: 'Last Year' }
  ];

  // Category options
  const categoryOptions = useMemo(() => {
    const categories = [...new Set(transactions.map(t => t.category))];
    return [{ id: 'all', label: 'All Categories' }, ...categories.map(cat => ({ id: cat, label: cat }))];
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

  return (
    <div className="p-responsive w-full max-w-full overflow-x-hidden bg-gray-50 dark:bg-gray-900">
          {/* Mobile-specific spacing adjustments */}
          <div className="sm:hidden mt-16"></div>
      {/* Header with Controls - Mobile optimized */}
      <div className="card-mobile">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-mobile-title">Financial Analysis</h1>
            <p className="text-mobile-caption">Detailed insights into your spending patterns</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                toggleTheme();
                triggerHapticFeedback('tap');
              }}
              className="btn-mobile btn-mobile-secondary touch-target"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              <span className="hidden xs:inline ml-1">{darkMode ? 'Light' : 'Dark'}</span>
            </button>
            <button 
              onClick={() => {
                // Export functionality would go here
                triggerHapticFeedback('tap');
              }}
              className="btn-mobile btn-mobile-primary touch-target"
            >
              <Download size={16} />
              <span className="hidden xs:inline ml-1">Export</span>
            </button>
          </div>
        </div>
        
        {/* Filters - Mobile optimized */}
        <div className="mt-4 flex flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-500 dark:text-gray-400" />
            <select
              value={timeRange}
              onChange={(e) => {
                setTimeRange(e.target.value);
                triggerHapticFeedback('tap');
              }}
              className="select-mobile touch-target"
            >
              {timeRangeOptions.map(option => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500 dark:text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                triggerHapticFeedback('tap');
              }}
              className="select-mobile touch-target"
            >
              {categoryOptions.map(option => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={comparisonPeriod}
              onChange={(e) => {
                setComparisonPeriod(e.target.value);
                triggerHapticFeedback('tap');
              }}
              className="select-mobile touch-target"
            >
              {comparisonOptions.map(option => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
          </div>
          
          <button
            onClick={() => {
              setHideSmallCategories(!hideSmallCategories);
              triggerHapticFeedback('tap');
            }}
            className="btn-mobile btn-mobile-secondary touch-target"
          >
            {hideSmallCategories ? <EyeOff size={16} /> : <Eye size={16} />}
            <span className="hidden xs:inline ml-1">{hideSmallCategories ? 'Show All' : 'Hide Small'}</span>
          </button>
        </div>
      </div>

      {/* Financial Metrics Overview - Mobile optimized */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6 md:mb-8">
        <ResponsiveStatCard
          title="Total Income"
          value={formatCurrency(financialMetrics.totalIncome)}
          trend={financialMetrics.incomeTrend}
          trendLabel={comparisonPeriod === 'previous' ? 'vs prev' : 'vs last yr'}
          icon={<TrendingUp className="text-green-500" size={20} />}
          bgColor="bg-green-50 dark:bg-green-900/20"
          textColor="text-green-700 dark:text-green-300"
        />
        
        <ResponsiveStatCard
          title="Total Expenses"
          value={formatCurrency(financialMetrics.totalExpenses)}
          trend={financialMetrics.expenseTrend}
          trendLabel={comparisonPeriod === 'previous' ? 'vs prev' : 'vs last yr'}
          icon={<TrendingDown className="text-red-500" size={20} />}
          bgColor="bg-red-50 dark:bg-red-900/20"
          textColor="text-red-700 dark:text-red-300"
        />
        
        <ResponsiveStatCard
          title="Net Cash Flow"
          value={formatCurrency(financialMetrics.netCashFlow)}
          trend={0}
          trendLabel=""
          icon={<DollarSign className="text-blue-500" size={20} />}
          bgColor="bg-blue-50 dark:bg-blue-900/20"
          textColor="text-blue-700 dark:text-blue-300"
        />
        
        <ResponsiveStatCard
          title="Savings Rate"
          value={`${financialMetrics.savingsRate.toFixed(1)}%`}
          trend={0}
          trendLabel=""
          icon={<Target className="text-purple-500" size={20} />}
          bgColor="bg-purple-50 dark:bg-purple-900/20"
          textColor="text-purple-700 dark:text-purple-300"
        />
      </div>

      {/* Financial Insights - Mobile optimized */}
      {showInsights && financialInsights.length > 0 && (
        <div className="card-mobile">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-mobile-subtitle">Financial Insights</h2>
            <button 
              onClick={() => {
                setShowInsights(false);
                triggerHapticFeedback('tap');
              }}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 touch-target"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="space-y-3">
            {financialInsights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <div 
                  key={index} 
                  className={`p-3 rounded-xl flex items-start gap-3 ${
                    insight.type === 'warning' 
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' 
                      : insight.type === 'success' 
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                        : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    insight.type === 'warning' 
                      ? 'bg-yellow-100 dark:bg-yellow-800 text-yellow-600 dark:text-yellow-300' 
                      : insight.type === 'success' 
                        ? 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300' 
                        : 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300'
                  }`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{insight.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-xs mt-1">{insight.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Charts Section - Mobile optimized */}
      <div className="grid grid-cols-1 gap-4 mb-5 sm:mb-6 md:mb-8">
        {/* Spending by Category Chart */}
        <ResponsiveCard title="Spending by Category" icon={<PieChart size={18} className="text-[#076653]" />}>
          <div className="h-64">
            <MemoizedDoughnutChart data={spendingByCategoryChartData} options={doughnutChartOptions} />
          </div>
        </ResponsiveCard>
        
        {/* Daily Spending Trend Chart */}
        <ResponsiveCard title="Daily Spending Trend" icon={<BarChart3 size={18} className="text-[#076653]" />}>
          <div className="h-64">
            <MemoizedBarChart data={dailySpendingTrendData} options={barChartOptions} />
          </div>
        </ResponsiveCard>
      </div>

      {/* Monthly Spending Trend Chart */}
      <ResponsiveCard title="Monthly Spending Trend" icon={<TrendingUp size={18} className="text-[#076653]" />}>
        <div className="h-64">
          <MemoizedLineChart data={monthlySpendingTrendData} options={lineChartOptions} />
        </div>
      </ResponsiveCard>

      {/* Top Spending Categories Table - Mobile optimized */}
      <div className="card-mobile mb-5 sm:mb-6 md:mb-8">
        <h2 className="text-mobile-subtitle mb-4">Top Spending Categories</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-3 font-semibold text-gray-700 dark:text-gray-300 text-xs">Category</th>
                <th className="text-right py-2 px-3 font-semibold text-gray-700 dark:text-gray-300 text-xs">Amount</th>
                <th className="text-right py-2 px-3 font-semibold text-gray-700 dark:text-gray-300 text-xs">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {spendingByCategory.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <td className="py-2 px-3 text-gray-900 dark:text-white font-medium text-xs">{item.category}</td>
                  <td className="py-2 px-3 text-right text-gray-900 dark:text-white text-xs">{formatCurrency(item.amount)}</td>
                  <td className="py-2 px-3 text-right text-gray-900 dark:text-white text-xs">
                    {financialMetrics.totalExpenses > 0 
                      ? `${((item.amount / financialMetrics.totalExpenses) * 100).toFixed(1)}%` 
                      : '0%'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default memo(Analysis);