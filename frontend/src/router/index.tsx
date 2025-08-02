import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import ErrorBoundary from '../components/common/ErrorBoundary';
import LoadingScreen from '../components/common/LoadingScreen';
import ProtectedRoute from '../components/common/ProtectedRoute';
import NotFound from '../components/common/NotFound';

// Lazy load pages for better performance
const HomePage = lazy(() => import('../pages/HomePage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const IssueDetailsPage = lazy(() => import('../pages/IssueDetailsPage'));
const ReportIssuePage = lazy(() => import('../pages/ReportIssuePage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));

// Wrapper component for lazy loaded pages
const LazyWrapper = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingScreen />}>
      {children}
    </Suspense>
  </ErrorBoundary>
);

// Unauthorized page component
const UnauthorizedPage = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div className="max-w-md w-full text-center">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-warning-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-warning-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Access Denied
        </h1>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page.
        </p>
        <a href="/" className="btn-primary w-full inline-block">
          Go Home
        </a>
      </div>
    </div>
  </div>
);

// Create router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <LazyWrapper>
        <HomePage />
      </LazyWrapper>
    ),
    errorElement: <NotFound />,
  },
  {
    path: '/login',
    element: (
      <LazyWrapper>
        <LoginPage />
      </LazyWrapper>
    ),
  },
  {
    path: '/register',
    element: (
      <LazyWrapper>
        <RegisterPage />
      </LazyWrapper>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <LazyWrapper>
          <DashboardPage />
        </LazyWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/report',
    element: (
      <ProtectedRoute>
        <LazyWrapper>
          <ReportIssuePage />
        </LazyWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <LazyWrapper>
          <ProfilePage />
        </LazyWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/issue/:id',
    element: (
      <LazyWrapper>
        <IssueDetailsPage />
      </LazyWrapper>
    ),
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requiredRole="admin">
        <LazyWrapper>
          <AdminDashboard />
        </LazyWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

// Router provider component
const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;