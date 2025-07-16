// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        oasis: {
          primary: '#00D4FF',    // Cyan Blue
          secondary: '#FF6B00',  // Orange
          accent: '#00FF88',     // Neon Green
          dark: '#0A0A0F',       // Deep Dark
          surface: '#1A1A2E',    // Dark Purple
          warning: '#FFD700',    // Gold
          success: '#00FF88',    // Neon Green
          error: '#FF3366',      // Red
        }
      },
      fontFamily: {
        'cyber': ['Orbitron', 'monospace'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00D4FF' },
          '100%': { boxShadow: '0 0 20px #00D4FF, 0 0 30px #00D4FF' },
        }
      }
    },
  },
  plugins: [],
}
