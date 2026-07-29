import { motion } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon?: ReactNode;
  suffix?: string;
  prefix?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
  index?: number;
  decimals?: number;
}

function AnimatedCounter({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{count.toFixed(decimals)}</span>;
}

export default function StatCard({ label, value, icon, suffix, prefix, trend, color = '#4F8CFF', index = 0, decimals = 0 }: StatCardProps) {
  const isNumeric = typeof value === 'number';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="relative rounded-3xl p-6 overflow-hidden"
      style={{
        background: 'rgba(17,24,39,0.6)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5" style={{ background: `radial-gradient(circle, ${color}, transparent)` }} />
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-white/45 font-medium">{label}</p>
          <p className="text-3xl font-bold tracking-tight">
            {prefix}
            {isNumeric ? <AnimatedCounter value={value} decimals={decimals} /> : value}
            {suffix}
          </p>
          {trend && (
            <span className={`inline-flex items-center gap-1 text-xs font-medium ${
              trend === 'up' ? 'text-[#22C55E]' : trend === 'down' ? 'text-[#EF4444]' : 'text-white/45'
            }`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
              {trend === 'up' ? '12%' : trend === 'down' ? '3%' : '0%'}
            </span>
          )}
        </div>
        {icon && (
          <div className="p-3 rounded-2xl" style={{ background: `${color}15` }}>
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
}
