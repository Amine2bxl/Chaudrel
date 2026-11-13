# Chaudrel — design system

Une seule direction artistique pour tout le site : accueil, métiers, chantiers, zone,
équipe, devis, pied de page. Ce document dit **quoi** utiliser et **pourquoi** ; les
valeurs vivent dans `src/styles/tokens.css`, les briques dans `src/components/ui/index.jsx`.

Règle d'or : si une page a besoin d'une couleur, d'un rayon, d'une durée ou d'un cadre
qui n'est pas ici, c'est la page qui a tort.

## 1. Le fil : une histoire en six verbes

**Imaginer → Concevoir → Préparer → Rénover → Transformer → Révéler.**

Source : `src/data/story.js`. La maquette 3D de l'accueil la raconte en entier ; chaque
page en porte un temps, affiché dans le cartouche de son en-tête et rallumé dans le
pied de page.

| Page | Temps |
|---|---|
| Accueil | les six |
| Devis | 01 Imaginer |
| À propos | 02 Concevoir |
| Méthode, FAQ | 03 Préparer |
| Services, fiches métier | 04 Rénover |
| Fiches chantier | 05 Transformer |
| Réalisations | 06 Révéler |

## 2. Couleur

Trois tons, un accent. Horlogerie plus que chantier.

| Jeton | Valeur | Rôle |
|---|---|---|
| `cream` | `#F7F5F2` | fond de page, la couleur du site |
| `shell` | `#FFFFFF` | surfaces surélevées, sections alternées |
| `sand` | `#EAE5DE` | aplats, fond d'image en attente, pastilles |
| `ink` | `#161C19` | texte, noir tirant sur le vert |
| `bark` | `#16241E` | **vert sapin** : sections sombres, galerie, crépuscule 3D, pied de page |
| `moss` | `#22352C` | le même vert, un cran plus clair (halos, cadres sur fond sombre) |
| `gold` | `#8C764E` | laiton : points, filets, repères — jamais du texte courant |
| `gold-deep` | `#6F5D3D` | laiton lisible : bouton de devis, mot accentué, numéros (5,8:1) |
| `gold-light` | `#C9AE83` | laiton sur fond sombre |

- Texte courant : `ink` à 65 % minimum sur clair, `cream` à 70 % minimum sur sombre (AA).
- Le vert n'est jamais un aplat décoratif au milieu d'une section claire : il **est** la
  section.
- Pas de dégradé de couleur, pas de néon, pas de verre dépoli gratuit.

## 3. Typographie

Deux voix, hébergées sur le site (`public/fonts/`).

| Classe | Police | Usage |
|---|---|---|
| `.xp-wordmark`, `.footer-wordmark` | Marcellus, capitales | le mot-symbole, à l'ouverture et à la fermeture |
| `.t-display` | Marcellus | une phrase par page au maximum (signature, bande de devis) |
| `.t-hero` | Marcellus | H1 des pages intérieures |
| `.t-h1`, `.t-h2` | Marcellus | titres de section |
| `.t-h3` | Schibsted Grotesk 600 | sous-titres |
| `.t-lead`, `.t-body`, `.t-small` | Schibsted Grotesk 400 | texte |
| `.t-label` | Schibsted Grotesk 600, capitales espacées | repères, boutons, méta |
| `.t-num` | chiffres tabulaires | numéros (01, 02…) |

**Mot accentué** : dans un titre, `<em>` passe au laiton (pas d'italique — Marcellus n'en
a pas). Un seul groupe de mots par titre, toujours la fin de la phrase.

## 4. Grille, espacement, formes

- Conteneur : 1320 px, gouttières 20 / 32 / 48 px. Grille de 12 colonnes.
- Rythme vertical : trois intervalles nommés et rien d'autre — `section`, `block`, `group`.
- Arrondis : commandes en pilule, champs 18 px, médias et panneaux 24 px.

Deux gestes donnent sa silhouette au site :

