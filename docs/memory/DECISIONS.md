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
