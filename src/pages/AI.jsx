import { formatDistanceToNow } from 'date-fns';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Send, 
  Loader2, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PieChart,
  BarChart3,
  Calendar,
  DollarSign,
  Target,
  User,
  HelpCircle,
  X,
  AlertTriangle,
  CheckCircle,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
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

  // Handle different question types with enhanced responses
  if (lowerQuestion.includes('balance') || lowerQuestion.includes('net worth')) {
    const status = balance >= 0 ? 'positive' : 'negative';
    return `💰 Your current financial status:

• Net Balance: $${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
• Total Income: $${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
• Total Expenses: $${totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}

You have a ${status} cash flow. ${status === 'positive' ? 'Great job managing your finances!' : 'Consider reviewing your expenses to improve your financial health.'}`;
  }

  if (lowerQuestion.includes('spend') || lowerQuestion.includes('expense') || lowerQuestion.includes('categories')) {
    if (topCategories.length === 0) {
      return '📊 You haven\'t recorded any expenses yet. Start tracking your spending to get insights!';
    }
    
    const categoryList = topCategories
      .map(([category, amount], index) => `${index + 1}. ${category}: $${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)
      .join('\n');
    
    return `📊 Your top spending categories:

${categoryList}

Would you like to see more details about any specific category or get tips on reducing expenses in these areas?`;
  }

  if (lowerQuestion.includes('budget') || lowerQuestion.includes('limit')) {
    if (budgets.length === 0) {
      return '🎯 You haven\'t set up any budgets yet. Setting budgets can help you control your spending and achieve your financial goals. Would you like to create your first budget?';
    }
    
    if (overBudgetCategories.length > 0) {
      const categoryList = overBudgetCategories
        .map(b => `• ${b.category}: ${b.utilization.toFixed(1)}% (${b.actual > b.budget ? '$' + (b.actual - b.budget).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''} over budget)`)
        .join('\n');
      return `⚠️ Budget Alert!

You're over budget in:
${categoryList}

Consider reviewing these categories to get back on track. Would you like specific suggestions for reducing spending in these areas?`;
    } else if (underBudgetCategories.length > 0) {
      const categoryList = underBudgetCategories
        .map(b => `• ${b.category}: ${b.utilization.toFixed(1)}%`)
        .join('\n');
      return `✅ Great Job!

You're under budget in:
${categoryList}

You might consider reallocating some of these funds to categories where you're overspending or toward your savings goals.`;
    } else {
      return '🎯 Your budgets are well balanced. All categories are within healthy utilization ranges (20%-100%). Keep up the good work!';
    }
  }

  if (lowerQuestion.includes('save') || lowerQuestion.includes('savings')) {
    const status = savingsRate >= 20 ? 'excellent' : savingsRate >= 10 ? 'good' : 'needs improvement';
    return `🏦 Savings Analysis:

• Current Savings Rate: ${savingsRate.toFixed(1)}%
• Monthly Savings: $${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
• Total Wallet Balance: $${totalWalletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}

Your savings rate is ${status}. ${savingsRate < 10 ? 'Try to increase your savings by reducing discretionary spending.' : savingsRate >= 20 ? 'Consider investing some of these savings for long-term growth.' : 'You\'re on the right track with your savings.'}`;
  }

  if (lowerQuestion.includes('wallet') || lowerQuestion.includes('assets')) {
    return `💳 Wallet Summary:

• Total Wallet Balance: $${totalWalletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
• Number of Wallets: ${wallets.length}

It's recommended to keep an emergency fund covering 3-6 months of expenses. Your current emergency fund status: ${totalWalletBalance >= totalExpense * 3 ? '✅ Sufficient' : '⚠️ Needs improvement'}.`;
  }

  if (lowerQuestion.includes('trend') || lowerQuestion.includes('monthly') || lowerQuestion.includes('pattern')) {
    if (recentSpending.length === 0) {
      return '📈 You haven\'t recorded any expenses yet. Start tracking your spending to see monthly trends!';
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
    
    return `📈 Recent Monthly Spending Trends:

${trendList}

Your spending is ${trendDirection}. ${trendDirection === 'increasing' ? 'Consider reviewing your expenses to identify areas for reduction.' : trendDirection === 'decreasing' ? 'Great job controlling your spending!' : 'Your spending is stable.'}`;
  }

  if (lowerQuestion.includes('tip') || lowerQuestion.includes('advice') || lowerQuestion.includes('recommend')) {
    const tips = [];
    
    if (balance < 0) {
      tips.push('📉 Your expenses are exceeding your income. Try to identify discretionary spending that can be reduced.');
    } else if (savingsRate < 10) {
      tips.push('💡 Try to increase your savings rate to at least 10% of your income. Look for areas where you can cut back on non-essential expenses.');
    } else if (savingsRate >= 20) {
      tips.push('🎉 Excellent savings rate! Consider investing some of these savings for long-term growth.');
    }
    
    if (volatility > totalExpense * 0.1) {
      tips.push('⚡ Your spending varies significantly. Creating a consistent budget may help stabilize your expenses.');
    }
    
    if (overBudgetCategories.length > 0) {
      tips.push('⚠️ You\'re over budget in some categories. Review these areas to get back on track.');
    }
    
    if (tips.length === 0) {
      tips.push('✅ You\'re on the right track with your finances. Consider setting specific financial goals to help guide your saving and investment decisions.');
    }
    
    const tipsList = tips.map((tip, index) => `${index + 1}. ${tip}`).join('\n\n');
    return `🎯 Personalized Financial Tips:

${tipsList}

Would you like more detailed advice on any of these points?`;
  }

  if (lowerQuestion.includes('invest') || lowerQuestion.includes('growth')) {
    return `📈 Investment Guidance:

• Current Savings: $${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
• Savings Rate: ${savingsRate.toFixed(1)}%

Consider diversifying your investments across different asset classes. A common recommendation is the 100-minus-age rule for stock allocation. For example, if you're 30, consider allocating 70% to stocks and 30% to bonds.

Before investing, ensure you have:
1. Emergency fund (3-6 months expenses)
2. No high-interest debt
3. Clear financial goals

Would you like specific investment recommendations based on your risk tolerance?`;
  }

  if (lowerQuestion.includes('emergency') || lowerQuestion.includes('fund')) {
    const recommendedFund = totalExpense * 3; // 3 months of expenses
    const fundStatus = totalWalletBalance >= recommendedFund 
      ? '✅ You have sufficient emergency funds.' 
      : `⚠️ Consider building your emergency fund to $${recommendedFund.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}, which covers 3 months of expenses.`;
    return `🚨 Emergency Fund Status:

• Current Emergency Fund: $${totalWalletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
• Recommended Amount: $${recommendedFund.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}

${fundStatus}

An emergency fund is crucial for financial security. It should cover 3-6 months of essential expenses and be kept in a liquid, easily accessible account.`;
  }

  // Default response with more helpful suggestions
  return `🤔 I can help you with questions about your balance, spending habits, budget status, savings rate, financial advice, monthly trends, investment tips, and emergency funds.

Try asking me:
• "What's my current balance?"
• "Show me my spending by category"
• "Am I on track with my budget?"
• "How can I save more money?"
• "What are my top expenses this month?"
• "Do I have enough emergency funds?"

I'm here to help you take control of your finances! 💰`;
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
    insights.push(`📊 Your biggest expense category is ${biggestCategory[0]} ($${biggestCategory[1].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`);
  }
  
  if (overBudgetCategories.length > 0) {
    const categoryList = overBudgetCategories
      .map(b => b.category + ' (' + b.utilization.toFixed(1) + '%)' )
      .join(', ');
    insights.push(`⚠️ Over budget in: ${categoryList}. Review these categories.`);
  }
  
  if (insights.length > 0) {
    const insightsList = insights.join('\n\n');
    return `💡 Here are some insights I noticed:

${insightsList}

Would you like me to explain any of these insights in more detail?`;
  }
  
  return null;
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

