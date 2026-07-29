import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BarChart3, Database, Briefcase, Activity, ArrowRight } from 'lucide-react';
import PageTransition from '../components/ui/PageTransition';

const links = [
  { to: '/owner/analytics', icon: BarChart3, label: 'Analytics Dashboard', desc: 'View platform statistics and insights', color: '#4F8CFF' },
  { to: '/owner/projects', icon: Briefcase, label: 'Project Monitoring', desc: 'Monitor all construction projects', color: '#36D7FF' },
  { to: '/owner/database', icon: Database, label: 'Database', desc: 'Access system database records', color: '#22C55E' },
];

export default function OwnerDashboard() {
  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Owner Dashboard</h1>
          <p className="text-white/45">Platform overview and management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {links.map((link, i) => {
            const Icon = link.icon;
            return (
              <Link key={link.to} to={link.to}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="relative group rounded-3xl p-6 overflow-hidden cursor-pointer h-full"
                  style={{
                    background: 'rgba(17,24,39,0.6)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03]" style={{ background: `radial-gradient(circle, ${link.color}, transparent)` }} />
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-2xl" style={{ background: `${link.color}15` }}>
                      <Icon className="w-6 h-6" style={{ color: link.color }} />
                    </div>
                    <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-white/50 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{link.label}</h3>
                  <p className="text-sm text-white/45">{link.desc}</p>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Status card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl p-6"
          style={{
            background: 'rgba(17,24,39,0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-[#22C55E]/10">
              <Activity className="w-6 h-6 text-[#22C55E]" />
            </div>
            <div>
              <p className="text-lg font-semibold">Platform Status</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                <span className="text-sm text-[#22C55E] font-medium">All systems operational</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
