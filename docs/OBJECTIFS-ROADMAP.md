# Objectifs 2027 & roadmap

> ⚠️ **Lire d'abord.** Aucun chiffre réel de Chaudrel n'est connu depuis le
> repository : ni chiffre d'affaires, ni nombre de chantiers, ni panier moyen, ni
> taux de signature, ni trafic. Les valeurs ci-dessous sont un **modèle vide** avec
> des ordres de grandeur à confirmer. Elles ne doivent pas être présentées comme des
> faits. La première colonne à remplir au meeting est « Aujourd'hui ».

## 1. Le tableau à remplir avec Alberto et Matteo

| Indicateur | Aujourd'hui | Fin 2026 | 2027 | Qui mesure |
|---|---|---|---|---|
| Chiffre d'affaires | ? | ? | ? | Alberto |
| Nombre de chantiers livrés / an | ? | ? | ? | Alberto |
| Panier moyen par chantier | ? | ? | ? | Alberto |
| Leads reçus / mois (toutes sources) | ? | ? | ? | Matteo |
| Demandes de devis via le site | 0 (pas de formulaire fonctionnel en V1) | ? | ? | Analytics |
| Taux lead → visite | ? | ? | ? | Matteo |
| Taux visite → devis | ? | ? | ? | Alberto |
| Taux devis → signature | ? | ? | ? | Alberto |
| Délai de première réponse | ? | < 24 h ouvrées | < 4 h ouvrées | Matteo |
| Visiteurs / mois sur le site | ? | ? | ? | Analytics |
| Avis Google | 0 identifié | 10 | 30 | Matteo |
| Note Google | — | ≥ 4,7 | ≥ 4,8 | Matteo |
| Abonnés Instagram | ? | ? | ? | Matteo |
| Partenaires prescripteurs actifs | 0 formalisé | 3 | 8 | Alberto |
| % de chantiers issus de recommandations | ? | ? | ? | Alberto |

## 2. Comment raisonner (méthode, pas prédiction)

Le raisonnement se fait à l'envers, depuis l'objectif de chiffre d'affaires :

```
CA visé ÷ panier moyen            = nombre de chantiers nécessaires
chantiers ÷ taux devis→signature  = nombre de devis à produire
devis ÷ taux visite→devis         = nombre de visites
visites ÷ taux lead→visite        = nombre de leads nécessaires
leads ÷ 12                        = leads à générer par mois
```

Une fois les 4 taux réels connus, ce calcul donne immédiatement l'objectif mensuel de
leads — et donc si l'effort doit porter sur l'acquisition (plus de leads) ou sur la
conversion (mieux transformer ceux qu'on a). **Tant que ces taux ne sont pas mesurés,
tout objectif chiffré est une devinette.**

Point d'attention fréquent dans ce métier : le problème n'est presque jamais le
volume de leads, c'est le délai de réponse et l'absence de relance.

## 3. Ce qu'il faut mesurer dès la semaine prochaine

Un simple tableur à 8 colonnes suffit pour démarrer :

`Date · Nom · Source (Google / site / Insta / reco / autre) · Type de projet · Commune · Statut · Montant devis · Signé O/N`

Trois mois de ce tableau valent tous les objectifs théoriques du monde.

---

## 4. Roadmap

Priorisation impact × effort. **Gras** = impact fort et effort faible : à faire en premier.

### 30 jours

| # | Action | Impact | Effort | Qui |
|---|---|---|---|---|
| 1 | **Créer et vérifier la fiche Google Business Profile** | ★★★ | ★ | Matteo |
| 2 | **Configurer Resend + variables Vercel** (leads reçus par e-mail) | ★★★ | ★ | Dév |
| 3 | **Passer à WhatsApp Business** + message d'accueil + message d'absence | ★★★ | ★ | Matteo |
| 4 | **Demander un avis Google aux 10 derniers clients satisfaits** | ★★★ | ★ | Matteo |
| 5 | Valider le contenu du site (services, avis, réalisations — voir `VERIFICATION.md`) | ★★★ | ★★ | Alberto + Matteo |
| 6 | Mettre en ligne la V2 | ★★★ | ★ | Dév |
| 7 | Mettre en place le tableur de suivi des leads | ★★ | ★ | Matteo |
| 8 | Réorganiser le Linktree (ordre : devis, WhatsApp, réalisations…) | ★★ | ★ | Matteo |
| 9 | Photographier 3 chantiers récents (avant si disponible, après) | ★★★ | ★★ | Équipe |
| 10 | Commander cartes de visite + panneau de chantier | ★★ | ★ | Alberto |

### 90 jours

| # | Action | Impact | Effort |
|---|---|---|---|
| 11 | Publier 3 nouvelles réalisations sur le site (salle de bain, appartement, commerce) | ★★★ | ★★ |
| 12 | Rythme social tenu : 3 publications/semaine pendant 12 semaines | ★★ | ★★★ |
| 13 | Scripts de relance devis appliqués systématiquement (J+3, J+10, J+30) | ★★★ | ★ |
| 14 | Contacter 10 prescripteurs (architectes, agences, cuisinistes) | ★★★ | ★★ |
| 15 | Brochure PDF finalisée et envoyée après chaque visite | ★★ | ★★ |
| 16 | Search Console + analytics branchés, premier rapport mensuel | ★★ | ★ |
| 17 | Atteindre 10 avis Google | ★★★ | ★★ |
| 18 | Modèle de devis standardisé | ★★ | ★★ |

### 6 mois

| # | Action | Impact | Effort |
|---|---|---|---|
| 19 | Pages « rénovation à <commune> » adossées à de vrais chantiers | ★★ | ★★ |
| 20 | 3 partenariats prescripteurs actifs et suivis | ★★★ | ★★ |
| 21 | Premier article de contenu (primes Renolution / budget rénovation) | ★★ | ★★ |
| 22 | Test publicitaire mesuré (Meta local, budget limité) — seulement si le funnel est rodé | ★★ | ★★ |
| 23 | Optimisation performance : images responsive, polices auto-hébergées | ★ | ★★ |
| 24 | Revue des taux de conversion réels et ajustement des objectifs | ★★★ | ★ |

### 12 mois

| # | Action | Impact | Effort |
|---|---|---|---|
| 25 | 30 avis Google, note ≥ 4,8 | ★★★ | ★★ |
| 26 | 8 partenaires actifs générant un flux régulier | ★★★ | ★★★ |
| 27 | Portfolio de 15 réalisations documentées | ★★★ | ★★★ |
| 28 | Le site est la 1re source de leads mesurée | ★★★ | — |
| 29 | Décider : embauche, sous-traitance cadrée, ou montée en gamme | ★★★ | ★★★ |
| 30 | Envisager une V3 (espace client, suivi de chantier) **uniquement si** le volume le justifie | ★ | ★★★ |

## 5. Règle de pilotage

Un point de 30 minutes par mois, sur trois questions seulement :
1. Combien de leads, par source ?
2. Combien de devis envoyés, combien signés ?
3. Qu'est-ce qu'on arrête, qu'est-ce qu'on double ?

Le reste est du bruit.
