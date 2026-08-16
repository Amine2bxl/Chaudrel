/**
 * Tailwind ne définit aucune valeur : il expose les jetons de
 * `src/styles/tokens.css`. Toute modification de thème se fait là-bas.
 */
const rgb = (name) => `rgb(var(--c-${name}-rgb) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Une seule famille d'interface. La hiérarchie tient à la graisse et à
        // l'échelle, pas à un deuxième caractère. `wordmark` ne sert qu'au
        // logotype Chaudrel.
        sans: ['var(--font-ui)'],
        display: ['var(--font-ui)'],
        wordmark: ['var(--font-wordmark)'],
      },
      colors: {
        cream: rgb('cream'),
        shell: rgb('shell'),
        sand: rgb('sand'),
        ink: rgb('ink'),
        bark: rgb('bark'),
        umber: {
          DEFAULT: rgb('umber'),
          deep: rgb('umber-deep'),
          light: rgb('umber-light'),
        },
        error: {
          DEFAULT: rgb('error'),
          light: rgb('error-light'),
        },
      },
      borderRadius: {
        xs: 'var(--r-xs)',
        sm: 'var(--r-sm)',
        DEFAULT: 'var(--r-md)',
        md: 'var(--r-md)',
        lg: 'var(--r-lg)',
        xl: 'var(--r-xl)',
        logo: 'var(--r-logo)',
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        lift: 'var(--shadow-lift)',
      },
      spacing: {
        section: 'var(--space-section)',
        block: 'var(--space-block)',
      },
      maxWidth: {
        page: '1320px',
        prose: '68ch',
      },
      transitionTimingFunction: {
        soft: 'var(--ease-soft)',
      },
      transitionDuration: {
        fast: 'var(--dur-fast)',
        DEFAULT: 'var(--dur)',
        slow: 'var(--dur-slow)',
      },
    },
  },
  plugins: [],
};
