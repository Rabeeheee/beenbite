import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Building2, CreditCard, Database, BarChart3,
  Bell, LogOut, Menu, X, Gift, Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/super-admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { path: '/super-admin/companies', icon: Building2, label: 'Companies' },
  { path: '/super-admin/subscriptions', icon: CreditCard, label: 'Subscriptions' },
  { path: '/super-admin/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/super-admin/master-data', icon: Database, label: 'Master Data' },
];

export default function SuperAdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-gray-900 fixed inset-y-0 left-0 z-30">
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-white">Super Admin</span>
            <p className="text-xs text-white/40">BeenBite Platform</p>
          </div>
        </div>

        <nav className="flex-1 py-4 space-y-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive ? 'bg-white/15 text-white' : 'text-white/50 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm">SA</div>
            <div>
              <p className="text-sm font-medium text-white truncate">{user?.email}</p>
              <p className="text-xs text-white/40">Super Admin</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-white/40 hover:text-red-400 transition-colors text-sm">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-black/50 z-40 lg:hidden" />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              className="fixed inset-y-0 left-0 w-64 bg-gray-900 z-50 lg:hidden flex flex-col">
              <div className="flex items-center justify-between px-5 py-5">
                <div className="flex items-center gap-2">
                  <Shield className="w-8 h-8 text-red-500" />
                  <span className="text-lg font-bold text-white">Super Admin</span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="text-white/60"><X className="w-6 h-6" /></button>
              </div>
              <nav className="flex-1 py-4 space-y-1 px-3">
                {navItems.map((item) => (
                  <NavLink key={item.path} to={item.path} end={item.end} onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive ? 'bg-white/15 text-white' : 'text-white/50 hover:bg-white/10 hover:text-white'}`
                    }>
                    <item.icon className="w-5 h-5" /><span className="text-sm font-medium">{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-20 glass border-b border-gray-100/50 px-6 py-3">
          <div className="flex items-center justify-between">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden text-gray-500">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-xl hover:bg-gray-100"><Bell className="w-5 h-5 text-gray-500" /></button>
              <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm">SA</div>
            </div>
          </div>
        </header>
        <main className="p-6"><Outlet /></main>
      </div>
    </div>
  );
}
