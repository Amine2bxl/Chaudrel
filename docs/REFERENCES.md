# Références de direction artistique

Dossier de références du projet. Chaque entrée dit ce qu'on en retient, et **si elle a
réellement été consultée** pendant la refonte.

## Références vidéo — obligatoires

| # | Référence | Lien | État |
|---|---|---|---|
| 01 | Elypt Web Design (TikTok) | https://www.tiktok.com/@elyptwebdesign/video/7648388525255183649 | **Non visionnée** |
| 02 | Webloved (TikTok) | https://www.tiktok.com/@webloved/video/7705918935475997974 | **Non visionnée** |

Ces deux vidéos n'ont pas pu être ouvertes depuis l'environnement de développement
(`www.tiktok.com` hors des domaines autorisés ; et même autorisé, seule la légende d'une
page TikTok est lisible, pas la vidéo). **Rien de ce qui est dans le site n'en est donc
tiré.** Pour les intégrer : déposer dans la conversation les fichiers vidéo ou quelques
captures d'écran, puis ajuster la séquence 3D (`scene/storyboard.js`) en conséquence.

## Références image

| Référence | Source | État | Ce qu'on en retient |
|---|---|---|---|
| STOIM — architecture claire | Pinterest https://pin.it/5y9JSOXgb | Lien non ouvert (domaine bloqué) ; direction décrite dans le brief V3 | fond crème, mot-symbole monumental, bâtiment au centre, beaucoup de vide |
| TERRA / cotta — architecture sombre | capture fournie | **Vue** | cartouche d'informations, repères fins, navigation en capsules, ambiance du soir |
| Homevia | capture fournie | **Vue** | titre géant derrière le bâtiment, lumière chaude à l'intérieur |
| Havenly | capture fournie (brief V5) | **Vue** | vert profond + crème, pastilles de section, mot accentué dans les titres, formes en arc, sections en nappes, pied de page comme scène finale |
| ICG Gallery (Iris Ceramica Group) | https://icggallery.irisceramicagroup.com/en | Non consultée | — |

## Ce qui a été adapté, pas copié

- Le **vert sapin + laiton + crème** : le trio de la charte (voir `DESIGN-SYSTEM.md`).
- La **pastille de section** et le **mot accentué** : repris comme règles de composant.
- Les **formes** : deux gestes seulement (feuille, nappe), pas des blobs décoratifs.
- Non repris : barre de recherche immobilière, cartes de prix, témoignages étoilés —
  Chaudrel n'a publié aucun avis vérifié, et le site n'en invente pas.

## Outils de production

| Outil | État |
|---|---|
| Higgsfield | compte accessible, **0 crédit** (plan gratuit) : aucune génération lancée |
| Blender | non disponible dans l'environnement : la maquette est générée en code (three.js) |
| Figma | compte accessible en siège « View » : pas de fichier créé |
