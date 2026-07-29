import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import PageTransition from '../components/ui/PageTransition';
import Button from '../components/ui/Button';
import { PlusCircle, Briefcase, DollarSign, FileText } from 'lucide-react';

const TRADES = ['mason', 'electrician', 'plumber', 'carpenter', 'painter', 'welder'];

export default function PostJob() {
  const [form, setForm] = useState({ trade_required: 'mason', description: '', budget: 0 });
  const [error, setError] = useState('');
  const [posting, setPosting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true);
    try {
      const res = await api.post('/jobs', form);
      navigate(`/employer/recommendations/${res.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to post job');
    }
    setPosting(false);
  };

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Post a Job</h1>
          <p className="text-white/45">Find the perfect skilled worker for your project</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="relative rounded-3xl p-8" style={{
            background: 'rgba(17,24,39,0.6)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] text-sm mb-6">
                {error}
              </motion.div>
            )}

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/70">Trade Required</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 z-10" />
                  <select value={form.trade_required}
                    onChange={(e) => setForm({ ...form, trade_required: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-[#0D1322]/80 border border-white/10 rounded-2xl text-white outline-none focus:border-[#4F8CFF] transition-all appearance-none cursor-pointer"
                  >
                    {TRADES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/70">Job Description</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-3 w-4 h-4 text-white/30" />
                  <textarea required value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={4} placeholder="Describe the job requirements..."
                    className="w-full pl-12 pr-4 py-3 bg-[#0D1322]/80 border border-white/10 rounded-2xl text-white placeholder-white/25 outline-none focus:border-[#4F8CFF] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/70">Budget ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input type="number" required min="0" value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: parseInt(e.target.value) || 0 })}
                    className="w-full pl-12 pr-4 py-3 bg-[#0D1322]/80 border border-white/10 rounded-2xl text-white outline-none focus:border-[#4F8CFF] transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button type="submit" loading={posting} icon={<PlusCircle className="w-4 h-4" />} size="lg" className="w-full">
                Post Job & Find Workers
              </Button>
            </div>
          </div>
        </form>
      </div>
    </PageTransition>
  );
}
