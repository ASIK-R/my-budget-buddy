import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';
import { lazy, memo, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  Home, 
  Wallet, 
  BarChart3, 
  PieChart, 
  Bot, 
  User, 
  Settings as SettingsIcon,
  Wifi,
  WifiOff,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import useHapticFeedback from '../hooks/useHapticFeedback.js';

// Lazy load all pages for slider (same as in App.jsx)
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Analysis = lazy(() => import('../pages/Analysis'));
const AI = lazy(() => import('../pages/AI'));
const Wallets = lazy(() => import('../pages/Wallets'));
const FinancialPlanning = lazy(() => import('../pages/FinancialPlanning'));
const Budgets = lazy(() => import('../pages/Budgets'));
const Gamification = lazy(() => import('../pages/Gamification'));
const Goals = lazy(() => import('../pages/Goals'));
const Integrations = lazy(() => import('../pages/Integrations'));
const Investments = lazy(() => import('../pages/Investments'));
const Profile = lazy(() => import('../pages/Profile'));
const RecurringTransactions = lazy(() => import('../pages/RecurringTransactions'));
const Reports = lazy(() => import('../pages/Reports'));
const Settings = lazy(() => import('../pages/Settings'));
const SharedAccounts = lazy(() => import('../pages/SharedAccounts'));
const Support = lazy(() => import('../pages/Support'));
const Notifications = lazy(() => import('../pages/Notifications'));
const Categories = lazy(() => import('../pages/Categories'));

const slides = [
  { id: 'dashboard', component: Dashboard, label: 'Dashboard' },
  { id: 'ai', component: AI, label: 'AI Insights' },
  { id: 'analysis', component: Analysis, label: 'Analysis' },
  { id: 'wallets', component: Wallets, label: 'Wallets' },
  { id: 'planning', component: FinancialPlanning, label: 'Financial Planning' },
  { id: 'categories', component: Categories, label: 'Categories' },
  { id: 'investments', component: Investments, label: 'Investments' },
  { id: 'gamification', component: Gamification, label: 'Gamification' },
  { id: 'goals', component: Goals, label: 'Goals' },
  { id: 'reports', component: Reports, label: 'Reports' },
  { id: 'recurring', component: RecurringTransactions, label: 'Recurring' },
  { id: 'notifications', component: Notifications, label: 'Notifications' },
  { id: 'shared', component: SharedAccounts, label: 'Shared Accounts' },
  { id: 'integrations', component: Integrations, label: 'Integrations' },
  { id: 'support', component: Support, label: 'Support' },
  { id: 'settings', component: Settings, label: 'Settings' },
  { id: 'profile', component: Profile, label: 'Profile' },
];

// Loading component
const SlideLoader = () => (
  <div className="flex items-center justify-center h-full min-h-[400px]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-secondary-200 border-t-secondary-600 rounded-full animate-spin" />
      <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
    </div>
  </div>
);

const DesktopSlider = memo(({ initialSlide = 0, onSlideChange }) => {
  const [currentSlide, setCurrentSlide] = useState(initialSlide);
  const [direction, setDirection] = useState(0);
  const x = useMotionValue(0);
  const { isOnline } = useAppContext();
  const { triggerHapticFeedback } = useHapticFeedback();

  console.log('DesktopSlider render:', { initialSlide, currentSlide });

  // Ensure content is displayed
  if (initialSlide === undefined || currentSlide === undefined) {
    console.log('Slider not ready, showing fallback');
    return <div className="p-4">Loading slider...</div>;
  }

  // Memoize slides to prevent unnecessary re-renders
  const memoizedSlides = useMemo(() => slides, []);

  // Sync with external slide changes (from SideNav)
  useEffect(() => {
    if (initialSlide !== currentSlide) {
      const dir = initialSlide > currentSlide ? 1 : -1;
      setDirection(dir);
      setCurrentSlide(initialSlide);
      triggerHapticFeedback('tap');
    }
  }, [initialSlide, currentSlide]);

  const handleSlideChange = useCallback(
    (index, dir = 0) => {
      if (index === currentSlide) {
        return;
      }
      setDirection(dir);
      setCurrentSlide(index);
      if (onSlideChange) {
        onSlideChange(index);
      }
      triggerHapticFeedback('tap');
      // Reduced timeout to prevent blinking
      setTimeout(() => {
        x.set(0);
      }, 300);
    },
    [currentSlide, onSlideChange, x]
  );

  const handleDragEnd = useCallback(
    (event, info) => {
      const swipeThreshold = 50;
      const velocityThreshold = 500;

      if (
        Math.abs(info.offset.x) > swipeThreshold ||
        Math.abs(info.velocity.x) > velocityThreshold
      ) {
        if (info.offset.x > 0 && currentSlide > 0) {
          handleSlideChange(currentSlide - 1, -1);
        } else if (info.offset.x < 0 && currentSlide < memoizedSlides.length - 1) {
          handleSlideChange(currentSlide + 1, 1);
        } else {
          // Smooth return to center
          x.set(0);
        }
      } else {
        // Smooth return to center
        x.set(0);
      }
    },
    [currentSlide, handleSlideChange, x, memoizedSlides.length]
  );

  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'ArrowLeft' && currentSlide > 0) {
        handleSlideChange(currentSlide - 1, -1);
      } else if (
        e.key === 'ArrowRight' &&
        currentSlide < memoizedSlides.length - 1
      ) {
        handleSlideChange(currentSlide + 1, 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, handleSlideChange, memoizedSlides.length]);

  // Improved slide variants for smoother transitions
  const slideVariants = {
    enter: direction => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 400, damping: 35 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 },
      },
    },
    exit: direction => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: 'spring', stiffness: 400, damping: 35 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 },
      },
    }),
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: 0.1,
      },
    },
  };

  // Memoize the current component to prevent re-creation
  const CurrentComponent = useMemo(() => {
    const component = memoizedSlides[currentSlide]?.component || Dashboard;
    console.log('Current slide component:', memoizedSlides[currentSlide]?.label || 'Dashboard');
    return component;
  }, [currentSlide, memoizedSlides]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence
          initial={false}
          mode="wait"
          custom={direction}
        >
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            style={{ x }}
            className="absolute inset-0"
          >
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="h-full"
            >
              <Suspense fallback={<SlideLoader />}>
                <CurrentComponent />
              </Suspense>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
});

export default DesktopSlider;