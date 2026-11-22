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

## D-013 — Un seul bloc de verre pour tout le corps du site
- Date : 2026-11-21 · Statut : acceptée (choix client par QCM)
- Contexte : le client aime l'accueil, le pied de page et /liens ; le milieu du site lui paraît disparate (« chaque page différente »), trop long.
- Décision : la carte de /liens devient le bloc unique (`Panel` dans `src/components/ui`, `Row`/`Chip`/`GroupLabel`/`FounderRows` dans `ContactList.jsx`). Titres de section seuls ; en-têtes de page sans intro ni fil d'Ariane ; bandeau de verre identique en fin de page ; fenêtre de contact au visuel de /liens, sans description sous WhatsApp ni le devis.
- Alternatives écartées : plaques de laiton partout (trop lourd), verre seulement sur 2-3 blocs (moins de marque), bloc final centré ou bande bronze.
- Conséquences : plaque laiton, escalier « lumineux » et bloc de choix du projet (passe 3) remplacés ; `/devis?projet=` n'est plus lu ; les cartes de verre du corps n'ont pas de flou d'arrière-plan (perf).

## D-014 — Dépôt : `marque/` + `studio/`, site à la racine
- Date : 2026-11-21 · Statut : acceptée (choix client par QCM)
- Contexte : le client veut un système réutilisable pour ses prochaines entreprises (« pas fais comme Chaudrel »).
- Décision : `brand/` devient `marque/`, rangé par support ; le générateur passe dans `studio/` et lit `marque/marque.json` ; `studio/ETAPES.md` décrit le parcours A → Z ; `studio/modele/` contient les fiches vierges.
- Alternatives écartées : monorepo `site/` (réglage Vercel obligatoire à la fusion), dépôt séparé (impossible à créer d'ici).
- Conséquences : le site ne bouge pas ; un nouveau client = un `marque.json` + ses SVG.

## D-015 — Page de remerciement privée chiffrée
- Date : 2026-11-21 · Statut : acceptée
- Contexte : le QR du certificat doit ouvrir un avant / après que personne d'autre ne peut voir ; le dépôt GitHub est public ; aucun coût serveur.
- Décision : page statique `/c/` ; contenu du client chiffré (AES-256-GCM) dans `public/c/<id>.bin` ; clé dans le fragment du QR (`#id.clé`), jamais envoyée au serveur ni commitée ; fiches et photos dans `marque/coffret/chantiers/` (ignoré par Git). noindex, no-referrer, no-store, exclu du service worker.
- Alternatives écartées : URL secrète en clair (lisible dans le dépôt public), protection par mot de passe Vercel (payante), dépôt privé (historique Git difficile à purger).
- Conséquences : couper l'accès = supprimer le `.bin` ; perdre `lien.txt` n'empêche pas de régénérer (nouveau QR).

## D-016 — Domaine principal : chaudrelrenovation.be
- Date : 2026-11-21 · Statut : acceptée (choix client)
- Décision : site, e-mail (info@chaudrelrenovation.be), QR, certificats, documents et vêtements passent sur chaudrelrenovation.be ; `vercel.json` redirige chaudrel.be et les www vers lui.
- Contexte : aucun des deux domaines n'est encore relié au projet Vercel (production sur *.vercel.app).
- Conséquences : avant la mise en production, relier le domaine à Vercel et créer la boîte e-mail, sinon les e-mails du site rebondissent.

## D-017 — Vrai verre sur photo, boutons en verre à texte blanc
- Date : 2026-11-21 · Statut : acceptée (demande client)
- Décision : les sections clés (métiers, étapes, appel final) sont des `Scene` (photo voilée) où les panneaux `Panel glass` floutent réellement l'image ; les légendes des chantiers sont des plaques de verre sur les photos ; chaque page s'ouvre sur une photo. Boutons : `.btn-bronze` (verre bronze sombre, texte blanc) et `.btn-glass` (verre clair, texte crème). Faits sous le hero : titres seuls. Matteo = numéro principal (ordre de `BRAND.phones`).
- Conséquences : le flou d'arrière-plan ne sert que là où une photo est derrière ; les autres panneaux gardent la carte sans flou.

## D-018 — Retour au visuel de main, boutons à plat, zigzag (remplace D-017)
- Date : 2026-11-21 · Statut : acceptée (retour client) · D-017 remplacée
- Contexte : le client préfère le visuel de main au vrai verre sur photo ; il trouve les boutons « brillants ».
- Décision : sections et pages reviennent à main ; boutons à plat façon Revolut (`.btn-solid` bronze sombre #8C6B3E texte blanc, `.btn-soft` voile blanc 10 % texte blanc) ; pages Services et Réalisations en zigzag (`Zigzag` : photo d'un côté, titre + texte de l'autre, en alternance). Gardés : faits en titres seuls, Matteo numéro principal.

## D-019 — Maison 3D en CSS, porte du logo qui s'entrouvre
- Date : 2026-11-22 · Statut : acceptée (demande client)
- Contexte : le client veut une maison en 3D sur Réalisations, qui se tourne au défilement vers la partie dont parle chaque bloc, et une porte du logo qui se lit comme une porte qui s'ouvre.
- Décision : `House3D` en CSS 3D (plans `preserve-3d`, aucune bibliothèque) ; caméra = première ligne des travaux (`focusFor`), animée par une view-timeline CSS (`--h3`), vue finale fixe sans prise en charge ou avec moins de mouvement. Hero : béquille crème qui s'abaisse, porte qui pivote de 38° sur ses gonds (bord gauche), lumière chaude dans l'embrasure ; au défilement elle finit de s'ouvrir puis s'efface.
- Alternatives écartées : Three.js (≈150 ko, rendu JavaScript à chaque image, contraire à D-008) ; vidéo de maquette (lourde, pas de parties allumées).
- Conséquences : Firefox voit la maison déjà tournée (pas de view-timeline) ; Services garde le schéma 2D.

## D-020 — Passe 6 : police du nom, maquette 3D partout, mosaïque, zigzag à trois temps
- Date : 2026-11-22 · Statut : acceptée (retours client)
- Décision : le nom CHAUDREL de la barre de navigation revient en Marcellus (police de l'ancien site, auto-hébergée via @fontsource) ; la maquette `House3D` remplace le schéma 2D aussi sur Services (vue penchée d'en haut, caméra qui glisse d'un métier à l'autre, intérieur en coupe de verre) et `HouseDiagram.jsx` est supprimé ; « Des chantiers, pas des promesses » devient une mosaïque sans vide (légende sur la photo) ; `Zigzag` alterne trois mises en page (split, duo avec seconde photo, panoramique) ; faits sous le hero sur une plaque de vrai verre avec lueurs bronze ; lueur bronze derrière les métiers de l'accueil ; porte du hero : panneau en creux et petite béquille ton sur ton.
- Alternatives écartées : maquette qui suit le pointeur sur Services (la caméra bougerait sous la souris, boucle de survol).

## D-021 — Réalisations symétrique, maquette 3D dans sa case
- Date : 2026-11-22 · Statut : acceptée (retour client : « super symétrique, bien organisé », la 3D ne doit pas sortir des cases)
- Décision : chaque chantier = une carte de verre à deux cases égales (vraie photo | maquette 3D), légende sous chaque case (chantier à gauche, travaux + lien à droite), même structure pour tous ; filtres centrés, compteur retiré. `House3D` rend sa propre case 4/3 (`overflow: clip`, échelle en `cqw`) ; cadrage de chaque caméra mesuré (≈ 6 % de marge, centré). Services garde le zigzag varié.
- Conséquences : `Zigzag` ne sert plus qu'à Services.

## D-022 — Métiers épurés (remplace la partie Services de D-020)
- Date : 2026-11-22 · Statut : acceptée (retour client : « épure complètement », navigation simple et structurée, valeur comprise tout de suite)
- Décision : « Votre maison, métier par métier » retiré (`ServicesHouse.jsx` supprimé) ; /services = grille de six cartes identiques (photo, icône, nom, phrase de valeur `excerpt`) ; chaque page métier a une barre des six métiers sous l'en-tête (métier en cours en bronze, centré sur mobile) et une seule carte : intro + devis à gauche, postes à droite ; la liste « Autres métiers » de la colonne est retirée. `Zigzag.jsx` supprimé (plus utilisé).

## D-023 — Intro jouée seule et une seule fois ; page métier visuelle ; devis guidé
- Date : 2026-11-22 · Statut : acceptée (retours client)
- Décision : l'intro de la porte se joue toute seule (plus de défilement épinglé) à la première visite, puis plus jamais : `localStorage['chaudrel-intro']`, lu avant le premier rendu par `public/intro.js` (script externe, CSP `script-src 'self'`) qui pose `data-intro="seen"` sur `<html>` ; un geste (molette, toucher, touche) saute l'intro. Page métier : en-tête sans photo, grande photo claire + carte « valeur » (phrase, intro, devis), « Ce que nous prenons en charge » = maquette 3D du métier + postes cochés par groupe ; questions retirées. Devis : étapes numérotées cliquables, tuiles à icônes pour le type de travaux, formulaire sur carte de verre, colonne « Votre demande » qui se remplit en direct + garanties + fondateurs.
- Conséquences : D-008 (« rien à l'arrêt ») tenu : animations jouées une fois puis annulées, l'état final est en CSS.

## D-024 — Intro une fois par chargement (remplace la partie « une seule fois » de D-023)
- Date : 2026-11-22 · Statut : acceptée (retour client : l'intro avait disparu pour de bon)
- Décision : l'intro se rejoue à chaque chargement de page (arrivée, F5, Cmd+R) ; pendant la navigation dans le site, revenir sur l'accueil l'affiche directement terminée (`data-intro="seen"` sur `<html>`, en mémoire seulement). `localStorage` et `public/intro.js` retirés ; `prefers-reduced-motion` passe par une media query CSS.

## D-025 — Défilement de base, faits sur la photo, maquette sur l'accueil, photo + 3D dès l'arrivée
- Date : 2026-11-22 · Statut : acceptée (retours client)
- Décision : `history.scrollRestoration = 'manual'` (chaque chargement repart du haut, on défile soi-même) ; un geste pendant l'intro la termine sans faire défiler. La plaque des faits mord sur la photo du hero (lg, -mt-28, vrai flou) et n'apparaît qu'après l'intro. Accueil : section « Chaque chantier, sur la maquette. » (`ProjectsHouse` : maquette live + liste des chantiers + photo + liens chantier / métier). Pages métier et chantier : en-tête titre seul, puis photo | maquette côte à côte, format 16/10 (mobile) – 16/11 (lg), mesurées pour tenir dans le premier écran (1440×900, 1366×768, iPhone 13) ; puis carte valeur + postes cochés (métier) ou récit + travaux cochés + lien vers le métier (chantier) ; galerie en cases égales.
- Détail technique : `.h3-box` lit `--h3-ratio` et `--h3-fit` (format et échelle de la case).
