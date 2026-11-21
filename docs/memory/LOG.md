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
