# SEO local — Chaudrel

## Situation

- Domaine : chaudrel.be, déployé sur Vercel, redirection `www` → apex en place.
- V1 : 2 URLs indexables. V2 : **22 URLs** pré-rendues en HTML statique.
- Pas de fiche Google Business Profile identifiée → **c'est le levier n°1 manquant**,
  devant tout le reste du SEO technique.

## Ce qui est déjà implémenté (V2)

| Élément | Où |
|---|---|
| Title / description uniques par page | `src/lib/seo.js` |
| Canonical, Open Graph, Twitter Card par page | idem |
| `LocalBusiness` (GeneralContractor + HomeAndConstructionBusiness) : adresse, géo, TVA, horaires, zones, réseaux, catalogue de services | idem |
| `Service` par page service, `CreativeWork` par réalisation | idem |
| `BreadcrumbList` sur toutes les pages internes | idem |
| `FAQPage` (uniquement des réponses validables, sans prix ni délai inventé) | idem |
| Sitemap régénéré à chaque build | `scripts/prerender.js` |
| `robots.txt` + lien sitemap | `public/robots.txt` |
| Fil d'Ariane visible + maillage interne service ↔ projets ↔ devis | pages |
| H1 unique par page, hiérarchie H2/H3 | pages |
| `alt` descriptifs (type de travaux + lieu) | composants |

## Architecture d'URL

```
/                              marque + rénovation Bruxelles
/realisations                  portfolio (preuve)
/realisations/<projet>         longue traîne : "rénovation cuisine Ixelles"
/services                      hub services
/services/<service>            requêtes commerciales principales
/methode                       requête informationnelle + réassurance
/a-propos                      marque, E-E-A-T
/faq                           longue traîne question/réponse
/devis                         page de conversion
/legal/politique-mentions      obligatoire
```

## Intentions de recherche visées (à arbitrer avec Chaudrel)

Aucun volume de recherche n'est affirmé ici : les chiffres doivent être vérifiés
dans Google Keyword Planner / Search Console une fois la fiche Google active.

**Commercial, priorité haute**
- rénovation complète Bruxelles / entreprise de rénovation Bruxelles
- rénovation appartement Bruxelles
- rénovation cuisine Bruxelles · rénovation salle de bain Bruxelles
- entreprise rénovation Schaerbeek / Uccle / Ixelles / Woluwe

**Commercial, priorité moyenne**
- peinture intérieure Bruxelles · pose de carrelage Bruxelles
- aménagement intérieur Bruxelles · menuiserie sur mesure Bruxelles

**Informationnel (contenu à produire)**
- prix rénovation appartement Bruxelles → nécessite des fourchettes validées
- combien de temps dure une rénovation
- primes rénovation Bruxelles (Renolution) → contenu à fort trafic local

## Priorités d'action

**P0 — avant / juste après le meeting**
1. Créer et vérifier la **fiche Google Business Profile** : catégorie principale
   « Entrepreneur en rénovation », zone de service, horaires, photos réelles,
   lien vers `/devis`.
2. Brancher **Search Console** + soumettre `sitemap.xml`.
3. Obtenir les **5 premiers avis Google** (clients récents satisfaits).

**P1 — 30 jours**
4. Publier au moins un projet réel par catégorie manquante (salle de bain,
   appartement, commerce) — chaque projet = une URL indexable de longue traîne.
5. Cohérence **NAP** (nom, adresse, téléphone) identique sur : site, Google,
   Facebook, Instagram, Linktree, annuaires.
6. Inscriptions annuaires belges : Pages d'Or / Goldenpages, Solvari, Bobex,
   Livios, Homeproject (à arbitrer selon coût/lead).

**P2 — 90 jours**
7. Pages communes (`/renovation/uccle`, `/renovation/ixelles`…) — **uniquement**
   quand un vrai chantier peut illustrer chaque commune, sinon c'est du contenu
   dupliqué qui dessert le site.
8. 1 article de fond par trimestre (primes Renolution, checklist avant travaux).
9. Poids des images : passer aux formats responsive (`srcset` + AVIF).

## Mesure

| KPI | Outil | Fréquence |
|---|---|---|
| Impressions / clics par requête | Search Console | mensuel |
| Position moyenne sur « rénovation Bruxelles » | Search Console | mensuel |
| Vues + appels + itinéraires de la fiche Google | Google Business | mensuel |
| Demandes de devis issues du SEO | analytics + origine déclarée au téléphone | mensuel |
| Nombre d'avis Google et note | Google Business | mensuel |

## À ne pas faire

- Pas de keyword stuffing (la V1 en contenait dans les descriptions et la meta `keywords`).
- Pas de page commune sans contenu propre.
- Pas de FAQ schema avec des prix ou délais non validés : c'est un engagement commercial.
