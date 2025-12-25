import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Upload, Database, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { 
  exportUserData, 
  importFromFile, 
  exportToFile, 
  generateBackupFilename,
  validateBackupData,
  mergeImportedData
} from '../utils/dataExportImport';

const BackupRestore = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { 
    accounts, 
    transactions, 
    budgets, 
    categories, 
    transfers,
    settings,
    addNotification,
    setAccounts,
    setTransactions,
    setBudgets,
    setCategories,
    setTransfers,
    setSettings
  } = useAppContext();
  
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [mergeStrategy, setMergeStrategy] = useState('merge'); // merge, overwrite, cancel
  const [importedData, setImportedData] = useState(null);

  // Export all data
  const handleExport = useCallback(async () => {
    setIsExporting(true);
    
    try {
      const userData = {
        accounts,
        transactions,
        budgets,
        categories,
        transfers,
        settings
      };
      
      const jsonData = exportUserData(userData);
      const filename = generateBackupFilename();
      
      exportToFile(jsonData, filename);
      
      addNotification({
        type: 'success',
        title: 'Export Successful',
        message: `Data exported to ${filename}`,
        priority: 'high'
      });
    } catch (error) {
      console.error('Export failed:', error);
      addNotification({
        type: 'error',
        title: 'Export Failed',
        message: error.message,
        priority: 'high'
      });
    } finally {
      setIsExporting(false);
    }
  }, [accounts, transactions, budgets, categories, transfers, settings, addNotification]);

  // Handle file selection for import
  const handleFileSelect = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setIsImporting(true);
    setImportResult(null);
    setValidationResult(null);
    setImportedData(null);
    
    try {
      const data = await importFromFile(file);
      setImportedData(data);
      
      // Validate the imported data
      const validation = validateBackupData(data);
      setValidationResult(validation);
      
      if (!validation.isValid) {
        addNotification({
          type: 'error',
          title: 'Invalid Backup File',
          message: 'The selected file contains invalid data. Please check the details below.',
          priority: 'high'
        });
      } else if (validation.warnings.length > 0) {
        addNotification({
          type: 'warning',
          title: 'Backup File Warning',
          message: 'The selected file has some warnings. Please review before importing.',
          priority: 'medium'
        });
      } else {
        addNotification({
          type: 'info',
          title: 'File Ready',
          message: 'Backup file validated successfully. Choose how to import the data.',
          priority: 'medium'
        });
      }
    } catch (error) {
      console.error('Import failed:', error);
      setImportResult({
        success: false,
        message: error.message
      });
      
      addNotification({
        type: 'error',
        title: 'Import Failed',
        message: error.message,
        priority: 'high'
      });
    } finally {
      setIsImporting(false);
    }
  }, [addNotification]);

  // Trigger file selection
  const triggerFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Perform the actual import based on selected strategy
  const performImport = useCallback(async (strategy) => {
    if (!importedData) return;
    
    setIsImporting(true);
    
    try {
      const currentData = {
        accounts,
        transactions,
        budgets,
        categories,
        transfers,
        settings
      };
      
      let finalData;
      
      switch (strategy) {
        case 'overwrite':
          // Completely replace all data
          finalData = importedData;
          break;
        case 'merge':
          // Merge with existing data
          finalData = mergeImportedData(currentData, importedData, {
            overwrite: false,
            mergeDuplicates: true
          });
          break;
        default:
          throw new Error('Invalid import strategy');
      }
      
      // Update the app context with new data
      setAccounts(finalData.accounts || []);
      setTransactions(finalData.transactions || []);
      setBudgets(finalData.budgets || []);
      setCategories(finalData.categories || []);
      setTransfers(finalData.transfers || []);
      setSettings(finalData.settings || {});
      
      setImportResult({
        success: true,
        message: `Data successfully ${strategy === 'overwrite' ? 'restored' : 'merged'}`
      });
      
      addNotification({
        type: 'success',
        title: 'Import Successful',
        message: `Data successfully ${strategy === 'overwrite' ? 'restored' : 'merged'}`,
        priority: 'high'
      });
      
      // Reset import state
      setImportedData(null);
      setValidationResult(null);
    } catch (error) {
      console.error('Import failed:', error);
      setImportResult({
        success: false,
        message: error.message
      });
      
      addNotification({
        type: 'error',
        title: 'Import Failed',
        message: error.message,
        priority: 'high'
      });
    } finally {
      setIsImporting(false);
    }
  }, [importedData, accounts, transactions, budgets, categories, transfers, settings, 
    setAccounts, setTransactions, setBudgets, setCategories, setTransfers, setSettings, addNotification]);

  return (
    <div className="p-responsive w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Backup & Restore
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Export your data for backup or import data from a previous backup
        </p>
      </div>
      
      {/* Export Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Export Data</h2>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Download className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Create Backup</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Export all your financial data to a secure JSON file
                </p>
              </div>
            </div>
            
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg transition-all duration-200 disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <Download size={20} />
                  Export Data
                </>
              )}
            </button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">What's included in backup:</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                Accounts & Wallets
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                Transactions
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                Budgets
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                Categories
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                Transfers
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                Settings
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Import Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Import Data</h2>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <Upload className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Restore from Backup</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Import data from a previously exported backup file
                </p>
              </div>
            </div>
            
            <button
              onClick={triggerFileSelect}
              disabled={isImporting}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold shadow-lg transition-all duration-200 disabled:opacity-50"
            >
              {isImporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Upload size={20} />
                  Select File
                </>
              )}
            </button>
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".json"
            className="hidden"
          />
          
          {/* Import Result */}
          {importResult && (
            <div className={`p-4 rounded-xl mb-6 ${
              importResult.success 
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            }`}>
              <div className="flex items-center gap-3">
                {importResult.success ? (
                  <CheckCircle className="text-green-500" size={20} />
                ) : (
                  <XCircle className="text-red-500" size={20} />
                )}
                <div>
                  <h4 className={`font-medium ${
                    importResult.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                  }`}>
                    {importResult.success ? 'Import Successful' : 'Import Failed'}
                  </h4>
                  <p className={`text-sm ${
                    importResult.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {importResult.message}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Validation Results */}
          {validationResult && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Validation Results:</h4>
              
              {validationResult.isValid ? (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="text-green-500" size={20} />
                    <span className="font-medium text-green-800 dark:text-green-200">File Validated Successfully</span>
                  </div>
                  <p className="text-green-600 dark:text-green-400 text-sm">
                    The backup file is valid and ready for import.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="text-red-500" size={20} />
                    <span className="font-medium text-red-800 dark:text-red-200">Validation Errors</span>
                  </div>
                  <ul className="text-red-600 dark:text-red-400 text-sm space-y-1">
                    {validationResult.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {validationResult.warnings.length > 0 && (
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="text-yellow-500" size={20} />
                    <span className="font-medium text-yellow-800 dark:text-yellow-200">Warnings</span>
                  </div>
                  <ul className="text-yellow-600 dark:text-yellow-400 text-sm space-y-1">
                    {validationResult.warnings.map((warning, index) => (
                      <li key={index}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {/* Import Strategy Selection */}
          {importedData && validationResult?.isValid && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">Choose Import Strategy:</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    mergeStrategy === 'merge'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => setMergeStrategy('merge')}
                >
                  <div className="flex items-start gap-3">
                    <Database className="text-blue-500 mt-1" size={20} />
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white mb-1">Merge with Existing Data</h5>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Combine imported data with your current data. Duplicate items will be updated.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div 
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    mergeStrategy === 'overwrite'
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => setMergeStrategy('overwrite')}
                >
                  <div className="flex items-start gap-3">
                    <Database className="text-red-500 mt-1" size={20} />
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white mb-1">Replace All Data</h5>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Completely replace your current data with the imported data. This cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => performImport(mergeStrategy)}
                  disabled={isImporting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg transition-all duration-200 disabled:opacity-50"
                >
                  {isImporting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </div>
                  ) : (
                    `Proceed with ${mergeStrategy === 'merge' ? 'Merge' : 'Replacement'}`
                  )}
                </button>
                
                <button
                  onClick={() => {
                    setImportedData(null);
                    setValidationResult(null);
                    setImportResult(null);
                  }}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl font-semibold transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Security Notice */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-4">
          <AlertCircle className="text-blue-500 mt-1" size={24} />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Security Notice</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your backup files contain sensitive financial information. Store them securely and never share 
              them with others. The files are not encrypted, so treat them with the same care as your 
              financial records.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupRestore;