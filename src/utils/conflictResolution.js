/**
 * Conflict Resolution Utilities for Offline Data Synchronization
 */

/**
 * Resolve conflicts between local and remote data based on timestamps
 * @param {Object} localData - Local data item
 * @param {Object} remoteData - Remote data item
 * @returns {Object} Resolved data item
 */
export const resolveConflictByTimestamp = (localData, remoteData) => {
  // If one doesn't have a timestamp, prefer the one with timestamp
  if (!localData.updated_at && !remoteData.updated_at) {
    // Both lack timestamps, prefer remote data
    return remoteData;
  }
  
  if (!localData.updated_at) {
    return remoteData;
  }
  
  if (!remoteData.updated_at) {
    return localData;
  }
  
  // Compare timestamps and return the newer one
  const localTime = new Date(localData.updated_at).getTime();
  const remoteTime = new Date(remoteData.updated_at).getTime();
  
  return localTime > remoteTime ? localData : remoteData;
};

/**
 * Resolve conflicts for transactions
 * @param {Object} localTransaction - Local transaction
 * @param {Object} remoteTransaction - Remote transaction
 * @returns {Object} Resolved transaction
 */
export const resolveTransactionConflict = (localTransaction, remoteTransaction) => {
  // For transactions, we typically want to preserve both but mark duplicates
  // Check if they are essentially the same transaction
  const isDuplicate = 
    localTransaction.description === remoteTransaction.description &&
    localTransaction.amount === remoteTransaction.amount &&
    localTransaction.category === remoteTransaction.category &&
    localTransaction.type === remoteTransaction.type &&
    Math.abs(new Date(localTransaction.date).getTime() - new Date(remoteTransaction.date).getTime()) < 60000; // Within 1 minute
  
  if (isDuplicate) {
    // Prefer the one with more complete data
    if (remoteTransaction.user_id && !localTransaction.user_id) {
      return remoteTransaction;
    }
    return localTransaction;
  }
  
  // Not duplicates, resolve by timestamp
  return resolveConflictByTimestamp(localTransaction, remoteTransaction);
};

/**
 * Resolve conflicts for wallets/accounts
 * @param {Object} localWallet - Local wallet
 * @param {Object} remoteWallet - Remote wallet
 * @returns {Object} Resolved wallet
 */
export const resolveWalletConflict = (localWallet, remoteWallet) => {
  // For wallets, the balance is critical
  // We need to be careful about which balance to use
  const resolved = resolveConflictByTimestamp(localWallet, remoteWallet);
  
  // If local was chosen but remote has a more recent balance update,
  // we might want to use the remote balance
  if (resolved.id === localWallet.id) {
    // Check if remote has a more recent balance update
    if (remoteWallet.balance_updated_at && localWallet.balance_updated_at) {
      const localBalanceTime = new Date(localWallet.balance_updated_at).getTime();
      const remoteBalanceTime = new Date(remoteWallet.balance_updated_at).getTime();
      
      if (remoteBalanceTime > localBalanceTime) {
        // Use remote balance but keep local metadata
        return {
          ...localWallet,
          balance: remoteWallet.balance,
          balance_updated_at: remoteWallet.balance_updated_at
        };
      }
    }
  }
  
  return resolved;
};

/**
 * Resolve conflicts for budgets
 * @param {Object} localBudget - Local budget
 * @param {Object} remoteBudget - Remote budget
 * @returns {Object} Resolved budget
 */
export const resolveBudgetConflict = (localBudget, remoteBudget) => {
  // For budgets, we care about the limit and spending
  return resolveConflictByTimestamp(localBudget, remoteBudget);
};

/**
 * Merge arrays of data with conflict resolution
 * @param {Array} localData - Local data array
 * @param {Array} remoteData - Remote data array
 * @param {Function} conflictResolver - Function to resolve conflicts between items
 * @param {String} idField - Field to use as ID (default: 'id')
 * @returns {Array} Merged data array
 */
export const mergeDataWithConflictResolution = (localData, remoteData, conflictResolver, idField = 'id') => {
  const merged = [];
  const localMap = new Map(localData.map(item => [item[idField], item]));
  const remoteMap = new Map(remoteData.map(item => [item[idField], item]));
  
  // Process all unique IDs
  const allIds = new Set([...localMap.keys(), ...remoteMap.keys()]);
  
  for (const id of allIds) {
    const localItem = localMap.get(id);
    const remoteItem = remoteMap.get(id);
    
    if (localItem && remoteItem) {
      // Conflict - both have this item
      const resolved = conflictResolver(localItem, remoteItem);
      merged.push(resolved);
    } else if (localItem) {
      // Only local has this item
      merged.push(localItem);
    } else {
      // Only remote has this item
      merged.push(remoteItem);
    }
  }
  
  return merged;
};

/**
 * Detect and mark potential conflicts without resolving them
 * @param {Array} localData - Local data array
 * @param {Array} remoteData - Remote data array
 * @param {String} idField - Field to use as ID (default: 'id')
 * @returns {Object} Object containing conflicts and nonConflicts
 */
export const detectConflicts = (localData, remoteData, idField = 'id') => {
  const conflicts = [];
  const localMap = new Map(localData.map(item => [item[idField], item]));
  const remoteMap = new Map(remoteData.map(item => [item[idField], item]));
  
  // Find items that exist in both arrays (potential conflicts)
  const commonIds = [...localMap.keys()].filter(id => remoteMap.has(id));
  
  for (const id of commonIds) {
    const localItem = localMap.get(id);
    const remoteItem = remoteMap.get(id);
    
    // Add to conflicts array
    conflicts.push({
      id,
      local: localItem,
      remote: remoteItem
    });
  }
  
  return {
    conflicts,
    localOnly: localData.filter(item => !remoteMap.has(item[idField])),
    remoteOnly: remoteData.filter(item => !localMap.has(item[idField]))
  };
};

export default {
  resolveConflictByTimestamp,
  resolveTransactionConflict,
  resolveWalletConflict,
  resolveBudgetConflict,
  mergeDataWithConflictResolution,
  detectConflicts
};