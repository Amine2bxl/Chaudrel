# Chaudrel — kit de marque

Tout ce qui porte la marque hors du site. Séparé du code (`src/`) ; le site n'en reprend que des
copies : `public/logo-*.svg`, `public/favicon.svg`, les icônes, `public/og-image.jpg`,
`public/email/signature-logo.png`.

Charte complète : **`documents/charte-graphique.pdf`** (5 pages). Système du site : `../DESIGN.md`.

## Contenu

| Dossier | Quoi | Pour qui |
|---|---|---|
| `logo/` | SVG (source), `png/` transparents haute définition, `pdf/` vectoriels | Tout le monde, imprimeurs |
| `carte-de-visite/` | La carte Canva de Chaudrel (PDF d'impression, aperçus recto / verso), QR vers le devis (`chaudrelrenovation.be/devis?utm_source=carte`) | Imprimeur |
| `vetements/` | Marquage cœur (SVG 90 mm) et dos (PDF 280 × 400 mm : logo + domaine en bas) + maquettes | Imprimeur textile |
| `google-business/` | Texte de la fiche (`fiche.md`), logo 720 px, couverture | Création de la fiche Google |
| `reseaux/` | Photo de profil 1080 px, couverture Facebook 1640 × 624 | Instagram, Facebook, TikTok |
| `documents/` | Charte graphique, papier à en-tête A4, signatures e-mail | Bureau |
| `coffret/` | Certificat de réalisation + page de remerciement privée (QR) | Fin de chantier |
| `marque.json` | Nom, contacts, couleurs, polices, textes : la seule source des fichiers générés | Mise à jour |

Le logo tel que fourni par Chaudrel : `logo/source/`. Tout se régénère avec `node studio/generer.cjs marque`.

## Logo : quelle version ?

| Fond | Version |
|---|---|
| Clair (crème, blanc) | `chaudrel-logo.svg` — lettres encre, porte bronze |
| Sombre (nuit, noir, photo voilée) | `chaudrel-logo-cream.svg` |
| Textile sombre, 2 couleurs | `chaudrel-logo-creme-bronze.svg` (aplats, sans dégradé) |
| Dorure, broderie, 1 couleur | `chaudrel-logo-or.svg` |
| Tampon, gravure, fax | `chaudrel-logo-noir.svg` |
| Petit format (avatar, cœur de t-shirt, favicon) | `chaudrel-monogram-*.svg` |

Taille minimale : logo complet 30 mm / 140 px, monogramme 8 mm / 32 px. Ne jamais déformer,
recolorer la porte ou ajouter d'effet.

## Vêtements (noir) : petit logo devant, grand logo + `CHAUDREL.BE` en bas du dos

Deux versions validées, maquettes dans `vetements/` :

- **Or métallisé** : monogramme au cœur, logo complet au dos, une seule encre or métallisée
  (`marquage-*-or-metallise-*.svg`, repère écran `#B8945F`). Choisir la teinte exacte sur le
  nuancier physique de l'imprimeur (encre sérigraphie métallisée, flex ou dorure à chaud).
- **Crème + bronze** : 2 couleurs à plat (`marquage-*-creme-bronze-*.svg` : crème `#EAE0D3`,
  bronze `#AE8A56`). Sur textile noir, demander une sous-couche blanche sous le crème.

Placement : cœur, côté gauche du porteur, 90 mm de large, environ 8 cm sous la couture d'épaule ;
dos, 280 mm de large, centré, environ 8 cm sous le col. Fichiers vectoriels déjà à la taille
réelle (attribut `width` en mm). Faire valider une épreuve avant la série.

## Carte de visite

Fichier : `carte-de-visite/carte-de-visite-chaudrel.pdf`, exporté de Canva (« Carte de visite -
Chaudrel Rénovation (FINAL) »), 85 × 55 mm, 2 pages.

⚠️ À savoir avant de réimprimer :
- elle porte **l'ancien logo** (badge rond avec les toits), pas le monogramme CR ;
- son QR code ouvre `https://linktr.ee/chaudrel` ; `qr/qr-devis-carte.svg` mène directement au
  devis du site et permet de mesurer les demandes venues de la carte ;
- le PDF n'a **pas de fonds perdus** (85 × 55 mm exacts) : la plupart des imprimeurs demandent
  3 mm de débord ; le réexporter depuis Canva avec « Fonds perdus » activé.

## Provenance

- `source/logo-client.webp` — logo fourni par Chaudrel (novembre 2026), matriciel, 1254 px.
- `logo/*.svg` — vectorisation de ce fichier (potrace, échantillonnage × 4). La porte bronze est un
  tracé séparé, redessiné à partir de ses quatre coins mesurés. Couleurs relevées sur le fichier.
  Une vectorisation reste une approximation : pour l'impression grand format, demander le fichier
  vectoriel natif au graphiste d'origine s'il existe.
- `carte-de-visite/` — export Canva du design de Chaudrel, non modifié ; aperçus rendus depuis le PDF.
- Tout le reste — rendu par `outils/generer.cjs` (Chromium) à partir des SVG ; la couverture
  Google est une vraie photo de chantier (`public/photos/facade-garages.webp`). Aucune image
  générée par IA.

## Régénérer

```bash
node studio/generer.cjs marque
```

Depuis la racine du dépôt ; nécessite Playwright + Chromium et une connexion (polices Google).
