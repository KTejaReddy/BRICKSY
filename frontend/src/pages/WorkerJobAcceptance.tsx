import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import PageTransition from '../components/ui/PageTransition';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import { Search, UserCircle, DollarSign, Briefcase, Check, ArrowRight } from 'lucide-react';

export default function WorkerJobAcceptance() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [acceptedJobId, setAcceptedJobId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/jobs/available').then((res) => {
      setJobs(res.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleAccept = async (jobId: number) => {
    try {
      await api.post(`/jobs/${jobId}/accept`);
      setAcceptedJobId(jobId);
    } catch {
      alert('Failed to accept job');
    }
  };

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Available Jobs</h1>
          <p className="text-white/45">Browse jobs that match your trade</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <Skeleton key={i} className="h-32" />)}
          </div>
        ) : jobs.length === 0 ? (
          <GlassCard className="text-center py-12">
            <Search className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/45 text-lg mb-2">No available jobs right now</p>
            <p className="text-white/30 text-sm">Check back later or update your profile</p>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {jobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative rounded-3xl p-6"
                style={{
                  background: 'rgba(17,24,39,0.6)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold capitalize">{job.trade_required}</h3>
                      <Badge variant="success">Open</Badge>
                    </div>
                    <p className="text-white/60 mb-3">{job.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="flex items-center gap-1.5 text-white/45">
                        <UserCircle className="w-4 h-4" /> {job.employer_name}
                      </span>
                      <span className="flex items-center gap-1.5 text-white/45">
                        <DollarSign className="w-4 h-4" /> Budget: ${job.budget}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {acceptedJobId === job.id ? (
                      <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#22C55E]/10 text-[#22C55E] font-medium text-sm">
                        <Check className="w-4 h-4" /> Accepted!
                      </div>
                    ) : (
                      <Button onClick={() => handleAccept(job.id)} size="sm">
                        Accept Job
                      </Button>
                    )}
                  </div>
                </div>

                {acceptedJobId === job.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-white/10"
                  >
                    <p className="text-[#22C55E] font-medium mb-3">Job accepted! Start working and upload your progress.</p>
                    <Button variant="secondary" onClick={() => navigate('/worker/progress')} icon={<ArrowRight className="w-4 h-4" />}>
                      Upload Progress
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
