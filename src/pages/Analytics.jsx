import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Wallet, Target, Calendar } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { 
  calculateSpendingByCategory,
  calculateIncomeBySource,
  calculateMonthlyTrends,
  calculateBudgetPerformance,
  calculateSavingsRate,
  calculateNetWorthHistory,
  getTopSpendingCategories,
  calculateWeeklySpendingPattern,
  generateFinancialInsights
} from '../utils/analytics';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const Analytics = () => {
  const navigate = useNavigate();
  const { accounts, transactions, budgets } = useAppContext();
  
  const [timeRange, setTimeRange] = useState('3months');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Filter transactions based on time range
  const filteredTransactions = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];
    
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case '1week':
        startDate.setDate(now.getDate() - 7);
        break;
      case '1month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '3months':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '6months':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case '1year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 3);
    }
    
    return transactions.filter(t => new Date(t.date) >= startDate);
  }, [transactions, timeRange]);
  
  // Calculate analytics data
  const analyticsData = useMemo(() => {
    if (!filteredTransactions || filteredTransactions.length === 0) {
      return {
        spendingByCategory: [],
        incomeBySource: [],
        monthlyTrends: [],
        budgetPerformance: [],
        savingsRate: 0,
        netWorthHistory: [],
        topSpendingCategories: [],
        weeklySpendingPattern: [],
        financialInsights: []
      };
    }
    
    return {
      spendingByCategory: Object.entries(calculateSpendingByCategory(filteredTransactions))
        .map(([name, value]) => ({ name, value })),
      incomeBySource: Object.entries(calculateIncomeBySource(filteredTransactions))
        .map(([name, value]) => ({ name, value })),
      monthlyTrends: Object.entries(calculateMonthlyTrends(filteredTransactions).net)
        .map(([month, net]) => ({ month, net })),
      budgetPerformance: calculateBudgetPerformance(budgets, filteredTransactions),
      savingsRate: calculateSavingsRate(filteredTransactions),
      netWorthHistory: calculateNetWorthHistory(accounts, filteredTransactions),
      topSpendingCategories: getTopSpendingCategories(filteredTransactions),
      weeklySpendingPattern: Object.entries(calculateWeeklySpendingPattern(filteredTransactions))
        .map(([day, amount]) => ({ day, amount })),
      financialInsights: generateFinancialInsights(filteredTransactions, accounts, budgets)
    };
  }, [filteredTransactions, accounts, budgets]);
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Format percentage
  const formatPercentage = (percentage) => {
    return `${percentage.toFixed(1)}%`;
  };
  
  return (
    <div className="p-responsive p-responsive-mobile-condensed w-full">
      {/* Enhanced Header with Modern Design */}
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-[#076653]/10 to-[#076653]/5 p-5 sm:p-6 md:p-7 backdrop-blur-sm border border-[#076653]/20 dark:border-[#076653]/10 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#076653]/5 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#076653]/5 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-[#076653]/10 dark:bg-[#076653]/20 rounded-xl">
              <BarChart size={24} className="text-[#076653]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Financial Analytics
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Detailed insights into your spending, income, and financial health
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Time Range Selector */}
      <div className="mb-8 flex flex-wrap gap-2">
        {['1week', '1month', '3months', '6months', '1year'].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-xl font-medium transition-colors duration-200 ${
              timeRange === range
                ? 'bg-[#076653] text-white'
                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {range.replace(/(\d)([a-z])/g, '$1 $2')}
          </button>
        ))}
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Income</h3>
            <TrendingUp size={24} className="text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(
              filteredTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0)
            )}
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Expenses</h3>
            <TrendingDown size={24} className="text-red-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(
              filteredTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0)
            )}
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Savings Rate</h3>
            <DollarSign size={24} className="text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatPercentage(analyticsData.savingsRate)}
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Net Worth</h3>
            <Wallet size={24} className="text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(accounts.reduce((sum, account) => sum + account.balance, 0))}
          </p>
        </div>
      </div>
      
      {/* Financial Insights */}
      {analyticsData.financialInsights.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Financial Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analyticsData.financialInsights.map((insight) => (
              <div 
                key={insight.id}
                className={`p-6 rounded-2xl shadow-sm border ${
                  insight.trend === 'positive' 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                    : insight.trend === 'negative'
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                      : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                }`}
              >
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{insight.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{insight.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{insight.value}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    insight.trend === 'positive' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : insight.trend === 'negative'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {insight.trend.charAt(0).toUpperCase() + insight.trend.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Spending by Category */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Spending by Category</h2>
          {analyticsData.spendingByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.spendingByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {analyticsData.spendingByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              No spending data available
            </div>
          )}
        </div>
        
        {/* Monthly Trends */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Monthly Trends</h2>
          {analyticsData.monthlyTrends.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="net" 
                  stroke="#076653" 
                  activeDot={{ r: 8 }} 
                  name="Net Change"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              No trend data available
            </div>
          )}
        </div>
      </div>
      
      {/* Budget Performance */}
      {analyticsData.budgetPerformance.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Budget Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analyticsData.budgetPerformance.map((budget) => (
              <div 
                key={budget.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 dark:text-white">{budget.category}</h3>
                  <Target size={20} className={
                    budget.status === 'critical' ? 'text-red-500' :
                      budget.status === 'warning' ? 'text-yellow-500' : 'text-green-500'
                  } />
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span>{formatCurrency(budget.spent)} spent</span>
                    <span>{formatCurrency(budget.amount)} budget</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        budget.status === 'critical' ? 'bg-red-500' :
                          budget.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(100, budget.percentage)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className={budget.status === 'critical' ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}>
                    {formatPercentage(budget.percentage)} used
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {formatCurrency(budget.remaining)} remaining
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Weekly Spending Pattern */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Weekly Spending Pattern</h2>
        {analyticsData.weeklySpendingPattern.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.weeklySpendingPattern}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="amount" fill="#076653" name="Amount Spent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              No spending pattern data available
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;