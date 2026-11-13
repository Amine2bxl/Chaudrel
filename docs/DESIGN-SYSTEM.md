# Design system — Chaudrel V6

*Quiet luxury × éditorial architectural × savoir-faire.* Le luxe tient à l'espace, à
la retenue et à la qualité de la photographie, pas à la taille des titres ni aux effets.

Source unique des valeurs : `src/styles/tokens.css`. Tailwind ne fait que les exposer
(`tailwind.config.js`). Les classes typographiques et le mouvement sont dans `src/index.css`.

## 1. Couleur

| Jeton | Valeur | Rôle |
|---|---|---|
| `graphite` | `#151615` | sections sombres, texte principal (`ink`), boutons primaires sur fond clair |
| `charcoal` | `#20211F` | surfaces sur fond sombre, survol des boutons graphite |
| `ivory` | `#F4F1EA` | fond de page |
| `paper` | `#FBFAF7` | surfaces claires surélevées : sections alternées, cartes, champs |
| `stone` | `#E7E2D7` | image en attente de chargement |
| `gold` | `#B79A65` | or champagne : filets, puces, bouton principal sur fond sombre |
| `gold-deep` | `#917447` | mot accentué des titres (≥ 24 px), focus, bordures |
| `gold-light` | `#D1BA8D` | accent sur fond sombre |
| `gold-ink` | `#76603C` | petits repères dorés lisibles sur ivoire (numéros) |
| `error` | `#9A3B23` | erreurs de formulaire |

Plus de vert : la validation prend l'or (`success` = `gold-ink`) et une coche.

Contrastes mesurés (WCAG 2.2) : graphite/ivoire 16,1 · ink 70 %/ivoire 6,3 ·
gold-ink/ivoire 5,3 · gold-deep/ivoire 3,9 (grands corps seulement) · gold/graphite 6,8 ·
gold-light/graphite 9,6 · ivoire 60 %/graphite 6,4. **Le champagne n'écrit jamais sur
l'ivoire** (2,4) : il y dessine. Texte secondaire : jamais sous `ink/65`.

## 2. Typographie

Instrument Serif (titres, italique pour l'accent) + Manrope (tout le reste). Fichiers
`public/fonts/*.woff2`, sous-ensemble latin, préchargés, `font-display: swap`, avec
polices de repli recalées (`size-adjust`) pour éviter tout décalage au chargement.

| Classe | Police | Bureau | Téléphone | Usage |
|---|---|---|---|---|
| `.t-hero` | Instrument Serif | 52 px | 38 px | H1 de l'accueil, titre de l'appel final |
| `.t-h1` | Instrument Serif | 48 px | 34 px | H1 des pages intérieures |
| `.t-h2` | Instrument Serif | 34 px | 26 px | titres de section |
| `.t-h3` | Instrument Serif | 22 px | 20 px | titres de carte |
| `.t-h4` | Manrope 600 | 17 px | 17 px | intitulés d'interface |
| `.t-lead` | Manrope | 18 px | 16 px | introductions |
| corps | Manrope | 16 px | 15 px | texte courant |
| `.t-small` | Manrope | 13 px | 13 px | légendes, descriptions |
| `.t-label` / `.eyebrow` | Manrope 600, capitales 0,12 em | 11,5 px | 11,5 px | fil d'Ariane, rubriques, repère de section |
| navigation | Manrope 500 | 13 px | — | barre de navigation |

**Mot accentué** : `<em>` dans un titre → italique d'Instrument Serif en `gold-deep`
(`gold-light` sur fond sombre). Un seul par titre. Les boutons sont en bas de casse.

## 3. Gabarit et espacement

- Conteneur : 1320 px, gouttière `clamp(16 px, 4vw, 48 px)` (16 px au téléphone).
- Grille 12 colonnes au bureau ; titres à gauche (7 col.), texte ou action à droite (5 col.).
- Trois intervalles verticaux : `section` (72–136 px), `block` (36–64 px), `group` (24–36 px).
- En-tête : 72 px.

## 4. Formes

- Photographies : rayon 4 px (`rounded-img`), presque droites.
- Champs : 12 px. Panneaux clairs : 18 px.
- **Grands panneaux graphite** (`DarkPanel`, rayon 20–32 px, détachés du bord de 8–12 px) :
  réalisations, appel final, pied de page. C'est la signature de mise en page du site.
- Commandes (boutons, filtres, étiquettes, flèches rondes) : pilules.
- Filets d'un pixel (`ink/12`), jamais de bordure épaisse. Ombres rares et douces.

## 5. Composants

`src/components/ui/index.jsx` : `Container`, `Section` (tons `ivory`, `paper`, `stone`,
`graphite`, `charcoal`), `DarkPanel`, `SectionHeading` (`label`, `align="split"`),
`Eyebrow`, `Button` (`solid`, `gold`, `light`, `outline`, `outlineLight` ; `sm`/`md`/`lg` ;
`arrow`), `RoundArrow`, `TextLink`, `Tag`, `Media` (ratio, révélation, `drift`, `zoom`),
`Panel`, `Disclosure`, `PlusIcon`.

Sections : `PageHero` (fil d'Ariane, titre, intro, photo ou colonne libre),
`ServiceMarquee`, `ProjectCarousel`, `ServiceIndex`, `DetailStrip`, `Commitments`,
`MethodSteps`, `FaqAccordion` (`<details>` natif), `BeforeAfter`, `CTASection`.

## 6. Photographie

- **Uniquement des photos de chantier Chaudrel.** Ni banque d'images, ni 3D, ni IA.
- Étalonnage commun léger (`.photo` : saturation 0,86, contraste 1,04) pour accorder des
  photos de téléphone prises à des heures différentes. Aucune retouche de contenu.
- Recadrage par `object-fit: cover` et `object-position`, jamais d'étirement ni
  d'agrandissement au-delà de la définition d'origine. Les gros plans (`detail-*.webp`)
  sont découpés à 100 % dans les originaux.
- Variantes 480/800/1200 px + original dans `srcset`, `sizes` par disposition (`lib/image.js`).
- Chaque `alt` décrit ce que montre la photo, rien de plus.

## 7. Mouvement

Transform, opacité et `clip-path` uniquement — tout reste sur le compositeur (60 et 120 Hz).

| Geste | Où | Durée / courbe |
|---|---|---|
| Entrée d'en-tête (`.enter`, `.enter-mask`) | H1, intro, photo d'ouverture | 0,9–1,3 s, CSS seul, sans attendre le JS |
| Apparition (`<Reveal>`) | blocs de texte | 1 s, `ease-soft`, course 18 px |
| Volet photo (`veil`) | photographies | 1,25 s `ease-glide` + image qui se pose (échelle 1,08 → 1) |
| Parallaxe (`drift`) | 2 photos éditoriales | liée au défilement en CSS (`animation-timeline: view()`), absente ailleurs |
| Bandeau des métiers | accueil | 48 s linéaire, pause au survol |
| Survol | photos 1,035 ; flèches rondes 45° | 1,1 s / 560 ms |

`prefers-reduced-motion` : tout est immobile (bandeau compris). Sans JavaScript : rien
n'est caché (`html:not(.js)`), la classe `js` étant posée par un script en ligne autorisé
par son empreinte dans la CSP.

## 8. Accessibilité

Un seul H1 par page, hiérarchie de titres continue, focus visible en or, cibles ≥ 44 px,
fil d'Ariane, carrousel pilotable au clavier (flèches) avec compteur annoncé, FAQ en
`<details>`, formulaire avec erreurs liées aux champs. Lighthouse accessibilité visé : 100.
