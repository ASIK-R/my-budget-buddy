import { useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  PieChart, 
  Wallet, 
  BarChart3, 
  TrendingUp, 
  Target,
  Bot,
  FileText,
  Calendar,
  Bell,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Shield,
  MoreHorizontal,
  Tag,
  Users,
  Repeat,
  Scan,
  Search,
  Menu
} from 'lucide-react';
import useHapticFeedback from '../hooks/useHapticFeedback';

const SideNav = ({ sidebarOpen, setSidebarOpen, sidebarMinimized, setSidebarMinimized, isMobile, onNavigate }) => {
  const sidebarRef = useRef(null);
  const location = useLocation();
  const { triggerHapticFeedback } = useHapticFeedback();

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        if (sidebarOpen && (isMobile || !sidebarMinimized)) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen, setSidebarOpen, isMobile, sidebarMinimized]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl/Cmd + B to toggle sidebar
      if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
        event.preventDefault();
        setSidebarOpen(!sidebarOpen);
      }
      
      // Escape key to close sidebar
      if (event.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [sidebarOpen, setSidebarOpen]);

  // Navigation items organized by priority
  const navItems = [
    // Core financial management (highest priority)
    { name: 'Dashboard', icon: PieChart, path: '/', priority: 1 },
    { name: 'Wallets', icon: Wallet, path: '/wallet', priority: 1 },
    { name: 'Transactions', icon: BarChart3, path: '/transactions', priority: 1 },
    
    // Financial planning and analysis (high priority)
    { name: 'Budgets', icon: Target, path: '/budgets', priority: 2 },
    { name: 'Analytics', icon: TrendingUp, path: '/analytics', priority: 2 },
    { name: 'Planning', icon: Calendar, path: '/planning', priority: 2 },
    
    // AI and reporting (medium priority)
    { name: 'AI Assistant', icon: Bot, path: '/ai', priority: 3 },
    { name: 'Reports', icon: FileText, path: '/analysis', priority: 3 },
    { name: 'Search', icon: Search, path: '/search', priority: 3 },
    
    // Additional features (lower priority)
    { name: 'Categories', icon: Tag, path: '/categories', priority: 4 },
    { name: 'Goals', icon: Target, path: '/goals', priority: 4 },
    { name: 'Investments', icon: TrendingUp, path: '/investments', priority: 4 },
    { name: 'Recurring', icon: Repeat, path: '/recurring-transactions', priority: 4 },
    { name: 'Shared Accounts', icon: Users, path: '/shared-accounts', priority: 4 },
    { name: 'Backup Restore', icon: Shield, path: '/backup-restore', priority: 4 },
  ];

  const bottomNavItems = [
    { name: 'Profile', icon: User, path: '/profile' },
    { name: 'Notifications', icon: Bell, path: '/notifications' },
    { name: 'Settings', icon: Settings, path: '/settings' },
    { name: 'Support', icon: HelpCircle, path: '/support' },
    { name: 'More', icon: MoreHorizontal, path: '/more' },
    { name: 'Scan', icon: Scan, path: '/scan' },
  ];

  const handleNavigation = (path) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      // Fallback navigation
      window.location.href = path;
    }
    triggerHapticFeedback('tap');
    
    // Close sidebar on mobile after navigation
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Sidebar */}
      <aside 
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-screen ${sidebarMinimized ? 'w-16' : (isMobile ? 'w-56 max-w-[85vw]' : 'w-64')} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40 shadow-xl transition-all duration-300 ease-in-out transform
          ${isMobile ? 'z-50' : 'md:z-40'}
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:shadow-none ${!isMobile && !sidebarOpen ? 'md:-translate-x-full' : ''} ${isMobile ? 'h-[100dvh]' : ''}`}
      >
        <div className="flex flex-col h-full bg-white dark:bg-gray-800">
          {/* Logo/Header - Kept sticky */}
          <div className="p-2 md:p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <div className="bg-secondary-500 p-1 rounded-lg">
                <PieChart size={18} className="text-white" />
              </div>
              {!sidebarMinimized && (
                <span className="text-gray-900 dark:text-white truncate">
                  ExpenseTracker
                </span>
              )}
            </h2>
          </div>

          {/* Full scrollable content including all navigation items */}
          <div className="flex-1 overflow-y-auto py-3 px-1.5 bg-white dark:bg-gray-800 md:pt-5">
            {/* Minimize/Expand Toggle Button */}
            <div className="flex justify-end px-2 mb-2">
              <button
                onClick={() => setSidebarMinimized(!sidebarMinimized)}
                className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 touch-target md:flex"
                aria-label={sidebarMinimized ? 'Expand sidebar' : 'Minimize sidebar'}
              >
                {sidebarMinimized ? (
                  <MoreHorizontal size={16} />
                ) : (
                  <Menu size={16} />
                )}
              </button>
            </div>
            <nav className="pb-4">
              {/* High Priority Section */}
              <div className="mb-6">
                {!sidebarMinimized && (
                  <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-white dark:bg-gray-800">
                    Financial Management
                  </h3>
                )}
                <ul className="space-y-1">
                  {navItems
                    .filter(item => item.priority === 1)
                    .map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                            
                      return (
                        <li key={item.name}>
                          <Link
                            to={item.path}
                            onClick={(e) => {
                              e.preventDefault();
                              handleNavigation(item.path);
                            }}
                            className={`flex items-center ${sidebarMinimized ? 'justify-center' : 'gap-2'} w-full p-2 rounded-md transition-all duration-200 touch-target ${
                              isActive
                                ? 'bg-secondary-500 text-white font-medium shadow'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 bg-white dark:bg-gray-800'
                            }`}
                          >
                            <div className={`p-1 rounded-md ${
                              isActive 
                                ? 'bg-white/20' 
                                : 'bg-gray-100 dark:bg-gray-700'
                            }`}>
                              <Icon size={18} />
                            </div>
                            {!sidebarMinimized && (
                              <span className="text-sm font-medium">{item.name}</span>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                </ul>
              </div>
          
              {/* Medium Priority Section */}
              <div className="mb-6">
                {!sidebarMinimized && (
                  <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-white dark:bg-gray-800">
                    Planning & Analysis
                  </h3>
                )}
                <ul className="space-y-1">
                  {navItems
                    .filter(item => item.priority === 2)
                    .map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                            
                      return (
                        <li key={item.name}>
                          <Link
                            to={item.path}
                            onClick={(e) => {
                              e.preventDefault();
                              handleNavigation(item.path);
                            }}
                            className={`flex items-center ${sidebarMinimized ? 'justify-center' : 'gap-2'} w-full p-2 rounded-md transition-all duration-200 touch-target ${
                              isActive
                                ? 'bg-secondary-500 text-white font-medium shadow'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 bg-white dark:bg-gray-800'
                            }`}
                          >
                            <div className={`p-1 rounded-md ${
                              isActive 
                                ? 'bg-white/20' 
                                : 'bg-gray-100 dark:bg-gray-700'
                            }`}>
                              <Icon size={18} />
                            </div>
                            {!sidebarMinimized && (
                              <span className="text-sm font-medium">{item.name}</span>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                </ul>
              </div>
          
              {/* Lower Priority Section */}
              <div className="mb-6">
                {!sidebarMinimized && (
                  <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-white dark:bg-gray-800">
                    Tools & Features
                  </h3>
                )}
                <ul className="space-y-1">
                  {navItems
                    .filter(item => item.priority === 3)
                    .map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                            
                      return (
                        <li key={item.name}>
                          <Link
                            to={item.path}
                            onClick={(e) => {
                              e.preventDefault();
                              handleNavigation(item.path);
                            }}
                            className={`flex items-center ${sidebarMinimized ? 'justify-center' : 'gap-2'} w-full p-2 rounded-md transition-all duration-200 touch-target ${
                              isActive
                                ? 'bg-secondary-500 text-white font-medium shadow'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 bg-white dark:bg-gray-800'
                            }`}
                          >
                            <div className={`p-1 rounded-md ${
                              isActive 
                                ? 'bg-white/20' 
                                : 'bg-gray-100 dark:bg-gray-700'
                            }`}>
                              <Icon size={18} />
                            </div>
                            {!sidebarMinimized && (
                              <span className="text-sm font-medium">{item.name}</span>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                </ul>
              </div>
          
              {/* Lowest Priority Section */}
              <div>
                {!sidebarMinimized && (
                  <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-white dark:bg-gray-800">
                    Additional Features
                  </h3>
                )}
                <ul className="space-y-1">
                  {navItems
                    .filter(item => item.priority >= 4)
                    .map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                            
                      return (
                        <li key={item.name}>
                          <Link
                            to={item.path}
                            onClick={(e) => {
                              e.preventDefault();
                              handleNavigation(item.path);
                            }}
                            className={`flex items-center ${sidebarMinimized ? 'justify-center' : 'gap-2'} w-full p-2 rounded-md transition-all duration-200 touch-target ${
                              isActive
                                ? 'bg-secondary-500 text-white font-medium shadow'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 bg-white dark:bg-gray-800'
                            }`}
                          >
                            <div className={`p-1 rounded-md ${
                              isActive 
                                ? 'bg-white/20' 
                                : 'bg-gray-100 dark:bg-gray-700'
                            }`}>
                              <Icon size={18} />
                            </div>
                            {!sidebarMinimized && (
                              <span className="text-sm font-medium">{item.name}</span>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </nav>
          
            {/* Bottom Navigation Items - Now part of scrollable content */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              {!sidebarMinimized && (
                <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-white dark:bg-gray-800">
                  Account
                </h3>
              )}
              <ul className="space-y-1">
                {bottomNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                        
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.path}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavigation(item.path);
                        }}
                        className={`flex items-center ${sidebarMinimized ? 'justify-center' : 'gap-2'} w-full p-2 rounded-md transition-all duration-200 touch-target ${
                          isActive
                            ? 'bg-secondary-500 text-white font-medium shadow'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 bg-white dark:bg-gray-800'
                        }`}
                      >
                        <div className={`p-1 rounded-md ${
                          isActive 
                            ? 'bg-white/20' 
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}>
                          <Icon size={18} />
                        </div>
                        {!sidebarMinimized && (
                          <span className="text-sm font-medium">{item.name}</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
                      
                {/* Logout Button */}
                <li>
                  <button
                    onClick={() => {
                      // Handle logout logic here
                      triggerHapticFeedback('tap');
                      if (isMobile) {
                        setSidebarOpen(false);
                      }
                    }}
                    className={`flex items-center ${sidebarMinimized ? 'justify-center' : 'gap-2'} w-full p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/50 transition-all duration-300 touch-target bg-white dark:bg-gray-800 shadow-sm hover:shadow-md hover:bg-red-100 dark:hover:bg-red-900/30`}
                  >
                    <div className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-700 transition-all duration-300">
                      <LogOut size={18} />
                    </div>
                    {!sidebarMinimized && (
                      <span className="text-sm font-medium transition-all duration-300">Logout</span>
                    )}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SideNav;