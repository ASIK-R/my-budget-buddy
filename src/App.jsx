import { AnimatePresence } from 'framer-motion';
import { lazy, Suspense, memo, useEffect, useMemo } from 'react';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import NotificationSystem from './components/NotificationSystem';
import PageTransition from './components/PageTransition';
import { AppProvider, useAppContext } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';

// Lazy load only the main pages that are accessible via router
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analysis = lazy(() => import('./pages/Analysis'));
const AI = lazy(() => import('./pages/EnhancedAI'));
const Wallets = lazy(() => import('./pages/Wallets'));
const FinancialPlanning = lazy(() => import('./pages/FinancialPlanning'));
const Profile = lazy(() => import('./pages/Profile'));
const Notifications = lazy(() => import('./pages/Notifications'));
const More = lazy(() => import('./pages/More'));
const Categories = lazy(() => import('./pages/Categories'));
const Analytics = lazy(() => import('./pages/Analytics'));
const BackupRestore = lazy(() => import('./pages/BackupRestore'));
const Transactions = lazy(() => import('./pages/Transactions'));
const Search = lazy(() => import('./pages/Search'));
const Scan = lazy(() => import('./pages/Scan'));
const Budgets = lazy(() => import('./pages/Budgets'));
const Settings = lazy(() => import('./pages/Settings'));
const Support = lazy(() => import('./pages/Support'));
const Goals = lazy(() => import('./pages/Goals'));
const Investments = lazy(() => import('./pages/Investments'));
const RecurringTransactions = lazy(() => import('./pages/RecurringTransactions'));
const SharedAccounts = lazy(() => import('./pages/SharedAccounts'));

// Simple fallback without spinner
const SimpleFallback = memo(() => (
  <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
    <div className="text-primary">Loading...</div>
  </div>
));

/**
 * @param {{ children: React.ReactNode }} props
 */
const LazyPageWrapper = memo(({ children }) => (
  <Suspense fallback={<SimpleFallback />}>{children}</Suspense>
));

/**
 * @param {{ children: React.ReactNode }} props
 */
const ProtectedRoute = memo(({ children }) => {
  const appContext = useAppContext();

  // Destructure safely with fallback to empty object if context is null
  const {
    user = null,
    appInitialized = false,
    fetchAccounts = () => {},
    fetchTransactions = () => {},
    fetchBudgets = () => {},
    fetchCategories = () => {}
  } = appContext || {};

  // Fetch data when app initializes
  useEffect(() => {
    if (appInitialized && user) {
      // Fetch all necessary data
      fetchAccounts();
      fetchTransactions();
      fetchBudgets();
      fetchCategories();
    }
  }, [appInitialized, user, fetchAccounts, fetchTransactions, fetchBudgets, fetchCategories]);

  // Always show children regardless of initialization state to prevent blank screen
  // The layout and components should handle uninitialized states gracefully
  return <ErrorBoundary>{children}</ErrorBoundary>;
});

const AnimatedRoutes = memo(() => {
  const location = useLocation();
  
  // Memoize routes to prevent unnecessary re-renders
  const routes = useMemo(() => [
    { path: "/", element: <Dashboard /> },
    { path: "/analysis", element: <Analysis /> },
    { path: "/analytics", element: <Analytics /> },
    { path: "/ai", element: <AI /> },
    { path: "/wallet", element: <Wallets /> },
    { path: "/planning", element: <FinancialPlanning /> },
    { path: "/profile", element: <Profile /> },
    { path: "/notifications", element: <Notifications /> },
    { path: "/backup-restore", element: <BackupRestore /> },
    { path: "/more", element: <More /> },
    { path: "/categories", element: <Categories /> },
    { path: "/transactions", element: <Transactions /> },
    { path: "/search", element: <Search /> },
    { path: "/scan", element: <Scan /> },
    { path: "/budgets", element: <Budgets /> },
    { path: "/settings", element: <Settings /> },
    { path: "/support", element: <Support /> },
    { path: "/goals", element: <Goals /> },
    { path: "/investments", element: <Investments /> },
    { path: "/recurring-transactions", element: <RecurringTransactions /> },
    { path: "/shared-accounts", element: <SharedAccounts /> }
  ], []);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Only main pages are accessible via router */}
        {routes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute>
                <LazyPageWrapper>
                  <PageTransition>
                    {element}
                  </PageTransition>
                </LazyPageWrapper>
              </ProtectedRoute>
            }
          />
        ))}
      </Routes>
    </AnimatePresence>
  );
});

const queryClient = new QueryClient();

const App = memo(() => {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <ThemeProvider>
          <AppProvider>
            <Router>
              <Layout>
                <AnimatedRoutes />
              </Layout>
              <NotificationSystem />
            </Router>
          </AppProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
});

export default App;