/**
 * Tailwind ne définit aucune valeur : il expose les jetons de
 * `src/styles/tokens.css`. Toute modification de thème se fait là-bas.
 */
const rgb = (name) => `rgb(var(--c-${name}-rgb) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  /* Sur un écran tactile, un `:hover` reste collé après le tap : la carte
     touchée garde son état de survol jusqu'au tap suivant, ailleurs. Ce drapeau
     enferme toutes les variantes `hover:` dans `@media (hover: hover)`, donc
     l'effet n'existe que là où un curseur existe. */
  future: {
    hoverOnlyWhenSupported: true,
  },

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
        void: rgb('void'),
        ground: rgb('ground'),
        surface: rgb('surface'),
        raised: rgb('raised'),
        glow: rgb('glow'),
        cream: rgb('cream'),
        shell: rgb('shell'),
        sand: rgb('sand'),
        ink: rgb('ink'),
        bark: rgb('bark'),
        gold: {
          DEFAULT: rgb('gold'),
          deep: rgb('gold-deep'),
          hover: rgb('gold-hover'),
          light: rgb('gold-light'),
        },
        green: {
          DEFAULT: rgb('green'),
          light: rgb('green-light'),
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
        group: 'var(--space-group)',
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
