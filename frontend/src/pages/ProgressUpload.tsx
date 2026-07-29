import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import PageTransition from '../components/ui/PageTransition';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import { Upload, CheckCircle, Briefcase, Image, Video } from 'lucide-react';

export default function ProgressUpload() {
  const [jobId, setJobId] = useState<number>(0);
  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [photos, setPhotos] = useState<FileList | null>(null);
  const [videos, setVideos] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return;
        const user = JSON.parse(userStr);
        const workersRes = await api.get('/workers');
        const myWorker = workersRes.data.find((w: any) => w.user_id === user.id);
        if (!myWorker) return;
        const jobsRes = await api.get('/jobs');
        setMyJobs(jobsRes.data.filter((j: any) => j.status === 'in_progress' && j.worker_id === myWorker.id));
      } catch {}
    };
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobId) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('job_id', String(jobId));
      if (photos) Array.from(photos).forEach((f) => formData.append('photos', f));
      if (videos) Array.from(videos).forEach((f) => formData.append('videos', f));
      await api.post('/progress/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setDone(true);
    } catch {}
    setUploading(false);
  };

  return (
    <PageTransition>
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Upload Progress</h1>
          <p className="text-white/45">Share your work progress with your employer</p>
        </div>

        <GlassCard>
          {done ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
              <div className="w-20 h-20 rounded-full bg-[#22C55E]/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-[#22C55E]" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Progress Uploaded!</h2>
              <p className="text-white/45">Your employer will review the progress.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/70">Select Job</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 z-10" />
                  <select value={jobId} onChange={(e) => setJobId(parseInt(e.target.value) || 0)}
                    className="w-full pl-12 pr-4 py-3 bg-[#0D1322]/80 border border-white/10 rounded-2xl text-white outline-none focus:border-[#4F8CFF] transition-all appearance-none cursor-pointer"
                  >
                    <option value={0}>-- Select a job --</option>
                    {myJobs.map((j: any) => (
                      <option key={j.id} value={j.id}>{j.trade_required} - ${j.budget}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/70">Photos</label>
                  <label className="flex flex-col items-center gap-2 p-6 rounded-2xl border border-dashed border-white/10 cursor-pointer hover:border-[#4F8CFF]/50 hover:bg-[#4F8CFF]/5 transition-all">
                    <Image className="w-6 h-6 text-white/30" />
                    <span className="text-xs text-white/30">{photos ? `${photos.length} files` : 'Add photos'}</span>
                    <input type="file" multiple accept="image/*" onChange={(e) => setPhotos(e.target.files)} className="hidden" />
                  </label>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/70">Videos</label>
                  <label className="flex flex-col items-center gap-2 p-6 rounded-2xl border border-dashed border-white/10 cursor-pointer hover:border-[#4F8CFF]/50 hover:bg-[#4F8CFF]/5 transition-all">
                    <Video className="w-6 h-6 text-white/30" />
                    <span className="text-xs text-white/30">{videos ? `${videos.length} files` : 'Add videos'}</span>
                    <input type="file" multiple accept="video/*" onChange={(e) => setVideos(e.target.files)} className="hidden" />
                  </label>
                </div>
              </div>

              <Button type="submit" disabled={uploading || !jobId} loading={uploading}
                icon={<Upload className="w-4 h-4" />} size="lg" className="w-full">
                Upload Progress
              </Button>
            </form>
          )}
        </GlassCard>
      </div>
    </PageTransition>
  );
}
