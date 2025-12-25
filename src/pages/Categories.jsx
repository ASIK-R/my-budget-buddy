import { useState, useMemo, memo } from 'react';
import { 
  TrendingUp, 
  Bell, 
  HelpCircle, 
  Settings as SettingsIcon,
  User,
  BarChart3,
  Wallet,
  Target,
  Award,
  Share2,
  Shield,
  FileText,
  Download,
  Heart,
  PieChart,
  Bot,
  Database,
  Repeat,
  Cloud,
  Gift,
  Users,
  Lock,
  Eye,
  Upload,
  Palette,
  Home,
  PiggyBank,
  Phone,
  MessageSquare,
  Info,
  FolderOpen,
  Tag,
  Grid
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const navigate = useNavigate();

  // Comprehensive list of all available pages organized by category
  const allFeatures = useMemo(() => [
    {
      id: 'core',
      title: 'Core Features',
      icon: Home,
      description: 'Essential financial management tools',
      items: [
        { id: 'dashboard', icon: PieChart, label: 'Dashboard', path: '/' },
        { id: 'wallets', icon: Wallet, label: 'Wallets', path: '/wallet' },
        { id: 'transactions', icon: BarChart3, label: 'Transactions', path: '/analysis' },
        { id: 'financial-planning', icon: TrendingUp, label: 'Financial Planning', path: '/planning' },
        { id: 'ai-insights', icon: Bot, label: 'AI Insights', path: '/ai' },
      ]
    },
    {
      id: 'management',
      title: 'Management Tools',
      icon: Database,
      description: 'Advanced financial control systems',
      items: [
        { id: 'budgets', icon: PiggyBank, label: 'Budgets', path: '/budgets' },
        { id: 'goals', icon: Target, label: 'Financial Goals', path: '/goals' },
        { id: 'recurring', icon: Repeat, label: 'Recurring Transactions', path: '/recurring' },
        { id: 'investments', icon: TrendingUp, label: 'Investments', path: '/' },
        { id: 'reports', icon: FileText, label: 'Reports', path: '/reports' },
      ]
    },
    {
      id: 'account',
      title: 'Account & Profile',
      icon: User,
      description: 'Personal settings and security',
      items: [
        { id: 'profile', icon: User, label: 'Profile', path: '/profile' },
        { id: 'notifications', icon: Bell, label: 'Notifications', path: '/notifications' },
        { id: 'settings', icon: SettingsIcon, label: 'Settings', path: '/settings' },
        { id: 'security', icon: Lock, label: 'Security', path: '/settings#security' },
        { id: 'privacy', icon: Eye, label: 'Privacy Policy', path: '/settings#privacy' },
      ]
    },
    {
      id: 'social',
      title: 'Social & Sharing',
      icon: Users,
      description: 'Community and collaboration features',
      items: [
        { id: 'achievements', icon: Award, label: 'Achievements', path: '/gamification' },
        { id: 'shared-accounts', icon: Share2, label: 'Shared Accounts', path: '/shared-accounts' },
        { id: 'referrals', icon: Gift, label: 'Referral Program', path: '#' },
      ]
    },
    {
      id: 'support',
      title: 'Support & Help',
      icon: HelpCircle,
      description: 'Assistance and information resources',
      items: [
        { id: 'support', icon: HelpCircle, label: 'Support Center', path: '/support' },
        { id: 'faq', icon: HelpCircle, label: 'FAQ', path: '/support#faq' },
        { id: 'contact', icon: Phone, label: 'Contact Us', path: '/support#contact' },
        { id: 'feedback', icon: MessageSquare, label: 'Feedback', path: '/support#feedback' },
      ]
    },
    {
      id: 'utilities',
      title: 'Utilities & Extras',
      icon: SettingsIcon,
      description: 'Additional tools and customization',
      items: [
        { id: 'integrations', icon: Share2, label: 'Integrations', path: '/integrations' },
        { id: 'backup', icon: Cloud, label: 'Backup & Sync', path: '#' },
        { id: 'export', icon: Download, label: 'Export Data', path: '#' },
        { id: 'import', icon: Upload, label: 'Import Data', path: '#' },
        { id: 'themes', icon: Palette, label: 'Themes', path: '/settings#themes' },
      ]
    }
  ], []);

  const handleNavigation = (path) => {
    if (path && path !== '#') {
      navigate(path);
    }
  };

  return (
    <div className="p-responsive w-full max-w-full overflow-x-hidden bg-gray-50 dark:bg-gray-900">
      {/* Mobile-specific spacing adjustments */}
      <div className="sm:hidden mt-16"></div>
      <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6 md:space-y-7 lg:space-y-8">
        
        {/* Modern Header with Gradient Background */}
        <div className="rounded-3xl bg-gradient-to-r from-[#076653]/10 to-[#076653]/5 p-5 sm:p-6 md:p-7 backdrop-blur-xl border border-[#076653]/20 dark:border-[#076653]/10 relative overflow-hidden shadow-xl">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#076653]/5 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#076653]/5 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Categories</h1>
                <p className="text-gray-600 dark:text-gray-300">Organize and manage all your financial tools</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 bg-[#076653]/10 text-[#076653] rounded-full text-sm font-medium">
                  {allFeatures.length} Categories
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Note */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/30 dark:from-blue-900/30 dark:to-blue-800/20 p-4 border border-blue-200/50 dark:border-blue-700/30 backdrop-blur-xl shadow-lg">
          <div className="flex items-start gap-3">
            <Info size={20} className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <span className="font-semibold">Note:</span> Some advanced features like Investments are accessed through slider navigation on desktop or by swiping between screens.
            </p>
          </div>
        </div>

        {/* All Categories Grid */}
        <div className="space-y-5 sm:space-y-6 md:space-y-7 lg:space-y-8 pb-24">
          {allFeatures.map((category) => {
            const CategoryIcon = category.icon;
            return (
              <div key={category.id} className="rounded-3xl bg-gradient-to-br from-white/40 to-gray-100/40 dark:from-gray-800/40 dark:to-gray-900/40 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 shadow-xl overflow-hidden relative">
                {/* Liquid glass effect elements */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#076653]/5 rounded-full -translate-y-12 translate-x-12 blur-xl"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#076653]/5 rounded-full translate-y-8 -translate-x-8 blur-xl"></div>
                
                <div className="p-5 sm:p-6 relative z-10">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="p-3 rounded-xl bg-[#076653]/10 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 shadow-lg">
                      <CategoryIcon size={24} className="text-[#076653]" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{category.title}</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
                    </div>
                    <div className="ml-auto px-3 py-1 bg-[#076653]/10 text-[#076653] rounded-full text-sm font-medium">
                      {category.items.length} items
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-3 sm:gap-4">
                    {category.items.map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavigation(item.path)}
                          className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-300 group shadow-lg hover:shadow-xl hover:-translate-y-1 relative overflow-hidden"
                        >
                          {/* Inner glow effect */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-[#076653]/20 to-[#076653]/10 flex items-center justify-center text-[#076653] mb-3 group-hover:scale-110 transition-all duration-300 shadow-md border border-white/20 backdrop-blur-lg relative z-10">
                            <ItemIcon size={24} className="sm:size-7" />
                          </div>
                          <span className="text-xs sm:text-sm font-semibold text-center text-gray-800 dark:text-gray-200 group-hover:text-[#076653] dark:group-hover:text-[#076653] truncate px-1 transition-colors duration-300 relative z-10">
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default memo(Categories);