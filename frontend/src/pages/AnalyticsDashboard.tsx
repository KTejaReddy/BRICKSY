import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import PageTransition from '../components/ui/PageTransition';
import StatCard from '../components/ui/StatCard';
import GlassCard from '../components/ui/GlassCard';
import Skeleton from '../components/ui/Skeleton';
import { Users, HardHat, Briefcase, DollarSign, Star, BarChart3, TrendingUp, Award } from 'lucide-react';

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics').then((res) => setAnalytics(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    </PageTransition>
  );

  if (!analytics) return null;

  const allTrades = ['mason', 'electrician', 'plumber', 'carpenter', 'painter', 'welder'];
  const jobsByTradeMap: Record<string, number> = {};
  const workersByTradeMap: Record<string, number> = {};
  analytics.jobsByTrade?.forEach((j: any) => jobsByTradeMap[j.trade_required] = j.count);
  analytics.workersByTrade?.forEach((w: any) => workersByTradeMap[w.trade] = w.count);

  const maxCount = Math.max(1, ...allTrades.map(t => Math.max(jobsByTradeMap[t] || 0, workersByTradeMap[t] || 0)));

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-white/45">Platform-wide statistics and insights</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard label="Total Users" value={analytics.totalUsers} icon={<Users className="w-5 h-5 text-[#4F8CFF]" />} color="#4F8CFF" index={0} />
          <StatCard label="Total Workers" value={analytics.totalWorkers} icon={<HardHat className="w-5 h-5 text-[#36D7FF]" />} color="#36D7FF" index={1} />
          <StatCard label="Total Jobs" value={analytics.totalJobs} icon={<Briefcase className="w-5 h-5 text-[#F59E0B]" />} color="#F59E0B" index={2} />
          <StatCard label="Completed Jobs" value={analytics.completedJobs} icon={<Award className="w-5 h-5 text-[#22C55E]" />} color="#22C55E" index={3} />
          <StatCard label="Total Payments" value={analytics.totalPayments} prefix="$" icon={<DollarSign className="w-5 h-5 text-[#4F8CFF]" />} color="#4F8CFF" index={4} decimals={2} />
          <StatCard label="Avg Rating" value={analytics.avgRating} icon={<Star className="w-5 h-5 text-[#F59E0B]" />} color="#F59E0B" index={5} decimals={1} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard>
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-[#4F8CFF]" />
              <h2 className="text-lg font-bold">Jobs by Trade</h2>
            </div>
            <div className="space-y-3">
              {allTrades.map((trade, i) => {
                const count = jobsByTradeMap[trade] || 0;
                const pct = (count / maxCount) * 100;
                return (
                  <motion.div key={trade} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="capitalize text-white/70">{trade}</span>
                      <span className="text-white/50">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, delay: i * 0.05 }}
                        className="h-full rounded-full bg-gradient-to-r from-[#4F8CFF] to-[#36D7FF]"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-5 h-5 text-[#36D7FF]" />
              <h2 className="text-lg font-bold">Workers by Trade</h2>
            </div>
            <div className="space-y-3">
              {allTrades.map((trade, i) => {
                const count = workersByTradeMap[trade] || 0;
                const pct = (count / maxCount) * 100;
                return (
                  <motion.div key={trade} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="capitalize text-white/70">{trade}</span>
                      <span className="text-white/50">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, delay: i * 0.05 }}
                        className="h-full rounded-full bg-gradient-to-r from-[#22C55E] to-[#36D7FF]"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </div>
    </PageTransition>
  );
}
