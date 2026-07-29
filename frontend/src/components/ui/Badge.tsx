import { motion } from 'framer-motion';

interface BadgeProps {
  children: string;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  className?: string;
}

const colors = {
  success: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20',
  warning: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
  danger: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20',
  info: 'bg-[#4F8CFF]/10 text-[#4F8CFF] border-[#4F8CFF]/20',
  default: 'bg-white/5 text-white/60 border-white/10',
};

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${colors[variant]} ${className}`}
    >
      {children}
    </motion.span>
  );
}
