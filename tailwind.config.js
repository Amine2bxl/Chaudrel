/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Inter porte 95 % du site. Playfair est réservé aux titres display.
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ["'Playfair Display'", 'Georgia', 'serif'],
      },
      colors: {
        // 5 couleurs, pas une de plus.
        ink: '#141311',
        night: '#0E0D0C',
        cream: '#F7F5F2',
        sand: '#EAE5DE',
        gold: '#8C764E',
      },
      maxWidth: {
        page: '1320px',
        prose: '62ch',
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
