import { motion } from 'framer-motion';
import { ReactNode, useState } from 'react';

interface InputProps {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  type?: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  icon?: ReactNode;
  rows?: number;
  as?: 'input' | 'textarea' | 'select';
  children?: ReactNode;
}

export default function Input({
  label, value, onChange, type = 'text', required, error,
  placeholder, className = '', min, max, step, icon, rows, as = 'input', children,
}: InputProps) {
  const [focused, setFocused] = useState(false);

  const baseClass = `w-full px-4 py-3 bg-[#0D1322]/80 border rounded-2xl text-white placeholder-white/30
    outline-none transition-all duration-300
    ${error ? 'border-[#EF4444]' : focused ? 'border-[#4F8CFF] shadow-[0_0_20px_rgba(79,140,255,0.1)]' : 'border-white/10'}
    ${icon ? 'pl-12' : ''}`;

  const renderInput = () => {
    if (as === 'textarea') {
      return (
        <textarea
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          rows={rows || 3}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={baseClass}
        />
      );
    }
    if (as === 'select') {
      return (
        <select
          value={value}
          onChange={onChange}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`${baseClass} appearance-none cursor-pointer`}
        >
          {children}
        </select>
      );
    }
    return (
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={baseClass}
      />
    );
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <motion.label
        animate={{ y: focused || value ? -2 : 0, color: focused ? '#4F8CFF' : 'rgba(255,255,255,0.7)' }}
        className="block text-sm font-medium"
      >
        {label}
      </motion.label>
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">{icon}</span>
        )}
        {renderInput()}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-[#EF4444]"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
