# Coffret de fin de chantier — Chaudrel

Certificat de réalisation (à encadrer) + page de remerciement privée ouverte par son QR
(avant / après, avis Google, parrainage). Mode d'emploi complet : `studio/ETAPES.md` §6.

- Fiches et photos des clients : `chantiers/<nom>/` — **ignoré par Git**, à sauvegarder à part.
- Générer : `node studio/coffret.cjs marque marque/coffret/chantiers/<nom>`
- Publier : commiter `public/c/<id>.bin` (chiffré, illisible sans le QR).
- Bouton « avis Google » : renseigner `avisGoogle` dans `marque/marque.json` (lien de la fiche).
