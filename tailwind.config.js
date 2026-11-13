/**
 * Tailwind ne définit aucune valeur : il expose les jetons de
 * `src/styles/tokens.css`. Toute modification de thème se fait là-bas.
 */
const rgb = (name) => `rgb(var(--c-${name}-rgb) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  /* Sur écran tactile, un `:hover` reste collé après le tap. Ce drapeau
     enferme les variantes `hover:` dans `@media (hover: hover)`. */
  future: {
    hoverOnlyWhenSupported: true,
  },

  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-ui)'],
        display: ['var(--font-display)'],
        wordmark: ['var(--font-wordmark)'],
      },
      colors: {
        graphite: rgb('graphite'),
        charcoal: rgb('charcoal'),
        ivory: rgb('ivory'),
        paper: rgb('paper'),
        stone: rgb('stone'),
        ink: rgb('ink'),
        gold: {
          DEFAULT: rgb('gold'),
          deep: rgb('gold-deep'),
          light: rgb('gold-light'),
          ink: rgb('gold-ink'),
        },
        success: {
          DEFAULT: rgb('success'),
          light: rgb('success-light'),
        },
        error: {
          DEFAULT: rgb('error'),
          light: rgb('error-light'),
        },
      },
      borderRadius: {
        xs: 'var(--r-xs)',
        img: 'var(--r-img)',
        sm: 'var(--r-sm)',
        DEFAULT: 'var(--r-md)',
        md: 'var(--r-md)',
        lg: 'var(--r-lg)',
        panel: 'var(--r-panel)',
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        lift: 'var(--shadow-lift)',
      },
      spacing: {
        section: 'var(--space-section)',
        block: 'var(--space-block)',
        group: 'var(--space-group)',
        gutter: 'var(--gutter)',
        header: 'var(--header-h)',
      },
      maxWidth: {
        page: 'var(--page-max)',
        prose: '64ch',
      },
      transitionTimingFunction: {
        soft: 'var(--ease-soft)',
        glide: 'var(--ease-glide)',
      },
      transitionDuration: {
        fast: 'var(--dur-fast)',
        DEFAULT: 'var(--dur)',
        slow: 'var(--dur-slow)',
        reveal: 'var(--dur-reveal)',
      },
    },
  },
  plugins: [],
};
