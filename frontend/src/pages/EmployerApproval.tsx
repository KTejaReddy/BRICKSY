import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import PageTransition from '../components/ui/PageTransition';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import { CheckCircle, Eye, Image, Video, Clock, UserCircle, Star } from 'lucide-react';

export default function EmployerApproval() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [progressList, setProgressList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvedIds, setApprovedIds] = useState<Set<number>>(new Set());
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    api.get(`/progress/${jobId}`).then((res) => {
      setProgressList(res.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [jobId]);

  const handleApprove = async (progressId: number) => {
    try {
      await api.put(`/progress/${progressId}/approve`);
      setApprovedIds((prev) => new Set(prev).add(progressId));
      setShowReview(true);
    } catch {
      alert('Failed to approve progress');
    }
  };

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Review Progress</h1>
          <p className="text-white/45">Review and approve work progress updates</p>
        </div>

        {loading ? (
          <div className="space-y-4">{[1,2].map(i => <Skeleton key={i} className="h-48" />)}</div>
        ) : progressList.length === 0 ? (
          <GlassCard className="text-center py-12">
            <Eye className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/45 text-lg mb-2">No progress updates yet</p>
            <p className="text-white/30 text-sm">Wait for the worker to upload their progress.</p>
          </GlassCard>
        ) : (
          <div className="space-y-6">
            {progressList.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative rounded-3xl p-6"
                style={{
                  background: 'rgba(17,24,39,0.6)',
                  backdropFilter: 'blur(20px)',
                  border: entry.approved ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <UserCircle className="w-5 h-5 text-white/40" />
                    <span className="text-sm text-white/60">{entry.worker_name}</span>
                    <Clock className="w-4 h-4 text-white/30 ml-2" />
                    <span className="text-sm text-white/40">{new Date(entry.upload_date).toLocaleDateString()}</span>
                  </div>
                  <Badge variant={entry.approved || approvedIds.has(entry.id) ? 'success' : 'warning'}>
                    {entry.approved || approvedIds.has(entry.id) ? 'Approved' : 'Pending'}
                  </Badge>
                </div>

                {(entry.photos || entry.videos) ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    {entry.photos?.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1.5 text-sm text-white/50 mb-2">
                          <Image className="w-4 h-4" /> Photos ({entry.photos.split(',').filter(Boolean).length})
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {entry.photos.split(',').filter(Boolean).map((photo: string, pi: number) => (
                            <img key={pi} src={photo.startsWith('http') ? photo : `/uploads/photos/${photo}`} alt={`Progress ${pi+1}`}
                              className="w-20 h-20 object-cover rounded-xl border border-white/10" />
                          ))}
                        </div>
                      </div>
                    )}
                    {entry.videos?.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1.5 text-sm text-white/50 mb-2">
                          <Video className="w-4 h-4" /> Videos ({entry.videos.split(',').filter(Boolean).length})
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {entry.videos.split(',').filter(Boolean).map((video: string, vi: number) => (
                            <video key={vi} src={video.startsWith('http') ? video : `/uploads/videos/${video}`} controls
                              className="w-36 h-20 object-cover rounded-xl border border-white/10" />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-white/30 text-sm mb-4">No files attached</p>
                )}

                {!entry.approved && !approvedIds.has(entry.id) && (
                  <Button onClick={() => handleApprove(entry.id)} icon={<CheckCircle className="w-4 h-4" />}>
                    Approve Progress
                  </Button>
                )}

                {approvedIds.has(entry.id) && (
                  <div className="text-sm text-[#22C55E] font-medium">Approved</div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {showReview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-3xl p-6 text-center"
            style={{
              background: 'rgba(34,197,94,0.05)',
              border: '1px solid rgba(34,197,94,0.15)',
            }}
          >
            <p className="text-[#22C55E] font-medium mb-4">Progress approved! Complete the project by submitting a review.</p>
            <Button onClick={() => navigate(`/employer/review/${jobId}`)} icon={<Star className="w-4 h-4" />}>
              Rate & Complete Project
            </Button>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
