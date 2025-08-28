import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';
import { Layout } from './components/layout/Layout';
import { PageLoading } from './components/ui';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider } from './components/ui/ToastContainer';
import { DirectionProvider } from './components/providers/DirectionProvider';
import { ThemeProvider } from './components/providers/ThemeProvider';
import './i18n'; // Initialize i18n

// Lazy load error pages
const Error404 = lazy(() => import('./pages/Error404'));
const Error500 = lazy(() => import('./pages/Error500'));
const Maintenance = lazy(() => import('./pages/Maintenance'));

// Lazy load pages for better performance and code splitting
const Login = lazy(() => import('./pages/Login').then(module => ({ default: module.Login })));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const VerifyOTP = lazy(() => import('./pages/VerifyOTP'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const ResetSuccess = lazy(() => import('./pages/ResetSuccess'));
const Dashboard = lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));
const Fleet = lazy(() => import('./pages/Fleet').then(module => ({ default: module.Fleet })));
const Drivers = lazy(() => import('./pages/Drivers').then(module => ({ default: module.Drivers })));
const Bookings = lazy(() => import('./pages/Bookings').then(module => ({ default: module.Bookings })));
const Analytics = lazy(() => import('./pages/Analytics').then(module => ({ default: module.Analytics })));
const Settings = lazy(() => import('./pages/Settings').then(module => ({ default: module.Settings })));
const Branches = lazy(() => import('./pages/Branches').then(module => ({ default: module.Branches })));
const CarClasses = lazy(() => import('./pages/CarClasses').then(module => ({ default: module.CarClasses })));
const Shift = lazy(() => import('./pages/Shift').then(module => ({ default: module.Shift })));
const LiveMap = lazy(() => import('./pages/LiveMap').then(module => ({ default: module.LiveMap })));
const DriversEnhanced = lazy(() => import('./pages/DriversEnhanced').then(module => ({ default: module.DriversEnhanced })));
const ShiftReport = lazy(() => import('./pages/ShiftReport').then(module => ({ default: module.ShiftReport })));
const ApiExample = lazy(() => import('./components/ApiExample').then(module => ({ default: module.default })));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Main App component
function App() {
  const { checkAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Check authentication status on app load
    if (!isAuthenticated) {
      checkAuth();
    }
  }, [checkAuth, isAuthenticated]);

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log error to console in development
        if (process.env.NODE_ENV === 'development') {
          console.error('Application Error:', error, errorInfo);
        }
        // In production, you might want to send this to an error tracking service
        // Example: logErrorToService(error, errorInfo);
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <DirectionProvider>
            <ToastProvider>
            <Router>
          <div className="App">
            <Suspense fallback={<PageLoading text="Loading application..." />}>
              <Routes>
              {/* Public routes */}
              <Route 
                path="/login" 
                element={
                  <Suspense fallback={<PageLoading text="Loading login..." />}>
                    <Login />
                  </Suspense>
                } 
              />
              <Route 
                path="/forgot-password" 
                element={
                  <Suspense fallback={<PageLoading text="Loading forgot password..." />}>
                    <ForgotPassword />
                  </Suspense>
                } 
              />
              <Route 
                path="/verify-otp" 
                element={
                  <Suspense fallback={<PageLoading text="Loading OTP verification..." />}>
                    <VerifyOTP />
                  </Suspense>
                } 
              />
              <Route 
                path="/reset-password" 
                element={
                  <Suspense fallback={<PageLoading text="Loading password reset..." />}>
                    <ResetPassword />
                  </Suspense>
                } 
              />
              <Route 
                path="/reset-success" 
                element={
                  <Suspense fallback={<PageLoading text="Loading success page..." />}>
                    <ResetSuccess />
                  </Suspense>
                } 
              />
              
              {/* Protected routes */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route 
                  index 
                  element={
                    <Suspense fallback={<PageLoading text="Loading dashboard..." />}>
                      <Dashboard />
                    </Suspense>
                  } 
                />
                <Route 
                  path="dashboard" 
                  element={
                    <Suspense fallback={<PageLoading text="Loading dashboard..." />}>
                      <Dashboard />
                    </Suspense>
                  } 
                />
                
                {/* Main application routes */}
                <Route 
                  path="fleet" 
                  element={
                    <Suspense fallback={<PageLoading text="Loading fleet..." />}>
                      <Fleet />
                    </Suspense>
                  } 
                />
                <Route 
                  path="drivers" 
                  element={
                    <Suspense fallback={<PageLoading text="Loading drivers..." />}>
                      <Drivers />
                    </Suspense>
                  } 
                />
                <Route 
                  path="bookings" 
                  element={
                    <Suspense fallback={<PageLoading text="Loading bookings..." />}>
                      <Bookings />
                    </Suspense>
                  } 
                />
                <Route 
                  path="analytics" 
                  element={
                    <Suspense fallback={<PageLoading text="Loading analytics..." />}>
                      <Analytics />
                    </Suspense>
                  } 
                />
                <Route 
                  path="settings" 
                  element={
                    <Suspense fallback={<PageLoading text="Loading settings..." />}>
                      <Settings />
                    </Suspense>
                  } 
                />
                <Route 
                  path="branches" 
                  element={
                    <Suspense fallback={<PageLoading text="Loading branches..." />}>
                      <Branches />
                    </Suspense>
                  } 
                />
                <Route 
                  path="car-classes" 
                  element={
                    <Suspense fallback={<PageLoading text="Loading car classes..." />}>
                      <CarClasses />
                    </Suspense>
                  } 
                />
                <Route 
                  path="shift" 
                  element={
                    <Suspense fallback={<PageLoading text="Loading shift..." />}>
                      <Shift />
                    </Suspense>
                  } 
                />
                <Route 
                  path="live-map" 
                  element={
                    <Suspense fallback={<PageLoading text="Loading live map..." />}>
                      <LiveMap />
                    </Suspense>
                  } 
                />
                <Route 
                  path="drivers-enhanced" 
                  element={
                    <Suspense fallback={<PageLoading text="Loading drivers enhanced..." />}>
                      <DriversEnhanced />
                    </Suspense>
                  } 
                />
                <Route 
                  path="shift-report" 
                  element={
                    <Suspense fallback={<PageLoading text="Loading shift report..." />}>
                      <ShiftReport />
                    </Suspense>
                  } 
                />
                <Route 
                  path="api-example" 
                  element={
                    <Suspense fallback={<PageLoading text="Loading API example..." />}>
                      <ApiExample />
                    </Suspense>
                  } 
                />
                
                {/* Error routes */}
                <Route 
                  path="404" 
                  element={
                    <Suspense fallback={<PageLoading text="Loading error page..." />}>
                      <Error404 />
                    </Suspense>
                  } 
                />
                <Route 
                  path="500" 
                  element={
                    <Suspense fallback={<PageLoading text="Loading error page..." />}>
                      <Error500 />
                    </Suspense>
                  } 
                />
                <Route 
                  path="maintenance" 
                  element={
                    <Suspense fallback={<PageLoading text="Loading maintenance page..." />}>
                      <Maintenance />
                    </Suspense>
                  } 
                />
                
                {/* Catch all route */}
                <Route 
                  path="*" 
                  element={
                    <Suspense fallback={<PageLoading text="Loading..." />}>
                      <Error404 />
                    </Suspense>
                  } 
                />
              </Route>
             </Routes>
           </Suspense>
         </div>
            </Router>
            </ToastProvider>
          </DirectionProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
