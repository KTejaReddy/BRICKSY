import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import PageTransition from '../components/ui/PageTransition';
import GlassCard from '../components/ui/GlassCard';
import Skeleton from '../components/ui/Skeleton';
import Badge from '../components/ui/Badge';
import { ShieldCheck, Shield, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export default function InsuranceBenefits() {
  const [insurance, setInsurance] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/insurance').then((res) => {
      setInsurance(res.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <PageTransition>
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Insurance Benefits</h1>
          <p className="text-white/45">Your coverage and benefits information</p>
        </div>

        {loading ? (
          <Skeleton className="h-64" />
        ) : !insurance ? (
          <GlassCard className="text-center py-12">
            <Shield className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/45">No insurance record found.</p>
          </GlassCard>
        ) : (
          <GlassCard>
            <div className="text-center mb-8">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
                insurance.insurance_status === 'active' ? 'bg-[#22C55E]/10' : 'bg-white/5'
              }`}>
                {insurance.insurance_status === 'active' ? (
                  <ShieldCheck className="w-12 h-12 text-[#22C55E]" />
                ) : (
                  <AlertTriangle className="w-12 h-12 text-white/30" />
                )}
              </div>
              <h2 className="text-2xl font-bold mb-2">
                Insurance {insurance.insurance_status === 'active' ? 'Active' : 'Inactive'}
              </h2>
              <Badge variant={insurance.insurance_status === 'active' ? 'success' : 'default'}>
                {insurance.insurance_status.toUpperCase()}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[#4F8CFF]" />
                  <span className="text-sm text-white/70">Policy Status</span>
                </div>
                <span className={`text-sm font-medium ${insurance.insurance_status === 'active' ? 'text-[#22C55E]' : 'text-white/40'}`}>
                  {insurance.insurance_status === 'active' ? 'Covered' : 'Not Covered'}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#36D7FF]" />
                  <span className="text-sm text-white/70">Valid Until</span>
                </div>
                <span className="text-sm text-white/50">Active indefinitely</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                  <span className="text-sm text-white/70">Coverage Type</span>
                </div>
                <span className="text-sm text-white/50">Full Benefits</span>
              </div>
            </div>
          </GlassCard>
        )}
      </div>
    </PageTransition>
  );
}