| Geste | Jeton / classe | Où |
|---|---|---|
| **Feuille** — un cadre photo dont un angle s'ouvre en grand arc | `--r-arc`, `<Media shape="leaf">` | une photo vedette par section : équipe, métiers |
| **Nappe** — une section qui remonte sur la précédente, coins hauts arrondis | `--r-sheet`, `.sheet`, `<Section sheet>` | à chaque changement de ton clair ↔ sombre |

Jamais de nappe entre deux sections du même ton. Jamais deux feuilles côte à côte.

## 5. Composants

| Brique | Règle |
|---|---|
| `Eyebrow` | pastille + point de laiton + 2–3 mots. Un par section, jamais deux empilés. |
| `SectionHeading` | `label` (Eyebrow), `title` (H2, `<em>` possible), `text` dessous. |
| `Button` | `solid` laiton = le devis, et lui seul. `outline` / `outlineLight` = le reste. |
| `TextLink` | lien discret : capitales, flèche, filet qui se déploie. |
| `Media` | toute photographie passe par lui (ratio, forme, étalonnage, apparition). |
| `PageHero` | cartouche (fil d'Ariane + temps de l'histoire), grand titre, phrase. |
| `ProjectCarousel` | la cimaise : l'unique façon de montrer des chantiers. |
| `CTASection` + `Footer` | un seul bloc sombre : la bande de devis, puis la dernière scène. |

Appels à l'action, dans cet ordre de force : « Demander un devis » (laiton),
« Parlons de votre rénovation » (contour), lien texte. Un seul bouton laiton par écran.

## 6. Photographie

- **Vraies photos de chantiers Chaudrel uniquement.** Aucune image générée ou de banque
  d'images présentée comme une réalisation.
- Jamais étirées : `object-cover` dans un cadre au ratio choisi, ou — dans la galerie —
  les proportions d'origine, accrochées à hauteur commune.
- Étalonnage commun `.photo` (saturation 0,9 · contraste 1,05) : il fait tenir ensemble
  des photos prises au téléphone, à des heures différentes. Rien n'est retouché.
- La maquette 3D et ses rendus sont des **illustrations**, annoncées comme telles.

Brief pour les prochaines prises de vue (ce qui manque le plus au site) : lumière du
jour, cadrage droit, une vue d'ensemble + deux gros plans de matière par chantier, et
pour les avant/après le **même point de vue**.

## 7. Grammaire du mouvement

Une courbe (`--ease-soft`), quatre durées, une course (`--rise`, 22 px).

| Quoi | Mouvement | Durée |
|---|---|---|
| Texte qui entre | monte de 22 px + fondu (`Reveal`) | `--dur-reveal` 900 ms |
| Photo qui entre | volet qui se lève (`Reveal from="veil"`) | 1,2 s |
| Filet | se trace de gauche à droite | 1,1 s |
| Changement de page | le contenu monte de 10 px (`.page-in`) | 500 ms |
| Survol d'une photo | zoom 1,03 | `--dur-reveal` |
| Survol d'un bouton, d'un lien | couleur, filet, flèche qui se décale | `--dur-fast` 200 ms |
| Barre de navigation | large au repos, compacte au défilement | `--dur-slow` 500 ms |
| Maquette 3D | caméra, vue éclatée, finition : pilotées par le défilement, réversibles | — |

- Rien ne tourne en boucle, rien ne démarre seul, rien ne capture la molette.
- Au premier affichage, la page prérendue reste immobile ; les entrées ne jouent qu'aux
  navigations internes.
- `prefers-reduced-motion` : tout est affiché, rien ne bouge, la 3D cède la place à ses
  images.

## 8. La maquette 3D

Un seul espace — la maquette sur le plan de travail de l'atelier, les plans à gauche,
les échantillons de matières à droite — parcouru sans coupe par une seule caméra.
Storyboard : `src/components/experience/scene/storyboard.js`. Détail technique : README.
