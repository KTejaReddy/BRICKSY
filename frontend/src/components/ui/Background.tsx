export default function Background() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#070B14] via-[#0D1322] to-[#070B14]" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(79,140,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(79,140,255,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Animated gradient orbs */}
      <div
        className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full opacity-10 blur-[120px]"
        style={{
          background: 'radial-gradient(circle, rgba(79,140,255,0.4), transparent)',
          animation: 'float 8s ease-in-out infinite',
        }}
      />
      <div
        className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full opacity-8 blur-[100px]"
        style={{
          background: 'radial-gradient(circle, rgba(54,215,255,0.3), transparent)',
          animation: 'float 10s ease-in-out infinite reverse',
        }}
      />
      <div
        className="absolute top-[40%] right-[20%] w-[30%] h-[30%] rounded-full opacity-5 blur-[80px]"
        style={{
          background: 'radial-gradient(circle, rgba(79,140,255,0.2), transparent)',
          animation: 'float 12s ease-in-out infinite 2s',
        }}
      />

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white/10"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${5 + Math.random() * 10}s ease-in-out infinite ${Math.random() * 5}s`,
            opacity: 0.1 + Math.random() * 0.2,
          }}
        />
      ))}

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