const AI = () => {
  const { transactions, budgets, wallets, error, clearError } = useAppContext();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: '👋 Hello! I\'m your Financial AI Assistant.\n\nI can help you:\n• Understand your spending patterns 📊\n• Track your budget status 💰\n• Provide personalized financial advice 🎯\n• Analyze your savings trends 📈\n\nJust ask me anything about your finances! For example:\n"What\'s my current balance?"\n"Show me my top spending categories"\n"Am I on track with my budget?"',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [showInsights, setShowInsights] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Show automatic insights when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      if (messages.length === 1) { // Only show if no other messages
        const insights = getFinancialInsights(transactions, budgets, wallets);
        if (insights) {
          const insightMessage = {
            id: Date.now(),
            text: insights,
            sender: 'ai',
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, insightMessage]);
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [transactions, budgets, wallets]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = getAIResponse(inputValue, transactions, budgets, wallets);

      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
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
    <div className="p-2 sm:p-3 md:p-4 lg:p-5 space-y-3 sm:space-y-4 md:space-y-5 fade-in">
      {/* Mobile-specific spacing adjustments */}
      <div className="sm:hidden mt-14"></div>
      
      {/* Minimal Header */}
      <div className="rounded-xl sm:rounded-2xl bg-white/80 dark:bg-gray-800/60 p-3 sm:p-4 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 rounded-lg bg-[#076653]/10">
            <Bot className="text-[#076653]" size={20} />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Financial AI Assistant</h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Ask about your finances</p>
          </div>
        </div>
      </div>

      {/* Full Screen Chat Area */}
      <div className="rounded-xl sm:rounded-2xl bg-white/80 dark:bg-gray-800/60 p-3 sm:p-4 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">AI Conversation</h2>
          <span className="text-xs sm:text-sm font-medium text-[#076653]">
            {messages.length} messages
          </span>
        </div>
        <div className="space-y-3 sm:space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: index * 0.1 }}
            >
              <div
                className={`max-w-[95%] sm:max-w-[90%] md:max-w-[85%] rounded-xl sm:rounded-2xl p-2.5 sm:p-3 backdrop-blur-2xl ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-[#076653] to-[#076653]/80 text-white rounded-br-lg sm:rounded-br-xl shadow-md sm:shadow-lg border border-white/10'
                    : 'bg-white/20 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700/20 text-gray-800 dark:text-gray-200 rounded-bl-lg sm:rounded-bl-xl shadow-md sm:shadow-lg'
                }`}
              >
                {message.sender === 'ai' && (
                  <div className="flex items-center gap-2 sm:gap-3 mb-3">
                    <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white/20 border border-white/20 shadow-md">
                      <Bot size={16} className="text-[#076653] sm:size-20" />
                    </div>
                    <div>
                      <span className="font-bold text-[#076653] text-sm sm:text-base">Financial AI Assistant</span>
                      <span className="text-[0.65rem] sm:text-xs text-gray-600 dark:text-gray-300 block mt-0.5">
                        {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                )}
                {message.sender === 'user' && (
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 justify-end">
                    <div>
                      <span className="text-[0.65rem] sm:text-xs text-white/90 block text-right mt-0.5">
                        {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                      </span>
                      <span className="font-bold text-white text-sm sm:text-base">You</span>
                    </div>
                    <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white/20 border border-white/20 shadow-md">
                      <User size={16} className="text-white sm:size-20" />
                    </div>
                  </div>
                )}
                <p className={`text-sm sm:text-base leading-relaxed whitespace-pre-line ${message.sender === 'user' ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>
                  {message.text}
                </p>
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
              <div className="max-w-[95%] sm:max-w-[90%] md:max-w-[85%] rounded-xl sm:rounded-2xl rounded-bl-lg sm:rounded-bl-xl p-2.5 sm:p-3 bg-white/20 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700/20 backdrop-blur-2xl shadow-md sm:shadow-lg">
                <div className="flex items-center gap-2 sm:gap-3 mb-3">
                  <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white/20 border border-white/20 shadow-md">
                    <Bot size={16} className="text-[#076653] sm:size-20" />
                  </div>
                  <span className="font-bold text-[#076653] text-sm sm:text-base">Financial AI Assistant</span>
                </div>
                <div className="flex space-x-1.5 sm:space-x-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-[#076653] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-[#076653] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-[#076653] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Sticky Input Area */}
      <div className="p-2 sm:p-3 border-t border-white/20 dark:border-gray-700/20 bg-white/10 dark:bg-gray-800/10 backdrop-blur-2xl sticky bottom-0">
        <form onSubmit={handleSubmit} className="flex gap-1.5 sm:gap-2 items-end">
          {/* Quick Questions Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowQuickQuestions(!showQuickQuestions)}
              className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl flex items-center justify-center bg-white/20 dark:bg-gray-800/20 border border-white/20 hover:bg-white/30 transition-all duration-300"
            >
              <HelpCircle size={16} className="text-[#076653] sm:size-20" />
            </button>
            
            {/* Quick Questions Dropdown */}
            {showQuickQuestions && (
              <div className="absolute bottom-full left-0 mb-1.5 sm:mb-2 w-56 sm:w-64 bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl shadow-lg z-10">
                <div className="p-2.5 sm:p-3">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-white">Quick Questions</h3>
                    <button 
                      onClick={() => setShowQuickQuestions(false)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <X size={14} className="sm:size-16" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5 sm:gap-2 max-h-48 sm:max-h-60 overflow-y-auto">
                    {predefinedQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setInputValue(question);
                          setShowQuickQuestions(false);
                        }}
                        className="text-left text-xs sm:text-sm p-2 rounded-lg sm:rounded-xl bg-white/20 dark:bg-gray-800/20 hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-300"
                      >
                        {question}
                      </button>
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
              className="w-full input-text bg-white/20 dark:bg-gray-800/20 backdrop-blur-2xl border border-white/20 dark:border-gray-700/20 rounded-xl sm:rounded-2xl pl-3 sm:pl-4 pr-10 sm:pr-12 py-2.5 sm:py-3 text-gray-800 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#076653]/40 focus:border-[#076653] transition-all duration-300"
              disabled={isLoading}
            />
            <div className="absolute right-2.5 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
              <Sparkles size={14} className="animate-pulse sm:size-18" />
            </div>
          </div>
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="btn btn-primary p-2.5 sm:p-3 rounded-xl sm:rounded-2xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 bg-gradient-to-r from-[#076653] to-[#076653]/90 hover:from-[#076653]/90 hover:to-[#076653] border border-white/20"
          >
            <Send size={16} className="text-white sm:size-20" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AI;