import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import PageTransition from '../components/ui/PageTransition';
import Button from '../components/ui/Button';
import { UserCircle, Save, Check } from 'lucide-react';

const TRADES = ['mason', 'electrician', 'plumber', 'carpenter', 'painter', 'welder'];

export default function WorkerProfile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    experience: 0, tenure: 0, rating: 0, previous_projects: 0,
    availability_score: 0.5, trust_score: 0.5, estimated_cost: 0, trade: 'mason',
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/workers').then((res) => {
      const w = res.data.find((w: any) => w.user_id === user?.id);
      if (w) setForm(w);
    }).catch(() => {});
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const workers = await api.get('/workers');
      const w = workers.data.find((w: any) => w.user_id === user?.id);
      if (w) {
        await api.put(`/workers/${w.id}`, form);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {}
    setSaving(false);
  };

  const update = (field: string, value: any) => setForm({ ...form, [field]: value });

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Worker Profile</h1>
          <p className="text-white/45">Update your skills and experience</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="relative rounded-3xl p-8" style={{
            background: 'rgba(17,24,39,0.6)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4F8CFF] to-[#36D7FF] flex items-center justify-center">
                <UserCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{user?.name}</h2>
                <p className="text-white/45 text-sm">{user?.email}</p>
              </div>
            </div>

            {saved && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] text-sm mb-6 flex items-center gap-2"
              >
                <Check className="w-4 h-4" /> Profile updated successfully
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { label: 'Trade', field: 'trade', type: 'select', options: TRADES },
                { label: 'Experience (years)', field: 'experience', type: 'number', min: 0 },
                { label: 'Tenure (years)', field: 'tenure', type: 'number', min: 0 },
                { label: 'Rating (0-5)', field: 'rating', type: 'number', min: 0, max: 5, step: 0.1 },
                { label: 'Previous Projects', field: 'previous_projects', type: 'number', min: 0 },
                { label: 'Estimated Cost ($)', field: 'estimated_cost', type: 'number', min: 0 },
                { label: 'Availability Score (0-1)', field: 'availability_score', type: 'number', min: 0, max: 1, step: 0.1 },
                { label: 'Trust Score (0-1)', field: 'trust_score', type: 'number', min: 0, max: 1, step: 0.1 },
              ].map(({ label, field, type, options, min, max, step }) => (
                <div key={field} className="space-y-2">
                  <label className="block text-sm font-medium text-white/70">{label}</label>
                  {type === 'select' ? (
                    <select value={(form as any)[field]}
                      onChange={(e) => update(field, e.target.value)}
                      className="w-full px-4 py-3 bg-[#0D1322]/80 border border-white/10 rounded-2xl text-white outline-none focus:border-[#4F8CFF] transition-all appearance-none cursor-pointer"
                    >
                      {(options || []).map((o: string) => (
                        <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>
                      ))}
                    </select>
                  ) : (
                    <input type={type} min={min} max={max} step={step}
                      value={(form as any)[field]}
                      onChange={(e) => update(field, type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
                      className="w-full px-4 py-3 bg-[#0D1322]/80 border border-white/10 rounded-2xl text-white outline-none focus:border-[#4F8CFF] transition-all"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Button type="submit" loading={saving} icon={<Save className="w-4 h-4" />} size="lg" className="w-full">
                Save Profile
              </Button>
            </div>
          </div>
        </form>
      </div>
    </PageTransition>
  );
}
