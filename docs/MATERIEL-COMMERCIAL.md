# Matériel commercial

Charte reprise du site V2 : noir `#141311`, crème `#F7F5F2`, beige `#EDE8E1`,
pierre `#B9B1A6`, accent doré `#8C764E`. Titres en Playfair Display, textes en Inter.
Angles nets, filets fins, beaucoup de blanc. Aucun dégradé.

---

## 1. Carte de visite (85 × 55 mm)

**Recto** — le moins d'informations possible
```
        CHAUDREL
        ─────────
        Rénovation · Bruxelles
```
Fond crème, logo centré, filet doré fin. C'est tout.

**Verso** — l'action
```
Alberto  +32 477 27 31 18
Matteo   +32 493 97 25 17
Info@chaudrel.be
chaudrel.be

[QR]  Demander un devis
      chaudrel.be/devis
```
Fond noir, texte crème, QR doré ou blanc.

**Détails d'impression** : 350 g, pelliculage mat (le brillant fait bon marché sur ce
positionnement), QR **testé au téléphone avant impression**, taille minimale 2 × 2 cm.
Quantité de départ : 250 par personne — on les distribue, on ne les stocke pas.

Le QR doit pointer vers `https://chaudrel.be/devis?utm_source=carte` pour mesurer.

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
