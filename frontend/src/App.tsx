import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Dashboard layouts
import AdminLayout from './layouts/AdminLayout';
import SuperAdminLayout from './layouts/SuperAdminLayout';

// Client Admin pages
import Dashboard from './pages/admin/Dashboard';
import UsersPage from './pages/admin/UsersPage';
import ProductsPage from './pages/admin/ProductsPage';
import CategoriesPage from './pages/admin/CategoriesPage';
import RewardsPage from './pages/admin/RewardsPage';
import SettingsPage from './pages/admin/SettingsPage';
import ThemePage from './pages/admin/ThemePage';

// Super Admin pages
import SuperDashboard from './pages/super-admin/SuperDashboard';
import CompaniesPage from './pages/super-admin/CompaniesPage';
import SubscriptionsPage from './pages/super-admin/SubscriptionsPage';
import AnalyticsPage from './pages/super-admin/AnalyticsPage';
import MasterDataPage from './pages/super-admin/MasterDataPage';

// Context
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Client Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['company_admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="rewards" element={<RewardsPage />} />
              <Route path="theme" element={<ThemePage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Super Admin Routes */}
            <Route path="/super-admin" element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <SuperAdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<SuperDashboard />} />
              <Route path="companies" element={<CompaniesPage />} />
              <Route path="subscriptions" element={<SubscriptionsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="master-data" element={<MasterDataPage />} />
            </Route>
          </Routes>
        </Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#fff',
              borderRadius: '12px',
            },
          }}
        />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
