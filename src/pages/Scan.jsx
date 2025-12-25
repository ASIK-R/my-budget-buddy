import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, QrCode, FileText, Upload, X, Wallet, TrendingUp, TrendingDown, ArrowUpDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import useHapticFeedback from '../hooks/useHapticFeedback.js';

const Scan = () => {
  const navigate = useNavigate();
  const { triggerHapticFeedback } = useHapticFeedback();
  const { accounts, addTransaction, addTransfer } = useAppContext();
  
  const [activeTab, setActiveTab] = useState('scan'); // scan, manual, upload
  const [scanResult, setScanResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [manualEntry, setManualEntry] = useState({
    type: 'expense',
    amount: '',
    description: '',
    category: 'Food & Dining',
    accountId: '',
    toAccountId: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  const fileInputRef = useRef(null);

  // Memoized available categories for better performance
  const categories = useMemo(() => [
    'Food & Dining', 'Shopping', 'Transportation', 'Entertainment', 
    'Utilities', 'Healthcare', 'Travel', 'Education', 'Salary', 
    'Investment', 'Other'
  ], []);

  // Set default account when accounts load - optimized with useCallback
  const setDefaultAccount = useCallback(() => {
    if (accounts.length > 0 && !manualEntry.accountId) {
      // Find Cash account first, otherwise use the first account
      const cashAccount = accounts.find(account => account.type === 'Cash');
      setManualEntry(prev => ({
        ...prev,
        accountId: cashAccount ? cashAccount.id : accounts[0].id
      }));
    }
  }, [accounts, manualEntry.accountId]);

  useEffect(() => {
    setDefaultAccount();
  }, [setDefaultAccount]);

  // Handle QR/Barcode scan simulation - optimized with useCallback
  const handleScan = useCallback(() => {
    setIsProcessing(true);
    triggerHapticFeedback('tap');
    
    // Simulate scanning process
    setTimeout(() => {
      setIsProcessing(false);
      // Mock scan result
      setScanResult({
        type: 'receipt',
        amount: Math.floor(Math.random() * 1000) + 10,
        merchant: 'Sample Store',
        date: new Date().toLocaleDateString(),
        items: [
          { name: 'Item 1', price: 25.99 },
          { name: 'Item 2', price: 15.50 },
          { name: 'Item 3', price: 8.75 }
        ]
      });
      triggerHapticFeedback('success');
    }, 2000);
  }, [triggerHapticFeedback]);

  // Handle file upload - optimized with useCallback
  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      setIsProcessing(true);
      triggerHapticFeedback('tap');
      
      // Simulate file processing
      setTimeout(() => {
        setIsProcessing(false);
        setScanResult({
          type: 'document',
          amount: Math.floor(Math.random() * 500) + 20,
          merchant: 'Uploaded Document',
          date: new Date().toLocaleDateString(),
          items: [
            { name: 'Processed Item 1', price: 32.99 },
            { name: 'Processed Item 2', price: 19.99 }
          ]
        });
        triggerHapticFeedback('success');
      }, 1500);
    }
  }, [triggerHapticFeedback]);

  // Handle manual entry submission - optimized with useCallback
  const handleManualSubmit = useCallback(() => {
    if (!manualEntry.amount || !manualEntry.description) {
      triggerHapticFeedback('error');
      return;
    }
    
    if (manualEntry.type !== 'transfer' && !manualEntry.accountId) {
      triggerHapticFeedback('error');
      return;
    }
    
    if (manualEntry.type === 'transfer' && (!manualEntry.accountId || !manualEntry.toAccountId)) {
      triggerHapticFeedback('error');
      return;
    }
    
    setIsProcessing(true);
    triggerHapticFeedback('tap');
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      
      if (manualEntry.type === 'transfer') {
        // Handle transfer
        addTransfer({
          fromAccountId: manualEntry.accountId,
          toAccountId: manualEntry.toAccountId,
          amount: parseFloat(manualEntry.amount),
          description: manualEntry.description,
          date: manualEntry.date
        });
      } else {
        // Handle transaction
        addTransaction({
          type: manualEntry.type,
          amount: parseFloat(manualEntry.amount),
          description: manualEntry.description,
          category: manualEntry.category,
          accountId: manualEntry.accountId,
          date: manualEntry.date
        });
      }
      
      // Reset form but keep the account selection
      setManualEntry({
        type: 'expense',
        amount: '',
        description: '',
        category: 'Food & Dining',
        accountId: manualEntry.accountId, // Keep the selected account
        toAccountId: '',
        date: new Date().toISOString().split('T')[0]
      });
      
      triggerHapticFeedback('success');
      
      // Navigate back to dashboard
      setTimeout(() => {
        navigate('/');
      }, 1000);
    }, 1000);
  }, [manualEntry, addTransaction, addTransfer, triggerHapticFeedback, navigate]);

  // Process scanned result - optimized with useCallback
  const processScanResult = useCallback(() => {
    if (!scanResult) return;
    
    setIsProcessing(true);
    triggerHapticFeedback('tap');
    
    // Simulate processing the scan result
    setTimeout(() => {
      setIsProcessing(false);
      addTransaction({
        type: 'expense',
        amount: scanResult.amount,
        description: scanResult.merchant,
        category: 'Shopping',
        accountId: manualEntry.accountId,
        date: new Date().toISOString().split('T')[0]
      });
      
      // Clear scan result
      setScanResult(null);
      triggerHapticFeedback('success');
      
      // Navigate back to dashboard
      setTimeout(() => {
        navigate('/');
      }, 1000);
    }, 1000);
  }, [scanResult, manualEntry.accountId, addTransaction, triggerHapticFeedback, navigate]);

  // Filter accounts for transfer - exclude the selected "from" account
  const filteredAccounts = useMemo(() => {
    if (manualEntry.type !== 'transfer') return accounts;
    return accounts.filter(account => account.id !== manualEntry.accountId);
  }, [accounts, manualEntry.accountId, manualEntry.type]);

  // Format account option display
  const formatAccountOption = useCallback((account) => {
    return `${account.name} (${account.type}) - $${account.balance.toFixed(2)}`;
  }, []);

  return (
    <div className="p-responsive w-full max-w-full overflow-x-hidden bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Mobile-specific spacing adjustments */}
      <div class="sm:hidden mt-16"></div>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 card-mobile">
        <h1 className="text-mobile-title text-gray-900 dark:text-white">Scan & Add</h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex mb-6 bg-white dark:bg-gray-800 rounded-2xl p-1 shadow-sm border border-gray-200 dark:border-gray-700 card-mobile">
        <button
          onClick={() => setActiveTab('scan')}
          className={`flex-1 py-3 px-2 text-sm font-medium rounded-xl transition-colors duration-200 ${
            activeTab === 'scan'
              ? 'bg-[#076653] text-white shadow'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Camera size={16} className="mx-auto mb-1" />
          Scan
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          className={`flex-1 py-3 px-2 text-sm font-medium rounded-xl transition-colors duration-200 ${
            activeTab === 'manual'
              ? 'bg-[#076653] text-white shadow'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <FileText size={16} className="mx-auto mb-1" />
          Manual
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-3 px-2 text-sm font-medium rounded-xl transition-colors duration-200 ${
            activeTab === 'upload'
              ? 'bg-[#076653] text-white shadow'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Upload size={16} className="mx-auto mb-1" />
          Upload
        </button>
      </div>

      {/* Scan Tab Content */}
      {activeTab === 'scan' && (
        <div className="card-mobile mb-6">
          <div className="text-center py-8">
            <div className="mx-auto w-32 h-32 bg-[#076653]/10 dark:bg-[#076653]/20 rounded-2xl flex items-center justify-center mb-6">
              <QrCode size={48} className="text-[#076653] dark:text-teal-400" />
            </div>
            <h2 className="text-mobile-subtitle mb-2">Scan Receipt or QR Code</h2>
            <p className="text-mobile-caption mb-6">
              Point your camera at a receipt or QR code to automatically capture transaction details
            </p>
            
            <button
              onClick={handleScan}
              disabled={isProcessing}
              className="w-full py-4 bg-gradient-to-r from-[#076653] to-[#076653]/80 hover:from-[#076653]/90 hover:to-[#076653] text-white rounded-2xl font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#076653] focus:ring-offset-2 touch-target disabled:opacity-50"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Scanning...
                </div>
              ) : (
                'Scan Now'
              )}
            </button>
          </div>
          
          {/* Scan Result Preview */}
          {scanResult && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-200 dark:border-gray-600">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Scan Result</h3>
                <button 
                  onClick={() => setScanResult(null)}
                  className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Merchant</span>
                  <span className="font-medium text-gray-900 dark:text-white">{scanResult.merchant}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Date</span>
                  <span className="font-medium text-gray-900 dark:text-white">{scanResult.date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Amount</span>
                  <span className="font-bold text-lg text-[#076653] dark:text-teal-400">
                    ${scanResult.amount.toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Items</h4>
                <ul className="space-y-2">
                  {scanResult.items.map((item, index) => (
                    <li key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                      <span className="text-gray-900 dark:text-white">${item.price.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Account Selection for Scan Result */}
              <div className="mb-4">
                <label htmlFor="scanAccount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Account
                </label>
                <select
                  id="scanAccount"
                  value={manualEntry.accountId}
                  onChange={(e) => setManualEntry({...manualEntry, accountId: e.target.value})}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#076653] focus:border-transparent"
                >
                  <option value="">Select account</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {formatAccountOption(account)}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={processScanResult}
                disabled={isProcessing || !manualEntry.accountId}
                className="w-full py-3 bg-[#076653] hover:bg-[#076653]/90 text-white rounded-xl font-medium transition-colors duration-200 touch-target disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Add Transaction'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Manual Entry Tab Content */}
      {activeTab === 'manual' && (
        <div className="card-mobile mb-6">
          <h2 className="text-mobile-subtitle mb-4">Manual Entry</h2>
          
          <div className="space-y-4">
            {/* Type Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Transaction Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setManualEntry({...manualEntry, type: 'expense'})}
                  className={`py-3 rounded-xl flex flex-col items-center justify-center transition-colors duration-200 ${
                    manualEntry.type === 'expense'
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-700'
                      : 'bg-gray-100 dark:bg-gray-700/30 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <TrendingDown size={20} className="mb-1" />
                  <span className="text-xs">Expense</span>
                </button>
                
                <button
                  onClick={() => setManualEntry({...manualEntry, type: 'income'})}
                  className={`py-3 rounded-xl flex flex-col items-center justify-center transition-colors duration-200 ${
                    manualEntry.type === 'income'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-700'
                      : 'bg-gray-100 dark:bg-gray-700/30 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <TrendingUp size={20} className="mb-1" />
                  <span className="text-xs">Income</span>
                </button>
                
                <button
                  onClick={() => setManualEntry({...manualEntry, type: 'transfer'})}
                  className={`py-3 rounded-xl flex flex-col items-center justify-center transition-colors duration-200 ${
                    manualEntry.type === 'transfer'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-700'
                      : 'bg-gray-100 dark:bg-gray-700/30 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <ArrowUpDown size={20} className="mb-1" />
                  <span className="text-xs">Transfer</span>
                </button>
              </div>
            </div>
            
            {/* Amount Input */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 dark:text-gray-400">
                  $
                </span>
                <input
                  type="number"
                  id="amount"
                  value={manualEntry.amount}
                  onChange={(e) => setManualEntry({...manualEntry, amount: e.target.value})}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#076653] focus:border-transparent text-lg"
                />
              </div>
            </div>
            
            {/* Description Input */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <input
                type="text"
                id="description"
                value={manualEntry.description}
                onChange={(e) => setManualEntry({...manualEntry, description: e.target.value})}
                placeholder="Enter description"
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#076653] focus:border-transparent"
              />
            </div>
            
            {/* Category Selector (for expense/income) */}
            {manualEntry.type !== 'transfer' && (
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={manualEntry.category}
                  onChange={(e) => setManualEntry({...manualEntry, category: e.target.value})}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#076653] focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {/* Account Selector */}
            <div>
              <label htmlFor="account" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {manualEntry.type === 'transfer' ? 'From Account' : 'Account'}
              </label>
              <select
                id="account"
                value={manualEntry.accountId}
                onChange={(e) => setManualEntry({...manualEntry, accountId: e.target.value})}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#076653] focus:border-transparent"
              >
                <option value="">Select account</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {formatAccountOption(account)}
                  </option>
                ))}
              </select>
            </div>
            
            {/* To Account Selector (for transfers) */}
            {manualEntry.type === 'transfer' && (
              <div>
                <label htmlFor="toAccount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  To Account
                </label>
                <select
                  id="toAccount"
                  value={manualEntry.toAccountId}
                  onChange={(e) => setManualEntry({...manualEntry, toAccountId: e.target.value})}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#076653] focus:border-transparent"
                >
                  <option value="">Select account</option>
                  {filteredAccounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {formatAccountOption(account)}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {/* Date Input */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date
              </label>
              <input
                type="date"
                id="date"
                value={manualEntry.date}
                onChange={(e) => setManualEntry({...manualEntry, date: e.target.value})}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#076653] focus:border-transparent"
              />
            </div>
            
            {/* Submit Button */}
            <button
              onClick={handleManualSubmit}
              disabled={isProcessing || !manualEntry.amount || !manualEntry.description}
              className="w-full py-3 bg-[#076653] hover:bg-[#076653]/90 text-white rounded-xl font-medium transition-colors duration-200 touch-target disabled:opacity-50 mt-4"
            >
              {isProcessing ? 'Processing...' : `Add ${manualEntry.type.charAt(0).toUpperCase() + manualEntry.type.slice(1)}`}
            </button>
          </div>
        </div>
      )}

      {/* Upload Tab Content */}
      {activeTab === 'upload' && (
        <div className="card-mobile mb-6">
          <div className="text-center py-8">
            <div className="mx-auto w-32 h-32 bg-[#076653]/10 dark:bg-[#076653]/20 rounded-2xl flex items-center justify-center mb-6">
              <Upload size={48} className="text-[#076653] dark:text-teal-400" />
            </div>
            <h2 className="text-mobile-subtitle mb-2">Upload Receipt</h2>
            <p className="text-mobile-caption mb-6">
              Upload a photo or PDF of your receipt for automatic processing
            </p>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*,application/pdf"
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="w-full py-4 bg-gradient-to-r from-[#076653] to-[#076653]/80 hover:from-[#076653]/90 hover:to-[#076653] text-white rounded-2xl font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#076653] focus:ring-offset-2 touch-target disabled:opacity-50"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                'Choose File'
              )}
            </button>
            
            <div className="mt-6 text-left">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">Supported Formats</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-[#076653] dark:bg-teal-400 rounded-full mr-2"></div>
                  JPG, PNG images of receipts
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-[#076653] dark:bg-teal-400 rounded-full mr-2"></div>
                  PDF documents with transaction details
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-[#076653] dark:bg-teal-400 rounded-full mr-2"></div>
                  Bank statements and invoices
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scan;