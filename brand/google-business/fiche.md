# Fiche Google Business Profile — Chaudrel Rénovation

Contenu prêt à copier dans [business.google.com](https://business.google.com). Tout ce qui suit est
déjà publié sur le site ou validé par Chaudrel ; les champs marqués **À COMPLÉTER** attendent une
information réelle (voir `docs/VERIFICATION.md`). Rien n'est inventé.

Règle d'or (référencement local) : **nom, adresse et téléphone identiques** partout — fiche
Google, site, Facebook, Instagram, Linktree, annuaires.

## Identité

| Champ | Valeur |
|---|---|
| Nom de l'établissement | Chaudrel Rénovation |
| Catégorie principale | La catégorie de rénovation proposée par Google à la saisie (en anglais *Remodeler* ; `docs/SEO-LOCAL.md` vise « Entrepreneur en rénovation »). Taper « rénovation » et choisir le libellé exact de la liste. |
| Catégories secondaires | Les équivalents proposés de : entrepreneur général, couvreur (toiture), pose de châssis / fenêtres, façades. Ne cocher que ce que Chaudrel fait réellement. |
| Téléphone principal | +32 477 27 31 18 (Alberto) |
| Téléphone secondaire | +32 493 97 25 17 (Matteo) |
| Site web | `https://chaudrel.be/?utm_source=google&utm_medium=fiche` |
| Lien de rendez-vous / devis | `https://chaudrel.be/devis?utm_source=google&utm_medium=fiche` |
| Date d'ouverture | 2009 |
| Adresse | Rue Henri Stacquet 49-51, 1030 Schaerbeek |

**Adresse ou zone desservie ?** Si les clients ne sont pas reçus rue Henri Stacquet, Google demande
de **masquer l'adresse** et de déclarer des **zones desservies** (20 au maximum). Proposition, d'après
`src/data/site.js` : Bruxelles, Brabant wallon, Brabant flamand, Anvers, Gand, Bruges, Louvain,
Hasselt, Liège, Namur, Charleroi, Mons, Wavre, Arlon.

**Horaires — À COMPLÉTER.** Ceux du site sont provisoires (lundi-vendredi 8 h-18 h, samedi sur
rendez-vous). Ne pas publier sans confirmation.

## Description (630 caractères, limite Google : 750)

> Chaudrel Rénovation est une entreprise de rénovation fondée en 2009 à Schaerbeek. Nous réalisons façades, toitures, châssis et portes, aménagements extérieurs et rénovations complètes, à Bruxelles et partout en Belgique. Les deux fondateurs, Alberto et Matteo, suivent chaque chantier en personne : Alberto pour la technique et l'exécution, Matteo pour le design et la relation client. Vous avez un seul interlocuteur, du devis à la remise des clés, et nous coordonnons tous les corps de métier. Visite sur place et devis détaillé gratuits, sans engagement, réponse sous 48 h. Demandez votre devis sur chaudrel.be ou par WhatsApp.

## Services (rubrique « Services »)

Repris de `src/data/services.js` et des réalisations du site :

- Rénovation complète
- Façade (création, ravalement, isolation par l'extérieur)
- Toiture (charpente, couverture, étanchéité, zinguerie)
- Châssis et portes d'entrée
- Aménagement extérieur (allées, terrasses, abords, portes de garage)
- Finitions intérieures (sols, murs, plafonds, peinture)
- Piscine (gros œuvre et finitions)

Description courte de chaque service : reprendre la phrase `excerpt` du fichier.

## Images

| Emplacement | Fichier |
|---|---|
| Logo | `logo-profil-720.png` |
| Couverture | `couverture-1600x900.jpg` (vrai chantier : façade enduite et portes de garage) |
| Photos | Les photos de `public/photos/` (réalisations réelles) ; ajouter des photos avant / pendant / après à chaque chantier. **Jamais** la photo d'ambiance `hero.webp` : ce n'est pas un chantier Chaudrel. |

## Premières publications (rubrique « Actualités »)

1. **Nouveau site** — « Nos chantiers en photos, nos métiers et un devis gratuit en deux minutes : chaudrel.be ». Bouton : *En savoir plus* → site.
2. **Un seul interlocuteur** — « Alberto suit la technique, Matteo le design et la relation client. Depuis 2009, vous savez toujours qui appeler. » Bouton : *Appeler*.
3. **Devis gratuit** — « Une visite sur place, puis un devis détaillé poste par poste. Gratuit, sans engagement, réponse sous 48 h. » Bouton : *Réserver* → lien devis.

## Avis

- Demander l'avis **le jour de la livraison**, quand le client est satisfait (cf. `docs/STRATEGIE-COMMERCIALE.md`).
- Lien d'avis : **À COMPLÉTER** une fois la fiche validée (« Demander des avis » dans la fiche). Le reporter ensuite dans `GOOGLE_REVIEWS_URL` (`src/data/testimonials.js`).
- Message type (WhatsApp / SMS) :
  > Bonjour, merci encore pour votre confiance. Si vous êtes satisfait du chantier, votre avis Google nous aiderait beaucoup : [lien]. Belle journée, Alberto et Matteo — Chaudrel Rénovation.
- Répondre à chaque avis, positif ou non, sous 48 h.
