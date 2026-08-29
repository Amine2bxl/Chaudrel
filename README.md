# Chaudrel Rénovation

Site vitrine de la société **Chaudrel Rénovation** — rénovation haut de gamme à Bruxelles.
Construit avec React + Vite + Tailwind CSS, optimisé pour un déploiement en un clic sur Vercel.

## Stack

- **React 18** + **Vite 5** — build rapide, HMR instantané
- **Tailwind CSS 3** — utility-first, palette de marque centralisée
- **Framer Motion** — animations sobres et fluides
- **Lucide React** — icônes
- Aucun backend, aucune dépendance à un service tiers

## Démarrage

```bash
npm install
npm run dev      # serveur local sur http://localhost:5173
npm run build    # build de production dans dist/
npm run preview  # aperçu du build
```

## Déploiement sur Vercel

1. Pousser le repo sur GitHub
2. Sur [vercel.com/new](https://vercel.com/new), importer le repo
3. Vercel détecte automatiquement Vite — aucune configuration requise
4. Le fichier `vercel.json` ajoute des en-têtes de cache optimaux sur les assets

## Structure

```
.
├── index.html              # Point d'entrée HTML (SEO, JSON-LD, fonts)
├── public/favicon.svg      # Favicon
├── src/
│   ├── main.jsx            # Entry React
│   ├── App.jsx             # Composition de la page
│   ├── index.css           # Tailwind + reset
│   ├── lib/
│   │   ├── content.js      # Textes, contacts, URLs d'images (UNIQUE source de contenu)
│   │   └── utils.js        # Helper cn()
│   └── components/landing/ # Toutes les sections de la landing
│       ├── Navbar.jsx
│       ├── Hero.jsx
│       ├── SocialProof.jsx
│       ├── Services.jsx
│       ├── Portfolio.jsx
│       ├── BeforeAfter.jsx
│       ├── Story.jsx
│       ├── Benefits.jsx
│       ├── Testimonials.jsx
│       ├── FAQ.jsx
│       ├── CTA.jsx         # Formulaire de contact (mailto:)
│       └── Footer.jsx
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── vercel.json
```

## Modifier le contenu

Toute l'information du site (téléphones, email, témoignages, images, services…) est dans
`src/lib/content.js`. C'est l'**unique** endroit à modifier pour changer le contenu
sans toucher au design.

## Remplacer les images

Les images proviennent actuellement d'Unsplash (libres de droits) en attendant
des visuels définitifs. Pour utiliser des images locales ou auto-hébergées :

1. Déposer les fichiers dans `public/images/`
2. Mettre à jour les URLs dans `src/lib/content.js`
3. Reconstruire : `npm run build`

## Formulaire de contact

Le formulaire utilise un `mailto:` qui ouvre le client mail de l'utilisateur avec
un message pré-rempli envoyé à `Info@chaudrel.be`. Zéro backend, zéro tracking,
RGPD-friendly par construction.

Pour intégrer un service tiers (Resend, Formspree, Web3Forms…), remplacer la
fonction `handleSubmit` dans `src/components/landing/CTA.jsx`.

## Accessibilité & SEO

- HTML sémantique (`<main>`, `<section>`, `<nav>`, `<article>`, `<footer>`, `<blockquote>`)
- Attributs ARIA sur les éléments interactifs (menu mobile, slider avant/après, FAQ)
- `prefers-reduced-motion` respecté
- Lazy loading sur les images hors écran
- `fetchpriority="high"` sur l'image Hero (LCP)
- Open Graph + Twitter Cards
- JSON-LD `GeneralContractor` pour le SEO local
- `<html lang="fr">` + `og:locale="fr_BE"`

## Licence

Code : tous droits réservés © Chaudrel Rénovation.
