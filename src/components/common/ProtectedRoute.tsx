import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { DashboardLayout } from '../layouts/DashboardLayout';

/**
 * ProtectedRoute Component
 *
 * This component acts as a guard for routes that require authentication.
 *
 * How it works:
 * 1. It consumes the `AuthContext` using the `useAuth` hook to check the
 * user's authentication status.
 * 2. If `isAuthenticated` is true, it renders the main `DashboardLayout`
 * (Sidebar + Header) and then renders the specific page (the `Outlet`)
 * inside that layout.
 * 3. If `isAuthenticated` is false, it uses the `Maps` component from
 * `react-router-dom` to automatically redirect the user to the `/login` page.
 */
export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // User is not authenticated, redirect to login page.
    // `replace` is used to replace the current entry in the history stack,
    // so the user can't click "back" to the protected route.
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render the main dashboard layout.
  // The <Outlet /> is a placeholder from react-router-dom that will be
  // replaced by the specific child route (e.g., DashboardPage, ScansPage).
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

