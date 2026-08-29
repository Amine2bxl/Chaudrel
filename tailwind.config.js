/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ["'Playfair Display'", 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        display: ["'Playfair Display'", 'Georgia', 'serif'],
      },
      colors: {
        brand: {
          gold: '#8C764E',
          goldLight: '#C4A96B',
          ink: '#1A1A1A',
          cream: '#F7F5F2',
          dark: '#111111',
        },
      },
    },
  },
  plugins: [],
};