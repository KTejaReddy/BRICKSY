import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import PageTransition from '../components/ui/PageTransition';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import { Database as DatabaseIcon, Table } from 'lucide-react';

const TABLES = ['users', 'workers', 'jobs', 'recommendations', 'payments', 'progress', 'reviews', 'insurance'];

const tableColors: Record<string, string> = {
  users: '#4F8CFF', workers: '#36D7FF', jobs: '#F59E0B',
  recommendations: '#22C55E', payments: '#EF4444', progress: '#8B5CF6',
  reviews: '#EC4899', insurance: '#14B8A6',
};

export default function Database() {
  const [view, setView] = useState<string>('users');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/db/${view}`).then((res) => setData(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, [view]);

  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  const formatValue = (val: any) => {
    if (val === null || val === undefined) return <span className="text-white/20">null</span>;
    if (typeof val === 'boolean') return <Badge variant={val ? 'success' : 'default'}>{String(val)}</Badge>;
    if (typeof val === 'object') return <span className="text-white/40">{JSON.stringify(val)}</span>;
    return String(val);
  };

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Database</h1>
          <p className="text-white/45">Browse and inspect system data</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {TABLES.map((table) => (
            <button
              key={table}
              onClick={() => setView(table)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300 ${
                view === table
                  ? 'text-white border border-white/10 shadow-glow'
                  : 'text-white/40 hover:text-white/70 border border-transparent'
              }`}
              style={view === table ? { background: `${tableColors[table]}12`, borderColor: `${tableColors[table]}30` } : {}}
            >
              <Table className="w-4 h-4" style={{ color: tableColors[table] }} />
              <span className="capitalize">{table}</span>
            </button>
          ))}
        </div>

        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <DatabaseIcon className="w-5 h-5" style={{ color: tableColors[view] }} />
            <h2 className="text-lg font-bold capitalize">{view}</h2>
            <span className="text-sm text-white/30 ml-auto">{data.length} records</span>
          </div>

          {loading ? (
            <div className="text-center py-12 text-white/30">Loading...</div>
          ) : data.length === 0 ? (
            <div className="text-center py-12 text-white/30">No records found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {columns.map((col) => (
                      <th key={col} className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">
                        {col.replace(/_/g, ' ')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, 50).map((row, i) => (
                    <motion.tr
                      key={row.id || i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.01 }}
                      className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors"
                    >
                      {columns.map((col) => (
                        <td key={col} className="px-4 py-3 text-sm text-white/60">
                          {formatValue(row[col])}
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {data.length > 50 && (
                <div className="text-center py-4 text-sm text-white/30">
                  Showing 50 of {data.length} records
                </div>
              )}
            </div>
          )}
        </GlassCard>
      </div>
    </PageTransition>
  );
}
