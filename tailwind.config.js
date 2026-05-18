/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(244, 63, 94, 0.45)',
        card: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'grid-slate':
          'linear-gradient(to right, rgb(30 41 59 / 0.35) 1px, transparent 1px), linear-gradient(to bottom, rgb(30 41 59 / 0.35) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};
