import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Database, 
  LogOut, 
  Sun, 
  Moon, 
  Wifi, 
  WifiOff,
  RefreshCw,
  Cloud,
  Smartphone,
  CreditCard,
  Lock,
  Mail,
  Phone,
  MapPin,
  Camera,
  Target,
  FileText,
  TrendingUp,
  Repeat,
  Users,
  Trophy,
  Link2,
  HelpCircle,
  Palette,
  Globe,
  Award,
  Calendar,
  ChevronRight,
  Heart,
  Edit3,
  Save,
  X,
  BarChart3,
  Tag,
  Wallet
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const Profile = () => {
  const { user, isOnline, isSyncing, syncData, logout, error, clearError, fetchProfile, updateProfile } = useAppContext();
    const { darkMode, toggleTheme } = useTheme();
  const [showMore, setShowMore] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    bio: '',
  });
  const navigate = useNavigate();

  // Initialize profile data when user changes
  useEffect(() => {
    const loadProfileData = async () => {
      if (user) {
        try {
          // Try to fetch detailed profile from Supabase
          const profile = await fetchProfile();
          
          if (profile) {
            // Use Supabase profile data if available
            setProfileData({
              name: profile.full_name || user.user_metadata?.full_name || user.username || 'User Profile',
              email: profile.email || user.email || '',
              phone: profile.phone || user.user_metadata?.phone || '',
              birthDate: profile.birth_date || user.user_metadata?.birth_date || '',
              bio: profile.bio || user.user_metadata?.bio || '',
            });
          } else {
            // Fallback to auth user data
            setProfileData({
              name: user.user_metadata?.full_name || user.username || 'User Profile',
              email: user.email || '',
              phone: user.user_metadata?.phone || '',
              birthDate: user.user_metadata?.birth_date || '',
              bio: user.user_metadata?.bio || '',
            });
          }
        } catch (err) {
          console.error('Error fetching profile:', err);
          // Fallback to auth user data
          setProfileData({
            name: user.user_metadata?.full_name || user.username || 'User Profile',
            email: user.email || '',
            phone: user.user_metadata?.phone || '',
            birthDate: user.user_metadata?.birth_date || '',
            bio: user.user_metadata?.bio || '',
          });
        }
      }
    };
    
    loadProfileData();
  }, [user, fetchProfile]);

  const moreItems = [
    { id: 'ai', icon: HelpCircle, label: 'AI Assistant', path: '/ai' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { id: 'backup', icon: Database, label: 'Backup & Restore', path: '/backup' },
    { id: 'budgets', icon: Target, label: 'Budgets', path: '/budgets' },
    { id: 'categories', icon: Tag, label: 'Categories', path: '/categories' },
    { id: 'financial-planning', icon: Calendar, label: 'Financial Planning', path: '/planning' },
    { id: 'goals', icon: Target, label: 'Goals', path: '/goals' },
    { id: 'investments', icon: TrendingUp, label: 'Investments', path: '/investments' },
    { id: 'notifications', icon: Bell, label: 'Notifications', path: '/notifications' },
    { id: 'recurring', icon: Repeat, label: 'Recurring Transactions', path: '/recurring' },
    { id: 'reports', icon: FileText, label: 'Reports', path: '/reports' },
    { id: 'shared', icon: Users, label: 'Shared Accounts', path: '/shared' },
    { id: 'support', icon: HelpCircle, label: 'Support', path: '/support' },
    { id: 'transactions', icon: CreditCard, label: 'Transactions', path: '/transactions' },
    { id: 'wallets', icon: Wallet, label: 'Wallets', path: '/wallets' },
  ];

  const settingsItems = [
    {
      id: 'notifications',
      icon: Bell,
      label: 'Notifications',
      description: 'Manage your notification preferences',
      path: '/settings#notifications',
    },
    {
      id: 'privacy',
      icon: Lock,
      label: 'Privacy',
      description: 'Control your privacy settings',
      path: '/settings#privacy',
    },
    {
      id: 'appearance',
      icon: Palette,
      label: 'Appearance',
      description: 'Customize the app appearance',
      path: '/settings#appearance',
    },
    {
      id: 'language',
      icon: Globe,
      label: 'Language',
      description: 'Change the app language',
      path: '/settings#language',
    },
    {
      id: 'security',
      icon: Shield,
      label: 'Security',
      description: 'Manage your security settings',
      path: '/settings#security',
    },
    {
      id: 'payment',
      icon: CreditCard,
      label: 'Payment Methods',
      description: 'Manage your payment methods',
      path: '/settings#payment',
    },
    {
      id: 'location',
      icon: MapPin,
      label: 'Location',
      description: 'Manage your location settings',
      path: '/settings#location',
    },
  ];

  // Fix the event handler type issue
  const handleSyncClick = async () => {
    if (syncData && typeof syncData === 'function') {
      try {
        await syncData();
      } catch (err) {
        console.error('Sync failed:', err);
      }
    }
  };

  // Logout function
  const handleLogout = async () => {
    try {
      // Use the logout function from context
      await logout();
      
      // Navigate to home page (which will show login)
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Handle profile update
  const handleProfileUpdate = async () => {
    try {
      // Update profile in Supabase
      await updateProfile({
        full_name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        birth_date: profileData.birthDate,
        bio: profileData.bio,
      });
      
      setEditingProfile(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile. Please try again.');
    }
  };

  // Handle dark mode toggle
  const handleDarkModeToggle = () => {
    toggleTheme();
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-6 bg-red-50 dark:bg-red-900/20 rounded-2xl max-w-md">
          <div className="text-red-500 dark:text-red-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Data</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={clearError}
              className="px-4 py-2 bg-[#076653] text-white rounded-lg hover:bg-[#076653]/90 transition-colors"
            >
              Try Again
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden bg-gray-50 dark:bg-gray-900">
      {/* Mobile-specific spacing adjustments */}
      <div className="sm:hidden mt-16"></div>
      
      {/* Enhanced Modern Header with Gradient Background - Mobile optimized */}
      <div className="card-mobile rounded-2xl bg-gradient-to-r from-[#076653]/10 to-[#076653]/5 p-4 sm:p-5 md:p-6 backdrop-blur-sm border border-[#076653]/20 dark:border-[#076653]/10 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#076653]/5 rounded-full -translate-y-12 translate-x-12"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#076653]/5 rounded-full translate-y-8 -translate-x-8"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#076653]/10 dark:bg-[#076653]/20 rounded-xl">
              <User size={20} className="text-[#076653]" />
            </div>
            <div>
              <h1 className="text-mobile-title text-gray-900 dark:text-white">Profile</h1>
              <p className="text-mobile-body text-gray-600 dark:text-gray-300 mt-1">Manage your account settings and preferences.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced User Profile Card with Modern Design - Mobile optimized */}
      <div className="card-mobile">
        <div className="flex flex-col gap-5">
          <div className="relative mx-auto">
            <div className="p-4 bg-gradient-to-br from-[#076653]/20 to-[#076653]/10 dark:from-[#076653]/30 dark:to-[#076653]/20 rounded-2xl border border-[#076653]/20 dark:border-[#076653]/10 shadow-lg">
              <User size={32} className="text-[#076653]" />
            </div>
            <button className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 rounded-full p-2 border-4 border-white dark:border-gray-800 shadow-lg hover:bg-[#076653]/10 transition-colors duration-200 touch-target">
              <Camera size={18} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          <div className="text-center">
            {editingProfile ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={profileData.name}
                  onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                  className="input-mobile"
                  placeholder="Full Name"
                />
                <input
                  type="email"
                  value={profileData.email}
                  onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                  className="input-mobile"
                  placeholder="Email Address"
                />
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                  className="input-mobile"
                  placeholder="Phone Number"
                />
                <input
                  type="date"
                  value={profileData.birthDate}
                  onChange={e => setProfileData({ ...profileData, birthDate: e.target.value })}
                  className="input-mobile"
                />
                <textarea
                  value={profileData.bio}
                  onChange={e => setProfileData({ ...profileData, bio: e.target.value })}
                  className="input-mobile"
                  placeholder="Bio"
                  rows="3"
                />
              </div>
            ) : (
              <>
                <h2 className="text-mobile-subtitle text-gray-900 dark:text-white">
                  {profileData.name || 'User Profile'}
                </h2>
                <p className="text-mobile-body text-gray-600 dark:text-gray-400 mt-1 truncate">
                  {profileData.email || 'No email provided'}
                </p>
                {profileData.phone && (
                  <p className="text-mobile-caption text-gray-500 dark:text-gray-400 mt-1">
                    {profileData.phone}
                  </p>
                )}
              </>
            )}
            <div className="flex items-center justify-center gap-2 mt-3">
              <div
                className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}
              ></div>
              <span className="text-mobile-caption text-gray-500 dark:text-gray-400">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Profile Actions with Modern Buttons - Mobile optimized */}
        <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50 flex flex-col gap-3">
          {editingProfile ? (
            <>
              <button
                onClick={handleProfileUpdate}
                className="btn-mobile btn-mobile-primary flex items-center justify-center gap-2"
              >
                <Save size={20} />
                <span>Save Changes</span>
              </button>
              <button
                onClick={() => setEditingProfile(false)}
                className="btn-mobile btn-mobile-secondary flex items-center justify-center gap-2"
              >
                <X size={20} />
                <span>Cancel</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditingProfile(true)}
                className="btn-mobile btn-mobile-primary flex items-center justify-center gap-2"
              >
                <Edit3 size={20} />
                <span>Edit Profile</span>
              </button>
              <button
                onClick={handleLogout}
                className="btn-mobile bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white flex items-center justify-center gap-2"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Enhanced Profile Stats with Modern Cards - Mobile optimized */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6 md:mb-8">
        <div className="card-mobile hover:shadow-xl transition-all duration-300">
          <div className="p-3 bg-blue-100/80 dark:bg-blue-900/30 rounded-xl w-14 h-14 mx-auto flex items-center justify-center mb-3">
            <TrendingUp className="text-blue-600 dark:text-blue-400" size={28} />
          </div>
          <p className="text-2xl font-bold text-center text-gray-900 dark:text-white">12</p>
          <p className="text-mobile-caption text-center text-gray-600 dark:text-gray-400 mt-1">Transactions</p>
        </div>
        <div className="card-mobile hover:shadow-xl transition-all duration-300">
          <div className="p-3 bg-green-100/80 dark:bg-green-900/30 rounded-xl w-14 h-14 mx-auto flex items-center justify-center mb-3">
            <Target className="text-green-600 dark:text-green-400" size={28} />
          </div>
          <p className="text-2xl font-bold text-center text-gray-900 dark:text-white">3</p>
          <p className="text-mobile-caption text-center text-gray-600 dark:text-gray-400 mt-1">Budgets</p>
        </div>
        <div className="card-mobile hover:shadow-xl transition-all duration-300">
          <div className="p-3 bg-purple-100/80 dark:bg-purple-900/30 rounded-xl w-14 h-14 mx-auto flex items-center justify-center mb-3">
            <Award className="text-purple-600 dark:text-purple-400" size={28} />
          </div>
          <p className="text-2xl font-bold text-center text-gray-900 dark:text-white">8</p>
          <p className="text-mobile-caption text-center text-gray-600 dark:text-gray-400 mt-1">Achievements</p>
        </div>
        <div className="card-mobile hover:shadow-xl transition-all duration-300">
          <div className="p-3 bg-yellow-100/80 dark:bg-yellow-900/30 rounded-xl w-14 h-14 mx-auto flex items-center justify-center mb-3">
            <Calendar className="text-yellow-600 dark:text-yellow-400" size={28} />
          </div>
          <p className="text-2xl font-bold text-center text-gray-900 dark:text-white">45</p>
          <p className="text-mobile-caption text-center text-gray-600 dark:text-gray-400 mt-1">Days Active</p>
        </div>
      </div>

      {/* Enhanced Settings Section with Modern Design - Mobile optimized */}
      <div className="card-mobile mb-5 sm:mb-6 md:mb-8">
        <h2 className="text-mobile-subtitle mb-5 text-gray-900 dark:text-white">Settings</h2>
        <div className="space-y-3">
          {settingsItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                onClick={() => navigate('/settings')}
                className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-[#076653]/5 dark:hover:bg-[#076653]/10 transition-all duration-200 group list-item-mobile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#076653]/10 dark:bg-[#076653]/20 rounded-xl group-hover:bg-[#076653]/20 dark:group-hover:bg-[#076653]/30 transition-colors duration-200">
                    <Icon size={22} className="text-[#076653] dark:text-[#076653]" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 dark:text-white text-base">
                      {item.label}
                    </div>
                    <div className="text-mobile-caption text-gray-600 dark:text-gray-400 mt-1">
                      {item.description}
                    </div>
                  </div>
                </div>
                <ChevronRight size={22} className="text-gray-400 group-hover:translate-x-1 transition-transform duration-200" />
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Enhanced Theme Toggle with Modern Design - Mobile optimized */}
      <div className="card-mobile mb-5 sm:mb-6 md:mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#076653]/10 dark:bg-[#076653]/20 rounded-xl">
              {darkMode ? (
                <Moon size={24} className="text-[#076653]" />
              ) : (
                <Sun size={24} className="text-[#076653]" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Theme</h3>
              <p className="text-mobile-caption text-gray-600 dark:text-gray-400">
                {darkMode ? 'Dark mode' : 'Light mode'}
              </p>
            </div>
          </div>
          <button
            onClick={handleDarkModeToggle}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 ${
              darkMode ? 'bg-[#076653]' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${
                darkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Enhanced Sync Status with Modern Design - Mobile optimized */}
      <div className="card-mobile mb-5 sm:mb-6 md:mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#076653]/10 dark:bg-[#076653]/20 rounded-xl">
              {isOnline ? (
                <Wifi size={24} className="text-green-600 dark:text-green-400" />
              ) : (
                <WifiOff size={24} className="text-red-600 dark:text-red-400" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Sync Status</h3>
              <p className="text-mobile-caption text-gray-600 dark:text-gray-400">
                {isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
          <button
            onClick={handleSyncClick}
            disabled={isSyncing || !isOnline}
            className={`p-3 rounded-xl ${
              isSyncing || !isOnline
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 dark:text-gray-400 hover:bg-[#076653]/10 dark:hover:bg-[#076653]/20 transition-colors duration-200'
            }`}
          >
            <RefreshCw
              size={24}
              className={`${isSyncing ? 'animate-spin text-yellow-500' : ''}`}
            />
          </button>
        </div>
        <div className="mt-5 pt-5 border-t border-gray-200/50 dark:border-gray-700/50">
          <p className="text-mobile-caption text-gray-500 dark:text-gray-400">
            Last synced: {new Date().toLocaleString()}
          </p>
        </div>
      </div>

      {/* Enhanced More Section with Modern Design - Mobile optimized */}
      <div className="card-mobile mb-5 sm:mb-6 md:mb-8">
        <button
          onClick={() => setShowMore(!showMore)}
          className="flex items-center justify-between w-full group"
        >
          <h2 className="text-mobile-subtitle text-gray-900 dark:text-white">More</h2>
          <motion.div animate={{ rotate: showMore ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronRight size={24} className="text-gray-500 dark:text-gray-400 group-hover:text-[#076653] transition-colors duration-200" />
          </motion.div>
        </button>

        {showMore && (
          <motion.div
            className="mt-5 space-y-3"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {moreItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-[#076653]/5 dark:hover:bg-[#076653]/10 transition-all duration-200 group list-item-mobile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#076653]/10 dark:bg-[#076653]/20 rounded-xl group-hover:bg-[#076653]/20 dark:group-hover:bg-[#076653]/30 transition-colors duration-200">
                      <Icon size={22} className="text-[#076653] dark:text-[#076653]" />
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white text-base">
                      {item.label}
                    </span>
                  </div>
                  <ChevronRight size={22} className="text-gray-400 group-hover:translate-x-1 transition-transform duration-200" />
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Enhanced App Info with Modern Design - Mobile optimized */}
      <div className="card-mobile mb-5 sm:mb-6 md:mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#076653] rounded-xl shadow-lg">
              <Heart size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Expense Tracker
              </h3>
              <p className="text-mobile-caption text-gray-600 dark:text-gray-400">Version 1.0.0</p>
            </div>
          </div>
          <button className="text-[#076653] hover:text-[#076653]/80 transition-colors duration-200">
            <Heart size={24} className="fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;