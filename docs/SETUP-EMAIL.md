# Brancher l'envoi automatique des demandes de devis

Le formulaire `/devis` envoie ses demandes via **Resend** (endpoint `api/lead.js`).
Tant qu'il n'est pas configuré, l'endpoint répond 503 avec le code
`email_unconfigured` et le formulaire propose un repli « Envoyer par e-mail »
(mais l'envoi automatique ne part pas). Voici les étapes pour le brancher
réellement.

≥ 15 minutes · une seule fois · tout se passe dans le navigateur sauf l'étape DNS.

---

## 1. Créer le compte Resend

1. Aller sur **https://resend.com** → `Sign up` (compte gratuit, 3 000 e-mails/mois).
2. Confirmer l'e-mail du compte.

## 2. Ajouter le domaine d'envoi

1. Dans Resend → **Domains** → `Add Domain`.
2. Saisir un domaine/ sous-domaine d'envoi, ex. **`chaudrel.be`** (le plus simple pour
   un `from` propre du type `site@chaudrel.be`).
3. Resend affiche **3 enregistrements DNS** à créer chez l'hébergeur du domaine
   (un `SPF`, un `DKIM`, un `DMARC`, tous en `TXT`).

## 3. Configurer le DNS

Chez l'hébergeur du domaine (OVH, Cloudflare, Namecheap…) :

1. Ouvrir la zone DNS de `chaudrel.be`.
2. Ajouter les **3 enregistrements TXT** donnés par Resend (valeurs exactes,
   sans espaces en trop).
3. Retourner dans Resend → le domaine passe à **Verified** en quelques minutes
   (vérifier l'état `DNS Records`).

> Sans cette étape, Resend REFUSE les envois depuis ce domaine (erreur 403 /
> « domain not registered »).

## 4. Créer la clé API

1. Dans Resend → **API Keys** → `Create API Key`.
2. Permissions : `Sending access` (envoi uniquement).
3. Copier la clé (`re_...`) et la garder : elle n'est plus affichée ensuite.

## 5. Ajouter les variables dans Vercel

1. Aller sur **https://vercel.com** → votre projet `chaudrel`.
2. `Settings → Environment Variables`, ajouter pour les environnements
   **Production** (et *Preview* si vous voulez tester en préview) :

| Variable | Valeur | Rôle |
|---|---|---|
| `RESEND_API_KEY` | `re_...` | la clé Resend de l'étape 4 |
| `LEAD_FROM_EMAIL` | `site@chaudrel.be` | expéditeur vérifié (domaine de l'étape 3) |
| `LEAD_TO_EMAIL` | `amineazouzi2009@gmail.com` | **destinataire de test** (mettre la vraie boîte en production) |
| `LEAD_BCC_EMAIL` | *(facultatif)* | copie cachée, ex. le second gérant |

> ⚠️ Ces valeurs restent **côté serveur** : elles ne sont jamais envoyées au
> navigateur.

## 6. Redéployer puis tester

1. Pousser sur `main` (le déploiement Vercel se fait tout seul) ou `Redeploy`.
2. Vider l'ancien brouillon si besoin → **Effacer le brouillon** sur `/devis`.
3. Remplir le formulaire (avec ou sans photos/vidéos) et envoyer.

Résultat attendu :
- **1ᵉʳ e-mail** : notification complète vers `LEAD_TO_EMAIL` (+ `LEAD_BCC_EMAIL`),
  avec les pièces jointes (photos/plans/vidéo incluses).
- **2ᵉ e-mail** : confirmation automatique vers l'adresse saisie dans le
  formulaire (récapitulatif + suite).

En cas de problème, regarder la sortie du log de la Vercel Function `lead`
(`vercel logs` ou l'onglet Functions du projet) : Resend y détaille les refus
(domaine non vérifié, clé erronée, etc.).

> ⚠️ L'envoi automatique ne fonctionne que sur le **déploiement Vercel**.
> En local (`npm run dev`) Vite ne sert pas `/api/lead` : le formulaire l'affiche
> comme un échec et propose le repli « Envoyer par e-mail » - c'est normal.

## Adresses utiles

- Compte Resend : https://resend.com
- Domaine → vérification : https://resend.com/domains
- Clés API : https://resend.com/api-keys
- Logs Vercel : https://vercel.com/Amine2bxl/Chaudrel/logs

---

*Pour la production, remplacer `LEAD_TO_EMAIL` par la vraie boîte de Chaudrel
(Info@chaudrel.be) et, à plus long terme, retirer le repli de test présent dans
`api/lead.js`.*