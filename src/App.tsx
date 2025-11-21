import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { LandingPage } from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ScansPage from './pages/ScansPage';
import ScanDetailPage from './pages/ScanDetailPage';
import SettingsPage from './pages/SettingsPage';
// --- NEW IMPORTS ---
import ReportsPage from './pages/ReportsPage';
import VulnerabilitiesPage from './pages/VulnerabilitiesPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <div className="bg-primary-dark min-h-screen text-neutral-100">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Routes */}
              <Route path="/app" element={<ProtectedRoute />}>
                <Route index element={<Navigate to="/app/dashboard" replace />} />
                
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="scans" element={<ScansPage />} />
                <Route path="scans/:scanId" element={<ScanDetailPage />} />
                <Route path="settings" element={<SettingsPage />} />
                
                {/* --- NEW ROUTES --- */}
                <Route path="reports" element={<ReportsPage />} />
                <Route path="vulnerabilities" element={<VulnerabilitiesPage />} />
                {/* ------------------ */}
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