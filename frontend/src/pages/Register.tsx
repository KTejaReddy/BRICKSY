import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { HardHat, User, Mail, Lock, Shield, Wrench } from 'lucide-react';

const TRADES = ['mason', 'electrician', 'plumber', 'carpenter', 'painter', 'welder'];

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'skilled_worker', trade: 'mason' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative rounded-4xl p-8"
        style={{
          background: 'rgba(17,24,39,0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4F8CFF] to-[#36D7FF] flex items-center justify-center mx-auto mb-4">
            <HardHat className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Create account</h1>
          <p className="text-white/45 mt-1">AI Creates Your Digital Profile</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] text-sm mb-6"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/70">Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input type="text" required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your full name"
                className="w-full pl-12 pr-4 py-3 bg-[#0D1322]/80 border border-white/10 rounded-2xl text-white placeholder-white/25 outline-none focus:border-[#4F8CFF] focus:shadow-[0_0_20px_rgba(79,140,255,0.1)] transition-all duration-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/70">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-3 bg-[#0D1322]/80 border border-white/10 rounded-2xl text-white placeholder-white/25 outline-none focus:border-[#4F8CFF] focus:shadow-[0_0_20px_rgba(79,140,255,0.1)] transition-all duration-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/70">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input type="password" required value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Create a password"
                className="w-full pl-12 pr-4 py-3 bg-[#0D1322]/80 border border-white/10 rounded-2xl text-white placeholder-white/25 outline-none focus:border-[#4F8CFF] focus:shadow-[0_0_20px_rgba(79,140,255,0.1)] transition-all duration-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/70">Role</label>
            <div className="relative">
              <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 z-10" />
              <select value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-[#0D1322]/80 border border-white/10 rounded-2xl text-white outline-none focus:border-[#4F8CFF] focus:shadow-[0_0_20px_rgba(79,140,255,0.1)] transition-all duration-300 appearance-none cursor-pointer"
              >
                <option value="skilled_worker">Skilled Worker</option>
                <option value="contractor">Contractor</option>
                <option value="owner">Owner</option>
              </select>
            </div>
          </div>

          {form.role === 'skilled_worker' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-2"
            >
              <label className="block text-sm font-medium text-white/70">Trade</label>
              <div className="relative">
                <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 z-10" />
                <select value={form.trade}
                  onChange={(e) => setForm({ ...form, trade: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-[#0D1322]/80 border border-white/10 rounded-2xl text-white outline-none focus:border-[#4F8CFF] focus:shadow-[0_0_20px_rgba(79,140,255,0.1)] transition-all duration-300 appearance-none cursor-pointer"
                >
                  {TRADES.map((t) => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-[#4F8CFF] to-[#36D7FF] hover:shadow-[0_0_30px_rgba(79,140,255,0.3)] disabled:opacity-50 transition-all duration-300"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                Creating account...
              </span>
            ) : 'Register & Create Digital Profile'}
          </button>
        </form>

        <p className="text-center text-sm text-white/45 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#4F8CFF] hover:text-[#36D7FF] transition-colors font-medium">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
