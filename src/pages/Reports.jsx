import { endOfMonth, format, parseISO, startOfMonth, subMonths } from 'date-fns';
import { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  Download,
  Filter,
  Eye,
  EyeOff,
  CheckCircle
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
import { getIconClass } from '../utils/iconUtils';

import {
  downloadBudgetsReport,
  downloadComprehensiveReport,
  downloadTransactionsReport,
  downloadWalletsReport,
} from '../utils/report';

const Reports = () => {
  const { transactions, budgets, wallets } = useAppContext();
  const [timeRange, setTimeRange] = useState('monthly');
  const [reportType, setReportType] = useState('transactions');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter transactions based on time range
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    let startDate, endDate;

    switch (timeRange) {
      case 'weekly':
        startDate = new Date(now.setDate(now.getDate() - 7));
        endDate = new Date();
        break;
      case 'monthly':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case 'quarterly':
        startDate = startOfMonth(subMonths(now, 3));
        endDate = endOfMonth(now);
        break;
      case 'yearly':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
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

  // Calculate financial metrics
  const financialMetrics = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const savings = income - expense;
    const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0;

    // Category-wise expenses
    const categoryExpenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    // Top spending categories
    const topCategories = Object.entries(categoryExpenses)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category, amount]) => ({ category, amount }));

    return {
      income,
      expense,
      savings,
      savingsRate,
      categoryExpenses,
      topCategories,
    };
  }, [filteredTransactions]);

  // Get unique categories for filter
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set((transactions || []).map(t => t.category))];
    return ['all', ...uniqueCategories];
  }, [transactions]);

  // Export functions
  const exportTransactions = () => {
    downloadTransactionsReport(timeRange, filteredTransactions);
  };

  const exportBudgets = () => {
    downloadBudgetsReport(budgets);
  };

  const exportWallets = () => {
    downloadWalletsReport(wallets);
  };

  const exportComprehensive = () => {
    downloadComprehensiveReport(transactions, budgets, wallets);
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
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Financial Reports</h1>
              <p className="text-gray-600 dark:text-gray-300">Detailed insights and exportable reports of your financial data</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={timeRange}
                onChange={e => setTimeRange(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#076653] focus:border-transparent w-full sm:w-auto"
              >
                <option value="weekly">Last 7 Days</option>
                <option value="monthly">This Month</option>
                <option value="quarterly">Last 3 Months</option>
                <option value="yearly">This Year</option>
              </select>
              <button 
                onClick={exportComprehensive}
                className="flex items-center gap-2 px-4 py-3 bg-[#076653] text-white rounded-xl hover:bg-[#076653]/90 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Download size={20} />
                <span className="font-semibold hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Financial Summary Cards with Modern Design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
        <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-5 shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Total Income</h3>
            <div className="p-2 rounded-lg bg-green-100/80 dark:bg-green-900/30">
              <TrendingUp size={20} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${financialMetrics.income.toLocaleString()}
          </p>
          <div className="mt-2 flex items-center text-xs text-green-600 dark:text-green-400">
            <TrendingUp size={14} className="mr-1" />
            <span>Revenue generated</span>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-5 shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Total Expenses</h3>
            <div className="p-2 rounded-lg bg-red-100/80 dark:bg-red-900/30">
              <TrendingDown size={20} className="text-red-600 dark:text-red-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${financialMetrics.expense.toLocaleString()}
          </p>
          <div className="mt-2 flex items-center text-xs text-red-600 dark:text-red-400">
            <TrendingDown size={14} className="mr-1" />
            <span>Money spent</span>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-5 shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Net Savings</h3>
            <div className="p-2 rounded-lg bg-blue-100/80 dark:bg-blue-900/30">
              <DollarSign size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${financialMetrics.savings.toLocaleString()}
          </p>
          <div className="mt-2 flex items-center text-xs text-blue-600 dark:text-blue-400">
            <DollarSign size={14} className="mr-1" />
            <span>Saved amount</span>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-5 shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Savings Rate</h3>
            <div className="p-2 rounded-lg bg-purple-100/80 dark:bg-purple-900/30">
              <PieChart size={20} className="text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {financialMetrics.savingsRate}%
          </p>
          <div className="mt-2 flex items-center text-xs text-purple-600 dark:text-purple-400">
            <PieChart size={14} className="mr-1" />
            <span>Of total income</span>
          </div>
        </div>
      </div>

      {/* Report Types */}
      <div className="rounded-2xl bg-white/80 dark:bg-gray-800/60 p-5 sm:p-6 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <div className="flex flex-wrap gap-2 mb-5">
          <button
            onClick={() => setReportType('transactions')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
              reportType === 'transactions'
                ? 'bg-[#076653] text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Transactions
          </button>
          <button
            onClick={() => setReportType('budgets')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
              reportType === 'budgets'
                ? 'bg-[#076653] text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Budgets
          </button>
          <button
            onClick={() => setReportType('wallets')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
              reportType === 'wallets'
                ? 'bg-[#076653] text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Wallets
          </button>
          <button
            onClick={() => setReportType('comprehensive')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
              reportType === 'comprehensive'
                ? 'bg-[#076653] text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Comprehensive
          </button>
        </div>

        {/* Report Content */}
        <div className="mt-5">
          {reportType === 'transactions' && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#076653] focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
                <button 
                  onClick={exportTransactions}
                  className="flex items-center gap-2 px-4 py-2 bg-[#076653] text-white rounded-lg hover:bg-[#076653]/90 transition-all duration-300"
                >
                  <Download size={16} />
                  Export CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Description</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Category</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {(filteredTransactions || []).filter(t => selectedCategory === 'all' || t.category === selectedCategory)
                      .map(transaction => (
                        <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                            {format(parseISO(transaction.date), 'MMM dd, yyyy')}
                          </td>
                          <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                            {transaction.description}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                              {transaction.category}
                            </span>
                          </td>
                          <td className={`py-3 px-4 font-semibold ${
                            transaction.type === 'income' 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {reportType === 'budgets' && (
            <div className="space-y-4">
              <button 
                onClick={exportBudgets}
                className="flex items-center gap-2 px-4 py-2 bg-[#076653] text-white rounded-lg hover:bg-[#076653]/90 transition-all duration-300 mb-4"
              >
                <Download size={16} />
                Export Budgets Report
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(budgets || []).map(budget => {
                  const spent = filteredTransactions
                    .filter(t => t.type === 'expense' && t.category === budget.category)
                    .reduce((sum, t) => sum + t.amount, 0);
                  const percentage = Math.min(100, (spent / budget.limit) * 100);
                  const remaining = budget.limit - spent;

                  return (
                    <div key={budget.id} className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/40 backdrop-blur-sm border border-gray-100/50 dark:border-gray-700/30">
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold text-gray-800 dark:text-gray-200">{budget.category}</span>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          ${spent.toLocaleString()} / ${budget.limit.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-2.5 mb-2">
                        <div
                          className={`h-2.5 rounded-full ${
                            percentage > 90 ? 'bg-red-500' : percentage > 75 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{Math.round(percentage)}% used</span>
                        <span>${remaining.toLocaleString()} remaining</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {reportType === 'wallets' && (
            <div className="space-y-4">
              <button 
                onClick={exportWallets}
                className="flex items-center gap-2 px-4 py-2 bg-[#076653] text-white rounded-lg hover:bg-[#076653]/90 transition-all duration-300 mb-4"
              >
                <Download size={16} />
                Export Wallets Report
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(wallets || []).map(wallet => (
                  <div key={wallet.id} className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/40 backdrop-blur-sm border border-gray-100/50 dark:border-gray-700/30">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#076653]/10 flex items-center justify-center">
                        <DollarSign size={20} className="text-[#076653]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">{wallet.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Wallet</p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${wallet.balance.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {reportType === 'comprehensive' && (
            <div className="space-y-6">
              <button 
                onClick={exportComprehensive}
                className="flex items-center gap-2 px-4 py-2 bg-[#076653] text-white rounded-lg hover:bg-[#076653]/90 transition-all duration-300"
              >
                <Download size={16} />
                Export Comprehensive Report
              </button>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-xl bg-white/50 dark:bg-gray-800/40 p-5 border border-gray-100/50 dark:border-gray-700/30">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-4">Top Spending Categories</h3>
                  <div className="space-y-3">
                    {(financialMetrics.topCategories || []).map((category, index) => (
                      <div key={category.category} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                              {index + 1}
                            </span>
                          </div>
                          <span className="font-medium text-gray-800 dark:text-gray-200">{category.category}</span>
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white">${category.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl bg-white/50 dark:bg-gray-800/40 p-5 border border-gray-100/50 dark:border-gray-700/30">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-4">Financial Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total Transactions</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{(filteredTransactions || []).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Income Transactions</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {(filteredTransactions || []).filter(t => t.type === 'income').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Expense Transactions</span>
                      <span className="font-semibold text-red-600 dark:text-red-400">
                        {(filteredTransactions || []).filter(t => t.type === 'expense').length}
                      </span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Average Transaction</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ${(((financialMetrics.income || 0) + (financialMetrics.expense || 0)) / ((filteredTransactions || []).length || 1)).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;