import { useState, useEffect, useMemo, memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SideNav from './SideNav';
import BottomNav from './BottomNav';
import MobileFAB from './MobileFAB';
import QuickTransactionInput from './QuickTransactionInput';
import { useAppContext } from '../context/AppContext';
import { Search, Bell, User, Menu, X, MoreHorizontal } from 'lucide-react';
import useHapticFeedback from '../hooks/useHapticFeedback';

const Layout = memo(({ children, hideHeaderAndSidebar = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isMobile } = useAppContext();
  const { triggerHapticFeedback } = useHapticFeedback();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showMobileFAB, setShowMobileFAB] = useState(true);

  // Determine if we should show the mobile FAB
  useEffect(() => {
    const hideFABPages = ['/', '/scan', '/ai'];
    setShowMobileFAB(!hideFABPages.includes(location.pathname));
  }, [location.pathname]);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close if clicking on menu buttons or sidebar
      if (sidebarOpen && 
          !event.target.closest('.sidebar') && 
          !event.target.closest('.menu-button') &&
          !event.target.closest('.minimize-button')) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen]);

  // Keyboard shortcuts for sidebar
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
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen]);

  // Close sidebar on route change (for mobile)
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location, isMobile]);

  // Handle escape key press
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        setSidebarOpen(false);
        setSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Navigation handler with haptic feedback
  const handleNavigation = (path) => {
    navigate(path);
    triggerHapticFeedback('tap');
    setSidebarOpen(false);
  };

  // Render nothing if hiding header and sidebar
  if (hideHeaderAndSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 w-full max-w-full overflow-x-hidden">
      {/* Header - Enhanced for desktop */}
      {!hideHeaderAndSidebar && (
        <header className={`fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl z-30 h-16 flex items-center px-4 border-b border-gray-200/20 dark:border-gray-700/30 safe-area-inset-top shadow-xl dark:shadow-gray-900/30 rounded-b-lg transition-all duration-300 ${isMobile ? 'px-2' : (sidebarOpen ? (sidebarMinimized ? 'md:ml-20' : 'md:ml-64') : 'md:ml-0')}`}>
          <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
            {/* Left side - Menu and Logo/Title */}
            <div className="flex items-center gap-3">
              {/* Unified Menu Button - Works for both mobile and desktop */}
              <button
                onClick={() => {
                  setSidebarOpen(!sidebarOpen);
                  triggerHapticFeedback('tap');
                }}
                className="menu-button flex items-center justify-center p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 touch-target"
                aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={sidebarOpen}
                title='Press Ctrl+B to toggle sidebar'
              >
                {sidebarOpen ? (
                  <X size={20} className="text-gray-700 dark:text-gray-300" />
                ) : (
                  <Menu size={20} className="text-gray-700 dark:text-gray-300" />
                )}
              </button>
              
              {/* Desktop Minimize Sidebar Button - Only show when sidebar is open and not on mobile */}
              {!isMobile && sidebarOpen && (
                <button
                  onClick={() => {
                    setSidebarMinimized(!sidebarMinimized);
                    triggerHapticFeedback('tap');
                  }}
                  className="minimize-button hidden md:flex items-center justify-center p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 touch-target"
                  aria-label={sidebarMinimized ? 'Expand sidebar' : 'Minimize sidebar'}
                  aria-expanded={!sidebarMinimized}
                  title={'Press Ctrl+B to toggle sidebar. ' + (sidebarMinimized ? 'Press again to expand' : 'Press again to minimize')}
                >
                  {sidebarMinimized ? (
                    <Menu size={20} className="text-gray-700 dark:text-gray-300" />
                  ) : (
                    <MoreHorizontal size={20} className="text-gray-700 dark:text-gray-300" />
                  )}
                </button>
              )}
              
              {/* Title for mobile, logo for desktop */}
              <h1 
                onClick={() => {
                  navigate('/');
                  triggerHapticFeedback('tap');
                }}
                className="text-lg md:text-xl font-bold text-gray-900 dark:text-white cursor-pointer hover:opacity-80 transition-opacity duration-200"
              >
                ExpenseTracker
              </h1>
            </div>

            {/* Center - Search (desktop only) */}
            <div className="hidden md:flex flex-1 max-w-md mx-6">
              <div className="relative w-full">
                <Search 
                  size={18} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" 
                />
                <input
                  type="text"
                  placeholder="Search transactions, categories..."
                  className="w-full py-2 px-4 pl-10 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#076653] focus:border-transparent text-sm"
                  onFocus={() => triggerHapticFeedback('tap')}
                />
              </div>
            </div>

            {/* Right side - Icons */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Search icon for mobile */}
              <button
                onClick={() => {
                  setSearchOpen(!searchOpen);
                  triggerHapticFeedback('tap');
                }}
                className="md:hidden flex items-center justify-center p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 touch-target"
                aria-label="Search"
              >
                <Search size={20} className="text-gray-700 dark:text-gray-300" />
              </button>
              
              {/* Notification icon */}
              <button
                onClick={() => {
                  handleNavigation('/notifications');
                  triggerHapticFeedback('tap');
                }}
                className="flex items-center justify-center p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 touch-target relative"
                aria-label="Notifications"
              >
                <Bell size={20} className="text-gray-700 dark:text-gray-300" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              {/* Profile icon */}
              <button
                onClick={() => {
                  handleNavigation('/profile');
                  triggerHapticFeedback('tap');
                }}
                className="flex items-center justify-center p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 touch-target"
                aria-label="Profile"
              >
                <User size={20} className="text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Mobile Search Bar */}
      {searchOpen && isMobile && (
        <div className="fixed top-16 left-0 right-0 bg-white dark:bg-gray-900 z-20 p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search 
              size={18} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" 
            />
            <input
              type="text"
              placeholder="Search transactions, categories..."
              className="w-full py-3 px-4 pl-10 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#076653] focus:border-transparent"
              autoFocus
              onBlur={() => setSearchOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="flex flex-1 pt-16 md:pt-4">
        {/* Sidebar - Always render for desktop, conditionally for mobile */}
        {!hideHeaderAndSidebar && (
          <SideNav 
            sidebarOpen={sidebarOpen} 
            setSidebarOpen={setSidebarOpen}
            sidebarMinimized={sidebarMinimized}
            setSidebarMinimized={setSidebarMinimized}
            isMobile={isMobile}
            onNavigate={handleNavigation}
          />
        )}
        
        <main className={`flex-1 transition-all duration-300 ${!hideHeaderAndSidebar ? 'pt-16 pb-20 md:pt-4 md:pb-0' : ''} ${isMobile ? 'ml-0' : (sidebarOpen ? (sidebarMinimized ? 'md:ml-20' : 'md:ml-64') : 'md:ml-0')} w-full max-w-full overflow-x-hidden bg-gray-50 dark:bg-gray-900 ${isMobile ? 'mobile-scrollbar' : 'desktop-scrollbar'}`} style={{minWidth: 0, maxWidth: '100vw'}}>
          <div className={`p-responsive w-full max-w-full overflow-x-hidden md:pl-6 md:pr-6 md:pt-6 smooth-scroll ${sidebarOpen && !isMobile ? (sidebarMinimized ? 'md:pl-24' : 'md:pl-72') : 'md:pl-6 md:pr-6'}`}>
            {/* Always show content immediately */}
            {children}
          </div>
          {/* Mobile FAB for adding transactions - only show on specific pages, not on home page */}
          {showMobileFAB && isMobile && <MobileFAB />}
        </main>
      </div>

      {/* Bottom Navigation for mobile - Show on all mobile views regardless of authentication */}
      {isMobile && <BottomNav />}
      {/* Quick Transaction Input - only show on home page */}
      {isAuthenticated && location.pathname === '/' && isMobile && <QuickTransactionInput />}
    </div>
  );
});

export default Layout;