/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Une seule famille sur tout le site. Schibsted Grotesk tient le texte
        // courant comme les grands titres ; c'est la graisse et l'échelle qui
        // font la hiérarchie, pas un deuxième caractère rapporté.
        sans: ["'Schibsted Grotesk'", 'system-ui', 'sans-serif'],
        display: ["'Schibsted Grotesk'", 'system-ui', 'sans-serif'],
      },
      colors: {
        /* ----------------------------------------------------------------
           Une seule famille chromatique : la terre.
           Le crème est le papier, le brun est la matière, et l'accent est ce
           même brun — pas un doré rapporté. Une marque, une couleur.
           ---------------------------------------------------------------- */
        cream: '#F4F0E8', // fond de page
        shell: '#FBF9F4', // surfaces surélevées : cartes, panneaux, champs
        sand: '#E7DFD2', // aplats discrets, fond d'image en attente
        umber: {
          DEFAULT: '#6B4A35', // brun de marque — 6,7:1 sur crème
          deep: '#54392A', // état pressé / survol
          light: '#C8A385', // même brun sur fond sombre — 7:1 sur bark
        },
        ink: '#241D18', // texte
        bark: '#1B1512', // sections sombres
      },
      borderRadius: {
        /* Une seule échelle, appliquée partout. Rien d'anguleux ne subsiste. */
        xs: '0.625rem', // 10px — puces, petits champs
        sm: '0.875rem', // 14px — boutons compacts, chips
        DEFAULT: '1.125rem', // 18px — boutons, champs
        md: '1.125rem',
        lg: '1.5rem', // 24px — images, cartes
        xl: '2rem', // 32px — grands médias, panneaux
        '2xl': '2.5rem', // 40px — blocs pleine largeur
      },
      boxShadow: {
        /* Ombres teintées dans le brun du fond, jamais du noir pur.
           Décalage vertical + flou : une ombre portée, pas un halo. */
        soft: '0 1px 2px rgb(36 29 24 / 0.04), 0 10px 28px -14px rgb(36 29 24 / 0.20)',
        lift: '0 2px 4px rgb(36 29 24 / 0.05), 0 26px 50px -22px rgb(36 29 24 / 0.30)',
        inset: 'inset 0 1px 0 rgb(255 255 255 / 0.6)',
      },
      maxWidth: {
        page: '1320px',
        prose: '68ch',
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
