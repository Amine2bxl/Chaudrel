# Audit V1 → décisions V2

Audit réalisé sur le repository à l'état `main` (landing page unique, React 18 +
Vite 5 + Tailwind 3, prerender SSR maison, déploiement Vercel).

Priorités : **P0** = bloquant avant le meeting · **P1** = important · **P2** = amélioration · **P3** = plus tard.

## Architecture

| # | Constat V1 | Prio | Statut V2 |
|---|---|---|---|
| A1 | Une seule page, aucun routeur : impossible d'avoir une page par service ou par projet → plafond SEO immédiat | P0 | ✅ `react-router-dom`, 11 routes, 22 pages pré-rendues |
| A2 | Tout le contenu codé en dur dans les composants (avis, FAQ, services) | P0 | ✅ `src/data/` (projects, services, testimonials, faqs, method, site) |
| A3 | Dossier unique `components/landing/` sans hiérarchie | P1 | ✅ `components/{layout,sections,ui}` + `pages/` |
| A4 | `scripts/build-legal.js` : second pipeline SSR dupliqué pour une seule page légale | P1 | ✅ supprimé — la page légale est une route comme les autres |
| A5 | Aucun système pour ajouter un projet/service sans toucher au code des composants | P0 | ✅ ajouter un objet dans `src/data/*` suffit |

## SEO

| # | Constat V1 | Prio | Statut V2 |
|---|---|---|---|
| S1 | 2 URLs indexables (`/` et la page légale) pour une entreprise multi-services multi-communes | P0 | ✅ 22 URLs, sitemap généré au build |
| S2 | Metadata figées dans `index.html` — identiques pour toute navigation | P0 | ✅ `src/lib/seo.js` = source unique, appliquée au prerender **et** au runtime |
| S3 | JSON-LD FAQPage affirmant des prix et délais non vérifiés (risque de sanction Google + risque commercial) | P0 | ✅ FAQ réécrite sans prix ni délai inventé |
| S4 | Aucun schema `Service`, `BreadcrumbList`, `ItemList`, `CreativeWork` | P1 | ✅ ajoutés par type de page |
| S5 | `keywords` meta (obsolète) + keyword stuffing dans les descriptions | P2 | ✅ retiré |
| S6 | Sitemap statique écrit à la main, jamais à jour | P1 | ✅ régénéré à chaque build depuis les données |
| S7 | Maillage interne inexistant (ancres `#section` uniquement) | P1 | ✅ liens croisés service ↔ projets ↔ devis, fil d'Ariane sur chaque page |

## Conversion

| # | Constat V1 | Prio | Statut V2 |
|---|---|---|---|
| C1 | Pas de page de demande de devis : un formulaire noyé en bas de page | P0 | ✅ `/devis`, parcours 5 étapes, page dédiée |
| C2 | Aucun endpoint : le lead partait par `mailto:` (perte massive sur mobile) | P0 | ✅ `POST /api/lead` (validation serveur, honeypot, rate-limit, Resend) |
| C3 | Pas de gestion loading / succès / erreur | P0 | ✅ 4 états + repli téléphone/WhatsApp en cas d'échec |
| C4 | WhatsApp absent | P0 | ✅ barre mobile, menu, footer, CTA de section, page devis |
| C5 | Aucun tracking des actions commerciales | P1 | ✅ `src/lib/analytics.js` — 12 événements, no-op tant qu'aucun outil n'est branché |
| C6 | Consentement RGPD absent du formulaire | P0 | ✅ case à cocher obligatoire + lien vers la politique |
| C7 | Aucun anti-spam | P1 | ✅ honeypot + limitation de débit côté serveur |
| C8 | Preuve sociale invérifiable en haut de page (« 150+ projets », « 5.0 ») | P0 | ✅ remplacée par des faits vérifiables (année, zone, TVA, devis gratuit) |

## UX / UI / accessibilité

| # | Constat V1 | Prio | Statut V2 |
|---|---|---|---|
| U1 | `user-select: none` sur tout le body : impossible de copier un numéro de téléphone | P0 | ✅ supprimé |
| U2 | `touch-action` / `overscroll-behavior` bloquant le zoom : violation WCAG 1.4.4 | P0 | ✅ supprimé, zoom rétabli |
| U3 | Pas de style `:focus-visible` cohérent | P1 | ✅ contour doré global |
| U4 | Pas de lien d'évitement | P1 | ✅ « Aller au contenu » |
| U5 | Direction artistique « SaaS doré » : coins très arrondis, glassmorphism, ombres portées | P1 | ✅ système éditorial : angles nets, filets fins, noir / crème / pierre / beige |
| U6 | Comparateur avant/après non accessible au clavier | P1 | ✅ deux boutons `aria-pressed`, navigable au clavier |
| U7 | `prefers-reduced-motion` partiellement respecté | P2 | ✅ toutes les animations neutralisées, y compris les reveals |

## Performance

| # | Constat V1 | Prio | Statut V2 |
|---|---|---|---|
| P1 | Bundle unique chargeant tout le site | P2 | ✅ pages séparées, vendor React en chunk distinct (JS total ~35 kB gzip + 45 kB React) |
| P2 | Preload de l'image hero appliqué à toutes les pages | P1 | ✅ preload conservé uniquement sur la home |
| P3 | Images sans `width`/`height` → CLS | P1 | ⚠️ partiellement : ratios fixés en CSS (`aspect-*`), attributs à ajouter sur les photos restantes |
| P4 | Polices Google en bloquant | P2 | ⏳ P2 — auto-hébergement des 2 familles à faire après le meeting |

## Sécurité

| # | Constat V1 | Prio | Statut V2 |
|---|---|---|---|
| Sec1 | CSP autorisant `images.unsplash.com` (plus nécessaire) | P2 | ✅ retiré |
| Sec2 | Aucune validation serveur (aucun serveur) | P0 | ✅ validation + limitation de débit dans `/api/lead` |

## Reste à faire (P2/P3, après le meeting)

- Attributs `width`/`height` sur toutes les images (CLS).
- Auto-hébergement des polices.
- Génération d'images responsive (`srcset`, AVIF) — actuellement WebP unique.
- Pages « rénovation à <commune> » (Uccle, Ixelles, Schaerbeek, Woluwe…) une fois
  qu'un vrai chantier peut illustrer chacune.
- Branchement analytics + Search Console.
- Tests automatisés (aucun framework de test dans le projet aujourd'hui).
