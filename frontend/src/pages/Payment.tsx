import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import PageTransition from '../components/ui/PageTransition';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import { CreditCard, CheckCircle, ArrowRight, DollarSign, Briefcase } from 'lucide-react';

export default function Payment() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [amount, setAmount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  useEffect(() => {
    api.get('/jobs').then((res) => {
      const employerJobs = res.data.filter(
        (j: any) => j.employer_id === user?.id && j.worker_id && j.status === 'open'
      );
      setJobs(employerJobs);
    }).catch(() => {});
  }, [user]);

  const handleJobSelect = (jobId: number) => {
    const job = jobs.find((j) => j.id === jobId);
    if (job) {
      setSelectedJobId(jobId);
      setAmount(job.budget);
      setSelectedJob(job);
    }
  };

  const handlePayment = async () => {
    if (!selectedJobId || amount <= 0) return;
    setProcessing(true);
    try {
      await api.post('/payment', { job_id: selectedJobId, amount });
      setDone(true);
    } catch {
      alert('Payment failed');
    }
    setProcessing(false);
  };

  return (
    <PageTransition>
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Secure Payment</h1>
          <p className="text-white/45">Pay securely for accepted work</p>
        </div>

        <GlassCard>
          {done ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
              <div className="w-20 h-20 rounded-full bg-[#22C55E]/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-[#22C55E]" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
              <p className="text-white/45 mb-8">The worker has been notified and work can begin.</p>
              <div className="flex items-center justify-center gap-3">
                <Button onClick={() => navigate(`/employer/approve/${selectedJobId}`)}>
                  Monitor Progress
                </Button>
                <Button variant="secondary" onClick={() => navigate('/employer/dashboard')}>
                  Dashboard
                </Button>
              </div>
            </motion.div>
          ) : (
            <>
              <p className="text-white/45 mb-6">Select a job with an accepted worker to release payment.</p>

              {jobs.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/45">No jobs with accepted workers yet</p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/70">Select Job</label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 z-10" />
                      <select value={selectedJobId || ''}
                        onChange={(e) => handleJobSelect(parseInt(e.target.value))}
                        className="w-full pl-12 pr-4 py-3 bg-[#0D1322]/80 border border-white/10 rounded-2xl text-white outline-none focus:border-[#4F8CFF] transition-all appearance-none cursor-pointer"
                      >
                        <option value="">-- Select a job --</option>
                        {jobs.map((job) => (
                          <option key={job.id} value={job.id}>
                            {job.trade_required} - ${job.budget}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {selectedJob && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-2"
                    >
                      <label className="block text-sm font-medium text-white/70">Payment Amount ($)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input type="number" min="0" value={amount}
                          onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                          className="w-full pl-12 pr-4 py-3 bg-[#0D1322]/80 border border-white/10 rounded-2xl text-white text-lg outline-none focus:border-[#4F8CFF] transition-all"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              <div className="mt-6 space-y-4">
                <Button onClick={handlePayment} disabled={processing || !selectedJobId || amount <= 0}
                  loading={processing} icon={<CreditCard className="w-4 h-4" />} size="lg" className="w-full">
                  Pay Securely
                </Button>
                <p className="text-xs text-white/30 text-center">
                  Secure digital payment with BRICKSY
                </p>
              </div>
            </>
          )}
        </GlassCard>
      </div>
    </PageTransition>
  );
}
