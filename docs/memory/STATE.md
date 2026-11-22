# STATE

## Objectif
Refonte complète du site Chaudrel (nouvelle DA tirée du nouveau logo, verre animé, animations Motion + Lenis), puis kit de marque dans `brand/` (carte de visite, t-shirts, fiche Google Business, documents).

## État actuel
- 2026-11-21 : PR #3 puis PR #4 fusionnées dans `main` (refonte + passe 2 + kit de marque) — `main` = nouveau site.
- Ancien `main` figé : branche `archive/site-v2-avant-refonte` (78795e9) et PR #5 (draft) qui restaure l'ancien site ; ne la fusionner que pour revenir en arrière. Tag impossible (proxy Git refuse les tags).
- Logo client vectorisé : `marque/logo/*.svg`, monogramme dans `src/components/ui/Logo.jsx`.
- 2026-11-21 : PR #6 fusionnée dans `main` (passes 3-4, marque/ + studio/, coffret, domaine). Passe 5 (PR #7) : certificat façon Lucid, photos t-shirts, boutons à plat, zigzag Services/Réalisations.
- 2026-11-21 (PR #6) : `brand/` → `marque/` (par support) + `studio/` (modèle réutilisable : `generer.cjs` lit `marque/marque.json`, `coffret.cjs`, `ETAPES.md` A → Z). Bug corrigé : la CSP bloquait les polices auto-hébergées en production (font-src 'self').
- Coffret : certificat de réalisation (PDF) + page `/c/#id.clé` chiffrée (AES-GCM, clé seulement dans le QR) ; fiches clients dans `marque/coffret/chantiers/` (hors Git, dépôt public).
- Système documenté : `DESIGN.md`, `.impeccable/design.json`, brief `.impeccable/surfaces/`.
- Kit de marque livré (PR #4, choix client ; aujourd'hui dans `marque/`) : logos PNG/PDF/variantes, carte Canva exportée, t-shirts noirs (or métallisé, crème + bronze), fiche Google, réseaux, charte PDF, papier à en-tête, signatures e-mail ; régénération `node brand/outils/generer.cjs`.

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

- D-014 : `marque/` (client) + `studio/` (modèle générique, piloté par `marque.json`) ; site à la racine (Vercel inchangé).
- D-015 : page de remerciement privée = statique chiffrée, clé dans le fragment du QR ; rien de personnel dans le dépôt public.
- D-016 : domaine principal = chaudrelrenovation.be (choix client) ; chaudrel.be et www redirigent vers lui.
- D-018 (remplace D-017) : visuel de main conservé ; boutons à plat façon Revolut, texte blanc ; Services et Réalisations en zigzag ; faits en titres seuls ; Matteo numéro principal.
- D-019 : maison 3D en CSS sur Réalisations (caméra par chantier au défilement) ; porte du logo qui s'entrouvre (poignée, gonds, lumière).
- D-020 : CHAUDREL en Marcellus ; maquette 3D aussi sur Services (schéma 2D supprimé) ; mosaïque des chantiers ; zigzag à trois mises en page ; faits sur vrai verre.
- D-021 : Réalisations = cartes symétriques photo | maquette 3D ; maquette toujours dans sa case 4/3, cadrage mesuré.
- D-022 : métiers épurés : /services = 6 cartes identiques ; pages métier = barre des 6 métiers + une carte (intro, devis, postes) ; maison de Services et zigzag supprimés.
- D-023 : intro de la porte automatique ; page métier = photo claire + valeur + maquette 3D + postes ; devis à étapes, tuiles, récap en direct.
- D-024 : intro rejouée à chaque chargement (F5), jamais en revenant sur l'accueil par la navigation ; plus de localStorage.

## Prochaines étapes
1. Vérifier le site en production après le déploiement de `main`.
1b. Recevoir de vraies paires avant/après (même point de vue) → `beforeAfter` dans projects.js.
2. Carte de visite : copie Canva enregistrée (mise en page d'origine, logo CR, QR doré vers chaudrelrenovation.be/devis) ; PDF dans `marque/carte-de-visite/` sans fonds perdus (à ajouter à l'export Canva « PDF impression »). Scanner le QR doré avec plusieurs téléphones avant impression.
2c. Domaine chaudrelrenovation.be : l'acheter si besoin, le relier au projet Vercel, créer la boîte info@chaudrelrenovation.be AVANT de fusionner la PR #6.
2d. T-shirt photo : Higgsfield à 0 crédit ; générer le t-shirt vierge dans Grok ou Gemini (Nano Banana), puis poser le vrai logo.
2b. Renseigner `avisGoogle` dans `marque/marque.json` dès que la fiche Google existe ; valider le contenu physique du coffret.
3. Remplacer `public/photos/hero.webp` par une vraie photo de chantier.

## Questions ouvertes
- Fichier vectoriel natif du logo disponible chez le graphiste ?
- Horaires réels, avis Google, chiffres validés (voir docs/VERIFICATION.md).
