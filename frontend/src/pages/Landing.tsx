import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HardHat, Users, Cpu, ArrowRight, Star, Shield, Zap } from 'lucide-react';

const container = { animate: { transition: { staggerChildren: 0.1 } } };
const item = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Landing() {
  return (
    <motion.div variants={container} initial="initial" animate="animate" className="relative">
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-32">
        <motion.div variants={item} className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4F8CFF]/10 border border-[#4F8CFF]/20 text-[#4F8CFF] text-sm font-medium mb-8">
            <Cpu className="w-4 h-4" />
            AI-Powered Construction Workforce Platform
          </div>
          <h1 className="text-7xl md:text-8xl font-bold tracking-tight mb-6">
            Build with{' '}
            <span className="text-gradient">Precision</span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed">
            Connect skilled construction workers with contractors through intelligent matching.
            Our AI engine finds the perfect fit for every project.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-3xl text-base font-semibold text-white bg-gradient-to-r from-[#4F8CFF] to-[#36D7FF] hover:shadow-[0_0_40px_rgba(79,140,255,0.3)] transition-all duration-500"
            >
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 rounded-3xl text-base font-semibold text-white/70 hover:text-white border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={item} className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-20">
          {[
            { value: '10K+', label: 'Workers' },
            { value: '5K+', label: 'Projects' },
            { value: '98%', label: 'Satisfaction' },
          ].map((s) => (
            <div key={s.label} className="text-center p-6 rounded-3xl" style={{
              background: 'rgba(17,24,39,0.4)', border: '1px solid rgba(255,255,255,0.05)',
            }}>
              <p className="text-3xl font-bold text-gradient mb-1">{s.value}</p>
              <p className="text-sm text-white/45">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Features */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          {[
            { icon: Users, title: 'For Contractors', desc: 'Post jobs and get AI-recommended skilled workers instantly. Reduce hiring time by 80%.' },
            { icon: HardHat, title: 'For Workers', desc: 'Build your digital profile and get matched with projects that fit your skills perfectly.' },
            { icon: Zap, title: 'AI Powered', desc: 'Smart matching using experience, ratings, availability, and trust scores for perfect fits.' },
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative group rounded-3xl p-8 overflow-hidden"
                style={{
                  background: 'rgba(17,24,39,0.4)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#4F8CFF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-[#4F8CFF]/10 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-[#4F8CFF]" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">{f.title}</h3>
                  <p className="text-white/45 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div variants={item} className="text-center mt-20 p-12 rounded-4xl relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, rgba(79,140,255,0.1), rgba(54,215,255,0.05))',
          border: '1px solid rgba(79,140,255,0.15)',
        }}>
          <h2 className="text-3xl font-bold mb-4">Ready to transform your workforce?</h2>
          <p className="text-white/45 mb-8 max-w-lg mx-auto">
            Join thousands of construction professionals already using BRICKSY.
          </p>
          <Link to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-3xl text-base font-semibold text-white bg-gradient-to-r from-[#4F8CFF] to-[#36D7FF] hover:shadow-[0_0_40px_rgba(79,140,255,0.3)] transition-all duration-500">
            Start Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
