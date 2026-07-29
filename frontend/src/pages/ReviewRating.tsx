import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import PageTransition from '../components/ui/PageTransition';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import { Star, CheckCircle, Briefcase, DollarSign } from 'lucide-react';

export default function ReviewRating() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<any>(null);
  const [stars, setStars] = useState(5);
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/jobs').then((res) => {
      const found = res.data.find((j: any) => j.id === parseInt(jobId!));
      if (found) setJob(found);
    }).catch(() => {});
  }, [jobId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job?.worker_id) { setError('Worker information not found'); return; }
    try {
      await api.post('/review', { job_id: parseInt(jobId!), worker_id: job.worker_id, stars, review });
      setSubmitted(true);
    } catch { setError('Failed to submit review'); }
  };

  return (
    <PageTransition>
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Rate & Review</h1>
          <p className="text-white/45">Complete the project with a review</p>
        </div>

        {submitted ? (
          <GlassCard className="text-center py-8">
            <div className="w-20 h-20 rounded-full bg-[#22C55E]/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-[#22C55E]" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Project Completed!</h2>
            <p className="text-white/45 mb-2">Thank you for your review.</p>
            <p className="text-white/45 mb-6">The worker's insurance benefits have been activated.</p>
            <Button onClick={() => navigate('/employer/dashboard')}>Back to Dashboard</Button>
          </GlassCard>
        ) : (
          <form onSubmit={handleSubmit}>
            <GlassCard>
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="p-4 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] text-sm mb-6">
                  {error}
                </motion.div>
              )}

              {job && (
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 mb-6">
                  <div className="flex-1">
                    <p className="font-semibold capitalize text-lg">{job.trade_required}</p>
                    <div className="flex items-center gap-3 text-sm text-white/45 mt-1">
                      <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> ${job.budget}</span>
                      <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> Job #{job.id}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <label className="block text-sm font-medium text-white/70 mb-3">Rating</label>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      type="button"
                      onClick={() => setStars(star)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className="transition-colors"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= stars ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-white/20'
                        }`}
                      />
                    </motion.button>
                  ))}
                </div>
                <p className="text-sm text-white/45 mt-2">{stars} out of 5 stars</p>
              </div>

              <div className="space-y-2 mb-6">
                <label className="block text-sm font-medium text-white/70">Review</label>
                <textarea value={review} onChange={(e) => setReview(e.target.value)}
                  rows={4} placeholder="Share your experience working with this worker..."
                  className="w-full px-4 py-3 bg-[#0D1322]/80 border border-white/10 rounded-2xl text-white placeholder-white/25 outline-none focus:border-[#4F8CFF] transition-all"
                />
              </div>

              <Button type="submit" icon={<Star className="w-4 h-4" />} size="lg" className="w-full">
                Complete Project & Activate Insurance
              </Button>
            </GlassCard>
          </form>
        )}
      </div>
    </PageTransition>
  );
}
