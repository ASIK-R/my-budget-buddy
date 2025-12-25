import { format, parseISO } from 'date-fns';

const formatTransactionsForPeriod = (type, transactions) => {
  const now = new Date();
  return transactions.filter((transaction) => {
    const date = parseISO(transaction.date);
    if (type === 'monthly') {
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }
    if (type === 'annual') {
      return date.getFullYear() === now.getFullYear();
    }
    return true;
  });
};

// Export transactions to CSV
export const downloadTransactionsReport = (type, transactions = []) => {
  if (transactions.length === 0) {
    alert('No transactions available for export yet.');
    return;
  }

  const filtered = formatTransactionsForPeriod(type, transactions);
  if (filtered.length === 0) {
    alert('No transactions found for the selected period.');
    return;
  }

  const header = ['Date', 'Description', 'Category', 'Type', 'Amount', 'From Wallet', 'To Wallet'];
  const rows = filtered.map((transaction) => [
    format(parseISO(transaction.date), 'yyyy-MM-dd'),
    transaction.description,
    transaction.category,
    transaction.type,
    transaction.amount,
    transaction.fromWallet || '',
    transaction.toWallet || ''
  ]);

  const csvContent = [header, ...rows]
    .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  const timestamp = format(new Date(), 'yyyyMMdd-HHmm');
  link.download = `expense-tracker-transactions-${type}-report-${timestamp}.csv`;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Export budgets to CSV
export const downloadBudgetsReport = (budgets = []) => {
  if (budgets.length === 0) {
    alert('No budgets available for export.');
    return;
  }

  const header = ['Category', 'Budget Limit', 'Created At'];
  const rows = budgets.map((budget) => [
    budget.category,
    budget.limit,
    budget.createdAt || new Date().toISOString()
  ]);

  const csvContent = [header, ...rows]
    .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  const timestamp = format(new Date(), 'yyyyMMdd-HHmm');
  link.download = `expense-tracker-budgets-report-${timestamp}.csv`;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Export wallets to CSV
export const downloadWalletsReport = (wallets = []) => {
  if (wallets.length === 0) {
    alert('No wallets available for export.');
    return;
  }

  const header = ['Name', 'Type', 'Balance', 'Initial Balance', 'Created At', 'Updated At'];
  const rows = wallets.map((wallet) => [
    wallet.name,
    wallet.type,
    wallet.balance,
    wallet.initialBalance,
    wallet.createdAt,
    wallet.updatedAt
  ]);

  const csvContent = [header, ...rows]
    .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  const timestamp = format(new Date(), 'yyyyMMdd-HHmm');
  link.download = `expense-tracker-wallets-report-${timestamp}.csv`;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Export all data as a comprehensive report
export const downloadComprehensiveReport = (transactions = [], budgets = [], wallets = []) => {
  if (transactions.length === 0 && budgets.length === 0 && wallets.length === 0) {
    alert('No data available for export.');
    return;
  }

  let csvContent = '';

  // Add transactions section
  if (transactions.length > 0) {
    csvContent += 'TRANSACTIONS\n';
    const transactionHeader = ['Date', 'Description', 'Category', 'Type', 'Amount', 'From Wallet', 'To Wallet'];
    const transactionRows = transactions.map((transaction) => [
      format(parseISO(transaction.date), 'yyyy-MM-dd'),
      transaction.description,
      transaction.category,
      transaction.type,
      transaction.amount,
      transaction.fromWallet || '',
      transaction.toWallet || ''
    ]);
    
    csvContent += [transactionHeader, ...transactionRows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    csvContent += '\n\n';
  }

  // Add budgets section
  if (budgets.length > 0) {
    csvContent += 'BUDGETS\n';
    const budgetHeader = ['Category', 'Budget Limit', 'Created At'];
    const budgetRows = budgets.map((budget) => [
      budget.category,
      budget.limit,
      budget.createdAt || new Date().toISOString()
    ]);
    
    csvContent += [budgetHeader, ...budgetRows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    csvContent += '\n\n';
  }

  // Add wallets section
  if (wallets.length > 0) {
    csvContent += 'WALLETS\n';
    const walletHeader = ['Name', 'Type', 'Balance', 'Initial Balance', 'Created At', 'Updated At'];
    const walletRows = wallets.map((wallet) => [
      wallet.name,
      wallet.type,
      wallet.balance,
      wallet.initialBalance,
      wallet.createdAt,
      wallet.updatedAt
    ]);
    
    csvContent += [walletHeader, ...walletRows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    csvContent += '\n\n';
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  const timestamp = format(new Date(), 'yyyyMMdd-HHmm');
  link.download = `expense-tracker-comprehensive-report-${timestamp}.csv`;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};