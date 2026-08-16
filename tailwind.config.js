/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Inter Tight porte le texte courant, Archivo les titres.
        // Pas de serif : le vocabulaire est celui de la signalétique
        // architecturale, pas celui du magazine de décoration.
        sans: ["'Inter Tight'", 'system-ui', 'sans-serif'],
        display: ['Archivo', "'Inter Tight'", 'system-ui', 'sans-serif'],
      },
      colors: {
        // Un gris papier neutre, un graphite, un accent unique.
        // Aucun beige, aucun laiton : la couleur ne raconte rien,
        // ce sont les photos de chantier qui portent la chaleur.
        ink: '#15161A', // texte et aplats clairs
        carbon: '#0B0C0E', // sections sombres
        paper: '#EDEDEA', // fond de page
        stone: '#DFDFDB', // fond d'image, séparations pleines
        signal: {
          DEFAULT: '#CC3A14', // accent sur fond clair — 6:1 sur paper
          light: '#F0724A', // même accent sur fond sombre — 6,4:1 sur carbon
        },
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
