import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import PageTransition from '../components/ui/PageTransition';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import { PlusCircle, CreditCard, Briefcase, ArrowRight, Eye, Star } from 'lucide-react';

const quickLinks = [
  { to: '/employer/post-job', icon: PlusCircle, label: 'Post Job', desc: 'Create a new listing', color: '#4F8CFF' },
  { to: '/employer/payment', icon: CreditCard, label: 'Pay Securely', desc: 'Process digital payments', color: '#22C55E' },
  { to: '/employer/projects', icon: Briefcase, label: 'Monitor Work', desc: 'View progress updates', color: '#36D7FF' },
];

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    api.get('/jobs').then((res) => {
      setJobs(res.data.filter((j: any) => j.employer_id === user?.id));
    }).catch(() => {});
  }, [user]);

  const statusColor = (status: string) => {
    switch (status) {
      case 'open': return 'success';
      case 'in_progress': return 'info';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold mb-2">Employer Dashboard</h1>
            <p className="text-white/45">Manage jobs and find skilled workers</p>
          </div>
          <Link to="/employer/post-job"
            className="hidden sm:flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-[#4F8CFF] to-[#36D7FF] hover:shadow-[0_0_30px_rgba(79,140,255,0.3)] transition-all duration-300">
            <PlusCircle className="w-4 h-4" /> Post a Job
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {quickLinks.map((link, i) => {
            const Icon = link.icon;
            return (
              <Link key={link.to} to={link.to}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="relative group rounded-3xl p-6"
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

        <GlassCard>
          <h2 className="text-xl font-bold mb-6">Your Jobs</h2>
          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/45">No jobs posted yet</p>
              <Link to="/employer/post-job"
                className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-2xl text-sm font-medium text-white bg-[#4F8CFF]/20 hover:bg-[#4F8CFF]/30 transition-all">
                <PlusCircle className="w-4 h-4" /> Post your first job
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job, i) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl p-5 bg-white/[0.03] border border-white/5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold capitalize text-lg">{job.trade_required}</h3>
                        <Badge variant={statusColor(job.status) as any}>{job.status.replace('_', ' ')}</Badge>
                      </div>
                      <p className="text-sm text-white/45 truncate">{job.description}</p>
                      <p className="text-sm text-white/30 mt-1">Budget: ${job.budget}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {job.status === 'open' && !job.worker_id && (
                        <Link to={`/employer/recommendations/${job.id}`}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-[#4F8CFF] bg-[#4F8CFF]/10 hover:bg-[#4F8CFF]/20 transition-all">
                          <Eye className="w-3.5 h-3.5" /> AI Recommendations
                        </Link>
                      )}
                      {job.status === 'open' && job.worker_id && (
                        <Link to="/employer/payment"
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-[#22C55E] bg-[#22C55E]/10 hover:bg-[#22C55E]/20 transition-all">
                          <CreditCard className="w-3.5 h-3.5" /> Pay Now
                        </Link>
                      )}
                      {job.status === 'in_progress' && (
                        <Link to={`/employer/approve/${job.id}`}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-[#36D7FF] bg-[#36D7FF]/10 hover:bg-[#36D7FF]/20 transition-all">
                          <Eye className="w-3.5 h-3.5" /> Review Progress
                        </Link>
                      )}
                      {job.status === 'completed' && (
                        <Link to={`/employer/review/${job.id}`}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-[#F59E0B] bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20 transition-all">
                          <Star className="w-3.5 h-3.5" /> Rate & Review
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </PageTransition>
  );
}
