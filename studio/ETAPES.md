# Studio — lancer la marque d'une entreprise, de A à Z

Le modèle réutilisable : un dossier `marque/` par client, piloté par un seul fichier
`marque.json`, et les générateurs de `studio/` qui en tirent tout le reste. Pour un nouveau
client, on ne recopie pas Chaudrel : on remplit `marque.json`, on dépose les logos, on lance.

## 0. Outils (une fois par ordinateur)
- Node.js 20+ ; dans le dépôt : `npm install`, puis `npx playwright install chromium`.
- Connexion internet pendant la génération (polices Google pour les PDF).

## 1. Cadrage (client)
- Activité, zone, cible, concurrents, ce qui est **prouvable** (année de création, photos de
  chantiers, délais tenus). Rien d'inventé : un chiffre non validé ne sort pas.
- Noter les validations dans `docs/VERIFICATION.md`.

## 2. Logo et identité
- Logo fourni ou créé → vectoriser en SVG dans `marque/logo/` avec les noms
  `<slug>-logo.svg`, `<slug>-logo-cream.svg`, `-or`, `-creme-bronze`, `-noir`,
  `<slug>-monogram*.svg` (mêmes variantes), `<slug>-app-icon.svg`. L'original dans `logo/source/`.
- Remplir `marque/marque.json` (modèle : `studio/modele/marque.json`) : nom, domaine,
  e-mail, adresse, TVA, contacts, couleurs, polices (Google Fonts), textes de la charte.
- `node studio/generer.cjs marque` → logos PNG/PDF, charte graphique, papier à en-tête,
  vêtements, visuels Google et réseaux, logo des signatures e-mail.

## 3. Site
- Base : ce dépôt (React + Vite + Tailwind, pré-rendu, Vercel). Contenus dans `src/data/*`,
  système visuel dans `DESIGN.md`.
- Domaine → Vercel ; e-mail du domaine (`docs/SETUP-EMAIL.md`) ; formulaire de devis (`/api/lead`).

## 4. Présence (la face cachée : jamais de détail technique au client)
- Fiche Google Business : texte dans `marque/google-business/fiche.md`, visuels générés.
- SEO local : `docs/SEO-LOCAL.md`. Réseaux : `docs/RESEAUX-SOCIAUX.md`.
- Au client, on ne montre que les effets : visibilité, sécurité, demandes reçues.

## 5. Imprimés
- **Carte de visite** : Canva (copie de travail, jamais l'original), 85 × 55 mm + 3 mm de
  fonds perdus, QR vers `/devis?utm_source=carte` (`marque/carte-de-visite/`). Papier :
  couché mat 350–400 g, pelliculage soft-touch, dorure à chaud du logo si budget.
- **Vêtements** : `marque/vetements/` — cœur 90 mm (SVG), dos 280 × 400 mm (PDF : logo +
  domaine en bas). Textile noir, sérigraphie or ou crème + bronze.

## 6. Coffret de fin de chantier
Contenu physique (à valider avec le client) : certificat encadré, mètre ruban, stylo,
porte-clés, bon. Le certificat porte un QR vers une page de remerciement **privée** :
avant / après, avis Google, parrainage.

Pour chaque chantier :
1. Créer `marque/coffret/chantiers/<nom>/` (ce dossier n'entre jamais dans Git).
2. Y copier `studio/modele/chantier.json`, le remplir, ajouter les photos avant / après
   (même point de vue), avec l'accord écrit du client.
3. `node studio/coffret.cjs marque marque/coffret/chantiers/<nom>`
4. Imprimer `certificat.pdf` (A4 paysage, papier 300 g mat, cadre). Garder `lien.txt`.
5. Commiter et pousser `public/c/<id>.bin` : la page est en ligne au déploiement.

Sécurité : la page est chiffrée ; la clé n'est que dans le QR (après le `#`, jamais envoyée
au serveur). Le dépôt public ne contient rien de lisible. Couper l'accès : supprimer
`public/c/<id>.bin`. Relancer la commande garde le même QR (réimpression).

## 7. Rangement sur l'ordinateur (proposition)
```
Studio/
├─ Clients/
│  └─ Chaudrel/            ← clone de ce dépôt (site + marque + coffret)
│     └─ marque/coffret/chantiers/   ← fiches et photos clients (hors Git, à sauvegarder)
├─ Modeles/                ← copie de studio/ pour démarrer un nouveau client
└─ Archives/               ← sources reçues (logos, photos brutes, contrats)
```
Les fiches clients ne sont pas dans GitHub : les sauvegarder ailleurs (disque, cloud privé).
