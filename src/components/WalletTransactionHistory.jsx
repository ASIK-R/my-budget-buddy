import { useState } from 'react';
import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import TransactionTable from './TransactionTable';

const WalletTransactionHistory = ({ walletId, wallets }) => {
  const { transactions } = useAppContext();
  const [filter, setFilter] = useState('all');

  // Filter transactions for this wallet or all wallets
  const walletTransactions = useMemo(() => {
    if (walletId) {
      // Filter for specific wallet
      return transactions.filter(transaction => {
        if (transaction.type === 'transfer') {
          return transaction.fromWallet === walletId || transaction.toWallet === walletId;
        }
        return false;
      });
    } else if (wallets && wallets.length > 0) {
      // Filter for all wallets
      const walletIds = wallets.map(wallet => wallet.id);
      return transactions.filter(transaction => {
        if (transaction.type === 'transfer') {
          return walletIds.includes(transaction.fromWallet) || walletIds.includes(transaction.toWallet);
        }
        return false;
      });
    } else {
      // No filtering
      return transactions.filter(transaction => transaction.type === 'transfer');
    }
  }, [transactions, walletId, wallets]);

  // Filter by type
  const filteredTransactions = useMemo(() => {
    return walletTransactions.filter(transaction => {
      if (filter === 'all') return true;
      if (filter === 'sent') return transaction.fromWallet === walletId;
      if (filter === 'received') return transaction.toWallet === walletId;
      return true;
    });
  }, [walletTransactions, filter]);

  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            filter === 'all'
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-primary hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          All Transactions
        </button>
        <button
          onClick={() => setFilter('sent')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            filter === 'sent'
              ? 'bg-red-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-primary hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Sent
        </button>
        <button
          onClick={() => setFilter('received')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            filter === 'received'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-primary hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Received
        </button>
      </div>

      {filteredTransactions.length > 0 ? (
        <TransactionTable transactions={filteredTransactions} />
      ) : (
        <div className="card p-8 text-center">
          <p className="text-tertiary">
            No transactions found for this wallet.
          </p>
        </div>
      )}
    </div>
  );
};

export default WalletTransactionHistory;