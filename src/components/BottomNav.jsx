import { Wallet, BarChart3, User, Home, Scan } from 'lucide-react';
import AIcon from './AIcon';
import { useLocation, useNavigate } from 'react-router-dom';
import useHapticFeedback from '../hooks/useHapticFeedback.js';
import { memo, useCallback, useMemo } from 'react';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { triggerHapticFeedback } = useHapticFeedback();

  // Memoized tabs data for better performance
  const tabsData = useMemo(() => ({
    essentialTabs: [
      { path: '/', icon: <Home size={24} className="text-current" />, label: 'Home' },
      { path: '/analysis', icon: <BarChart3 size={24} className="text-current" />, label: 'Analysis' },
    ],
    middleButton: { path: '/scan', icon: <Scan size={24} className="text-current" />, label: 'Scan' },
    rightTabs: [
      { path: '/wallet', icon: <Wallet size={24} className="text-current" />, label: 'Wallet' },
      { path: '/profile', icon: <User size={24} className="text-current" />, label: 'Profile' },
    ]
  }), []);

  // Optimized navigation handler with useCallback
  const handleNavigation = useCallback((path) => {
    triggerHapticFeedback('tap');
    navigate(path);
  }, [navigate, triggerHapticFeedback]);

  // Function to determine if a tab is active - optimized with useCallback
  const isTabActive = useCallback((tabPath) => {
    // For the home route, we want exact match
    if (tabPath === '/') {
      return location.pathname === '/';
    }
    // For other routes, we check if the current path starts with the tab path
    return location.pathname.startsWith(tabPath);
  }, [location.pathname]);

  // Memoized tab components for better performance
  const leftTabs = useMemo(() => 
    tabsData.essentialTabs.map((tab) => {
      const isActive = isTabActive(tab.path);
      
      return (
        <button
          key={tab.path}
          onClick={() => handleNavigation(tab.path)}
          className={`flex flex-col items-center justify-center py-2 transition-all duration-300 touch-target transform ${
            isActive 
              ? 'text-[#076653] dark:text-teal-400 scale-105' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:scale-95'
          }`}
          aria-label={tab.label}
        >
          <div className={`p-2 rounded-lg transition-all duration-300 backdrop-blur-sm ${
            isActive 
              ? 'bg-[#076653]/20 dark:bg-teal-500/30 shadow-lg border border-[#076653]/20 dark:border-teal-500/30' 
              : 'bg-white/30 dark:bg-gray-700/30 shadow-sm border border-white/50 dark:border-gray-600/50'
          }`}>
            {tab.icon}
          </div>
        </button>
      );
    }), [tabsData.essentialTabs, isTabActive, handleNavigation]);

  // Memoized right tabs
  const rightTabs = useMemo(() => 
    tabsData.rightTabs.map((tab) => {
      const isActive = isTabActive(tab.path);
      
      return (
        <button
          key={tab.path}
          onClick={() => handleNavigation(tab.path)}
          className={`flex flex-col items-center justify-center py-2 transition-all duration-300 touch-target transform ${
            isActive 
              ? 'text-[#076653] dark:text-teal-400 scale-105' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:scale-95'
          }`}
          aria-label={tab.label}
        >
          <div className={`p-2 rounded-lg transition-all duration-300 backdrop-blur-sm ${
            isActive 
              ? 'bg-[#076653]/20 dark:bg-teal-500/30 shadow-lg border border-[#076653]/20 dark:border-teal-500/30' 
              : 'bg-white/30 dark:bg-gray-700/30 shadow-sm border border-white/50 dark:border-gray-600/50'
          }`}>
            {tab.icon}
          </div>
        </button>
      );
    }), [tabsData.rightTabs, isTabActive, handleNavigation]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/70 dark:bg-gray-900/70 border-t border-gray-200/10 dark:border-gray-700/20 backdrop-blur-3xl z-40 md:hidden safe-area-inset-bottom max-w-full shadow-xl dark:shadow-gray-900/30 rounded-t-xl overflow-x-auto">
      <div className="grid grid-cols-5 gap-1 p-2 min-w-max">
        {/* Left tabs */}
        {leftTabs}
        
        {/* Middle Scan button */}
        <button
          onClick={() => handleNavigation(tabsData.middleButton.path)}
          className="flex flex-col items-center justify-center py-2 transition-all duration-300 touch-target transform scale-110"
          aria-label={tabsData.middleButton.label}
        >
          <div className="p-3 rounded-full bg-gradient-to-r from-[#076653] to-teal-600 shadow-lg border-2 border-white dark:border-gray-800">
            {tabsData.middleButton.icon}
          </div>
        </button>
        
        {/* Right tabs */}
        {rightTabs}
      </div>
    </nav>
  );
};

// Memoize the entire component for better performance
export default memo(BottomNav);