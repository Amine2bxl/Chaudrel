# Chaudrel — site V2

Site vitrine, portfolio et outil de génération de demandes de devis pour Chaudrel
Rénovation (Bruxelles). React 18 + Vite 5 + Tailwind 3, pré-rendu en HTML statique,
déployé sur Vercel.

## Démarrer

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # vite build + pré-rendu de toutes les routes + sitemap
npm run preview    # sert dist/ (les fonctions /api ne tournent pas ici)
```

Pour tester le formulaire de devis de bout en bout : `vercel dev`.

## Architecture

```
src/
├── data/           contenu du site — c'est ici qu'on édite
│   ├── site.js         identité, contacts, navigation, WhatsApp
│   ├── belgium.js      contours des provinces (illustration de la zone)
│   ├── projects.js     réalisations + catégories
│   ├── services.js     services + FAQ par service
│   ├── testimonials.js avis (⚠️ à valider — voir docs/VERIFICATION.md)
│   ├── faqs.js         FAQ générale
│   └── method.js       les 5 étapes
├── pages/          une page par route
├── components/
│   ├── layout/     Navbar, Footer, MobileBar
│   ├── sections/   Hero, PageHero, ProjectGrid, ServiceList, ProcessTimeline,
│   │               BelgiumCoverage, BeforeAfter, Testimonials, FaqAccordion,
│   │               CTASection
│   └── ui/         Container, Section, Button, SectionHeading, Figure…
├── lib/
│   ├── seo.js      métadonnées + JSON-LD par route (source unique)
│   ├── SeoHead.jsx applique le SEO lors des navigations client
│   ├── analytics.js événements commerciaux (no-op sans outil branché)
│   ├── reveal.jsx  animations d'apparition au scroll
│   └── utils.js
api/
└── lead.js         réception des demandes de devis (Vercel Function)
scripts/
└── prerender.js    HTML statique par route + sitemap.xml
docs/               audit, SEO, réseaux sociaux, stratégie, roadmap, meeting
```

## Routes

`/` · `/realisations` · `/realisations/:slug` · `/services` · `/services/:slug` ·
`/methode` · `/a-propos` · `/faq` · `/contact` · `/devis` ·
`/legal/politique-mentions` · 404

Chaque route est rendue en HTML statique au build (23 pages) : les bots voient le
contenu sans exécuter de JavaScript, et chaque page a ses propres title, description,
canonical, Open Graph et JSON-LD.

## Ajouter du contenu

**Une réalisation** → un objet dans `src/data/projects.js` :

```js
{
  slug: 'salle-de-bain-schaerbeek',
  title: 'Salle de bain Schaerbeek',
  type: 'Salle de bain',
  categories: ['salle-de-bain', 'appartement'],
  location: 'Schaerbeek, Bruxelles',
  cover: '/photos/mon-image.webp',
  coverAspect: 'aspect-[3/2]',
  featured: true,
  summary: '…',
  description: '…',
  works: ['…'],
  materials: ['…'],
  images: ['/photos/mon-image.webp'],
  beforeAfter: { before: '/photos/avant.webp', after: '/photos/apres.webp' }, // optionnel
}
```

La page `/realisations/salle-de-bain-schaerbeek`, son SEO, son entrée de sitemap et
les filtres se génèrent automatiquement au prochain build.

**Un service** → un objet dans `src/data/services.js` (même principe).
**Un avis, une FAQ** → `src/data/testimonials.js`, `src/data/faqs.js`.

Les images vont dans `public/photos/` (WebP, largeur ≥ 1600 px pour les visuels pleine largeur).

## Design system

Cinq couleurs (`ink`, `night`, `cream`, `sand`, `gold`), deux familles
typographiques (Inter pour tout, Playfair Display réservé aux titres) et sept
niveaux de texte (`.t-display`, `.t-h1`, `.t-h2`, `.t-h3`, `.t-body`, `.t-small`,
`.t-label`) définis dans `src/index.css`. Pas d'ombre portée, pas de dégradé :
la mise en page repose sur des filets, du vide et la typographie.

Animations : `<Reveal>` (`up`, `fade`, `line`, `lineY`, `veil`) applique une classe
au scroll via IntersectionObserver, tout le reste est en CSS. `prefers-reduced-motion`
neutralise l'ensemble.

## Formulaire de devis

`/devis` → `POST /api/lead`. La page `/contact` envoie au même endpoint avec un
formulaire court (nom, téléphone, e-mail, message). Validation client et serveur, honeypot, limitation de
débit, consentement RGPD obligatoire.

Variables d'environnement Vercel à configurer :

| Variable | Rôle |
|---|---|
| `RESEND_API_KEY` | clé API Resend |
| `LEAD_TO_EMAIL` | adresse qui reçoit les demandes |
| `LEAD_FROM_EMAIL` | expéditeur vérifié chez Resend |

Sans ces variables, l'endpoint répond 503 et le formulaire affiche le téléphone et
WhatsApp en repli — aucun lead n'est perdu silencieusement.

## Analytics

`src/lib/analytics.js` émet 12 événements (clic devis, étapes du formulaire, envoi,
téléphone, WhatsApp, réseaux, consultation projet/service). La fonction est un no-op
tant qu'aucun outil n'est chargé : brancher GA4 ou Plausible suffit à les recevoir.
Aucun cookie tiers n'est posé aujourd'hui.

## Documentation

| Fichier | Contenu |
|---|---|
| `docs/AUDIT.md` | audit V1 classé P0–P3 et ce qui a été corrigé |
| `docs/VERIFICATION.md` | **à valider avec Chaudrel avant mise en production** |
| `docs/SEO-LOCAL.md` | stratégie de référencement local |
| `docs/RESEAUX-SOCIAUX.md` | Instagram, Facebook, WhatsApp, Linktree |
| `docs/STRATEGIE-COMMERCIALE.md` | funnel, canaux, partenariats |
| `docs/MATERIEL-COMMERCIAL.md` | carte de visite, brochure, présentation |
| `docs/OBJECTIFS-ROADMAP.md` | KPI et roadmaps 30 / 90 jours / 6 / 12 mois |
| `docs/MEETING.md` | déroulé du meeting et informations à demander |

## Règle de contenu

Aucun chiffre, avis, délai, prix ou référence n'est publié sans validation de
Chaudrel. Les éléments en attente sont marqués `TODO_VALIDATION` dans le code et
listés dans `docs/VERIFICATION.md`.
