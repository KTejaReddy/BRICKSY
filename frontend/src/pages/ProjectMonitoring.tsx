import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import PageTransition from '../components/ui/PageTransition';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import { Briefcase, UserCircle, DollarSign, Image, Video, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

export default function ProjectMonitoring() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  useEffect(() => {
    api.get('/projects').then((res) => setProjects(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const toggleExpand = (id: number) => {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id); else next.add(id);
    setExpanded(next);
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'info';
      case 'open': return 'warning';
      default: return 'default';
    }
  };

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Project Monitoring</h1>
          <p className="text-white/45">Track all construction projects and their progress</p>
        </div>

        {loading ? (
          <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-40" />)}</div>
        ) : projects.length === 0 ? (
          <GlassCard className="text-center py-12">
            <Briefcase className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/45">No projects found</p>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative rounded-3xl overflow-hidden"
                style={{
                  background: 'rgba(17,24,39,0.6)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold capitalize">{project.trade_required}</h3>
                        <Badge variant={statusBadge(project.status) as any}>
                          {project.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm">
                        <span className="flex items-center gap-1.5 text-white/45">
                          <UserCircle className="w-4 h-4" /> {project.employer_name}
                        </span>
                        <span className="flex items-center gap-1.5 text-white/45">
                          <DollarSign className="w-4 h-4" /> ${project.budget}
                        </span>
                        {project.progress_updates?.length > 0 && (
                          <span className="flex items-center gap-1.5 text-white/45">
                            <Image className="w-4 h-4" /> {project.progress_updates.length} updates
                          </span>
                        )}
                      </div>
                      <p className="text-white/50 text-sm mt-3 line-clamp-2">{project.description}</p>
                    </div>
                    {project.progress_updates?.length > 0 && (
                      <button onClick={() => toggleExpand(project.id)}
                        className="p-2 rounded-xl hover:bg-white/5 transition-all shrink-0">
                        {expanded.has(project.id) ?
                          <ChevronUp className="w-5 h-5 text-white/40" /> :
                          <ChevronDown className="w-5 h-5 text-white/40" />
                        }
                      </button>
                    )}
                  </div>
                </div>

                {expanded.has(project.id) && project.progress_updates?.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="border-t border-white/5 px-6 py-4 space-y-3"
                  >
                    <h4 className="text-sm font-medium text-white/50">Progress Updates</h4>
                    {project.progress_updates.map((p: any, pi: number) => (
                      <div key={pi} className="flex items-center gap-3 text-sm text-white/40 bg-white/[0.02] p-3 rounded-2xl">
                        <Calendar className="w-4 h-4 text-[#36D7FF]" />
                        <span>{new Date(p.upload_date).toLocaleDateString()}</span>
                        {p.photos?.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Image className="w-3.5 h-3.5" /> {p.photos.length}
                          </span>
                        )}
                        {p.videos?.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Video className="w-3.5 h-3.5" /> {p.videos.length}
                          </span>
                        )}
                      </div>
                    ))}
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
