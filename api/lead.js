/**
 * Réception des demandes de devis (Vercel Serverless Function).
 *
 * Configuration requise (variables d'environnement Vercel) :
 *   RESEND_API_KEY   clé API Resend (https://resend.com)
 *   LEAD_TO_EMAIL    adresse de réception interne  (ex. Info@chaudrel.be)
 *   LEAD_FROM_EMAIL  expéditeur vérifié chez Resend (ex. site@chaudrel.be)
 *
 * Tant que ces variables ne sont pas définies, l'endpoint répond 503 avec un
 * message explicite : le formulaire affiche alors le numéro de téléphone et
 * WhatsApp en repli. Aucun lead n'est perdu silencieusement.
 */

const MAX_LEN = { description: 4000, name: 120, email: 200, phone: 40, city: 120 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Limitation de débit best-effort (mémoire de l'instance).
const hits = new Map();
const RATE_LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

function rateLimited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  return list.length > RATE_LIMIT;
}

const clean = (v, max = 500) => String(v ?? '').trim().slice(0, max);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
  if (rateLimited(ip)) {
    return res.status(429).json({ error: 'Trop de demandes. Réessayez dans quelques minutes.' });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body || {};

  // Honeypot : rempli = bot. On renvoie 200 sans rien envoyer.
  if (clean(body.company)) return res.status(200).json({ ok: true });

  const firstName = clean(body.firstName, MAX_LEN.name);
  const lastName = clean(body.lastName, MAX_LEN.name);

  const lead = {
    projectType: clean(body.projectType, 80),
    propertyType: clean(body.propertyType, 40),
    description: clean(body.description, MAX_LEN.description),
    city: clean(body.city, MAX_LEN.city),
    postalCode: clean(body.postalCode, 12),
    // `name` reste accepté pour ne pas casser une demande envoyée depuis une
    // page encore en cache pendant le déploiement.
    name: [firstName, lastName].filter(Boolean).join(' ') || clean(body.name, MAX_LEN.name),
    firstName,
    lastName,
    phone: clean(body.phone, MAX_LEN.phone),
    email: clean(body.email, MAX_LEN.email),
    consent: Boolean(body.consent),
  };

  const errors = [];
  if (!lead.projectType) errors.push('type de projet');
  if (lead.description.length < 10) errors.push('description');
  if (lead.name.length < 2) errors.push('nom');
  if (lead.phone.length < 8) errors.push('téléphone');
  if (!EMAIL_RE.test(lead.email)) errors.push('e-mail');
  if (!lead.consent) errors.push('consentement');

  if (errors.length) {
    return res.status(400).json({ error: `Ces informations n'ont pas été acceptées : ${errors.join(', ')}. Corrigez-les et renvoyez la demande.` });
  }

  const { RESEND_API_KEY, LEAD_TO_EMAIL, LEAD_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !LEAD_TO_EMAIL || !LEAD_FROM_EMAIL) {
    console.error('[lead] Envoi non configuré — lead reçu mais non transmis:', {
      ...lead,
      description: `${lead.description.slice(0, 120)}…`,
    });
    return res.status(503).json({
      // L'état de notre configuration ne regarde pas le visiteur : il a
      // besoin d'un autre chemin, pas d'un diagnostic.
      error: "L'envoi automatique est momentanément indisponible. Appelez-nous ou écrivez sur WhatsApp : votre demande sera traitée de la même façon.",
    });
  }

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: LEAD_FROM_EMAIL,
        to: [LEAD_TO_EMAIL],
        reply_to: lead.email,
        subject: `Demande de devis — ${lead.projectType} — ${lead.city}`,
        text: [
          `Type de projet : ${lead.projectType}`,
          `Type de bien : ${lead.propertyType || 'non précisé'}`,
          `Commune : ${lead.city} ${lead.postalCode}`,
          '',
          'Description :',
          lead.description,
          '',
          `Nom : ${lead.name}`,
          `Téléphone : ${lead.phone}`,
          `E-mail : ${lead.email}`,
          '',
          `Consentement RGPD : ${lead.consent ? 'oui' : 'non'}`,
          `Reçu le : ${new Date().toISOString()}`,
        ].join('\n'),
      }),
    });

    if (!r.ok) {
      const detail = await r.text();
      console.error('[lead] Resend error', r.status, detail);
      return res.status(502).json({ error: "L'envoi a échoué. Réessayez, ou appelez-nous si cela se reproduit." });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[lead] Exception', err);
    return res.status(500).json({ error: "L'envoi a échoué de notre côté. Réessayez, ou appelez-nous si cela se reproduit." });
  }
}

function safeParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}
