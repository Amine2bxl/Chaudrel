/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', lg: '2.5rem' },
      screens: { '2xl': '1360px' },
    },
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", 'Georgia', 'serif'],
        heading: ["'Playfair Display'", 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          ink: '#141311',      // noir profond
          dark: '#0E0D0C',     // fonds sombres
          cream: '#F7F5F2',    // blanc cassé
          sand: '#EDE8E1',     // beige très léger
          stone: '#B9B1A6',    // pierre
          gold: '#8C764E',     // accent discret
          goldLight: '#C4A96B',
        },
      },
      fontSize: {
        eyebrow: ['0.6875rem', { lineHeight: '1', letterSpacing: '0.25em' }],
      },
      borderRadius: { xl2: '1.5rem' },
      transitionTimingFunction: {
        soft: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      aspectRatio: {
        portrait: '4 / 5',
        landscape: '3 / 2',
      },
    },
  },
  plugins: [],
};
