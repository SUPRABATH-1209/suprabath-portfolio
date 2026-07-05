/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Arial', 'sans-serif']
      },
      boxShadow: {
        soft: '0 24px 70px rgba(15, 23, 42, 0.11)',
        glow: '0 22px 70px rgba(20, 184, 166, 0.25)'
      }
    }
  },
  plugins: []
};
