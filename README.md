# Chaudrel — site V6

Site vitrine, portfolio et outil de demande de devis de Chaudrel Rénovation
(Schaerbeek, toute la Belgique). React 18 + Vite 5 + Tailwind 3, pré-rendu en HTML
statique puis hydraté, déployé sur Vercel.

Direction V6 : *quiet luxury × éditorial architectural × savoir-faire*. Photographie
réelle uniquement — aucune 3D, aucune image de synthèse, aucune photo de banque.
Audit, références et direction : `docs/V6-AUDIT-DIRECTION.md`.

## Démarrer

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # vite build + pré-rendu de toutes les routes + sitemap
npm run preview    # sert dist/ (les fonctions /api ne tournent pas ici)
npm test           # build + tests de bout en bout (navigateur réel, API simulée)
node scripts/responsive-images.mjs   # variantes 480/800/1200 px des photos (cwebp ou ImageMagick)
```

Les tests utilisent `playwright-core` : `npx playwright-core install chromium` une fois
sur un poste qui n'a pas encore le navigateur.

Pour tester le formulaire de devis de bout en bout : `vercel dev`.

## Architecture

```
src/
├── data/           contenu du site — c'est ici qu'on édite
│   ├── site.js         identité, contacts, réseaux vérifiés, navigation, WhatsApp
│   ├── projects.js     réalisations (dossiers photo) + catégories + anciennes adresses
│   ├── services.js     les six métiers + FAQ par métier
│   ├── method.js       les 4 étapes
│   ├── faqs.js         FAQ générale
│   ├── testimonials.js avis (⚠️ non validés, non publiés — voir docs/VERIFICATION.md)
│   └── image-variants.json  manifeste des variantes responsives (généré)
├── pages/          une page par route
├── components/
│   ├── layout/     Navbar, Footer, MobileBar, ContactDialog, SocialLinks
│   ├── home/       HomeHero
│   ├── sections/   PageHero, ServiceMarquee, ProjectCarousel, ServiceIndex,
│   │               DetailStrip, Commitments, MethodSteps, FaqAccordion,
│   │               BeforeAfter, CTASection
│   └── ui/         Container, Section, DarkPanel, Button, Tag, Media…
├── lib/            seo.js, SeoHead.jsx, analytics.js, reveal.jsx, image.js
└── styles/         tokens.css (jetons), gallery.css (carrousel)
api/lead.js         réception des demandes de devis (Vercel Function)
scripts/            prerender.js (HTML + sitemap), responsive-images.mjs
```

## Routes

`/` · `/realisations` · `/realisations/:slug` · `/services` · `/services/:slug` ·
`/methode` · `/a-propos` · `/faq` · `/devis` · `/liens` (alias `/link`, `/links`) ·
`/legal/politique-mentions` · 404. `/contact` redirige vers l'accueil (la fenêtre de
contact remplace la page). Les anciennes fiches de réalisations redirigent en 301
vers le dossier qui contient leur photo (`vercel.json`, `LEGACY_SLUGS`).

Chaque route est rendue en HTML statique au build (21 pages, 20 dans le sitemap) puis
hydratée : le contenu s'affiche sans attendre le JavaScript, et chaque page a ses
propres title, description, canonical, Open Graph et JSON-LD.

## Ajouter du contenu

**Une réalisation** → un objet dans `src/data/projects.js` (schéma documenté en tête
de fichier). `location`, `year` et `materials` ne s'affichent que renseignés : ne les
remplir qu'avec des informations confirmées par Chaudrel. Un comparateur avant/après
n'a de sens qu'avec deux photos prises **du même point de vue**.

**Un métier** → `src/data/services.js` ; `image: null` tant qu'aucune vraie photo ne
montre ce métier.

Les photos vont dans `public/photos/` (WebP). Relancer ensuite
`node scripts/responsive-images.mjs`.

## Design system

Jetons dans `src/styles/tokens.css`, exposés par Tailwind, documentés dans
`docs/DESIGN-SYSTEM.md` : graphite `#151615`, charbon `#20211F`, ivoire `#F4F1EA`,
blanc cassé `#FBFAF7`, or champagne `#B79A65` / profond `#917447` / clair `#D1BA8D`.
Instrument Serif (titres) + Manrope (interface et texte), hébergées sur le site.

## Formulaire de devis

`/devis` → `POST /api/lead`. Validation client et serveur, honeypot, limitation de
débit, consentement RGPD obligatoire.

Variables d'environnement Vercel à configurer :

| Variable | Rôle |
|---|---|
| `RESEND_API_KEY` | clé API Resend |
| `LEAD_TO_EMAIL` | adresse qui reçoit les demandes |
| `LEAD_FROM_EMAIL` | expéditeur vérifié chez Resend |

Sans ces **trois** variables, l'endpoint répond 503 et le formulaire propose l'e-mail
pré-rempli, WhatsApp et le téléphone — aucun lead n'est perdu silencieusement, et
aucune demande ne part vers une boîte par défaut.

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
