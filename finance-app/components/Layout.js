import { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import DesktopSlider from './DesktopSlider';
import MobileNav from './MobileNav';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Layout({ children }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  // Navigation items for both desktop and mobile
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/' },
    { id: 'wallets', label: 'Wallets', path: '/wallets' },
    { id: 'transactions', label: 'Transactions', path: '/transactions' },
    { id: 'budgets', label: 'Budgets', path: '/budgets' },
    { id: 'goals', label: 'Goals', path: '/goals' },
    { id: 'reports', label: 'Reports', path: '/reports' },
    { id: 'investments', label: 'Investments', path: '/investments' },
    { id: 'recurring', label: 'Recurring', path: '/recurring' },
    { id: 'shared', label: 'Shared Accounts', path: '/shared' },
    { id: 'gamification', label: 'Gamification', path: '/gamification' },
    { id: 'integrations', label: 'Integrations', path: '/integrations' },
    { id: 'support', label: 'Support', path: '/support' },
  ];

  // Handle slide change from desktop slider
  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Navigation */}
      {!isMobile && (
        <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-1 w-10 h-10 rounded-xl flex items-center justify-center">
                  <span className="text-brand-dark font-bold text-xl">$</span>
                </div>
                <h1 className="text-2xl font-bold text-gradient">FinanceTracker</h1>
              </div>
              
              <DesktopSlider 
                navItems={navItems} 
                currentSlide={currentSlide} 
                onSlideChange={handleSlideChange} 
              />
              
              <div className="flex items-center space-x-4">
                <button className="btn-outline">Sign In</button>
                <button className="btn-primary">Sign Up</button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Mobile Navigation */}
      {isMobile && (
        <>
          {/* Mobile Header */}
          <header className="fixed top-0 left-0 right-0 z-50 glass-effect pt-6 pb-2">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="bg-gradient-1 w-10 h-10 rounded-xl flex items-center justify-center">
                    <span className="text-brand-dark font-bold text-xl">$</span>
                  </div>
                  <h1 className="text-xl font-bold text-gradient">FinanceTracker</h1>
                </div>
                
                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-lg bg-white/20 backdrop-blur-sm"
                >
                  {mobileMenuOpen ? (
                    <XMarkIcon className="h-6 w-6 text-brand-dark" />
                  ) : (
                    <Bars3Icon className="h-6 w-6 text-brand-dark" />
                  )}
                </button>
              </div>
            </div>
            
            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="absolute top-full left-0 right-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-t border-white/20 shadow-lg">
                <div className="container mx-auto px-4 py-3">
                  <div className="grid grid-cols-3 gap-2">
                    {navItems.slice(0, 9).map((item, index) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setCurrentSlide(index);
                          setMobileMenuOpen(false);
                        }}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                          currentSlide === index
                            ? 'bg-brand-accent text-white'
                            : 'text-brand-dark hover:bg-white/50 dark:text-white dark:hover:bg-gray-700/50'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                  
                  <div className="border-t border-white/20 my-2 pt-2">
                    <div className="grid grid-cols-2 gap-2">
                      {navItems.slice(9).map((item, index) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setCurrentSlide(index + 9);
                            setMobileMenuOpen(false);
                          }}
                          className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                            currentSlide === index + 9
                              ? 'bg-brand-accent text-white'
                              : 'text-brand-dark hover:bg-white/50 dark:text-white dark:hover:bg-gray-700/50'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </header>
        </>
      )}

      {/* Main Content */}
      <main className={`pt-20 ${!isMobile ? 'pt-24' : ''}`}>
        {isMobile ? (
          <div className="container mx-auto px-4 py-6">
            {children}
          </div>
        ) : (
          <DesktopSlider 
            navItems={navItems} 
            currentSlide={currentSlide} 
            onSlideChange={handleSlideChange}
          >
            {children}
          </DesktopSlider>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <MobileNav 
          navItems={navItems.slice(0, 5)} 
          currentSlide={currentSlide} 
          onSlideChange={setCurrentSlide} 
        />
      )}
    </div>
  );
}