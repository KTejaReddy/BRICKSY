import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import PageTransition from '../components/ui/PageTransition';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import { Cpu, Star, Clock, Award, DollarSign, TrendingUp, Shield, UserCheck } from 'lucide-react';

export default function AIRecommendations() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobInfo, setJobInfo] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const jobsRes = await api.get('/jobs');
        const job = jobsRes.data.find((j: any) => j.id === parseInt(jobId!));
        if (job) {
          setJobInfo(job);
          const recRes = await api.post('/ai/recommend', {
            job_id: job.id,
            trade_required: job.trade_required,
          });
          const recs = recRes.data.recommendations || [];
          const workersRes = await api.get('/workers');
          const enriched = recs.map((r: any) => {
            const w = workersRes.data.find((wr: any) => wr.id === r.id);
            return { ...r, name: r.name || w?.name || 'Unknown', email: w?.email || '' };
          });
          setRecommendations(enriched);
        }
      } catch {}
      setLoading(false);
    };
    load();
  }, [jobId]);

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-10">
          <div className="flex items-center gap-2 text-[#4F8CFF] text-sm font-medium mb-2">
            <Cpu className="w-4 h-4" />
            AI Matching Engine
          </div>
          <h1 className="text-4xl font-bold mb-2">Recommended Workers</h1>
          {jobInfo && (
            <p className="text-white/45">
              Best matches for <span className="capitalize font-medium text-white">{jobInfo.trade_required}</span> &mdash; Budget: ${jobInfo.budget}
            </p>
          )}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <Skeleton key={i} className="h-40" />)}
          </div>
        ) : recommendations.length === 0 ? (
          <GlassCard className="text-center py-12">
            <Cpu className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/45 text-lg mb-2">No matching workers found</p>
            <p className="text-white/30 text-sm">Try adjusting the job requirements</p>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec, i) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 4 }}
                className="relative rounded-3xl p-6 overflow-hidden"
                style={{
                  background: 'rgba(17,24,39,0.6)',
                  backdropFilter: 'blur(20px)',
                  border: i === 0 ? '1px solid rgba(79,140,255,0.2)' : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {i === 0 && (
                  <div className="absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl bg-gradient-to-r from-[#4F8CFF] to-[#36D7FF] text-xs font-semibold text-white">
                    BEST MATCH
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold ${
                    i === 0 ? 'bg-gradient-to-br from-[#4F8CFF] to-[#36D7FF]' : 'bg-white/10'
                  } text-white`}>
                    {rec.name?.[0] || '?'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold">{rec.name}</h3>
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] text-xs font-medium">
                        <Star className="w-3 h-3" /> {rec.rating}
                      </div>
                    </div>
                    <p className="text-sm text-white/45 mb-3">{rec.email}</p>

                    <div className="flex flex-wrap gap-4">
                      <span className="flex items-center gap-1.5 text-xs text-white/50">
                        <Clock className="w-3.5 h-3.5" /> {rec.experience} yrs exp
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-white/50">
                        <Award className="w-3.5 h-3.5" /> {rec.tenure} yrs tenure
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-white/50">
                        <TrendingUp className="w-3.5 h-3.5" /> {rec.previous_projects} projects
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-white/50">
                        <DollarSign className="w-3.5 h-3.5" /> ${rec.estimated_cost}/hr
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-white/50">
                        <Shield className="w-3.5 h-3.5" /> {(rec.trust_score * 100).toFixed(0)}% trust
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-white/50">
                        <UserCheck className="w-3.5 h-3.5" /> {(rec.availability_score * 100).toFixed(0)}% available
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-3xl font-bold text-gradient">{rec.score?.toFixed(1)}</div>
                    <p className="text-xs text-white/30">match score</p>
                  </div>
                </div>
              </motion.div>
            ))}

            <div className="flex justify-center pt-4">
              <Button onClick={() => navigate('/employer/dashboard')}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
