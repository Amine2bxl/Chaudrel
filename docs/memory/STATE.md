# STATE

## Objectif
Refonte complète du site Chaudrel (nouvelle DA tirée du nouveau logo, verre animé, animations Motion + Lenis), puis kit de marque dans `brand/` (carte de visite, t-shirts, fiche Google Business, documents).

## État actuel
- 2026-11-21 : PR #3 puis PR #4 fusionnées dans `main` (refonte + passe 2 + kit de marque) — `main` = nouveau site.
- Ancien `main` figé : branche `archive/site-v2-avant-refonte` (78795e9) et PR #5 (draft) qui restaure l'ancien site ; ne la fusionner que pour revenir en arrière. Tag impossible (proxy Git refuse les tags).
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

- D-013 : un seul bloc pour tout le corps du site = la carte de verre de /liens (`Panel` + `Row` + `GroupLabel`) ; titres seuls (ni sous-titre, ni intro, ni fil d'Ariane) ; même bandeau « Parlons de votre projet. » en fin de page.
- Passes 3 et 4 (branche de session, PR #6) : icônes Chaudrel (lucide-react retiré), grille éditoriale des chantiers, escalier des 4 étapes, puis passe 4 : fenêtre de contact au visuel de /liens, carte de Belgique en verre (provinces qui s'allument), faits/métiers/fondateurs/méthode/FAQ/pages métier et chantier sur la carte de verre ; bloc « Quel est votre projet ? » et présélection `?projet=` retirés.

## Prochaines étapes
1. Vérifier le site en production après le déploiement de `main`.
1b. Recevoir de vraies paires avant/après (même point de vue) → `beforeAfter` dans projects.js.
2. Carte de visite : passer au monogramme CR dans Canva + QR devis + fonds perdus (en attente d'accord client).
3. Remplacer `public/photos/hero.webp` par une vraie photo de chantier.

## Questions ouvertes
- Fichier vectoriel natif du logo disponible chez le graphiste ?
- Horaires réels, avis Google, chiffres validés (voir docs/VERIFICATION.md).
