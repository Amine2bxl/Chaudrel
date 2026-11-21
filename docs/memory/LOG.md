# LOG

## 2026-11-21
- Cadrage refonte : PRODUCT.md, mémoire projet créée. Logo attendu du client.

## 2026-11-21 — Refonte livrée (PR #4)
- Logo vectorisé (potrace ×4) ; favicons, OG, logo carré régénérés depuis les SVG.
- Erreur : opacités du hero qui montaient au lieu de descendre. Cause : Motion 12 confie `useTransform(scrollYProgress)` avec `target` à l'API ScrollTimeline du navigateur, plage fausse. Solution : relayer la progression dans un `useMotionValue` (`src/lib/useSectionProgress.js`).
- Erreur : « Invalid hook call » après `npm i motion` serveur lancé. Cause : deps Vite pré-assemblées en deux passes. Solution : relancer `npx vite --force`.
- Leçon : pas de config Prettier dans le dépôt — ne jamais lancer `prettier --write` sur `src/**` (reformate tout). Formater seulement les fichiers réécrits.
- Leçon : `overflow-x: hidden` sur html/body casse `position: sticky` ; utiliser `overflow-x: clip`.
- Commandes utiles : `npm run build` ; captures Playwright dans le scratchpad (1440 et 390, états réduits, menu, dialogue).

## 2026-11-21 — Passe 2 (perf, sombre adouci)
- Mesure au repos (build prod, après défilement complet) : 0 rAF, 1 ms de tâches sur 5 s, 0 layout. LCP local 164 ms.
- Bug corrigé : `scripts/responsive-images.mjs` ignorait `pf-1…pf-4` (regex `-\d+$`) ; désormais seuls les suffixes de largeur sont exclus.
- Leçon : un `position: sticky` plus haut que l'écran cache son bas ; l'empilement n'est actif qu'à partir de 760 px de hauteur.
- Leçon : l'aperçu Vercel suit chaque push de la branche (lien dans la PR).

## 2026-11-21 — Kit de marque
- Carte Canva « (FINAL) » exportée en PDF (l'export PNG Canva a été refusé : « Not allowed ») ; aperçus rendus avec pdftoppm. QR décodé : https://linktr.ee/chaudrel.
- Leçon : une page ouverte par `page.setContent` ne charge pas `file://` → passer les images en data URI.

## 2026-11-21 — Fusion dans main
- #3 (fe9f217) puis #4 (2fdfce4) fusionnées. PR #5 = ancien site (arbre de 78795e9).
- Le proxy Git de la session refuse le push de tags ; branche d'archive utilisée à la place.

## 2026-11-21 — Passe 3
- Choix client : escalier, bloc de choix du projet, grille éditoriale, plaque (verre + laiton) parmi plaque / mètre ruban.
- `/devis?projet=` présélectionne le type (liste blanche) ; ajout du type « Châssis et portes ».
- À corriger (antérieur) : `QUOTE_FALLBACK_EMAIL` dans `src/pages/Quote.jsx` pointe vers une adresse de test, pas info@chaudrel.be.

## 2026-11-21 — Passe 4 (système unique)
- Choix client : sous-titres, intros et fils d'Ariane retirés ; bandeau de verre en fin de page ; style /liens partout ; provinces qui s'allument depuis Bruxelles.
- `Panel` : `pad` et `radius` se remplacent en entier (`cn` ne fusionne pas les classes Tailwind, deux `p-*` en conflit donnent un résultat imprévisible).
- Racine sombre : `ink` = couleur claire, `cream` = fond. Un composant sorti d'une section `bark` doit passer de `text-cream` à `text-ink` (ProcessStairs, Monogram).
- Corrigé au passage (revue de la passe 3) : délai « 48 h » lu dans `BRAND`, présélection `?projet=` supprimée avec le bloc qui l'utilisait.

## 2026-11-21 — Restructuration, coffret, carte
- Bug production : CSP `font-src https://fonts.gstatic.com` bloquait Prata / Albert Sans auto-hébergées depuis la passe 2 → `font-src 'self'` (vérifié en local avec la CSP appliquée).
- Canva MCP : pas de vignette pour une transaction non enregistrée ; les formes insérées passent devant (faire `layer_element back`) ; `update_fill` recadre en mode couvrir (corriger avec `crop_media`). Pas de choix de police par l'API.
- Coffret testé : bonne clé → page ; mauvaise clé / id inconnu → message d'erreur ; relancer garde le même QR.
