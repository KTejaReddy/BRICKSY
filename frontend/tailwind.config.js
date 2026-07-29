/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bricksy: {
          950: '#070B14',
          900: '#0D1322',
          800: '#111827',
          700: '#161F33',
          accent: '#4F8CFF',
          cyan: '#36D7FF',
          success: '#22C55E',
          warning: '#F59E0B',
          danger: '#EF4444',
        },
        surface: {
          DEFAULT: '#111827',
          elevated: '#161F33',
          border: 'rgba(255,255,255,0.08)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.3)',
        glow: '0 0 20px rgba(79,140,255,0.15)',
        'glow-lg': '0 0 40px rgba(79,140,255,0.2)',
        card: '0 4px 24px rgba(0,0,0,0.2)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'grid': 'grid 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        grid: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
