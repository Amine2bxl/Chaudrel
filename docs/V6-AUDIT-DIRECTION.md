# V6 — Audit, analyse de référence, direction créative

Branche `feature/chaudrel-premium-3d` · novembre 2026. Rien n'est fusionné dans `main`.

## 01 · Audit (avant V6), par priorité

| # | Constat | Gravité | Traitement V6 |
|---|---|---|---|
| A1 | **Visuel d'ouverture = photo de banque.** `photos/hero.webp` (villa sombre au crépuscule) est l'image Unsplash de la V1, « restaurée » en juillet (`e6fe920`). Elle laissait croire à une réalisation Chaudrel. La vraie photo d'origine (façade enduite, deux portes de garage) était dans l'historique (`3eaf2ae`). | Critique | Fichier retiré du site ; vraie photo restaurée (`photos/facade-garages.webp`). Récupérable par git si Chaudrel prouve que la villa est un de ses chantiers. |
| A2 | **Textes de réalisations sans rapport avec leurs photos.** « Cuisine Ixelles » illustrée par une façade et une toiture ; « Villa Tervuren, intérieur » par une façade en brique ; « Terrasse Woluwe, pierre naturelle » par une porte d'entrée ; etc. Titres et lieux hérités de la V1. | Critique | Réalisations regroupées en 6 **dossiers par nature de travaux**, textes et `alt` décrivant uniquement ce que montrent les photos ; aucun lieu ni année tant que non confirmés. Anciennes URL → 301 vers le dossier qui contient leur photo. |
| A3 | **Avant/après trompeurs.** Les paires `ba-*` ne sont pas prises du même point de vue (volet roulant / rangée de garages ; maison en pierre / extension). | Haute | Comparateur retiré des pages ; composant conservé pour de vraies paires. |
| A4 | **3D modélisée** : monde three.js (maison d'étude), film d'accueil GSAP, page `/visite`. Exclu par le brief V6. | Haute | Supprimés (code, images, tests, `three` et `gsap` retirés des dépendances). `/visite` → 302 vers `/realisations`. |
| A5 | Liens sociaux faux : Facebook `facebook.com/chaudrel_renovation` (nom impossible sur Facebook), YouTube `@chaudrelrenovations` (404), TikTok divergent dans la doc. | Haute | Vérifiés via le Linktree réel de Chaudrel (`linktr.ee/chaudrel`) et TikTok : voir §06. |
| A6 | Horaires provisoires (`TODO_VALIDATION`, « ne pas publier ») affichés dans la fenêtre de contact. | Haute | Retirés de l'affichage. |
| A7 | Adresse e-mail personnelle de développement dans `docs/SETUP-EMAIL.md` (destinataire de test). Le code ne l'utilise plus depuis V5 (`api/lead.js` → 503 si non configuré ; repli `/devis` = `info@chaudrel.be`). | Moyenne | Remplacée par la boîte de l'entreprise ; consigne : boîte de test uniquement dans l'environnement *Preview* Vercel, jamais dans le code. |
| A8 | Typographie Marcellus + Schibsted, titres jusqu'à 96 px, capitales espacées partout ; vert sapin comme couleur sombre ; laiton brun. | Haute | Nouveau système (§03). |
| A9 | LCP mobile 4,2 s : le HTML prérendu était effacé puis re-rendu par React. | Moyenne | Hydratation du HTML prérendu (`hydrateRoot`), entrées d'en-tête en CSS. LCP 2,2–2,5 s. |
| A10 | Variantes responsives jamais générées (script macOS `sips`, et `pf-1…pf-4` exclues par erreur). | Moyenne | Script portable (cwebp ou ImageMagick), bogue corrigé ; 18 photos en 480/800/1200 px + original. |
| A11 | Services « finitions intérieures » et « piscine » illustrés par des photos de façade (fichiers `svc-*` mal nommés). | Moyenne | Pages sans photo (en-tête typographique) jusqu'à réception de vraies photos. |

### Audit des photos (`public/photos/`)

Photos de téléphone, lumière variable, 900 à 1920 px de large — correctes jusqu'à ~700 px
affichés, insuffisantes en plein écran. Contenu réel : châssis, portes, volets, façades
enduites, extensions en chantier, toitures, garages, une allée. **Aucune photo d'intérieur,
de piscine, d'équipe ni de vidéo.**

| Fichier | Définition | Contenu réel | Usage V6 |
|---|---|---|---|
| `facade-garages` | 1920×1080 | façade brique, volume enduit, 2 portes de garage | ouverture accueil, À propos, dossier Façades |
| `pf-1` | 1400×933 | façade brique 2 niveaux, châssis anthracite | Châssis et volets |
| `pf-2` | 900×1125 | brique rouge, châssis/porte anthracite, volets | Châssis et volets, À propos |
| `pf-3` | 900×1125 | porte bleu nuit à vitrages | Portes d'entrée |
| `pf-4` | 1400×933 | toiture neuve, volume enduit | Toitures, métier Rénovation complète |
| `svc-cuisine` | 1200×900 | porte taupe (pas une cuisine) | Portes d'entrée |
| `svc-jardin` | 1200×900 | extension vitrée avant enduit | Extensions |
| `svc-nettoyage` | 1200×900 | brique + socle pierre, châssis blancs | gros plan « socle » |
| `svc-piscine` | 1200×900 | façade enduite (pas une piscine) | Façades, métier Façade |
| `svc-salle-de-bain` | 1200×900 | brique peinte, menuiseries brunes (pas une SdB) | Châssis et volets |
| `svc-toiture` | 1200×900 | bâtiment brique grise, toiture sombre | Toitures, métier Toiture |
| `ba-*` (6) | 1200×800 | façades diverses, pas des paires | répartis dans les dossiers |
| `abords-allee` | 1000×1333 | grande maison brique, allée asphalte | Abords, métier Aménagement extérieur, Histoire |
| `detail-*` (6, nouveaux) | 480×600 | gros plans découpés à 100 % dans les originaux | section Savoir-faire |

## 02 · Référence : raisemybusiness.com/website-development-services

Étudiée dans un vrai navigateur (Playwright/Chromium), bureau 1440×900 et téléphone
390×844, page entière (≈ 10 250 px au bureau), captures tous les 0,85 écran ; fenêtre
« Let's Connect » et bandeau cookies écartés pour voir la page. Police Syne, H1 83 px,
H2 63 px, fond gris clair, cartes givrées, sphères décoratives.

| Motif de la référence | Ce qu'on en retient | Traduction Chaudrel |
|---|---|---|
| En-tête : logo, navigation dans une capsule centrée, action en pilule | capsule centrale, action détachée | Capsule ivoire, page active en pilule graphite, « Demander un devis » en pilule ; voile ivoire au défilement ; menu mobile plein écran graphite |
| Fil d'Ariane en petites capitales | repère discret | `PageHero` : fil d'Ariane, séparateurs or |
| Héros : titre à gauche, visuel à droite, phrase, action | proportion texte/image ~50/50 | Titre 52 px max à gauche, vraie façade en portrait à droite, gros plan en recouvrement |
| Bandeau sombre de services défilants | rythme, transition | Bandeau graphite, métiers en serif italique, losanges or, pause au survol |
| Cartes numérotées givrées | numérotation | Index des métiers en lignes numérotées séparées d'un filet (pas de grille de cartes) |
| « Cases » : grand conteneur sombre arrondi, cartes projet, flèche ronde, « All projects » | **le geste signature** | `DarkPanel` graphite détaché du bord ; carrousel aimanté (flèches, compteur, clavier, glisser), étiquettes, flèche ronde, barre d'avancement or |
| Approche : pastilles d'étapes, grand numéro creux collé, cartes empilées avec « Deliverables » | séquence collée | `MethodSteps` : pastilles, numéro creux doré collant, cartes avec « Ce que vous recevez » |
| Services : texte collé à gauche, cartes à droite | colonne collée | FAQ : rubrique collée à gauche, questions à droite |
| FAQ en pilules à « + » | accordéon compact | `<details>` natif, « + » qui pivote en croix, pastille graphite à l'ouverture |
| Panneau d'appel arrondi avec formulaire | conversion en fin de page | Panneau graphite : titre, deux actions, téléphones/WhatsApp/e-mail (le formulaire complet reste sur `/devis`) |
| Pied de page sombre arrondi : logo, description, colonnes en petites capitales, mot-symbole géant | conclusion de marque | Panneau graphite : présentation + actions, 4 colonnes (site, métiers, joindre, adresse + réseaux), mot-symbole en filigrane, ligne légale |
| Mouvement : apparitions au défilement, survols de cartes, carrousel horizontal | retenue | Volets photo (clip-path), image qui se pose, filets qui se dessinent, parallaxe CSS liée au défilement, zoom 1,035 au survol |

Non repris : sphères 3D décoratives, verre givré, Syne en très grand corps, avis Google
(aucun avis validé chez Chaudrel), formulaire en fin de page.

Références motion (Elypt, Webloved) : visionnées en V5 (fichiers fournis) ; retenus :
révélations par masque, entrées décalées, transitions d'image douces.

## 03 · Direction créative

Voir `docs/DESIGN-SYSTEM.md` (couleur, typographie, gabarit, formes, photographie,
mouvement, accessibilité). En bref : graphite/ivoire/or champagne, Instrument Serif +
Manrope, grille 12 colonnes, filets d'un pixel, grands panneaux graphite, photographie
réelle uniquement, mouvement en transform/opacité/clip-path.

## 04 · Pages

| Route | Composition |
|---|---|
| `/` | 01 ouverture photo · 02 bandeau des métiers + signature · 03 carrousel de réalisations (panneau graphite) · 04 index des métiers · 05 gros plans de savoir-faire · 06 histoire (2009, Alberto & Matteo) · 07 engagements · 08 méthode collée · 09 appel final |
| `/realisations` | filtres en pilules, grille deux colonnes décalées, photos 4:5, compteur |
| `/realisations/:slug` | photo d'ouverture, dossier factuel, fiche (nature, état), travaux visibles, métiers liés, galerie avec légendes, dossiers voisins, précédent/suivant |
| `/services` | index détaillé des 6 métiers, engagements |
| `/services/:slug` | photo réelle ou en-tête typographique, postes groupés, dossiers liés, FAQ du métier, autres métiers |
| `/a-propos` | ouverture photo, approche, les deux associés, faits vérifiables, gros plans, engagements |
| `/methode` | sommaire des étapes, séquence collée, engagements, FAQ du déroulement |
| `/faq` | deux rubriques à colonne collée, accordéon natif |
| `/devis` | parcours en colonne gauche collée (étapes, état, téléphones) + formulaire ; toute la logique conservée |
| `/liens` | page « linktree » mobile : 3 vraies photos, actions, réseaux vérifiés |
| `/legal/politique-mentions`, 404 | même identité ; crédits typographiques mis à jour |

## 05 · Outils et intégrations — ce qui a réellement servi

| Outil | Statut |
|---|---|
| Playwright + Chromium | analyse de la référence, captures de contrôle (320 → 1920 px), tests de bout en bout |
| Lighthouse 12 | mesures mobile |
| ImageMagick / Pillow | variantes responsives, gros plans découpés dans les originaux |
| Higgsfield | **non utilisé** : solde vérifié à 0 crédit (offre gratuite) ; aucune génération lancée |
| Blender | **non installé** dans l'environnement |
| ffmpeg | disponible, non utilisé : aucune vidéo réelle de chantier dans le dépôt, et un diaporama vidéo de photos fixes aurait alourdi la page sans rien montrer de plus |
| Figma | non utilisé |
| GitHub / Vercel | branche, PR #2, déploiement de prévisualisation |

## 06 · Faits vérifiés en V6

- Registre public (busibee.be, companyweb.be) : Chaudrel Rénovation SRL, TVA BE 0812.283.245,
  Rue Henri Stacquet 49‑51, 1030 Schaerbeek, constituée le 15/06/2009.
- Linktree existant : `linktr.ee/chaudrel` (« Entreprise de rénovation à Bruxelles ») →
  Instagram `chaudrel_renovation`, Facebook `profile.php?id=61574019493337`, WhatsApp
  +32 493 97 25 17, et un lien obsolète vers `chaudrel.vercel.app`.
- TikTok `@chaudrel_renovation` existe ; `@chaudrelrenovations` n'existe pas.
- YouTube `@chaudrelrenovations` : 404. Retiré.
- Avis : aucun avis public trouvé ; `TESTIMONIALS_VALIDATED = false` → aucun avis publié.

## 07 · À demander à Chaudrel

**Photos et vidéos** (le levier n°1 de la qualité du site) :
1. Pour 3 à 6 chantiers terminés : série complète d'un même chantier (extérieur, chaque
   pièce, détails), lieu (commune), année, postes réalisés, matériaux — en pleine
   définition (≥ 3000 px), lumière du jour.
2. Paires avant/après **prises du même point de vue**.
3. Photos d'intérieurs finis (finitions intérieures) et d'un chantier de piscine.
4. Portrait des deux associés et de l'équipe sur chantier.
5. Vidéo réelle : une visite filmée en continu d'un chantier livré (stabilisée, 4K,
   30–60 s) et quelques plans de chantier (pose, gestes, outils) — de quoi construire la
   visite « réelle » demandée au lieu d'une maison modélisée.
6. Confirmer que la villa de l'ancienne V1 est (ou non) un chantier Chaudrel.

**Faits à valider** : horaires d'ouverture ; numéro WhatsApp Business (le Linktree
publie celui de Matteo) ; adresse de chaîne YouTube s'il y en a une ; adresse de la fiche
Google Business (`GOOGLE_REVIEWS_URL`) et accord des clients pour publier leurs avis ;
assurance RC (AXA, police citée dans les mentions légales) ; destinataire des demandes
(`LEAD_TO_EMAIL`) sur Vercel ; remplacer dans le Linktree le lien `chaudrel.vercel.app`
par `https://chaudrel.be/liens`.
