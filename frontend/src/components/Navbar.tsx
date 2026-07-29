import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  LayoutDashboard, BarChart3, Database, Briefcase, UserCircle,
  LogOut, Menu, X, FileText, ShieldCheck, Upload, Search,
  PlusCircle, CreditCard, CheckSquare, Star, HardHat,
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'owner': return '/owner/dashboard';
      case 'contractor': return '/employer/dashboard';
      case 'skilled_worker': return '/worker/dashboard';
      default: return '/';
    }
  };

  const ownerLinks = [
    { to: '/owner/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/owner/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/owner/database', label: 'Database', icon: Database },
    { to: '/owner/projects', label: 'Projects', icon: Briefcase },
  ];

  const contractorLinks = [
    { to: '/employer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/employer/post-job', label: 'Post Job', icon: PlusCircle },
    { to: '/employer/payment', label: 'Payment', icon: CreditCard },
    { to: '/employer/projects', label: 'Projects', icon: Briefcase },
  ];

  const workerLinks = [
    { to: '/worker/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/worker/jobs', label: 'Browse Jobs', icon: Search },
    { to: '/worker/profile', label: 'Profile', icon: UserCircle },
    { to: '/worker/progress', label: 'Progress', icon: Upload },
    { to: '/worker/insurance', label: 'Insurance', icon: ShieldCheck },
  ];

  const currentLinks = user?.role === 'owner' ? ownerLinks
    : user?.role === 'contractor' ? contractorLinks
    : user?.role === 'skilled_worker' ? workerLinks
    : [];

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <>
      <nav className="sticky top-0 z-50">
        <div className="relative mx-4 my-3 rounded-3xl" style={{
          background: 'rgba(13,19,34,0.7)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}>
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-8">
              <Link to={getDashboardLink()} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F8CFF] to-[#36D7FF] flex items-center justify-center">
                  <HardHat className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight">
                  <span className="text-gradient">BRICKSY</span>
                </span>
              </Link>
              {user && (
                <div className="hidden md:flex items-center gap-1">
                  {currentLinks.map((link) => {
                    const Icon = link.icon;
                    const active = isActive(link.to);
                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={`relative flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300 ${
                          active ? 'text-white' : 'text-white/50 hover:text-white/80'
                        }`}
                      >
                        {active && (
                          <motion.div
                            layoutId="nav-pill"
                            className="absolute inset-0 rounded-2xl bg-white/5"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          />
                        )}
                        <Icon className="w-4 h-4" />
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#4F8CFF] to-[#36D7FF] flex items-center justify-center text-xs font-bold">
                      {user.name[0]}
                    </div>
                    <span className="text-sm text-white/70">{user.name}</span>
                  </div>
                  <button onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all duration-300">
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                  <button onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden p-2 rounded-2xl text-white/50 hover:text-white hover:bg-white/5 transition-all">
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login"
                    className="px-5 py-2 rounded-2xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all duration-300">
                    Sign In
                  </Link>
                  <Link to="/register"
                    className="px-5 py-2 rounded-2xl text-sm font-medium text-white bg-gradient-to-r from-[#4F8CFF] to-[#36D7FF] hover:shadow-[0_0_30px_rgba(79,140,255,0.3)] transition-all duration-300">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && user && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-4 rounded-3xl overflow-hidden"
              style={{
                background: 'rgba(13,19,34,0.95)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {currentLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors ${
                      isActive(link.to) ? 'text-white bg-white/5' : 'text-white/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
