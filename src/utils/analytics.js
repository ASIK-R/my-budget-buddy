/**
 * Analytics Utilities for Expense Tracker
 * Provides comprehensive financial analytics and reporting features
 */

/**
 * Calculate spending by category
 * @param {Array} transactions - Array of transaction objects
 * @returns {Object} Spending by category
 */
export const calculateSpendingByCategory = (transactions) => {
  const spending = {};
  
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      const category = t.category || 'Uncategorized';
      spending[category] = (spending[category] || 0) + t.amount;
    });
  
  return spending;
};

/**
 * Calculate income by source
 * @param {Array} transactions - Array of transaction objects
 * @returns {Object} Income by source
 */
export const calculateIncomeBySource = (transactions) => {
  const income = {};
  
  transactions
    .filter(t => t.type === 'income')
    .forEach(t => {
      const source = t.source || t.category || 'Uncategorized';
      income[source] = (income[source] || 0) + t.amount;
    });
  
  return income;
};

/**
 * Calculate monthly trends
 * @param {Array} transactions - Array of transaction objects
 * @returns {Object} Monthly trends data
 */
export const calculateMonthlyTrends = (transactions) => {
  const trends = {
    income: {},
    expenses: {},
    net: {}
  };
  
  transactions.forEach(t => {
    const date = new Date(t.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (t.type === 'income') {
      trends.income[monthKey] = (trends.income[monthKey] || 0) + t.amount;
    } else if (t.type === 'expense') {
      trends.expenses[monthKey] = (trends.expenses[monthKey] || 0) + t.amount;
    }
    
    // Calculate net
    trends.net[monthKey] = (trends.income[monthKey] || 0) - (trends.expenses[monthKey] || 0);
  });
  
  return trends;
};

/**
 * Calculate budget performance
 * @param {Array} budgets - Array of budget objects
 * @param {Array} transactions - Array of transaction objects
 * @returns {Array} Budget performance data
 */
export const calculateBudgetPerformance = (budgets, transactions) => {
  return budgets.map(budget => {
    const spent = transactions
      .filter(t => t.type === 'expense' && t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const percentage = budget.amount > 0 ? Math.min(100, (spent / budget.amount) * 100) : 0;
    const remaining = Math.max(0, budget.amount - spent);
    const status = percentage >= 90 ? 'critical' : percentage >= 75 ? 'warning' : 'good';
    
    return {
      ...budget,
      spent,
      percentage,
      remaining,
      status
    };
  });
};

/**
 * Calculate savings rate
 * @param {Array} transactions - Array of transaction objects
 * @returns {Number} Savings rate as percentage
 */
export const calculateSavingsRate = (transactions) => {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  if (income === 0) return 0;
  
  const savings = income - expenses;
  return (savings / income) * 100;
};

/**
 * Calculate net worth over time
 * @param {Array} accounts - Array of account objects
 * @param {Array} transactions - Array of transaction objects
 * @returns {Array} Net worth history
 */
export const calculateNetWorthHistory = (accounts, transactions) => {
  // Current net worth from accounts
  const currentNetWorth = accounts.reduce((sum, account) => sum + account.balance, 0);
  
  // Historical net worth based on transactions
  const history = [];
  let runningTotal = currentNetWorth;
  
  // Sort transactions by date descending
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );
  
  // Calculate historical values
  for (let i = 0; i < sortedTransactions.length; i++) {
    const transaction = sortedTransactions[i];
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (transaction.type === 'income') {
      runningTotal -= transaction.amount;
    } else if (transaction.type === 'expense') {
      runningTotal += transaction.amount;
    }
    
    // Only add to history if this is the last transaction of the month
    // or the last transaction overall
    const isLastInMonth = i === sortedTransactions.length - 1 || 
      new Date(sortedTransactions[i + 1].date).getMonth() !== date.getMonth();
    
    if (isLastInMonth || i === sortedTransactions.length - 1) {
      history.push({
        date: transaction.date,
        month: monthKey,
        netWorth: runningTotal
      });
    }
  }
  
  return history.reverse(); // Chronological order
};

/**
 * Identify top spending categories
 * @param {Array} transactions - Array of transaction objects
 * @param {Number} limit - Number of top categories to return
 * @returns {Array} Top spending categories
 */
export const getTopSpendingCategories = (transactions, limit = 5) => {
  const spending = calculateSpendingByCategory(transactions);
  
  return Object.entries(spending)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
};

/**
 * Calculate expense breakdown by day of week
 * @param {Array} transactions - Array of transaction objects
 * @returns {Object} Expenses by day of week
 */
export const calculateWeeklySpendingPattern = (transactions) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const pattern = {};
  
  days.forEach(day => {
    pattern[day] = 0;
  });
  
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      const date = new Date(t.date);
      const day = days[date.getDay()];
      pattern[day] += t.amount;
    });
  
  return pattern;
};

