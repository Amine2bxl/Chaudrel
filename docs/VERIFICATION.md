# À valider avec Chaudrel avant mise en production

Règle appliquée dans tout le projet : **aucun contenu factuel inventé**. Tout ce qui
n'a pas pu être vérifié depuis le repository a été retiré du site ou marqué ici.

## 1. Retiré du site V2 (car non vérifiable)

| Élément V1 | Décision V2 | Action Chaudrel |
|---|---|---|
| « 150+ projets réalisés » | Retiré (home, avis, JSON-LD) | Donner le chiffre réel, ou on ne l'affiche pas |
| « 100 projets en 2018 » (timeline) | Retiré | Confirmer les jalons réels |
| Note moyenne « 5.0 » affichée | Retirée | Utiliser la note Google réelle une fois la fiche active |
| « Devis sous 48h » | Retiré | Confirmer un délai de réponse tenable (24h / 48h / 72h) |
| Budgets « 5 000 € à 150 000 € », « majorité entre 15 000 et 60 000 € » | Retirés (FAQ + JSON-LD) | Valider des fourchettes réelles si vous voulez les afficher |
| Délais « cuisine 3–6 semaines », « rénovation 2–4 mois » | Retirés | Confirmer des délais moyens réels |
| « Garantie décennale » affirmée | Retirée du site | Confirmer les couvertures exactes (l'assurance RC AXA police 010.330.000.014 est conservée dans les mentions légales) |
| Services toiture / piscine / jardin / nettoyage | Retirés de la liste principale | **Décision à prendre** : les remettre si Chaudrel les réalise vraiment (voir §3) |
| Durées de chantier dans les titres de section | Aucune n'est affichée | Communiquer des durées moyennes réelles si vous voulez les afficher |
| Photos Unsplash | Retirées | Toutes les images du site sont désormais les photos du dossier `/public/photos` |

## 2. Avis clients — bloquant

Fichier : `src/data/testimonials.js` — drapeau `TESTIMONIALS_VALIDATED = false`.

Les 6 avis proviennent de la V1 et **n'ont pas été vérifiés**. Aucun n'a été inventé
ici, mais leur origine est inconnue.

À faire :
1. Confirmer chaque avis (texte, personne, projet, date), **ou**
2. Les remplacer par de vrais avis Google, **ou**
3. Les supprimer (le site reste cohérent sans la section).

Seuls prénom + initiale sont affichés (RGPD / règles sur les avis en ligne).
Renseigner `GOOGLE_REVIEWS_URL` dès que la fiche Google Business existe.

## 3. Services — à confirmer un par un

Fichier : `src/data/services.js`. Liste actuelle (9) :
rénovation complète, cuisine, salle de bain, peinture, électricité, plomberie,
sols & revêtements, menuiserie, aménagement intérieur.

Questions :
- Chaudrel réalise-t-il **réellement** chacun de ces postes, en interne ou via sous-traitance ?
- Toiture, piscine, jardin, nettoyage de fin de chantier (présents en V1) : à conserver ou non ?
- Électricité : Chaudrel prend-il en charge la mise en conformité et le contrôle par organisme agréé ? (marqué `TODO_VALIDATION` dans le code)
- Le code NACE officiel est 43.910 « travaux de couverture » — cohérent avec l'activité affichée ?

## 4. Réalisations

Fichier : `src/data/projects.js` — 5 projets construits à partir des photos réelles.

À confirmer pour chacun : titre, localisation, nature des travaux, matériaux,
autorisation du client de publier les photos.

Manquent pour être crédible : au moins 1 projet **salle de bain**, 1 **appartement**,
1 **commerce** (les filtres correspondants n'apparaissent que si un projet existe).

## 5. Coordonnées & identité

| Donnée | Valeur utilisée | Statut |
|---|---|---|
| TVA / n° entreprise | BE 0812.283.245 | issu de la V1 — à confirmer |
| Siège | Rue Henri Stacquet 49-51, 1030 Schaerbeek | à confirmer |
| Constitution | 15 juin 2009 | à confirmer |
| Téléphones | Alberto +32 477 27 31 18 / Matteo +32 493 97 25 17 | à confirmer |
| E-mail | Info@chaudrel.be | à confirmer |
| Assurance RC | AXA Belgium, police 010.330.000.014 | à confirmer + demander l'attestation |
| **Numéro WhatsApp Business** | +32 477 27 31 18 (par défaut) | **à confirmer** — `BRAND.whatsapp` dans `src/data/site.js` |
| Zone d'intervention | **Toute la Belgique** | confirmé par le client (août 2026) — le site l'affiche désormais partout, avec une carte des provinces sur l'accueil et la page méthode |

## 6. Technique — à configurer avant mise en ligne

| Variable Vercel | Rôle |
|---|---|
| `RESEND_API_KEY` | clé API Resend pour l'envoi des demandes de devis |
| `LEAD_TO_EMAIL` | boîte qui reçoit les leads (ex. Info@chaudrel.be), ou plusieurs adresses séparées par des virgules |
| `LEAD_BCC_EMAIL` | optionnel — copie cachée de la notification (ex. second gérant) |
| `LEAD_FROM_EMAIL` | expéditeur vérifié chez Resend (ex. site@chaudrel.be) |

À chaque demande envoyée :
1. la **notification interne** (avec type de projet, surface, échéance, budget,
   situation, occupation, description et coordonnées) part vers `LEAD_TO_EMAIL`
   (et `LEAD_BCC_EMAIL`) — c'est le seul envoi dont dépend le statut de la demande ;
2. une **confirmation automatique** part au visiteur (récapitulatif + suite), envoyée
   en best-effort : son échec ne fait pas échouer la demande.

Le formulaire `/devis` collecte désormais les questions de qualification
(`docs/RESEAUX-SOCIAUX.md`) : surface approximative, occupation du logement,
échéance, budget, situation (propriétaire/locataire), **province + code postal**
(l'intervention couvre toute la Belgique), et **pièces jointes** : jusqu'à 5 photos
ou PDF et une vidéo courte (3 Mo au total), envoyées en pièces jointes de la
notification interne.

> ⚠️ **PROVISOIRE (tests)** — tant que `LEAD_TO_EMAIL` n'est pas défini dans
> Vercel, les demandes partent vers `amineazouzi2009@gmail.com` (destinataire de
> test dans `api/lead.js`). La confirmation automatique au visiteur part, elle,
> sur l'adresse saisie dans le formulaire.

Tant que ces variables sont absentes, `/api/lead` répond 503 et le formulaire
affiche téléphone + WhatsApp en repli : **aucun lead n'est perdu silencieusement**.

Autres éléments à créer/fournir :
- Fiche **Google Business Profile** (indispensable au SEO local)
- Compte **Resend** (ou équivalent) + vérification du domaine d'envoi
- Photo réelle de l'équipe (la page À propos utilise une photo de chantier en attendant)
- Décision analytics : GA4 / Plausible ? (le code envoie déjà les événements, il ne manque que le script — voir `src/lib/analytics.js`)

## 7. Carte de la Belgique (ajoutée en refonte)

Les contours proviennent des données publiques Eurostat NUTS 2021 (niveau 2 =
provinces belges). C'est une illustration : aucune donnée dynamique, aucun service
de cartographie, aucune page par province. Le message affiché est
« Nous intervenons partout en Belgique », conformément à la zone commerciale
confirmée par le client.

À confirmer : y a-t-il des provinces où Chaudrel **ne** se déplace pas ? Si oui,
les retirer de `src/data/belgium.js` (la liste et la carte se mettent à jour seules).
