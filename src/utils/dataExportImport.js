/**
 * Data Export/Import Utilities for Expense Tracker
 * Provides functionality for backing up and restoring user data
 */

/**
 * Export all user data to JSON format
 * @param {Object} userData - User data object containing all financial information
 * @returns {String} JSON string of user data
 */
export const exportUserData = (userData) => {
  const exportData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    ...userData
  };
  
  return JSON.stringify(exportData, null, 2);
};

/**
 * Import user data from JSON format
 * @param {String} jsonString - JSON string of user data
 * @returns {Object} Parsed user data object
 */
export const importUserData = (jsonString) => {
  try {
    const parsedData = JSON.parse(jsonString);
    
    // Validate data structure
    if (!parsedData.version || !parsedData.exportDate) {
      throw new Error('Invalid data format: missing version or export date');
    }
    
    // Validate required data structures
    const requiredFields = ['accounts', 'transactions', 'budgets', 'categories'];
    for (const field of requiredFields) {
      if (!Array.isArray(parsedData[field])) {
        throw new Error(`Invalid data format: ${field} should be an array`);
      }
    }
    
    return parsedData;
  } catch (error) {
    throw new Error(`Failed to parse import data: ${error.message}`);
  }
};

/**
 * Export data to file
 * @param {String} data - Data to export
 * @param {String} filename - Filename for export
 */
export const exportToFile = (data, filename) => {
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
};

/**
 * Import data from file
 * @param {File} file - File to import
 * @returns {Promise<Object>} Promise that resolves to parsed user data
 */
export const importFromFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const data = importUserData(event.target.result);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Generate backup filename
 * @param {String} prefix - Prefix for filename
 * @returns {String} Generated filename
 */
export const generateBackupFilename = (prefix = 'expense-tracker-backup') => {
  const date = new Date();
  const dateString = date.toISOString().split('T')[0];
  const timeString = date.toTimeString().split(' ')[0].replace(/:/g, '-');
  
  return `${prefix}-${dateString}-${timeString}.json`;
};

/**
 * Validate backup data integrity
 * @param {Object} data - Backup data to validate
 * @returns {Object} Validation result
 */
export const validateBackupData = (data) => {
  const result = {
    isValid: true,
    errors: [],
    warnings: []
  };
  
  // Check required fields
  const requiredFields = ['accounts', 'transactions', 'budgets', 'categories'];
  for (const field of requiredFields) {
    if (!Object.prototype.hasOwnProperty.call(data, field)) {
      result.isValid = false;
      result.errors.push(`Missing required field: ${field}`);
    } else if (!Array.isArray(data[field])) {
      result.isValid = false;
      result.errors.push(`Field ${field} should be an array`);
    }
  }
  
  // Validate accounts
  if (Array.isArray(data.accounts)) {
    data.accounts.forEach((account, index) => {
      if (!account.id) {
        result.warnings.push(`Account ${index} missing ID`);
      }
      if (typeof account.balance !== 'number') {
        result.warnings.push(`Account ${account.name || index} has invalid balance`);
      }
    });
  }
  
  // Validate transactions
  if (Array.isArray(data.transactions)) {
    data.transactions.forEach((transaction, index) => {
      if (!transaction.id) {
        result.warnings.push(`Transaction ${index} missing ID`);
      }
      if (!transaction.date) {
        result.warnings.push(`Transaction ${transaction.description || index} missing date`);
      }
      if (typeof transaction.amount !== 'number') {
        result.warnings.push(`Transaction ${transaction.description || index} has invalid amount`);
      }
      if (!['income', 'expense', 'transfer'].includes(transaction.type)) {
        result.warnings.push(`Transaction ${transaction.description || index} has invalid type`);
      }
    });
  }
  
  // Validate budgets
  if (Array.isArray(data.budgets)) {
    data.budgets.forEach((budget, index) => {
      if (!budget.id) {
        result.warnings.push(`Budget ${index} missing ID`);
      }
      if (!budget.category) {
        result.warnings.push(`Budget ${index} missing category`);
      }
      if (typeof budget.amount !== 'number') {
        result.warnings.push(`Budget ${budget.category || index} has invalid amount`);
      }
    });
  }
  
  return result;
};

/**
 * Merge imported data with existing data
 * @param {Object} existingData - Existing user data
 * @param {Object} importedData - Imported user data
 * @param {Object} options - Merge options
 * @returns {Object} Merged data
 */
export const mergeImportedData = (existingData, importedData, options = {}) => {
  const mergeOptions = {
    overwrite: false,
    mergeDuplicates: true,
    ...options
  };
  
  const mergedData = { ...existingData };
  
  // Merge accounts
  if (Array.isArray(importedData.accounts)) {
    if (mergeOptions.overwrite) {
      mergedData.accounts = importedData.accounts;
    } else {
      const existingAccountIds = new Set(existingData.accounts.map(a => a.id));
      const newAccounts = importedData.accounts.filter(a => !existingAccountIds.has(a.id));
      mergedData.accounts = [...existingData.accounts, ...newAccounts];
    }
  }
  
  // Merge transactions
  if (Array.isArray(importedData.transactions)) {
    if (mergeOptions.overwrite) {
      mergedData.transactions = importedData.transactions;
    } else {
      const existingTransactionIds = new Set(existingData.transactions.map(t => t.id));
      const newTransactions = importedData.transactions.filter(t => !existingTransactionIds.has(t.id));
      mergedData.transactions = [...existingData.transactions, ...newTransactions];
    }
  }
  
  // Merge budgets
  if (Array.isArray(importedData.budgets)) {
    if (mergeOptions.overwrite) {
      mergedData.budgets = importedData.budgets;
    } else {
      // For budgets, we might want to update existing ones or add new ones
      const existingBudgetCategories = new Set(existingData.budgets.map(b => b.category));
      const newBudgets = importedData.budgets.filter(b => !existingBudgetCategories.has(b.category));
      const updatedBudgets = importedData.budgets.filter(b => existingBudgetCategories.has(b.category));
      
      // Update existing budgets if mergeDuplicates is true
      let finalBudgets = [...existingData.budgets];
      if (mergeOptions.mergeDuplicates) {
        updatedBudgets.forEach(importedBudget => {
          const existingIndex = finalBudgets.findIndex(b => b.category === importedBudget.category);
          if (existingIndex !== -1) {
            finalBudgets[existingIndex] = { ...finalBudgets[existingIndex], ...importedBudget };
          }
        });
      }
      
      mergedData.budgets = [...finalBudgets, ...newBudgets];
    }
  }
  
  // Merge categories
  if (Array.isArray(importedData.categories)) {
    if (mergeOptions.overwrite) {
      mergedData.categories = importedData.categories;
    } else {
      const existingCategoryIds = new Set(existingData.categories.map(c => c.id));
      const newCategories = importedData.categories.filter(c => !existingCategoryIds.has(c.id));
      mergedData.categories = [...existingData.categories, ...newCategories];
    }
  }
  
  return mergedData;
};

export default {
  exportUserData,
  importUserData,
  exportToFile,
  importFromFile,
  generateBackupFilename,
  validateBackupData,
  mergeImportedData
};