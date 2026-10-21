/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        sacred: {
          dark: '#0a0908',
          card: '#16120e',
          border: '#2a221b',
          gold: '#eab308',
        }
      },
      fontFamily: {
        sanskrit: ['"Rozha One"', '"Cinzel"', '"Yatra One"', 'serif'],
        devanagari: ['"Tiro Devanagari Hindi"', '"Mukta"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 25s linear infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2.5s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { filter: 'drop-shadow(0 0 12px rgba(245, 158, 11, 0.35))' },
          '100%': { filter: 'drop-shadow(0 0 28px rgba(245, 158, 11, 0.75))' },
        }
      }
    },
  },
  plugins: [],
}
