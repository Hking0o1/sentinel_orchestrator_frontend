import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { LandingPage } from './pages/LandingPage'; // <-- Import Landing Page
import DashboardPage from './pages/DashboardPage';
import ScansPage from './pages/ScansPage';
import ScanDetailPage from './pages/ScanDetailPage';
import SettingsPage from './pages/SettingsPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <div className="bg-primary-dark min-h-screen text-neutral-100">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} /> {/* Root is now Landing Page */}
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Routes */}
              <Route path="/app" element={<ProtectedRoute />}> {/* Changed prefix to /app */}
                <Route index element={<Navigate to="/app/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="scans" element={<ScansPage />} />
                <Route path="scans/:scanId" element={<ScanDetailPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;