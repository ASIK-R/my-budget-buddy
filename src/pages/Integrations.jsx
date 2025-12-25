import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import { 
  Database, 
  Cloud, 
  Smartphone, 
  CreditCard, 
  Lock, 
  Mail, 
  Phone, 
  MapPin,
  Wifi,
  WifiOff,
  RefreshCw,
  Link2,
  Globe,
  CheckCircle
} from 'lucide-react';
import { getIconClass } from '../utils/iconUtils';

const Integrations = () => {
  const {
    googleSheetsConnected,
    setGoogleSheetsConnected,
    syncWithGoogleSheets,
    fetchFromGoogleSheets,
  } = useAppContext();
  const [integrations, setIntegrations] = useState([
    {
      id: 'google-sheets',
      name: 'Google Sheets',
      description: 'Sync your data with Google Sheets for advanced analysis',
      icon: Globe,
      connected: googleSheetsConnected,
      lastSync: null,
    },
    {
      id: 'bank-api',
      name: 'Bank API',
      description: 'Automatically import transactions from your bank',
      icon: Database,
      connected: false,
      lastSync: null,
    },
  ]);

  const handleConnect = async id => {
    if (id === 'google-sheets') {
      try {
        if (googleSheetsConnected) {
          // Disconnect Google Sheets
          await disconnectGoogleAccount();
          setGoogleSheetsConnected(false);
        } else {
          // Connect Google Sheets
          await connectGoogleAccount();
          setGoogleSheetsConnected(true);
        }

        setIntegrations(
          integrations.map(int => (int.id === id ? { ...int, connected: !int.connected } : int))
        );
      } catch (error) {
        console.error('Google Sheets connection failed:', error);
      }
    } else {
      setIntegrations(
        integrations.map(int => (int.id === id ? { ...int, connected: !int.connected } : int))
      );
    }
  };

  const handleSync = async id => {
    if (id === 'google-sheets') {
      try {
        // Sync with Google Sheets
        await syncWithGoogleSheets();
        await fetchFromGoogleSheets();

        setIntegrations(
          integrations.map(int =>
            int.id === id ? { ...int, lastSync: new Date().toLocaleString() } : int
          )
        );
      } catch (error) {
        console.error('Google Sheets sync failed:', error);
      }
    } else {
      // In a real app, this would trigger the actual sync
      setIntegrations(
        integrations.map(int =>
          int.id === id ? { ...int, lastSync: new Date().toLocaleString() } : int
        )
      );
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-5 lg:p-6 space-y-5 sm:space-y-6 md:space-y-7 lg:space-y-8 fade-in">
      {/* Mobile-specific spacing adjustments */}
      <div className="sm:hidden mt-16"></div>
      
      {/* Modern Header with Gradient Background */}
      <div className="rounded-2xl bg-gradient-to-r from-[#076653]/10 to-[#076653]/5 p-5 sm:p-6 md:p-7 backdrop-blur-sm border border-[#076653]/20 dark:border-[#076653]/10 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#076653]/5 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#076653]/5 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Integrations</h1>
              <p className="text-gray-600 dark:text-gray-300">Connect to external services and APIs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Integration Cards with Modern Design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:gap-7">
        {integrations.map((integration, index) => {
          const Icon = integration.icon;
          return (
            <motion.div
              key={integration.id}
              className="rounded-2xl bg-white/80 dark:bg-gray-800/60 p-5 sm:p-6 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-xl ${
                    integration.connected
                      ? 'bg-gradient-to-br from-green-100/80 to-emerald-100/80 dark:from-green-900/30 dark:to-emerald-900/30 text-green-600 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <Icon size={24} className={`${getIconClass()}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                    {integration.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {integration.description}
                  </p>

                  {integration.connected && integration.lastSync && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <RefreshCw size={14} />
                      <span>Last synced: {integration.lastSync}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => handleConnect(integration.id)}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                    integration.connected
                      ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-800/50'
                      : 'bg-[#076653] text-white hover:bg-[#076653]/90 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {integration.connected ? 'Disconnect' : 'Connect'}
                </button>

                {integration.connected && (
                  <button
                    onClick={() => handleSync(integration.id)}
                    className="p-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 transition-all duration-300"
                  >
                    <RefreshCw size={20} />
                  </button>
                )}
              </div>

              {integration.connected && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700/50">
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                    <CheckCircle size={16} />
                    <span>Connected and active</span>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Manual Sync Section */}
      <div className="rounded-2xl bg-white/80 dark:bg-gray-800/60 p-5 sm:p-6 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Manual Sync</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-5">
          Force a manual sync of all connected services.
        </p>
        <button className="flex items-center gap-2 px-4 py-3 bg-[#076653] text-white rounded-xl hover:bg-[#076653]/90 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold">
          <RefreshCw size={20} />
          Sync All Services
        </button>
      </div>

      {/* API Documentation */}
      <div className="rounded-2xl bg-white/80 dark:bg-gray-800/60 p-5 sm:p-6 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">API Documentation</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-5">
          Integrate with our API to build custom solutions.
        </p>
        <button className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-700 text-[#076653] dark:text-white border border-[#076653]/30 dark:border-gray-600 rounded-xl hover:bg-[#076653]/5 dark:hover:bg-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold">
          <Link2 size={20} />
          View Documentation
        </button>
      </div>
    </div>
  );
};

export default Integrations;