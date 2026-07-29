import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import PageTransition from '../components/ui/PageTransition';
import StatCard from '../components/ui/StatCard';
import GlassCard from '../components/ui/GlassCard';
import Skeleton from '../components/ui/Skeleton';
import { UserCircle, Briefcase, Star, BarChart3, Clock, Shield, Edit3, Search, Upload, ShieldCheck, ArrowRight } from 'lucide-react';

export default function WorkerDashboard() {
  const { user } = useAuth();
  const [worker, setWorker] = useState<any>(null);

  useEffect(() => {
    api.get('/workers').then((res) => {
      const w = res.data.find((w: any) => w.user_id === user?.id);
      if (w) setWorker(w);
    }).catch(() => {});
  }, [user]);

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Worker Dashboard</h1>
          <p className="text-white/45">Your digital profile and work overview</p>
        </div>

        {worker ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <StatCard label="Experience" value={worker.experience} suffix=" yrs" icon={<Clock className="w-5 h-5 text-[#4F8CFF]" />} color="#4F8CFF" index={0} />
              <StatCard label="Tenure" value={worker.tenure} suffix=" yrs" icon={<BarChart3 className="w-5 h-5 text-[#36D7FF]" />} color="#36D7FF" index={1} />
              <StatCard label="Rating" value={worker.rating} prefix="" icon={<Star className="w-5 h-5 text-[#F59E0B]" />} color="#F59E0B" index={2} decimals={1} />
              <StatCard label="Previous Projects" value={worker.previous_projects} icon={<Briefcase className="w-5 h-5 text-[#22C55E]" />} color="#22C55E" index={3} />
              <StatCard label="Availability" value={Number((worker.availability_score * 100).toFixed(0))} suffix="%" icon={<BarChart3 className="w-5 h-5 text-[#4F8CFF]" />} color="#4F8CFF" index={4} />
              <StatCard label="Trust Score" value={Number((worker.trust_score * 100).toFixed(0))} suffix="%" icon={<Shield className="w-5 h-5 text-[#22C55E]" />} color="#22C55E" index={5} />
            </div>

            <GlassCard className="mb-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4F8CFF] to-[#36D7FF] flex items-center justify-center">
                    <UserCircle className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{user?.name}</h2>
                    <p className="text-white/45">{user?.email}</p>
                  </div>
                </div>
                <Link to="/worker/profile"
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm font-medium">
                  <Edit3 className="w-4 h-4" /> Edit Profile
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Trade', value: worker?.trade, color: '#4F8CFF' },
                  { label: 'Experience', value: `${worker?.experience || 0} years`, color: '#36D7FF' },
                  { label: 'Tenure', value: `${worker?.tenure || 0} years`, color: '#F59E0B' },
                  { label: 'Rating', value: `${worker?.rating || 0} / 5`, color: '#22C55E' },
                  { label: 'Projects', value: worker?.previous_projects || 0, color: '#EF4444' },
                ].map((item, i) => (
                  <div key={item.label} className="p-4 rounded-2xl bg-white/5">
                    <p className="text-xs text-white/45 mb-1">{item.label}</p>
                    <p className="text-lg font-semibold capitalize" style={{ color: item.color }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </GlassCard>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { to: '/worker/jobs', icon: Search, label: 'Browse Jobs', desc: 'Find available work', color: '#4F8CFF' },
                { to: '/worker/progress', icon: Upload, label: 'Upload Progress', desc: 'Share work updates', color: '#22C55E' },
                { to: '/worker/insurance', icon: ShieldCheck, label: 'Insurance', desc: 'View your benefits', color: '#F59E0B' },
              ].map((link, i) => {
                const Icon = link.icon;
                return (
                  <Link key={link.to} to={link.to}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      whileHover={{ y: -4, scale: 1.01 }}
                      className="relative group rounded-3xl p-6 overflow-hidden"
                      style={{
                        background: 'rgba(17,24,39,0.6)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-2xl" style={{ background: `${link.color}15` }}>
                            <Icon className="w-5 h-5" style={{ color: link.color }} />
                          </div>
                          <div>
                            <p className="font-semibold">{link.label}</p>
                            <p className="text-sm text-white/45">{link.desc}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/50 group-hover:translate-x-1 transition-all" />
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-32" />)}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
