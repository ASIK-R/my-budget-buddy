import { useState } from 'react';
import { 
  WalletIcon, 
  ArrowsRightLeftIcon, 
  PlusIcon, 
  ChevronDownIcon 
} from '@heroicons/react/24/outline';

export default function Wallets() {
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [fromWallet, setFromWallet] = useState('');
  const [toWallet, setToWallet] = useState('');
  const [amount, setAmount] = useState('');

  // Mock wallet data
  const wallets = [
    { id: 1, name: 'Bank Account', type: 'Bank', balance: 5420.75, icon: '🏦' },
    { id: 2, name: 'bKash', type: 'Mobile', balance: 1250.00, icon: '📱' },
    { id: 3, name: 'Nagad', type: 'Mobile', balance: 875.50, icon: '📱' },
    { id: 4, name: 'Savings', type: 'Savings', balance: 12500.00, icon: '💰' },
    { id: 5, name: 'Cash Fund', type: 'Cash', balance: 320.25, icon: '💵' },
  ];

  const handleTransfer = (e) => {
    e.preventDefault();
    // In a real app, this would call an API to transfer funds
    alert(`Transferring $${amount} from ${fromWallet} to ${toWallet}`);
    setShowTransferModal(false);
    setFromWallet('');
    setToWallet('');
    setAmount('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gradient">Wallets</h1>
        <button 
          onClick={() => setShowTransferModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <ArrowsRightLeftIcon className="h-5 w-5" />
          <span>Transfer Money</span>
        </button>
      </div>

      {/* Wallets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wallets.map((wallet) => (
          <div key={wallet.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">{wallet.icon}</div>
                <div>
                  <h3 className="font-bold text-lg">{wallet.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{wallet.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">${wallet.balance.toFixed(2)}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Balance</p>
              </div>
            </div>
            <div className="mt-6 flex space-x-3">
              <button className="flex-1 py-2 bg-gradient-1 text-brand-dark rounded-lg font-medium">
                Add Money
              </button>
              <button className="flex-1 py-2 bg-gradient-2 text-brand-dark rounded-lg font-medium">
                Withdraw
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Transfer Money</h2>
                <button 
                  onClick={() => setShowTransferModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleTransfer}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">From Wallet</label>
                    <div className="relative">
                      <select 
                        value={fromWallet}
                        onChange={(e) => setFromWallet(e.target.value)}
                        className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-brand-accent focus:border-transparent"
                        required
                      >
                        <option value="">Select wallet</option>
                        {wallets.map((wallet) => (
                          <option key={wallet.id} value={wallet.name}>
                            {wallet.name} (${wallet.balance.toFixed(2)})
                          </option>
                        ))}
                      </select>
                      <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">To Wallet</label>
                    <div className="relative">
                      <select 
                        value={toWallet}
                        onChange={(e) => setToWallet(e.target.value)}
                        className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-brand-accent focus:border-transparent"
                        required
                      >
                        <option value="">Select wallet</option>
                        {wallets.map((wallet) => (
                          <option key={wallet.id} value={wallet.name}>
                            {wallet.name} (${wallet.balance.toFixed(2)})
                          </option>
                        ))}
                      </select>
                      <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Amount</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-8 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-brand-accent focus:border-transparent"
                        required
                        min="0.01"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowTransferModal(false)}
                    className="flex-1 py-3 px-4 bg-gray-200 dark:bg-gray-700 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-gradient-1 text-brand-dark rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    Transfer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}