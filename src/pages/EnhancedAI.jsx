import { formatDistanceToNow } from 'date-fns';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Bot, 
  Send, 
  Sparkles, 
  User,
  HelpCircle,
  X,
  TrendingUp,
  TrendingDown,
  Wallet,
  Target,
  PieChart,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Zap,
  Star
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

// Enhanced AI response generator with more sophisticated financial analysis
const getAIResponse = (question, transactions, budgets, wallets) => {
  const lowerQuestion = question.toLowerCase();

  // Calculate comprehensive financial metrics
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const incomeTransactions = transactions.filter(t => t.type === 'income');
  
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100) : 0;

  // Expense categories analysis
  const expenseCategories = expenseTransactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const topCategories = Object.entries(expenseCategories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Budget analysis
  const budgetInsights = budgets.map(budget => {
    const actualSpent = expenseTransactions
      .filter(t => t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      category: budget.category,
      budget: budget.limit,
      actual: actualSpent,
      utilization: budget.limit > 0 ? ((actualSpent / budget.limit) * 100) : 0,
    };
  });

  const overBudgetCategories = budgetInsights.filter(b => b.utilization > 100);
  const underBudgetCategories = budgetInsights.filter(b => b.utilization < 80);

  // Wallet analysis
  const totalWalletBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);

  // Monthly spending trend
  const monthlySpending = expenseTransactions.reduce((acc, t) => {
    const month = format(parseISO(t.date), 'MMM yyyy');
    acc[month] = (acc[month] || 0) + t.amount;
    return acc;
  }, {});

  const sortedMonths = Object.keys(monthlySpending).sort((a, b) => {
    const dateA = new Date('01 ' + a);
    const dateB = new Date('01 ' + b);
    return dateB - dateA;
  });

  const recentSpending = sortedMonths.slice(0, 3).map(month => ({
    month,
    amount: monthlySpending[month]
  }));

  // Advanced spending pattern analysis
  const calculateSpendingVolatility = () => {
    const dailySpending = {};
    expenseTransactions.forEach(t => {
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

  const volatility = calculateSpendingVolatility();

  // New enhanced financial recommendations
  const getFinancialRecommendations = () => {
    const recommendations = [];
    
    if (balance < 0) {
      recommendations.push({
        type: 'urgent',
        title: 'Negative Cash Flow',
        description: 'Your expenses are exceeding your income. Review discretionary spending.',
        action: 'Review Expenses'
      });
    } else if (savingsRate < 10) {
      recommendations.push({
        type: 'improvement',
        title: 'Low Savings Rate',
        description: 'Try to increase savings to at least 10% of income.',
        action: 'Cut Non-Essentials'
      });
    } else if (savingsRate >= 20) {
      recommendations.push({
        type: 'success',
        title: 'Excellent Savings',
        description: 'Consider investing some savings for long-term growth.',
        action: 'Explore Investments'
      });
    }
    
    if (volatility > totalExpense * 0.1) {
      recommendations.push({
        type: 'warning',
        title: 'High Spending Volatility',
        description: 'Create a consistent budget to stabilize expenses.',
        action: 'Set Budgets'
      });
    }
    
    if (overBudgetCategories.length > 0) {
      recommendations.push({
        type: 'warning',
        title: 'Over Budget',
        description: `You're over budget in ${overBudgetCategories.length} categories.`,
        action: 'Adjust Spending'
      });
    }
    
    return recommendations;
  };

  // Handle different question types with enhanced responses
  if (lowerQuestion.includes('balance') || lowerQuestion.includes('net worth')) {
    const status = balance >= 0 ? 'positive' : 'negative';
    return {
      type: 'balance',
      content: `💰 Your current financial status:

• Net Balance: $${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
• Total Income: $${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
• Total Expenses: $${totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}

You have a ${status} cash flow. ${status === 'positive' ? 'Great job managing your finances!' : 'Consider reviewing your expenses to improve your financial health.'}`,
      data: { balance, totalIncome, totalExpense, status }
    };
  }

  if (lowerQuestion.includes('spend') || lowerQuestion.includes('expense') || lowerQuestion.includes('categories')) {
    if (topCategories.length === 0) {
      return {
        type: 'info',
        content: '📊 You haven\'t recorded any expenses yet. Start tracking your spending to get insights!',
        data: null
      };
    }
    
    const categoryList = topCategories
      .map(([category, amount], index) => `${index + 1}. ${category}: $${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)
      .join('\n');
    
    return {
      type: 'spending',
      content: `📊 Your top spending categories:

${categoryList}

Would you like to see more details about any specific category or get tips on reducing expenses in these areas?`,
      data: topCategories
    };
  }

  if (lowerQuestion.includes('budget') || lowerQuestion.includes('limit')) {
    if (budgets.length === 0) {
      return {
        type: 'info',
        content: '🎯 You haven\'t set up any budgets yet. Setting budgets can help you control your spending and achieve your financial goals. Would you like to create your first budget?',
        data: null
      };
    }
    
    if (overBudgetCategories.length > 0) {
      const categoryList = overBudgetCategories
        .map(b => `• ${b.category}: ${b.utilization.toFixed(1)}% (${b.actual > b.budget ? '$' + (b.actual - b.budget).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''} over budget)`)
        .join('\n');
      return {
        type: 'warning',
        content: `⚠️ Budget Alert!

You're over budget in:
${categoryList}

Consider reviewing these categories to get back on track. Would you like specific suggestions for reducing spending in these areas?`,
        data: overBudgetCategories
      };
    } else if (underBudgetCategories.length > 0) {
      const categoryList = underBudgetCategories
        .map(b => `• ${b.category}: ${b.utilization.toFixed(1)}%`)
        .join('\n');
      return {
        type: 'success',
        content: `✅ Great Job!

You're under budget in:
${categoryList}

You might consider reallocating some of these funds to categories where you're overspending or toward your savings goals.`,
        data: underBudgetCategories
      };
    } else {
      return {
        type: 'info',
        content: '🎯 Your budgets are well balanced. All categories are within healthy utilization ranges (20%-100%). Keep up the good work!',
        data: budgetInsights
      };
    }
  }

  if (lowerQuestion.includes('save') || lowerQuestion.includes('savings')) {
    const status = savingsRate >= 20 ? 'excellent' : savingsRate >= 10 ? 'good' : 'needs improvement';
    return {
      type: 'savings',
      content: `🏦 Savings Analysis:

• Current Savings Rate: ${savingsRate.toFixed(1)}%
• Monthly Savings: $${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
• Total Wallet Balance: $${totalWalletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}

Your savings rate is ${status}. ${savingsRate < 10 ? 'Try to increase your savings by reducing discretionary spending.' : savingsRate >= 20 ? 'Consider investing some of these savings for long-term growth.' : 'You\'re on the right track with your savings.'}`,
      data: { savingsRate, balance, totalWalletBalance }
    };
  }

  if (lowerQuestion.includes('wallet') || lowerQuestion.includes('assets')) {
    return {
      type: 'wallet',
      content: `💳 Wallet Summary:

• Total Wallet Balance: $${totalWalletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
• Number of Wallets: ${wallets.length}

It's recommended to keep an emergency fund covering 3-6 months of expenses. Your current emergency fund status: ${totalWalletBalance >= totalExpense * 3 ? '✅ Sufficient' : '⚠️ Needs improvement'}.`,
      data: { totalWalletBalance, walletCount: wallets.length }
    };
  }

  if (lowerQuestion.includes('trend') || lowerQuestion.includes('monthly') || lowerQuestion.includes('pattern')) {
    if (recentSpending.length === 0) {
      return {
        type: 'info',
        content: '📈 You haven\'t recorded any expenses yet. Start tracking your spending to see monthly trends!',
        data: null
      };
    }
    
    const trendList = recentSpending
      .map(s => `• ${s.month}: $${s.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)
      .join('\n');
    
    // Analyze trend direction
    let trendDirection = 'stable';
    if (recentSpending.length >= 2) {
      const current = recentSpending[0].amount;
      const previous = recentSpending[1].amount;
      if (current > previous * 1.1) trendDirection = 'increasing';
      else if (current < previous * 0.9) trendDirection = 'decreasing';
    }
    
    return {
      type: 'trend',
      content: `📈 Recent Monthly Spending Trends:

${trendList}

Your spending is ${trendDirection}. ${trendDirection === 'increasing' ? 'Consider reviewing your expenses to identify areas for reduction.' : trendDirection === 'decreasing' ? 'Great job controlling your spending!' : 'Your spending is stable.'}`,
      data: recentSpending
    };
  }

  if (lowerQuestion.includes('tip') || lowerQuestion.includes('advice') || lowerQuestion.includes('recommend')) {
    const recommendations = getFinancialRecommendations();
    if (recommendations.length === 0) {
      return {
        type: 'info',
        content: '✅ You\'re on the right track with your finances. Consider setting specific financial goals to help guide your saving and investment decisions.',
        data: null
      };
    }
    
    const recList = recommendations
      .map((rec, index) => `${index + 1}. ${rec.title}: ${rec.description}`)
      .join('\n\n');
    
    return {
      type: 'recommendations',
      content: `🎯 Personalized Financial Recommendations:

${recList}

Would you like more detailed advice on any of these points?`,
      data: recommendations
    };
  }

  if (lowerQuestion.includes('invest') || lowerQuestion.includes('growth')) {
    return {
      type: 'investment',
      content: `📈 Investment Guidance:

• Current Savings: $${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
• Savings Rate: ${savingsRate.toFixed(1)}%

Consider diversifying your investments across different asset classes. A common recommendation is the 100-minus-age rule for stock allocation. For example, if you're 30, consider allocating 70% to stocks and 30% to bonds.

Before investing, ensure you have:
1. Emergency fund (3-6 months expenses)
2. No high-interest debt
3. Clear financial goals

Would you like specific investment recommendations based on your risk tolerance?`,
      data: { balance, savingsRate }
    };
  }

  if (lowerQuestion.includes('emergency') || lowerQuestion.includes('fund')) {
    const recommendedFund = totalExpense * 3; // 3 months of expenses
    const fundStatus = totalWalletBalance >= recommendedFund 
      ? '✅ You have sufficient emergency funds.' 
      : `⚠️ Consider building your emergency fund to $${recommendedFund.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}, which covers 3 months of expenses.`;
    return {
      type: 'emergency',
      content: `🚨 Emergency Fund Status:

• Current Emergency Fund: $${totalWalletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
• Recommended Amount: $${recommendedFund.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}

${fundStatus}

An emergency fund is crucial for financial security. It should cover 3-6 months of essential expenses and be kept in a liquid, easily accessible account.`,
      data: { current: totalWalletBalance, recommended: recommendedFund }
    };
  }

  // Default response with more helpful suggestions
  return {
    type: 'help',
    content: `🤔 I can help you with questions about your balance, spending habits, budget status, savings rate, financial advice, monthly trends, investment tips, and emergency funds.

Try asking me:
• "What's my current balance?"
• "Show me my spending by category"
• "Am I on track with my budget?"
• "How can I save more money?"
• "What are my top expenses this month?"
• "Do I have enough emergency funds?"

I'm here to help you take control of your finances! 💰`,
    data: null
  };
};

// Enhanced function to generate automatic financial insights
const getFinancialInsights = (transactions, budgets, wallets) => {
  if (transactions.length === 0) return null;

  // Calculate financial metrics
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const incomeTransactions = transactions.filter(t => t.type === 'income');
  
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100) : 0;

  // Find biggest expense category
  const expenseCategories = expenseTransactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const biggestCategory = Object.entries(expenseCategories)
    .sort((a, b) => b[1] - a[1])[0];

  // Budget analysis
  const budgetInsights = budgets.map(budget => {
    const actualSpent = expenseTransactions
      .filter(t => t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      category: budget.category,
      budget: budget.limit,
      actual: actualSpent,
      utilization: budget.limit > 0 ? ((actualSpent / budget.limit) * 100) : 0,
    };
  });

  const overBudgetCategories = budgetInsights.filter(b => b.utilization > 100);

  // Generate insights
  let insights = [];
  
  if (balance < 0) {
    insights.push('📉 Your expenses are exceeding your income. Review your spending.');
  } else if (savingsRate < 10) {
    insights.push('💡 Try to increase your savings rate to at least 10% of your income.');
  } else if (savingsRate >= 20) {
    insights.push('🎉 Excellent savings rate! Consider investing for long-term growth.');
  }
  
  if (biggestCategory) {
    insights.push(`📊 Your biggest expense category is ${biggestCategory[0]} ($${biggestCategory[1].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}).`);
  }
  
  if (overBudgetCategories.length > 0) {
    const categoryList = overBudgetCategories
      .map(b => b.category + ' (' + b.utilization.toFixed(1) + '%)' )
      .join(', ');
    insights.push(`⚠️ Over budget in: ${categoryList}. Review these categories.`);
  }
  
  if (insights.length > 0) {
    const insightsList = insights.join('\n\n');
    return {
      type: 'insights',
      content: `💡 Here are some insights I noticed:

${insightsList}

Would you like me to explain any of these insights in more detail?`,
      data: insights
    };
  }
  
  return null;
};

// New component for displaying structured responses
const StructuredResponse = ({ response }) => {
  if (!response || typeof response !== 'object') return null;
  
  const { type, content, data } = response;
  
  // Render different response types with appropriate UI
  switch (type) {
    case 'balance':
      return (
        <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 rounded-2xl border border-blue-200 dark:border-blue-700/30 backdrop-blur-xl shadow-sm">
          <h4 className="font-bold text-blue-800 dark:text-blue-200 flex items-center gap-2 mb-3">
            <Target size={18} />
            Financial Summary
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-white/50 dark:bg-gray-800/40 rounded-xl backdrop-blur-sm border border-white/30 dark:border-gray-700/30 shadow-sm">
              <div className="text-xs text-gray-600 dark:text-gray-300 mb-1">Income</div>
              <div className="font-bold text-green-600 dark:text-green-400 text-lg">${data?.totalIncome?.toFixed(2) || '0.00'}</div>
            </div>
            <div className="text-center p-3 bg-white/50 dark:bg-gray-800/40 rounded-xl backdrop-blur-sm border border-white/30 dark:border-gray-700/30 shadow-sm">
              <div className="text-xs text-gray-600 dark:text-gray-300 mb-1">Expenses</div>
              <div className="font-bold text-red-600 dark:text-red-400 text-lg">${data?.totalExpense?.toFixed(2) || '0.00'}</div>
            </div>
            <div className="text-center p-3 bg-white/50 dark:bg-gray-800/40 rounded-xl backdrop-blur-sm border border-white/30 dark:border-gray-700/30 shadow-sm">
              <div className="text-xs text-gray-600 dark:text-gray-300 mb-1">Balance</div>
              <div className={`font-bold text-lg ${data?.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                ${data?.balance?.toFixed(2) || '0.00'}
              </div>
            </div>
          </div>
        </div>
      );
    case 'spending':
      return (
        <div className="mt-3">
          <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
            <TrendingUp size={18} />
            Top Spending Categories
          </h4>
          <div className="space-y-2">
            {data && data.map(([category, amount], index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-white/30 dark:bg-gray-800/30 rounded-xl backdrop-blur-sm border border-white/30 dark:border-gray-700/30 shadow-sm">
                <span className="text-gray-800 dark:text-gray-200 font-medium">{category}</span>
                <span className="font-bold text-gray-900 dark:text-white">${amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      );
    case 'recommendations':
      return (
        <div className="mt-3">
          <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
            <Sparkles size={18} />
            Personalized Recommendations
          </h4>
          <div className="space-y-3">
            {data && data.map((rec, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-2xl backdrop-blur-xl shadow-sm ${
                  rec.type === 'urgent' ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' :
                    rec.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' :
                      rec.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' :
                        'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-bold text-gray-900 dark:text-white">{rec.title}</h5>
                  <span className={`text-xs px-2.5 py-1 rounded-full ${
                    rec.type === 'urgent' ? 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200' :
                      rec.type === 'warning' ? 'bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200' :
                        rec.type === 'success' ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200' :
                          'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200'
                  }`}>
                    {rec.type.charAt(0).toUpperCase() + rec.type.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{rec.description}</p>
                <button className="text-xs bg-gradient-to-r from-[#076653] to-[#076653]/90 text-white px-4 py-2 rounded-xl hover:from-[#076653]/90 hover:to-[#076653] transition-all duration-300 shadow-sm touch-target">
                  {rec.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    case 'wallet':
      return (
        <div className="mt-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 rounded-2xl border border-purple-200 dark:border-purple-700/30 backdrop-blur-xl shadow-sm">
          <h4 className="font-bold text-purple-800 dark:text-purple-200 flex items-center gap-2 mb-3">
            <Wallet size={18} />
            Wallet Summary
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-white/50 dark:bg-gray-800/40 rounded-xl backdrop-blur-sm border border-white/30 dark:border-gray-700/30 shadow-sm">
              <div className="text-xs text-gray-600 dark:text-gray-300 mb-1">Total Balance</div>
              <div className="font-bold text-purple-600 dark:text-purple-400 text-lg">${data?.totalWalletBalance?.toFixed(2) || '0.00'}</div>
            </div>
            <div className="text-center p-3 bg-white/50 dark:bg-gray-800/40 rounded-xl backdrop-blur-sm border border-white/30 dark:border-gray-700/30 shadow-sm">
              <div className="text-xs text-gray-600 dark:text-gray-300 mb-1">Wallets</div>
              <div className="font-bold text-purple-600 dark:text-purple-400 text-lg">{data?.walletCount || 0}</div>
            </div>
          </div>
        </div>
      );
    case 'savings':
      return (
        <div className="mt-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl border border-green-200 dark:border-green-700/30 backdrop-blur-xl shadow-sm">
          <h4 className="font-bold text-green-800 dark:text-green-200 flex items-center gap-2 mb-3">
            <DollarSign size={18} />
            Savings Analysis
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-gray-800/40 rounded-xl backdrop-blur-sm border border-white/30 dark:border-gray-700/30 shadow-sm">
              <span className="text-gray-700 dark:text-gray-300">Savings Rate</span>
              <span className="font-bold text-green-600 dark:text-green-400">{data?.savingsRate?.toFixed(1) || '0.0'}%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-gray-800/40 rounded-xl backdrop-blur-sm border border-white/30 dark:border-gray-700/30 shadow-sm">
              <span className="text-gray-700 dark:text-gray-300">Monthly Savings</span>
              <span className="font-bold text-green-600 dark:text-green-400">${data?.balance?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>
      );
    case 'trend':
      return (
        <div className="mt-3">
          <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
            <BarChart3 size={18} />
            Monthly Spending Trends
          </h4>
          <div className="space-y-2">
            {data && data.map((entry, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-white/30 dark:bg-gray-800/30 rounded-xl backdrop-blur-sm border border-white/30 dark:border-gray-700/30 shadow-sm">
                <span className="text-gray-800 dark:text-gray-200 font-medium">{entry.month}</span>
                <span className="font-bold text-gray-900 dark:text-white">${entry.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      );
    default:
      return null;
  }
};

// Predefined questions for quick access
const predefinedQuestions = [
  'What is my current balance?',
  'Show me my spending by category',
  'How am I doing with my budget?',
  'Any financial tips for me?',
  'What are my monthly trends?',
  'Do I have enough emergency funds?',
  'How can I save more money?',
  'Where am I overspending?',
  'What\'s my biggest expense?',
  'Should I invest my savings?'
];

const WelcomeMessage = ({ onQuickQuestion }) => (
  <div className="text-center p-4 bg-gradient-to-r from-[#076653]/5 to-teal-50 dark:from-[#076653]/10 dark:to-teal-900/20 rounded-2xl border border-[#076653]/10 dark:border-teal-800/30 backdrop-blur-xl mb-4">
    <div className="inline-flex items-center justify-center p-3 rounded-full bg-[#076653]/10 mb-3">
      <Zap className="text-[#076653]" size={24} />
    </div>
    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Welcome to Smart Finance AI</h3>
    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Your personal financial assistant powered by advanced analytics</p>
    <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto mb-4">
      <div className="flex items-center justify-center gap-1 p-2 bg-white/30 dark:bg-gray-800/30 rounded-lg">
        <PieChart size={14} className="text-[#076653]" />
        <span className="text-xs text-gray-700 dark:text-gray-300">Insights</span>
      </div>
      <div className="flex items-center justify-center gap-1 p-2 bg-white/30 dark:bg-gray-800/30 rounded-lg">
        <Target size={14} className="text-[#076653]" />
        <span className="text-xs text-gray-700 dark:text-gray-300">Goals</span>
      </div>
    </div>
    <button 
      onClick={() => onQuickQuestion("What's my current balance?")}
      className="text-sm bg-gradient-to-r from-[#076653] to-[#076653]/90 text-white px-4 py-2 rounded-xl hover:from-[#076653]/90 hover:to-[#076653] transition-all duration-300 shadow-sm touch-target"
    >
      Get Started
    </button>
  </div>
);

const EnhancedAI = () => {
  const navigate = useNavigate();
  const { transactions, budgets, wallets, error, clearError } = useAppContext();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Hello! I'm your Enhanced Financial AI Assistant.\n\nI can help you:\n• Understand your spending patterns 📊\n• Track your budget status 💰\n• Provide personalized financial advice 🎯\n• Analyze your savings trends 📈\n\nJust ask me anything about your finances! For example:\n\"What's my current balance?\"\n\"Show me my top spending categories\"\n\"Am I on track with my budget?\"",
      sender: 'ai',
      timestamp: new Date(),
      response: null
    },
  ]);
  const [showQuickQuestions, setShowQuickQuestions] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [favoriteQuestions, setFavoriteQuestions] = useState([]);
  const messagesEndRef = useRef(null);

  // Memoize financial calculations for performance
  const financialData = useMemo(() => {
    // Safely handle potentially undefined arrays
    const safeTransactions = Array.isArray(transactions) ? transactions : [];
    const safeBudgets = Array.isArray(budgets) ? budgets : [];
    const safeWallets = Array.isArray(wallets) ? wallets : [];
    
    const expenseTransactions = safeTransactions.filter(t => t && t.type === 'expense');
    const incomeTransactions = safeTransactions.filter(t => t && t.type === 'income');
    
    const totalIncome = incomeTransactions.reduce((sum, t) => sum + (t?.amount || 0), 0);
    const totalExpense = expenseTransactions.reduce((sum, t) => sum + (t?.amount || 0), 0);
    const balance = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100) : 0;
    
    // Expense categories analysis
    const expenseCategories = expenseTransactions.reduce((acc, t) => {
      if (t?.category) {
        acc[t.category] = (acc[t.category] || 0) + (t.amount || 0);
      }
      return acc;
    }, {});
    
    const topCategories = Object.entries(expenseCategories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    // Budget analysis
    const budgetInsights = safeBudgets.map(budget => {
      const actualSpent = expenseTransactions
        .filter(t => t && t.category === budget.category)
        .reduce((sum, t) => sum + (t?.amount || 0), 0);
      
      return {
        category: budget.category || '',
        budget: budget.limit || 0,
        actual: actualSpent,
        utilization: budget.limit > 0 ? ((actualSpent / budget.limit) * 100) : 0,
      };
    });
    
    const overBudgetCategories = budgetInsights.filter(b => b.utilization > 100);
    
    // Wallet analysis
    const totalWalletBalance = safeWallets.reduce((sum, wallet) => sum + (wallet?.balance || 0), 0);
    
    return {
      expenseTransactions,
      incomeTransactions,
      totalIncome,
      totalExpense,
      balance,
      savingsRate,
      expenseCategories,
      topCategories,
      budgetInsights,
      overBudgetCategories,
      totalWalletBalance
    };
  }, [transactions, budgets, wallets]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + K to toggle quick questions
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowQuickQuestions(prev => !prev);
      }
      
      // Escape to close quick questions
      if (e.key === 'Escape') {
        setShowQuickQuestions(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Show automatic insights when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      if (messages.length === 1) { // Only show if no other messages
        // Create a simplified version of the data structure that getFinancialInsights expects
        const insights = getFinancialInsights(
          [...(financialData.expenseTransactions || []), ...(financialData.incomeTransactions || [])], 
          budgets || [], 
          wallets || []
        );
        if (insights) {
          const insightMessage = {
            id: Date.now(),
            text: insights.content,
            sender: 'ai',
            timestamp: new Date(),
            response: insights
          };
          setMessages(prev => [...prev, insightMessage]);
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [financialData, budgets, wallets]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      response: null
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI thinking time
    setTimeout(() => {
      // Create a simplified version of the data structure that getAIResponse expects
      const aiResponse = getAIResponse(
        inputValue, 
        [...(financialData.expenseTransactions || []), ...(financialData.incomeTransactions || [])], 
        budgets || [], 
        wallets || []
      );

      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponse.content,
        sender: 'ai',
        timestamp: new Date(),
        response: aiResponse
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

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
          <div class="sm:hidden mt-16"></div>
      {/* Header within layout */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white">Enhanced Financial AI</h1>
        <button 
          onClick={() => {
            // Reset to initial message
            setMessages([
              {
                id: 1,
                text: "👋 Hello! I'm your Enhanced Financial AI Assistant.\n\nI can help you:\n• Understand your spending patterns 📊\n• Track your budget status 💰\n• Provide personalized financial advice 🎯\n• Analyze your savings trends 📈\n\nJust ask me anything about your finances! For example:\n\"What's my current balance?\"\n\"Show me my top spending categories\"\n\"Am I on track with my budget?\"",
                sender: 'ai',
                timestamp: new Date(),
                response: null
              },
            ]);
          }}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 touch-target"
          aria-label="Clear chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Chat Area - Mobile optimized */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Welcome message for first visit */}
        {messages.length === 1 && <WelcomeMessage onQuickQuestion={(question) => setInputValue(question)} />}
        
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-mobile-subtitle">AI Conversation</h2>
          <span className="text-sm font-medium text-[#076653]">
            {messages.length} messages
          </span>
        </div>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: index * 0.1 }}
            >
              <div
                className={`max-w-[95%] rounded-2xl p-4 backdrop-blur-xl shadow-lg ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-[#076653] to-[#076653]/80 text-white rounded-br-2xl border border-white/10'
                    : 'bg-white/30 dark:bg-gray-800/30 border border-white/30 dark:border-gray-700/30 text-gray-800 dark:text-gray-200 rounded-bl-2xl'
                }`}
              >
                {message.sender === 'ai' && (
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-white/30 to-white/20 border border-white/40 dark:border-gray-700/40 shadow-sm">
                      <Bot size={18} className="text-[#076653]" />
                    </div>
                    <div>
                      <span className="font-bold text-[#076653]">Financial AI Assistant</span>
                      <span className="text-[0.65rem] text-gray-600 dark:text-gray-300 block mt-0.5">
                        {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                )}
                {message.sender === 'user' && (
                  <div className="flex items-center gap-3 mb-3 justify-end">
                    <div>
                      <span className="text-[0.65rem] text-white/90 block text-right mt-0.5">
                        {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                      </span>
                      <span className="font-bold text-white">You</span>
                    </div>
                    <div className="p-2 rounded-xl bg-gradient-to-br from-white/30 to-white/20 border border-white/40 shadow-sm">
                      <User size={18} className="text-white" />
                    </div>
                  </div>
                )}
                <p className={`leading-relaxed whitespace-pre-line ${message.sender === 'user' ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>
                  {message.text}
                </p>
                {message.response && (
                  <StructuredResponse response={message.response} />
                )}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div 
              className="flex justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="max-w-[95%] rounded-2xl rounded-bl-2xl p-4 bg-white/30 dark:bg-gray-800/30 border border-white/30 dark:border-gray-700/30 backdrop-blur-xl shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-white/30 to-white/20 border border-white/40 dark:border-gray-700/40 shadow-sm">
                    <Bot size={18} className="text-[#076653]" />
                  </div>
                  <span className="font-bold text-[#076653]">Financial AI Assistant</span>
                </div>
                <div className="flex space-x-2 mb-2">
                  <div className="w-3 h-3 bg-[#076653] rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-[#076653] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-3 h-3 bg-[#076653] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Analyzing your financial data...</p>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Sticky Input Area - Mobile optimized */}
      <div className="p-3 border-t border-white/20 dark:border-gray-700/20 bg-white/10 dark:bg-gray-800/10 backdrop-blur-2xl sticky bottom-0">
        <form onSubmit={handleSubmit} className="flex gap-2 items-end">
          {/* Quick Questions Button */}
          <div className="relative">
            <div className="relative group">
              <button
                type="button"
                onClick={() => setShowQuickQuestions(!showQuickQuestions)}
                className="p-3 rounded-2xl flex items-center justify-center bg-white/30 dark:bg-gray-800/30 border border-white/40 dark:border-gray-700/40 hover:bg-white/40 dark:hover:bg-gray-800/40 transition-all duration-300 backdrop-blur-2xl shadow-sm touch-target transform hover:scale-105 active:scale-95"
                aria-label="Quick questions (Ctrl+K)"
              >
                <HelpCircle size={18} className="text-[#076653]" />
              </button>
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-20">
                Ctrl+K
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-1 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
            </div>
            
            {/* Quick Questions Dropdown - Mobile optimized */}
            {showQuickQuestions && (
              <div className="absolute bottom-full left-0 mb-2 w-64 bg-gradient-to-br from-white/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-2xl border border-white/60 dark:border-gray-700/60 rounded-2xl shadow-xl z-10">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <HelpCircle size={16} className="text-[#076653]" />
                      Quick Questions
                    </h3>
                    <button 
                      onClick={() => setShowQuickQuestions(false)}
                      className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700/50 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  
                  {/* Favorite Questions */}
                  {favoriteQuestions.length > 0 && (
                    <>
                      <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                        <Star size={12} className="text-yellow-500" />
                        Favorites
                      </h4>
                      <div className="space-y-2 mb-3 max-h-32 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent scrollbar-thumb-rounded-full">
                        {favoriteQuestions.map((question, index) => (
                          <button
                            key={`fav-${index}`}
                            onClick={() => {
                              setInputValue(question);
                              setShowQuickQuestions(false);
                            }}
                            className="text-left text-sm p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-all duration-300 border border-yellow-200 dark:border-yellow-800/50 shadow-sm w-full text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white touch-target flex items-center gap-2"
                          >
                            <Star size={14} className="text-yellow-500 flex-shrink-0" />
                            <span className="truncate">{question}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                  
                  {/* All Questions */}
                  <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">All Questions</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent scrollbar-thumb-rounded-full">
                    {predefinedQuestions.map((question, index) => (
                      <div key={index} className="flex gap-1">
                        <button
                          onClick={() => {
                            setInputValue(question);
                            setShowQuickQuestions(false);
                          }}
                          className="text-left text-sm p-2 rounded-lg bg-white/30 dark:bg-gray-800/30 hover:bg-white/40 dark:hover:bg-gray-800/40 transition-all duration-300 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-sm w-full text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white touch-target flex items-center gap-2"
                        >
                          <span className="text-[#076653] flex-shrink-0">•</span>
                          <span className="truncate">{question}</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Toggle favorite
                            if (favoriteQuestions.includes(question)) {
                              setFavoriteQuestions(fav => fav.filter(q => q !== question));
                            } else {
                              setFavoriteQuestions(fav => [...fav, question]);
                            }
                          }}
                          className="p-2 rounded-lg bg-white/30 dark:bg-gray-800/30 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-all duration-300 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-sm flex-shrink-0"
                          aria-label="Toggle favorite"
                        >
                          <Star 
                            size={14} 
                            className={`${favoriteQuestions.includes(question) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} 
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Ask about your finances..."
              className="w-full input-mobile bg-white/30 dark:bg-gray-800/30 backdrop-blur-2xl border border-white/40 dark:border-gray-700/40 rounded-2xl pl-4 pr-10 py-3.5 text-gray-800 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#076653]/50 focus:border-[#076653] transition-all duration-300 touch-target shadow-sm"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
              <Sparkles size={16} className="animate-pulse" />
            </div>
          </div>
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="btn-mobile btn-mobile-primary p-3 rounded-2xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 bg-gradient-to-r from-[#076653] to-[#076653]/90 hover:from-[#076653]/90 hover:to-[#076653] border border-white/40 backdrop-blur-2xl shadow-lg touch-target-large transform hover:scale-105 active:scale-95"
          >
            <Send size={18} className="text-white" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default EnhancedAI;