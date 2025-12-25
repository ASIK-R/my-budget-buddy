import { format } from 'date-fns';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  clearExpiredCacheEntries,
  getSetting,
  initDB,
  loadFromDB,
  saveSetting,
  saveToDB,
} from '../utils/db';
import { fetchFromSheets, syncWithSheets } from '../utils/googleSheets';
import { getCurrentUser, onAuthStateChange, signOut as authLogout } from '../utils/supabaseAuth';
import { supabase } from '../utils/supabaseClient';
import * as supabaseDB from '../utils/supabaseDB';
import { mergeDataWithConflictResolution, resolveTransactionConflict, resolveWalletConflict, resolveBudgetConflict } from '../utils/conflictResolution';
import OfflineQueueManager from '../utils/offlineQueueManager';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSynced, setIsSynced] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionModalType, setTransactionModalType] = useState(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [settings, setSettings] = useState({});
  const [appInitialized, setAppInitialized] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Initialize offline queue manager
  const offlineQueueManager = useMemo(() => new OfflineQueueManager({
    maxRetries: 3,
    retryDelay: 1000,
    backoffMultiplier: 2,
    maxRetryDelay: 30000
  }), []);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      console.log('Browser went online');
      setIsOnline(true);
      processOfflineQueue();
    };
    
    const handleOffline = () => {
      console.log('Browser went offline');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Monitor window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const subscription = onAuthStateChange((event, session) => {
      console.log('Auth state changed:', { event, session });
      if (event === 'SIGNED_IN') {
        console.log('User signed in:', session.user);
        setUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      if (typeof subscription === 'function') {
        subscription();
      } else if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    console.log('User effect triggered:', { user });
    if (user) {
      console.log('Initializing DB for user:', user.id);
      initDB().then(() => {
        console.log('DB initialized successfully');
        // Load all data stores separately
        Promise.all([
          loadFromDB('accounts'),
          loadFromDB('budgets'),
          loadFromDB('categories'),
          loadFromDB('transactions'),
          loadFromDB('transfers'),
          loadFromDB('settings')
        ]).then(([accounts, budgets, categories, transactions, transfers, settings]) => {
          console.log('Data loaded:', { accounts, categories, transactions, transfers, settings });
          setAccounts(accounts || []);
          setBudgets(budgets || []);
          setCategories(categories || []);
          setTransactions(transactions || []);
          setTransfers(transfers || []);
          setSettings(settings || {});
          setAppInitialized(true);
          console.log('App initialized successfully');
           
          // Set up real-time subscriptions after data is loaded (only if Supabase is configured)
          if (supabase) {
            setupRealTimeSubscriptions();
          }
        }).catch((error) => {
          console.error('Failed to load data:', error);
          setError('Failed to load your financial data. Please try refreshing the page.');
          // Set some default data to prevent blank screen
          setAccounts([]);
          setBudgets([]);
          setCategories([]);
          setTransactions([]);
          setTransfers([]);
          setSettings({});
          setAppInitialized(true); // Still set to true to prevent infinite loading
        });
      }).catch((error) => {
        console.error('Failed to initialize DB:', error);
        setError('Failed to initialize the application database. Please try refreshing the page.');
        // Set some default data to prevent blank screen
        setAccounts([]);
        setBudgets([]);
        setCategories([]);
        setTransactions([]);
        setTransfers([]);
        setSettings({});
        setAppInitialized(true); // Still set to true to prevent infinite loading
      });
    } else {
      // For demo purposes, we'll set appInitialized to true even without user
      console.log('No user, setting app as initialized');
      // Set some default data to prevent blank screen
      setAccounts([]);
      setBudgets([]);
      setCategories([]);
      setTransactions([]);
      setTransfers([]);
      setSettings({});
      setAppInitialized(true);
      
      // Also ensure we don't get stuck in loading state
      setIsLoading(false);
    }
  }, [user]);
  
  // Add a safety timeout to ensure appInitialized is set to true
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!appInitialized) {
        console.log('Safety timeout: forcing appInitialized to true');
        setAccounts([]);
        setBudgets([]);
        setCategories([]);
        setTransactions([]);
        setTransfers([]);
        setSettings({});
        setAppInitialized(true);
        setIsLoading(false);
      }
    }, 5000); // 5 second timeout
    
    return () => clearTimeout(timeout);
  }, [appInitialized]);

  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        clearExpiredCacheEntries(user?.id || 'local-user');
      }, 1000 * 60 * 60 * 24); // Clear cache every 24 hours

      return () => clearInterval(interval);
    }
  }, [user]);

  // Set up real-time subscriptions
  const setupRealTimeSubscriptions = useCallback(() => {
    // Only set up subscriptions if Supabase is configured and we have a user
    if (!supabase || !user) return;

    console.log('Setting up real-time subscriptions');

    // Subscribe to wallet changes
    const walletSubscription = supabase
      .channel('wallet-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wallets',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Wallet change detected:', payload);
          fetchAccounts();
        }
      )
      .subscribe();

    // Subscribe to transaction changes
    const transactionSubscription = supabase
      .channel('transaction-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Transaction change detected:', payload);
          fetchTransactions();
        }
      )
      .subscribe();

    // Subscribe to budget changes
    const budgetSubscription = supabase
      .channel('budget-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'budgets',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Budget change detected:', payload);
          fetchBudgets();
        }
      )
      .subscribe();

    // Cleanup function
    return () => {
      if (walletSubscription?.unsubscribe) walletSubscription.unsubscribe();
      if (transactionSubscription?.unsubscribe) transactionSubscription.unsubscribe();
      if (budgetSubscription?.unsubscribe) budgetSubscription.unsubscribe();
    };
  }, [user]);

  // Process offline queue when coming back online
  const processOfflineQueue = useCallback(async () => {
    if (!isOnline || offlineQueueManager.isEmpty()) {
      return;
    }

    console.log(`Processing ${offlineQueueManager.length()} offline operations`);
    setIsSyncing(true);

    try {
      // Process queued operations using the queue manager
      await offlineQueueManager.processQueue(async (operation) => {
        switch (operation.type) {
          case 'ADD_TRANSACTION':
            await addTransaction(operation.data);
            break;
          case 'ADD_WALLET':
            await addAccount(operation.data);
            break;
          case 'ADD_BUDGET':
            await upsertBudget(operation.data);
            break;
          case 'UPDATE_WALLET':
            await updateAccount(operation.data.id, operation.data);
            break;
          case 'DELETE_WALLET':
            await deleteAccount(operation.data.id);
            break;
          case 'TRANSFER_BETWEEN_WALLETS':
            await transferBetweenWallets(
              operation.data.fromWalletId,
              operation.data.toWalletId,
              operation.data.amount,
              operation.data.note
            );
            break;
          // Add other operations as needed
          default:
            console.warn('Unknown operation type:', operation.type);
            throw new Error(`Unknown operation type: ${operation.type}`);
        }
      });

      // Check if there are still operations in the queue (failed ones)
      if (!offlineQueueManager.isEmpty()) {
        addNotification({
          type: 'warning',
          title: 'Partial Sync Complete',
          message: `${offlineQueueManager.length()} operations failed and will be retried`,
          priority: 'medium'
        });
      } else {
        setIsSynced(true);
        addNotification({
          type: 'success',
          title: 'Sync Complete',
          message: 'Offline data successfully synchronized with server',
          priority: 'high'
        });
      }
    } catch (error) {
      console.error('Error processing offline queue:', error);
      setError('Failed to sync offline data. Please try again.');
      addNotification({
        type: 'error',
        title: 'Sync Failed',
        message: 'Failed to synchronize offline data. Please try again.',
        priority: 'high'
      });
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, offlineQueueManager]);

  const fetchAccounts = useCallback(async () => {
    try {
      // Ensure user exists before trying to fetch accounts
      if (!user && !supabase) {
        console.warn('No user found and Supabase not configured, returning empty accounts array');
        setAccounts([]);
        saveToDB('accounts', []);
        return [];
      }
      
      const accounts = await supabaseDB.fetchAccounts(user?.id);
      setAccounts(accounts || []);
      saveToDB('accounts', accounts || []);
      return accounts;
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
      setError('Failed to fetch accounts. Please try again.');
      // Return empty array to prevent breaking the app
      setAccounts([]);
      saveToDB('accounts', []);
      throw error;
    }
  }, [user]);

  const fetchCategories = useCallback(async () => {
    try {
      // Ensure user exists before trying to fetch categories
      if (!user && !supabase) {
        console.warn('No user found and Supabase not configured, returning empty categories array');
        setCategories([]);
        saveToDB('categories', []);
        return [];
      }
      
      const categories = await supabaseDB.fetchCategories(user?.id);
      setCategories(categories || []);
      saveToDB('categories', categories || []);
      return categories;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setError('Failed to fetch categories. Please try again.');
      // Return empty array to prevent breaking the app
      setCategories([]);
      saveToDB('categories', []);
      throw error;
    }
  }, [user]);

  const fetchTransactions = useCallback(async () => {
    try {
      // Ensure user exists before trying to fetch transactions
      if (!user && !supabase) {
        console.warn('No user found and Supabase not configured, returning empty transactions array');
        setTransactions([]);
        saveToDB('transactions', []);
        return [];
      }
      
      const transactions = await supabaseDB.fetchTransactions(user?.id);
      setTransactions(transactions || []);
      saveToDB('transactions', transactions || []);
      return transactions;
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      setError('Failed to fetch transactions. Please try again.');
      // Return empty array to prevent breaking the app
      setTransactions([]);
      saveToDB('transactions', []);
      throw error;
    }
  }, [user]);

  const fetchTransfers = useCallback(async () => {
    try {
      // Ensure user exists before trying to fetch transfers
      if (!user && !supabase) {
        console.warn('No user found and Supabase not configured, returning empty transfers array');
        setTransfers([]);
        saveToDB('transfers', []);
        return [];
      }
      
      const transfers = await supabaseDB.fetchTransfers(user?.id);
      setTransfers(transfers || []);
      saveToDB('transfers', transfers || []);
      return transfers;
    } catch (error) {
      console.error('Failed to fetch transfers:', error);
      setError('Failed to fetch transfers. Please try again.');
      // Return empty array to prevent breaking the app
      setTransfers([]);
      saveToDB('transfers', []);
      throw error;
    }
  }, [user]);

  const fetchSettings = useCallback(async () => {
    try {
      // Ensure user exists before trying to fetch settings
      if (!user && !supabase) {
        console.warn('No user found and Supabase not configured, returning empty settings object');
        setSettings({});
        saveToDB('settings', {});
        return {};
      }
      
      const settings = await supabaseDB.fetchSettings(user?.id);
      setSettings(settings || {});
      saveToDB('settings', settings || {});
      return settings;
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      setError('Failed to fetch settings. Please try again.');
      // Return empty object to prevent breaking the app
      setSettings({});
      saveToDB('settings', {});
      throw error;
    }
  }, [user]);

  const fetchProfile = useCallback(async () => {
    try {
      // Ensure user exists before trying to fetch profile
      if (!user && !supabase) {
        console.warn('No user found and Supabase not configured, returning empty profile');
        return null;
      }
      
      const profile = await supabaseDB.fetchProfile(user?.id);
      return profile;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setError('Failed to fetch profile. Please try again.');
      throw error;
    }
  }, [user]);

  const updateProfile = useCallback(async (updates) => {
    try {
      // Ensure user exists before trying to update profile
      if (!user && !supabase) {
        console.warn('No user found and Supabase not configured, cannot update profile');
        return null;
      }
      
      const updatedProfile = await supabaseDB.updateProfile(user?.id, updates);
      return updatedProfile;
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError('Failed to update profile. Please try again.');
      throw error;
    }
  }, [user]);

  const fetchBudgets = useCallback(async () => {
    try {
      // Ensure user exists before trying to fetch budgets
      if (!user && !supabase) {
        console.warn('No user found and Supabase not configured, returning empty budgets array');
        setBudgets([]);
        saveToDB('budgets', []);
        return [];
      }
      
      const data = await supabaseDB.getBudgets(user?.id);
      setBudgets(data || []);
      saveToDB('budgets', data || []);
      return data;
    } catch (error) {
      console.error('Failed to fetch budgets:', error);
      setError('Failed to fetch budgets. Please try again.');
      // Return empty array to prevent breaking the app
      setBudgets([]);
      saveToDB('budgets', []);
      throw error;
    }
  }, [user]);

  const syncAllData = useCallback(async () => {
    setIsSyncing(true);
    setError(null);
    try {
      // Only sync with server if Supabase is configured
      if (supabase && user) {
        await Promise.all([
          fetchAccounts(),
          fetchTransactions(),
          fetchBudgets(),
          fetchCategories(),
          fetchTransfers(),
          fetchSettings()
        ]);
      }
      setIsSynced(true);
      return true;
    } catch (error) {
      console.error('Sync failed:', error);
      setError('Failed to sync data. Please check your connection and try again.');
      setIsSynced(false);
      throw error;
    } finally {
      setIsSyncing(false);
    }
  }, [fetchAccounts, fetchTransactions, fetchBudgets, fetchCategories, fetchTransfers, fetchSettings, user]);

  const addAccount = useCallback(
    async (account) => {
      try {
        // Validate account data
        if (!account || !account.name) {
          throw new Error('Account name is required');
        }
        
        if (!user && !supabase) {
          // If offline and Supabase not configured, add to local storage only
          const tempAccount = { ...account, id: `temp-${Date.now()}`, user_id: 'local-user' };
          setAccounts(prev => [...prev, tempAccount]);
          saveToDB('accounts', [...accounts, tempAccount]);
          return tempAccount;
        }
        
        const newAccount = await supabaseDB.addWallet({ ...account, user_id: user?.id || 'local-user' });
        setAccounts(prev => [...prev, newAccount]);
        saveToDB('accounts', [...accounts, newAccount]);
        return newAccount;
      } catch (error) {
        console.error('Failed to add account:', error);
        setError('Failed to add account. Please try again.');
        throw error;
      }
    },
    [accounts, user]
  );

  const updateAccount = useCallback(
    async (id, updates) => {
      try {
        if (!user && !supabase) {
          // If offline and Supabase not configured, update local storage only
          const updatedAccounts = accounts.map(account => 
            account.id === id ? { ...account, ...updates } : account
          );
          setAccounts(updatedAccounts);
          saveToDB('accounts', updatedAccounts);
          return { ...accounts.find(a => a.id === id), ...updates };
        }
        
        const updatedAccount = await supabaseDB.updateWallet(id, updates);
        setAccounts(prev => prev.map(account => (account.id === id ? updatedAccount : account)));
        saveToDB('accounts', accounts.map(account => (account.id === id ? updatedAccount : account)));
        return updatedAccount;
      } catch (error) {
        console.error('Failed to update account:', error);
        setError('Failed to update account. Please try again.');
        throw error;
      }
    },
    [accounts, user]
  );

  const deleteAccount = useCallback(
    async (id) => {
      try {
        if (!user && !supabase) {
          // If offline and Supabase not configured, delete from local storage only
          const updatedAccounts = accounts.filter(account => account.id !== id);
          setAccounts(updatedAccounts);
          saveToDB('accounts', updatedAccounts);
          return true;
        }
        
        await supabaseDB.deleteWallet(id);
        setAccounts(prev => prev.filter(account => account.id !== id));
        saveToDB('accounts', accounts.filter(account => account.id !== id));
        return true;
      } catch (error) {
        console.error('Failed to delete account:', error);
        setError('Failed to delete account. Please try again.');
        throw error;
      }
    },
    [accounts, user]
  );

  const addTransaction = useCallback(
    async (transaction) => {
      try {
        // Validate transaction data
        if (!transaction || !transaction.description || !transaction.amount) {
          throw new Error('Transaction description and amount are required');
        }
        
        if (!user && !supabase) {
          // If offline and Supabase not configured, add to local storage only
          const tempTransaction = { ...transaction, id: `temp-${Date.now()}`, user_id: 'local-user' };
          setTransactions(prev => [...prev, tempTransaction]);
          saveToDB('transactions', [...transactions, tempTransaction]);
          return tempTransaction;
        }
        
        const newTransaction = await supabaseDB.addTransaction({ ...transaction, user_id: user?.id || 'local-user' });
        setTransactions(prev => [...prev, newTransaction]);
        saveToDB('transactions', [...transactions, newTransaction]);
        return newTransaction;
      } catch (error) {
        console.error('Failed to add transaction:', error);
        setError('Failed to add transaction. Please try again.');
        throw error;
      }
    },
    [transactions, user]
  );

  const updateTransaction = useCallback(
    async (id, updates) => {
      try {
        if (!user && !supabase) {
          // If offline and Supabase not configured, update local storage only
          const updatedTransactions = transactions.map(transaction => 
            transaction.id === id ? { ...transaction, ...updates } : transaction
          );
          setTransactions(updatedTransactions);
          saveToDB('transactions', updatedTransactions);
          return { ...transactions.find(t => t.id === id), ...updates };
        }
        
        const updatedTransaction = await supabaseDB.updateTransaction(id, updates);
        setTransactions(prev => prev.map(transaction => (transaction.id === id ? updatedTransaction : transaction)));
        saveToDB('transactions', transactions.map(transaction => (transaction.id === id ? updatedTransaction : transaction)));
        return updatedTransaction;
      } catch (error) {
        console.error('Failed to update transaction:', error);
        setError('Failed to update transaction. Please try again.');
        throw error;
      }
    },
    [transactions, user]
  );

  const deleteTransaction = useCallback(
    async (id) => {
      try {
        if (!user && !supabase) {
          // If offline and Supabase not configured, delete from local storage only
          const updatedTransactions = transactions.filter(transaction => transaction.id !== id);
          setTransactions(updatedTransactions);
          saveToDB('transactions', updatedTransactions);
          return true;
        }
        
        await supabaseDB.deleteTransaction(id);
        setTransactions(prev => prev.filter(transaction => transaction.id !== id));
        saveToDB('transactions', transactions.filter(transaction => transaction.id !== id));
        return true;
      } catch (error) {
        console.error('Failed to delete transaction:', error);
        setError('Failed to delete transaction. Please try again.');
        throw error;
      }
    },
    [transactions, user]
  );

  const upsertBudget = useCallback(
    async (budget) => {
      try {
        // Validate budget data
        if (!budget || !budget.category || !budget.amount) {
          throw new Error('Budget category and amount are required');
        }
        
        if (!user && !supabase) {
          // If offline and Supabase not configured, add to local storage only
          const tempBudget = { ...budget, id: budget.id || `temp-${Date.now()}`, user_id: 'local-user' };
          const updatedBudgets = budgets.some(b => b.id === tempBudget.id)
            ? budgets.map(b => b.id === tempBudget.id ? tempBudget : b)
            : [...budgets, tempBudget];
          setBudgets(updatedBudgets);
          saveToDB('budgets', updatedBudgets);
          return tempBudget;
        }
        
        const newBudget = await supabaseDB.upsertBudget({ ...budget, user_id: user?.id || 'local-user' });
        const updatedBudgets = budgets.some(b => b.id === newBudget.id)
          ? budgets.map(b => b.id === newBudget.id ? newBudget : b)
          : [...budgets, newBudget];
        setBudgets(updatedBudgets);
        saveToDB('budgets', updatedBudgets);
        return newBudget;
      } catch (error) {
        console.error('Failed to upsert budget:', error);
        setError('Failed to save budget. Please try again.');
        throw error;
      }
    },
    [budgets, user]
  );

  const deleteBudget = useCallback(
    async (id) => {
      try {
        if (!user && !supabase) {
          // If offline and Supabase not configured, delete from local storage only
          const updatedBudgets = budgets.filter(budget => budget.id !== id);
          setBudgets(updatedBudgets);
          saveToDB('budgets', updatedBudgets);
          return true;
        }
        
        await supabaseDB.deleteBudget(id);
        setBudgets(prev => prev.filter(budget => budget.id !== id));
        saveToDB('budgets', budgets.filter(budget => budget.id !== id));
        return true;
      } catch (error) {
        console.error('Failed to delete budget:', error);
        setError('Failed to delete budget. Please try again.');
        throw error;
      }
    },
    [budgets, user]
  );

  const transferBetweenWallets = useCallback(
    async (fromWalletId, toWalletId, amount, note = '') => {
      try {
        if (!user && !supabase) {
          // If offline and Supabase not configured, simulate transfer locally
          const updatedAccounts = accounts.map(account => {
            if (account.id === fromWalletId) {
              return { ...account, balance: account.balance - amount };
            }
            if (account.id === toWalletId) {
              return { ...account, balance: account.balance + amount };
            }
            return account;
          });
          
          setAccounts(updatedAccounts);
          saveToDB('accounts', updatedAccounts);
          
          // Add transfer transaction
          const transferTransaction = {
            id: `temp-${Date.now()}`,
            type: 'transfer',
            from_wallet_id: fromWalletId,
            to_wallet_id: toWalletId,
            amount,
            description: note || 'Transfer between wallets',
            date: new Date().toISOString(),
            user_id: 'local-user'
          };
          
          setTransactions(prev => [...prev, transferTransaction]);
          saveToDB('transactions', [...transactions, transferTransaction]);
          
          return {
            fromWallet: updatedAccounts.find(a => a.id === fromWalletId),
            toWallet: updatedAccounts.find(a => a.id === toWalletId),
            transaction: transferTransaction
          };
        }
        
        const result = await supabaseDB.transferBetweenWallets({
          fromWalletId,
          toWalletId,
          amount,
          description: note,
          userId: user?.id || 'local-user'
        });
        
        // Update local state with the result
        setAccounts(prev => 
          prev.map(account => {
            if (account.id === result.fromWallet.id) return result.fromWallet;
            if (account.id === result.toWallet.id) return result.toWallet;
            return account;
          })
        );
        
        setTransactions(prev => [...prev, result.transaction]);
        
        // Save to DB
        saveToDB('accounts', accounts.map(account => {
          if (account.id === result.fromWallet.id) return result.fromWallet;
          if (account.id === result.toWallet.id) return result.toWallet;
          return account;
        }));
        
        saveToDB('transactions', [...transactions, result.transaction]);
        
        return result;
      } catch (error) {
        console.error('Failed to transfer between wallets:', error);
        setError('Failed to transfer between wallets. Please check balances and try again.');
        throw error;
      }
    },
    [accounts, transactions, user]
  );

  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...notification
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep only last 10 notifications
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const logout = useCallback(async () => {
    try {
      if (supabase) {
        await authLogout();
      }
      setUser(null);
      // Clear all data
      setAccounts([]);
      setBudgets([]);
      setCategories([]);
      setTransactions([]);
      setTransfers([]);
      setSettings({});
      saveToDB('accounts', []);
      saveToDB('budgets', []);
      saveToDB('categories', []);
      saveToDB('transactions', []);
      saveToDB('transfers', []);
      saveToDB('settings', {});
    } catch (error) {
      console.error('Logout error:', error);
      setError('Failed to logout. Please try again.');
      throw error;
    }
  }, []);

  const value = {
    user,
    isLoading,
    isSyncing,
    isSynced,
    showTransactionModal,
    setShowTransactionModal,
    transactionModalType,
    setTransactionModalType,
    showTransferModal,
    setShowTransferModal,
    accounts,
    budgets,
    categories,
    transactions,
    transfers,
    settings,
    appInitialized,
    notifications,
    error,
    isOnline,
    offlineQueue,
    setOfflineQueue,
    isMobile,
    fetchAccounts,
    fetchCategories,
    fetchTransactions,
    fetchTransfers,
    fetchSettings,
    fetchBudgets,
    fetchProfile,
    updateProfile,
    syncAllData,
    addAccount,
    updateAccount,
    deleteAccount,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    upsertBudget,
    deleteBudget,
    transferBetweenWallets,
    addNotification,
    removeNotification,
    clearError,
    logout
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

