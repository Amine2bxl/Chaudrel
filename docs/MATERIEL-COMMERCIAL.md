# Matériel commercial

Charte : **nouveau logo CR (novembre 2026)**, détaillée dans `marque/documents/charte-graphique.pdf`.
Nuit `#1A1613`, brun chaud `#231E1A`, crème `#EAE0D3`, bronze de la porte `#AE8A56` (seul accent),
encre `#24221E` sur fond clair. Titres en Prata, textes en Albert Sans. Fichiers prêts à
l'emploi dans `marque/` (logos, carte, t-shirts, fiche Google, réseaux, papier à en-tête,
signatures e-mail). L'ancienne charte (Playfair, Inter, `#8C764E`) est abandonnée.

---

## 1. Carte de visite (85 × 55 mm)

Chaudrel a déjà sa carte sur Canva : `marque/carte-de-visite/` (PDF d'impression + aperçus).
Avant réimpression : passer au **monogramme CR** (elle porte encore l'ancien logo), remplacer le
QR Linktree par `marque/carte-de-visite/qr-devis-carte.svg` (`chaudrelrenovation.be/devis?utm_source=carte`, mesurable),
réexporter avec 3 mm de fonds perdus. Papier 350 g, pelliculage mat ; tester le QR au téléphone
avant impression.

---

## 2. Brochure (A5, 12 pages, ou A4 plié 3 volets pour une version légère)

| Page | Contenu | Règle |
|---|---|---|
| 1 | Couverture : une photo pleine page d'un chantier livré + « CHAUDREL — Rénovation à Bruxelles » | Une seule image, aucun texte marketing |
| 2 | Chaudrel en 5 lignes : qui, depuis quand, où, ce qu'on fait, un seul interlocuteur | Court |
| 3 | Notre expertise : ce qu'on maîtrise et comment on travaille | Factuel |
| 4–5 | Services (double page, 9 services en grille avec une icône ou une photo) | Reprend `src/data/services.js` |
| 6–8 | Réalisations : 3 chantiers, chacun avec avant/après + 3 lignes de descriptif + commune | Le cœur de la brochure |
| 9 | Notre méthode : les 5 étapes | Reprend `src/data/method.js` |
| 10 | Pourquoi Chaudrel : un interlocuteur, devis clair, respect du lieu, finitions | Reprend les valeurs de `/a-propos` |
| 11 | Zone d'intervention : carte simple de Bruxelles + communes | Pas de carte inventée : les communes réellement couvertes |
| 12 | Contact + QR vers `/devis` + réseaux | CTA unique et gros |

**Format numérique** : exporter en PDF < 5 Mo pour l'envoi par WhatsApp/e-mail.
C'est la version qui servira le plus (envoyée après chaque visite).

---

## 3. Présentation entreprise (pour architectes, agences, promoteurs — 10 slides)

1. Chaudrel — qui nous sommes (photo d'équipe, année, Bruxelles)
2. Ce que nous faisons (les 9 postes)
3. Notre manière de travailler (les 5 étapes)
4. Réalisation 1 — avant / après / travaux / durée
5. Réalisation 2 — idem
6. Réalisation 3 — idem
7. Ce que nous apportons à un prescripteur (interlocuteur unique, planning tenu, communication, photos partagées)
8. Zone d'intervention et capacité (nombre de chantiers simultanés — **à valider**)
9. Références & assurances (TVA, RC professionnelle AXA)
10. Contact + proposition de collaboration

Format : PDF paysage. Aucune animation. Une idée par slide.

---

## 4. Autres supports utiles (par ordre de rentabilité)

| Support | Pourquoi | Coût indicatif |
|---|---|---|
| **Panneau de chantier** (bâche 1 × 1,5 m) | Le meilleur média local : visible pendant des semaines dans la rue du chantier | ~60–120 € |
| **Autocollants véhicule** | Publicité permanente à Bruxelles | ~150–400 € |
| **Carte « chantier terminé »** laissée au client avec 3 cartes de visite | Déclenche la recommandation | marginal |
| **Vêtements de travail marqués** | Crédibilité perçue sur chantier et dans les magasins de matériaux | ~40 €/pièce |
| **Carte QR « Laissez-nous un avis »** remise à la livraison | Convertit la satisfaction en avis Google | marginal |

Le panneau de chantier et la carte d'avis sont les deux investissements les plus
rentables — à faire avant toute publicité payante.

---

## 5. À fournir par Chaudrel pour produire ces supports

- Logo en vectoriel (SVG ou AI) — seul un JPG/WebP est présent dans le repository
- Photo de l'équipe (Alberto & Matteo, sur chantier de préférence)
- 3 chantiers complets avec photos avant **et** après, et l'accord écrit des clients
- Confirmation des coordonnées et de la zone d'intervention
- Décision sur les services à afficher
