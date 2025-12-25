import { motion } from 'framer-motion';
import { Users, Plus, Edit3, Trash2, Share2, UserPlus, UserMinus, Wifi, WifiOff, Eye } from 'lucide-react';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import ResponsiveCard from '../components/ResponsiveCard';

const SharedAccounts = () => {
  const { isOnline } = useAppContext();
  const [accounts] = useState([
    {
      id: 1,
      name: 'Family Budget',
      owner: 'John Doe',
      members: 4,
      balance: 2450.75,
      permissions: 'Full Access',
      lastUpdated: '2023-06-15',
      color: 'bg-blue-500'
    },
    {
      id: 2,
      name: 'Business Expenses',
      owner: 'Sarah Smith',
      members: 3,
      balance: -1200.50,
      permissions: 'View Only',
      lastUpdated: '2023-06-14',
      color: 'bg-green-500'
    },
    {
      id: 3,
      name: 'Vacation Fund',
      owner: 'Mike Johnson',
      members: 2,
      balance: 3500.00,
      permissions: 'Full Access',
      lastUpdated: '2023-06-10',
      color: 'bg-purple-500'
    }
  ]);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newAccountModal, setNewAccountModal] = useState(false);

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
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Shared Accounts</h1>
              <p className="text-gray-600 dark:text-gray-300">Manage and collaborate on shared financial accounts</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setNewAccountModal(true)}
                className="flex items-center gap-2 px-4 py-3 bg-[#076653] text-white rounded-xl hover:bg-[#076653]/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus size={20} />
                <span className="font-semibold hidden sm:inline">New Account</span>
              </button>
              <button
                onClick={() => setShowInviteModal(true)}
                className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 text-[#076653] dark:text-white border border-[#076653]/30 dark:border-gray-600 rounded-xl hover:bg-[#076653]/5 dark:hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Share2 size={20} />
                <span className="font-semibold hidden sm:inline">Invite</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards with Modern Design */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-5 shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Total Accounts</h3>
            <div className="p-2 rounded-lg bg-blue-100/80 dark:bg-blue-900/30">
              <Users size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
          <div className="mt-2 flex items-center text-xs text-blue-600 dark:text-blue-400">
            <Users size={14} className="mr-1" />
            <span>Active accounts</span>
          </div>
        </div>
        
        <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-5 shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Members</h3>
            <div className="p-2 rounded-lg bg-green-100/80 dark:bg-green-900/30">
              <Share2 size={20} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">9</p>
          <div className="mt-2 flex items-center text-xs text-green-600 dark:text-green-400">
            <UserPlus size={14} className="mr-1" />
            <span>Total members</span>
          </div>
        </div>
        
        <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-5 shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Pending Invites</h3>
            <div className="p-2 rounded-lg bg-purple-100/80 dark:bg-purple-900/30">
              <Eye size={20} className="text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">2</p>
          <div className="mt-2 flex items-center text-xs text-purple-600 dark:text-purple-400">
            <Eye size={14} className="mr-1" />
            <span>Awaiting response</span>
          </div>
        </div>
      </div>

      {/* Accounts List */}
      <div className="rounded-2xl bg-white/80 dark:bg-gray-800/60 p-5 sm:p-6 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Your Shared Accounts</h2>
          <span className="text-sm font-medium text-[#076653]">
            {accounts.length} accounts
          </span>
        </div>
        
        <div className="space-y-4">
          {accounts.map((account) => (
            <motion.div
              key={account.id}
              className="p-5 rounded-xl bg-white/50 dark:bg-gray-800/40 backdrop-blur-sm border border-gray-100/50 dark:border-gray-700/30 hover:bg-white/80 dark:hover:bg-gray-800/60 transition-all duration-200"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: account.id * 0.05 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${account.color} flex items-center justify-center`}>
                    <Users className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">{account.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Owner: {account.owner} • {account.members} members
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="text-right">
                    <p className={`font-bold text-lg ${account.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      ${Math.abs(account.balance).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {account.permissions}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors duration-200">
                      <Eye size={18} />
                    </button>
                    <button className="p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors duration-200">
                      <Edit3 size={18} />
                    </button>
                    <button className="p-3 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors duration-200">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Last updated: {account.lastUpdated}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Active</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pending Invites */}
      <div className="rounded-2xl bg-white/80 dark:bg-gray-800/60 p-5 sm:p-6 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Pending Invites</h2>
          <span className="text-sm font-medium text-[#076653]">2 invites</span>
        </div>
        
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-white/50 dark:bg-gray-800/40 backdrop-blur-sm border border-gray-100/50 dark:border-gray-700/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Team Expenses</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Invited by: Alex Thompson • 5 members
                </p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 font-medium">
                  Accept
                </button>
                <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 font-medium">
                  Decline
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-5 rounded-xl bg-white/50 dark:bg-gray-800/40 backdrop-blur-sm border border-gray-100/50 dark:border-gray-700/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Apartment Rent</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Invited by: Emma Wilson • 3 members
                </p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 font-medium">
                  Accept
                </button>
                <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 font-medium">
                  Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="fixed bottom-6 right-6 z-10">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg ${
          isOnline 
            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
        }`}>
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm font-medium">
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SharedAccounts;