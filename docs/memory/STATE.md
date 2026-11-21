# STATE

## Objectif
Refonte complète du site Chaudrel (nouvelle DA tirée du nouveau logo, verre animé, animations Motion + Lenis), puis kit de marque dans `brand/` (carte de visite, t-shirts, fiche Google Business, documents).

## État actuel
- PR #4 (branche `claude/beautiful-tesla-x6r9du`) : refonte + passe 2 (perf, sombre adouci, porte courte, cartes empilées, avant/après, transitions) ; build + pré-rendu OK (21 pages).
- Intègre la PR #3 (réalisations décrites fidèlement, liens réseaux vérifiés).
- Logo client vectorisé : `brand/logo/*.svg`, monogramme dans `src/components/ui/Logo.jsx`.
- Système documenté : `DESIGN.md`, `.impeccable/design.json`, brief `.impeccable/surfaces/`.
- Kit de marque livré dans `brand/` (même PR #4, choix client) : logos PNG/PDF/variantes, carte Canva exportée, t-shirts noirs (or métallisé, crème + bronze), fiche Google, réseaux, charte PDF, papier à en-tête, signatures e-mail ; régénération `node brand/outils/generer.cjs`.

## Décisions clés
- D-001 : kit de marque dans `brand/` — seul dépôt accessible.
- D-002 : réécriture libre, zéro invention.
- D-003 : cible = propriétaires, rénovations complètes.
- D-004 : direction « La porte qui s'ouvre » — choisie par le client parmi 3 maquettes.
- D-005 : Motion limité aux menus/dialogue ; Lenis retiré (D-008).
- D-008 : perf d'abord — défilement natif, animations CSS/WAAPI sur la carte graphique, rien à l'arrêt.
- D-009 : palette sombre dominante adoucie (choix client), crème en encarts.
- D-006 : crème/nuit/bronze, Prata + Albert Sans — relevés sur le logo.
- D-007 : photo d'ambiance (stock) gardée derrière la porte, jamais légendée comme chantier.

## Prochaines étapes
1. Retour client sur la PR #4, puis fusion (après #3).
1b. Recevoir de vraies paires avant/après (même point de vue) → `beforeAfter` dans projects.js.
2. Carte de visite : passer au monogramme CR dans Canva + QR devis + fonds perdus (en attente d'accord client).
3. Remplacer `public/photos/hero.webp` par une vraie photo de chantier.

## Questions ouvertes
- Fichier vectoriel natif du logo disponible chez le graphiste ?
- Horaires réels, avis Google, chiffres validés (voir docs/VERIFICATION.md).
