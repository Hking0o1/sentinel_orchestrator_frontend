import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ScansPage from './pages/ScansPage';
import ScanDetailPage from './pages/ScanDetailPage';
import SettingsPage from './pages/SettingsPage';

// Create a client for TanStack Query
const queryClient = new QueryClient();

/**
 * App Component
 *
 * This is the root component of the application. It's responsible for:
 * 1. Setting up the QueryClientProvider for server state management.
 * 2. Setting up the AuthProvider for global authentication state.
 * 3. Defining the application's routes using React Router.
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <div className="bg-primary-dark min-h-screen text-neutral-100">
            <Routes>
              {/* --- Public Routes --- */}
              <Route path="/login" element={<LoginPage />} />

              {/* --- Protected Routes (Require Authentication) --- */}
              <Route path="/" element={<ProtectedRoute />}>
                {/* The ProtectedRoute component renders the DashboardLayout.
                  The <Outlet /> inside DashboardLayout is replaced by these
                  child routes based on the URL.
                */}
                <Route
                  index
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="scans" element={<ScansPage />} />
                <Route path="scans/:scanId" element={<ScanDetailPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* --- Fallback Route --- */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