/**
 * Generate financial insights
 * @param {Array} transactions - Array of transaction objects
 * @param {Array} accounts - Array of account objects
 * @param {Array} budgets - Array of budget objects
 * @returns {Object} Financial insights
 */
export const generateFinancialInsights = (transactions, accounts, budgets) => {
  const insights = [];
  
  // Calculate key metrics
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const savingsRate = calculateSavingsRate(transactions);
  const topCategories = getTopSpendingCategories(transactions, 3);
  
  // Insight 1: Spending patterns
  if (topCategories.length > 0) {
    insights.push({
      id: 'top-spending',
      title: 'Top Spending Categories',
      description: `Your highest spending categories are: ${topCategories.map(c => c.category).join(', ')}`,
      value: topCategories[0].amount.toFixed(2),
      trend: 'neutral',
      priority: 'high'
    });
  }
  
  // Insight 2: Savings rate
  if (savingsRate >= 20) {
    insights.push({
      id: 'good-savings',
      title: 'Excellent Savings Rate',
      description: `You're saving ${savingsRate.toFixed(1)}% of your income, which is above the recommended 20%.`,
      value: `${savingsRate.toFixed(1)}%`,
      trend: 'positive',
      priority: 'high'
    });
  } else if (savingsRate >= 10) {
    insights.push({
      id: 'moderate-savings',
      title: 'Moderate Savings Rate',
      description: `You're saving ${savingsRate.toFixed(1)}% of your income. Aim for 20% for financial security.`,
      value: `${savingsRate.toFixed(1)}%`,
      trend: 'neutral',
      priority: 'medium'
    });
  } else {
    insights.push({
      id: 'low-savings',
      title: 'Low Savings Rate',
      description: `You're saving only ${savingsRate.toFixed(1)}% of your income. Consider reducing expenses to save more.`,
      value: `${savingsRate.toFixed(1)}%`,
      trend: 'negative',
      priority: 'high'
    });
  }
  
  // Insight 3: Budget health
  const budgetPerformance = calculateBudgetPerformance(budgets, transactions);
  const overBudgetCount = budgetPerformance.filter(b => b.status === 'critical').length;
  
  if (overBudgetCount > 0) {
    insights.push({
      id: 'budget-alert',
      title: 'Budget Alert',
      description: `You've exceeded ${overBudgetCount} budget${overBudgetCount > 1 ? 's' : ''}. Review your spending.`,
      value: overBudgetCount.toString(),
      trend: 'negative',
      priority: 'high'
    });
  }
  
  // Insight 4: Account balance
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  
  if (totalBalance > 0) {
    insights.push({
      id: 'positive-balance',
      title: 'Healthy Account Balance',
      description: `Your total account balance is $${totalBalance.toFixed(2)}.`,
      value: `$${totalBalance.toFixed(2)}`,
      trend: 'positive',
      priority: 'medium'
    });
  }
  
  return insights;
};

/**
 * Export data to CSV format
 * @param {Array} transactions - Array of transaction objects
 * @param {Array} accounts - Array of account objects
 * @param {Array} budgets - Array of budget objects
 * @returns {String} CSV formatted data
 */
export const exportToCSV = (transactions, accounts, budgets) => {
  let csv = '';
  
  // Transactions
  csv += 'Transactions\n';
  csv += 'Date,Description,Category,Amount,Type,Account\n';
  transactions.forEach(t => {
    csv += `"${t.date}","${t.description}","${t.category}",${t.amount},${t.type},"${t.account || ''}"\n`;
  });
  
  csv += '\nAccounts\n';
  csv += 'Name,Type,Balance\n';
  accounts.forEach(a => {
    csv += `"${a.name}","${a.type}",${a.balance}\n`;
  });
  
  csv += '\nBudgets\n';
  csv += 'Category,Limit,Spent,Remaining\n';
  budgets.forEach(b => {
    const spent = transactions
      .filter(t => t.type === 'expense' && t.category === b.category)
      .reduce((sum, t) => sum + t.amount, 0);
    const remaining = b.amount - spent;
    csv += `"${b.category}",${b.amount},${spent},${remaining}\n`;
  });
  
  return csv;
};

export default {
  calculateSpendingByCategory,
  calculateIncomeBySource,
  calculateMonthlyTrends,
  calculateBudgetPerformance,
  calculateSavingsRate,
  calculateNetWorthHistory,
  getTopSpendingCategories,
  calculateWeeklySpendingPattern,
  generateFinancialInsights,
  exportToCSV
};