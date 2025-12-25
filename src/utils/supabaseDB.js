import { supabase } from './supabaseClient';

// Helper function to simulate successful operations when Supabase is not configured
const notConfiguredResponse = (data = null) => {
  console.warn('Supabase not configured, returning empty data');
  return data;
};

// Transactions
export const getTransactions = async userId => {
  if (!supabase) {
    return notConfiguredResponse([]);
  }

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) {
    throw error;
  }
  return data;
};

export const addTransaction = async transaction => {
  if (!supabase) {
    return notConfiguredResponse({ ...transaction, id: Date.now().toString() });
  }

  const { data, error } = await supabase.from('transactions').insert([transaction]).select();

  if (error) {
    throw error;
  }
  return data[0];
};

export const updateTransaction = async (id, updates) => {
  if (!supabase) {
    return notConfiguredResponse({ ...updates, id });
  }

  const { data, error } = await supabase.from('transactions').update(updates).eq('id', id).select();

  if (error) {
    throw error;
  }
  return data[0];
};

export const deleteTransaction = async id => {
  if (!supabase) {
    return notConfiguredResponse(true);
  }

  const { error } = await supabase.from('transactions').delete().eq('id', id);

  if (error) {
    throw error;
  }
  return true;
};

// Budgets
export const getBudgets = async userId => {
  if (!supabase) {
    return notConfiguredResponse([]);
  }

  const { data, error } = await supabase.from('budgets').select('*').eq('user_id', userId);

  if (error) {
    throw error;
  }
  return data;
};

export const upsertBudget = async budget => {
  if (!supabase) {
    return notConfiguredResponse({ ...budget, id: budget.id || Date.now().toString() });
  }

  const { data, error } = await supabase.from('budgets').upsert(budget).select();

  if (error) {
    throw error;
  }
  return data[0];
};

export const deleteBudget = async id => {
  if (!supabase) {
    return notConfiguredResponse(true);
  }

  const { error } = await supabase.from('budgets').delete().eq('id', id);

  if (error) {
    throw error;
  }
  return true;
};

// Wallets
export const getWallets = async userId => {
  if (!supabase) {
    return notConfiguredResponse([]);
  }

  const { data, error } = await supabase.from('wallets').select('*').eq('user_id', userId);

  if (error) {
    throw error;
  }
  return data;
};

export const addWallet = async wallet => {
  if (!supabase) {
    return notConfiguredResponse({ ...wallet, id: Date.now().toString() });
  }

  const { data, error } = await supabase.from('wallets').insert([wallet]).select();

  if (error) {
    throw error;
  }
  return data[0];
};

export const updateWallet = async (id, updates) => {
  if (!supabase) {
    return notConfiguredResponse({ ...updates, id });
  }

  const { data, error } = await supabase.from('wallets').update(updates).eq('id', id).select();

  if (error) {
    throw error;
  }
  return data[0];
};

export const deleteWallet = async id => {
  if (!supabase) {
    return notConfiguredResponse(true);
  }

  const { error } = await supabase.from('wallets').delete().eq('id', id);

  if (error) {
    throw error;
  }
  return true;
};

// Transfer between wallets
export const transferBetweenWallets = async transferData => {
  if (!supabase) {
    return notConfiguredResponse({
      fromWallet: { id: transferData.fromWalletId, balance: 0 },
      toWallet: { id: transferData.toWalletId, balance: transferData.amount },
      transaction: { id: Date.now().toString(), ...transferData },
    });
  }

  // For transfers, we need to create two linked transactions (debit and credit)
  // with a shared transaction_group_id to link them, following data model immutability rules
  const { fromWalletId, toWalletId, amount, description, userId } = transferData;
  const transactionGroupId = Date.now().toString();

  // Update from wallet
  const fromWallet = await supabase
    .from('wallets')
    .select('balance')
    .eq('id', fromWalletId)
    .eq('user_id', userId)
    .single();

  if (fromWallet.error) {
    throw fromWallet.error;
  }
  if (fromWallet.data.balance < amount) {
    throw new Error('Insufficient funds');
  }

  const updatedFromWallet = await updateWallet(fromWalletId, {
    balance: fromWallet.data.balance - amount,
  });

  // Update to wallet
  const toWallet = await supabase
    .from('wallets')
    .select('balance')
    .eq('id', toWalletId)
    .eq('user_id', userId)
    .single();

  if (toWallet.error) {
    throw toWallet.error;
  }

  const updatedToWallet = await updateWallet(toWalletId, {
    balance: toWallet.data.balance + amount,
  });

  // Create debit transaction (from wallet)
  const debitTransaction = await addTransaction({
    user_id: userId,
    type: 'transfer',
    category: 'Transfer',
    amount: amount,
    description: description || `Transfer to ${updatedToWallet.name}`,
    date: new Date().toISOString(),
    from_wallet_id: fromWalletId,
    to_wallet_id: toWalletId,
    transaction_group_id: transactionGroupId,
  });

  // Create credit transaction (to wallet)
  const creditTransaction = await addTransaction({
    user_id: userId,
    type: 'transfer',
    category: 'Transfer',
    amount: amount,
    description: description || `Transfer from ${updatedFromWallet.name}`,
    date: new Date().toISOString(),
    from_wallet_id: fromWalletId,
    to_wallet_id: toWalletId,
    transaction_group_id: transactionGroupId,
  });

  return {
    fromWallet: updatedFromWallet,
    toWallet: updatedToWallet,
    debitTransaction: debitTransaction,
    creditTransaction: creditTransaction,
    transactionGroupId: transactionGroupId,
  };
};

// Additional functions needed by AppContext
export const fetchAccounts = async userId => {
  if (!supabase) {
    return notConfiguredResponse([]);
  }

  const { data, error } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    throw error;
  }
  return data;
};

export const fetchCategories = async userId => {
  if (!supabase) {
    return notConfiguredResponse([]);
  }

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    throw error;
  }
  return data;
};

export const fetchTransfers = async userId => {
  if (!supabase) {
    return notConfiguredResponse([]);
  }

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .eq('type', 'transfer')
    .order('date', { ascending: false });

  if (error) {
    throw error;
  }
  return data;
};

export const fetchSettings = async userId => {
  if (!supabase) {
    return notConfiguredResponse({});
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('settings')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // No rows returned
      return {};
    }
    throw error;
  }
  return data.settings || {};
};

export const fetchTransactions = async userId => {
  if (!supabase) {
    return notConfiguredResponse([]);
  }

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .neq('type', 'transfer') // Exclude transfers since they're handled separately
    .order('date', { ascending: false });

  if (error) {
    throw error;
  }
  return data;
};

// Fetch user profile
export const fetchProfile = async userId => {
  if (!supabase) {
    return notConfiguredResponse(null);
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // No rows returned
      return null;
    }
    throw error;
  }
  return data;
};

// Update user profile
export const updateProfile = async (userId, updates) => {
  if (!supabase) {
    return notConfiguredResponse({ id: userId, ...updates });
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
};
