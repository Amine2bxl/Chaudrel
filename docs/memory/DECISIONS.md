# DECISIONS

## D-001 — Kit de marque dans `brand/`
- Date : 2026-11-21 · Statut : acceptée
- Contexte : le client veut le kit de marque séparé du code du site.
- Décision : dossier `brand/` à la racine de ce dépôt, PR dédiée.
- Alternatives écartées : dépôt séparé (non accessible depuis la session).
- Conséquences : `src/` reste le seul code du site ; `brand/` n'est pas bundlé.

## D-002 — Réécriture libre sans invention
- Date : 2026-11-21 · Statut : acceptée
- Contexte : textes jugés brouillons, manque d'impact.
- Décision : réécrire titres et accroches ; aucun chiffre, avis, prix ou délai non validé.
- Conséquences : `docs/VERIFICATION.md` reste la référence des contenus bloqués.

## D-003 — Cible prioritaire
- Date : 2026-11-21 · Statut : acceptée
- Décision : propriétaires qui rénovent une maison ou un appartement entier.

## D-004 — Direction « La porte qui s'ouvre »
- Date : 2026-11-21 · Statut : acceptée
- Contexte : trois maquettes animées présentées (Élévation, Zone d'abord, Porte).
- Décision : accueil sur le monogramme CR ; au défilement, la porte bronze devient une fenêtre sur la photo puis le plein cadre, carte de verre avec l'offre.
- Alternatives écartées : règle de niveaux d'architecte (A), carte de Belgique en ouverture (B, aucune commune de chantier confirmée).
- Conséquences : `Hero.jsx` pilote un contour `clip-path` calculé depuis la progression du scroll ; état final direct si mouvement réduit.

## D-005 — Motion + Lenis
- Date : 2026-11-21 · Statut : acceptée
- Décision : `motion@12` (entrées, mise en page partagée, scroll) et `lenis` (molette amortie, coupé si mouvement réduit).
- Alternatives écartées : GSAP + ScrollTrigger (plus impératif en React).
- Conséquences : passer par `useSectionProgress` pour tout `useScroll({ target })` + `useTransform` (voir LOG 2026-11-21).

## D-006 — Palette et typographie tirées du logo
- Date : 2026-11-21 · Statut : acceptée
- Décision : crème #FCF4EC, encre #24221E, nuit #191714, bronze #AE8A56 (+ #7D6035 lisible sur crème, #C9A876 sur nuit) ; Prata (titres, proche du monogramme) et Albert Sans (proche du wordmark).
- Alternatives écartées : Bodoni Moda (contraste trop fin), Montserrat (trop large en texte courant).
- Conséquences : noms Tailwind inchangés (cream, ink, bark, gold…), seules les valeurs ont changé.

## D-007 — Photo d'ambiance du hero
- Date : 2026-11-21 · Statut : acceptée (provisoire)
- Contexte : `hero.webp` est une photo de banque d'images, pas un chantier.
- Décision : le client garde cette photo d'ambiance ; aucune légende ne la présente comme un chantier Chaudrel.
- Conséquences : à remplacer dès qu'une vraie photo de qualité existe (docs/VERIFICATION.md).

## D-008 — Performance d'abord, rien à l'arrêt
- Date : 2026-11-21 · Statut : acceptée (remplace la partie Lenis de D-005)
- Contexte : demande client « 120 fps partout, aucune énergie, chargement ultra rapide », effet « cage » du hero.
- Décision : défilement natif (Lenis retiré), entrées en CSS, hero et cartes pilotés par ViewTimeline / animation-timeline, polices auto-hébergées, variantes d'images 480/800/1200, plus aucune boucle infinie.
- Conséquences : 0 callback rAF et ~1 ms CPU sur 5 s au repos (mesuré) ; Motion ne sert qu'aux menus, dialogue et pastille de navigation.

## D-009 — Sombre dominant adouci
- Date : 2026-11-21 · Statut : acceptée (choix client parmi 3)
- Décision : page #231E1A, texte #EAE0D3 (12,7:1), sections profondes #1A1613, crème seulement en encarts. Rôles Tailwind inchangés, inversés à la racine ; `.on-dark` / `.on-light` restaurent le sens premier.
- Conséquences : tout `text-cream` doit vivre dans un bloc `.on-dark` ; libellés sur bronze en `text-bark`.

## D-010 — Hero court, cartes empilées, avant/après à poignée
- Date : 2026-11-21 · Statut : acceptée (choix client)
- Décision : porte sur un seul écran (masque agrandi par transform), chantiers en cartes empilées, comparateur à poignée porte bronze, View Transitions entre pages.
- Conséquences : avant/après masqué tant qu'aucune vraie paire n'est renseignée.

## D-011 — Kit de marque dans la PR #4
- Date : 2026-11-21 · Statut : acceptée (choix client)
- Décision : `brand/` livré dans la PR de refonte ; carte de visite = design Canva existant du client (« FINAL »), exportée sans modification ; t-shirts noirs, logo or métallisé ou crème + bronze.
- Conséquences : la carte garde l'ancien logo et un QR Linktree tant que le client n'a pas validé la mise à jour ; générateur `brand/outils/generer.cjs` pour tout le reste.

## D-012 — Inversion des rôles main / PR
- Date : 2026-11-21 · Statut : acceptée (demande client)
- Décision : figer l'ancien `main` (branche `archive/site-v2-avant-refonte`), fusionner #3 puis #4 dans `main`, ouvrir la PR #5 qui contient l'ancien site.
- Conséquences : revenir en arrière = fusionner la PR #5 ; l'historique de la refonte reste dans `main`.
