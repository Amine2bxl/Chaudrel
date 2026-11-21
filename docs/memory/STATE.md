# STATE

## Objectif
Refonte complète du site Chaudrel (nouvelle DA tirée du nouveau logo, verre animé, animations Motion + Lenis), puis kit de marque dans `brand/` (carte de visite, t-shirts, fiche Google Business, documents).

## État actuel
- PR #4 (branche `claude/beautiful-tesla-x6r9du`) : refonte du site livrée, build + pré-rendu OK (21 pages).
- Intègre la PR #3 (réalisations décrites fidèlement, liens réseaux vérifiés).
- Logo client vectorisé : `brand/logo/*.svg`, monogramme dans `src/components/ui/Logo.jsx`.
- Système documenté : `DESIGN.md`, `.impeccable/design.json`, brief `.impeccable/surfaces/`.

## Décisions clés
- D-001 : kit de marque dans `brand/` — seul dépôt accessible.
- D-002 : réécriture libre, zéro invention.
- D-003 : cible = propriétaires, rénovations complètes.
- D-004 : direction « La porte qui s'ouvre » — choisie par le client parmi 3 maquettes.
- D-005 : Motion + Lenis — choix du client ; relais `useSectionProgress` obligatoire.
- D-006 : crème/nuit/bronze, Prata + Albert Sans — relevés sur le logo.
- D-007 : photo d'ambiance (stock) gardée derrière la porte, jamais légendée comme chantier.

## Prochaines étapes
1. Retour client sur la PR #4, puis fusion (après #3).
2. PR kit de marque : carte de visite, t-shirts, fiche Google Business, documents à la nouvelle DA.
3. Remplacer `public/photos/hero.webp` par une vraie photo de chantier.

## Questions ouvertes
- Fichier vectoriel natif du logo disponible chez le graphiste ?
- Horaires réels, avis Google, chiffres validés (voir docs/VERIFICATION.md).
