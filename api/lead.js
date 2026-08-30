/**
 * Réception des demandes de devis (Vercel Serverless Function).
 *
 * Configuration requise (variables d'environnement Vercel) :
 *   RESEND_API_KEY    clé API Resend (https://resend.com)
 *   LEAD_TO_EMAIL     boîte(s) de réception interne - une adresse, ou plusieurs
 *                     séparées par des virgules (ex. Info@chaudrel.be)
 *   LEAD_BCC_EMAIL    optionnel - copie cachée (le second gérant, par exemple)
 *   LEAD_FROM_EMAIL   expéditeur vérifié chez Resend (ex. site@chaudrel.be)
 *
 * ⚠️ PROVISOIRE - tant que `LEAD_TO_EMAIL` n'est pas défini, la destination de
 *    test envoy@… reçoit les demandes (adresse d'Amine) pour vérifier que
 *    l'envoi et les pièces jointes fonctionnent. À retirer dès la mise en
 *    production réelle.
 *
 * À chaque demande :
 *   1. une notification complète part à l'équipe (LEAD_TO_EMAIL ± LEAD_BCC_EMAIL),
 *      avec les photos/plans/vidéo reçus en pièces jointes ;
 *   2. un e-mail de confirmation part automatiquement au visiteur, avec le
 *      récapitulatif de sa demande et la suite.
 *
 * Tant que RESEND et LEAD_FROM ne sont pas configurés, l'endpoint répond 503
 * avec un message explicite : le formulaire affiche alors le téléphone et
 * WhatsApp en repli. Aucun lead n'est perdu silencieusement.
 */

const MAX_LEN = { description: 4000, name: 120, email: 200, phone: 40, city: 120, small: 40 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* Limites des pièces jointes. Le corps est chiffré en base64 (+~33 %) et
   l'endpoint Vercel plafonne le corps à 4,5 Mo : on reste sous 3 Mo de brut. */
const ATTACH = {
  maxFiles: 5,
  maxVideo: 1,
  perFile: 1 * 1024 * 1024,
  perVideo: 1.5 * 1024 * 1024,
  total: 3 * 1024 * 1024,
};
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const DOC_TYPES = ['application/pdf'];

/* ⚠️ PROVISOIRE (tests) - voir en-tête. */
const TEST_DESTINATION = 'amineazouzi2009@gmail.com';

/* Limitation de débit best-effort (mémoire de l'instance). */
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

/** Envoie un e-mail Resend. `to` peut être une chaîne « a@x.fr, b@y.fr ». */
async function sendEmail({ apiKey, from, to, bcc = '', replyTo, subject, text, attachments = [] }) {
  const addresses = (list) =>
    list
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

  const payload = {
    from,
    to: addresses(to),
    subject,
    text,
  };
  const bccList = addresses(bcc);
  if (bccList.length) payload.bcc = bccList;
  if (replyTo) payload.reply_to = replyTo;
  if (attachments.length) payload.attachments = attachments;

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!r.ok) {
    const detail = await r.text();
    const err = new Error(`Resend ${r.status}: ${detail}`);
    err.status = r.status;
    throw err;
  }
  return r;
}

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
    surface: clean(body.surface, MAX_LEN.small),
    description: clean(body.description, MAX_LEN.description),
    occupied: clean(body.occupied, MAX_LEN.small),
    province: clean(body.province, MAX_LEN.small),
    postalCode: clean(body.postalCode, 12),
    commune: clean(body.commune, MAX_LEN.city),
    timeline: clean(body.timeline, MAX_LEN.small),
    budget: clean(body.budget, MAX_LEN.small),
    ownerStatus: clean(body.ownerStatus, 40),
    // `name` reste accepté pour ne pas casser une demande envoyée depuis une
    // page encore en cache pendant le déploiement.
    name: [firstName, lastName].filter(Boolean).join(' ') || clean(body.name, MAX_LEN.name),
    firstName,
    lastName,
    phone: clean(body.phone, MAX_LEN.phone),
    email: clean(body.email, MAX_LEN.email).toLowerCase(),
    consent: Boolean(body.consent),
  };

  const errors = [];
  if (!lead.projectType) errors.push('type de projet');
  if (lead.description.length < 10) errors.push('description');
  if (lead.name.length < 2) errors.push('nom');
  if (lead.phone.length < 8) errors.push('téléphone');
  if (!EMAIL_RE.test(lead.email)) errors.push('e-mail');
  if (!lead.consent) errors.push('consentement');
  if (!lead.postalCode) errors.push('code postal');

  if (errors.length) {
    return res.status(400).json({
      error: `Ces informations n'ont pas été acceptées : ${errors.join(', ')}. Corrigez-les et renvoyez la demande.`,
    });
  }

  /* ---------- Pièces jointes ---------- */
  const attachments = [];
  const rawFiles = Array.isArray(body.files) ? body.files : [];
  let images = 0;
  let videos = 0;
  let total = 0;

  for (const f of rawFiles) {
    const name = clean(f?.name, 120) || 'piece-jointe';
    const type = clean(f?.type, 60);
    const content = String(f?.data ?? '');

    const isImage = IMAGE_TYPES.includes(type);
    const isVideo = type.startsWith('video/');
    const isDoc = DOC_TYPES.includes(type);

    if (!isImage && !isVideo && !isDoc) {
      return res.status(400).json({ error: 'Un des fichiers joints a un format non accepté. Formats autorisés : JPG, PNG, WebP, PDF et une vidéo.' });
    }
    if (!content) continue;

    const size = Math.round((content.length * 3) / 4);
    total += size;

    if (isVideo) {
      videos += 1;
      if (videos > ATTACH.maxVideo) {
        return res.status(400).json({ error: `Une seule vidéo par demande (${ATTACH.maxVideo} maximum).` });
      }
      if (size > ATTACH.perVideo) {
        return res.status(400).json({ error: 'La vidéo dépasse la taille autorisée.' });
      }
    } else {
      images += 1;
      if (images > ATTACH.maxFiles) {
        return res.status(400).json({ error: `Jusqu’à ${ATTACH.maxFiles} photos ou plans par demande.` });
      }
      if (size > ATTACH.perFile) {
        return res.status(400).json({ error: 'Un des fichiers dépasse la taille autorisée.' });
      }
    }

    if (total > ATTACH.total) {
      return res.status(400).json({ error: "L’ensemble des fichiers dépasse la limite de 3 Mo : réduisez la taille des pièces." });
    }

    attachments.push({ filename: name, content });
  }

  const { RESEND_API_KEY, LEAD_TO_EMAIL, LEAD_BCC_EMAIL, LEAD_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !LEAD_FROM_EMAIL) {
    console.error('[lead] Envoi non configuré - lead reçu mais non transmis:', {
      ...lead,
      files: attachments.length,
      description: `${lead.description.slice(0, 120)}…`,
    });
    return res.status(503).json({
      // L'état de notre configuration ne regarde pas le visiteur : il a
      // besoin d'un autre chemin, pas d'un diagnostic.
      error: "L'envoi automatique est momentanément indisponible. Appelez-nous ou écrivez sur WhatsApp : votre demande sera traitée de la même façon.",
    });
  }

  /* ⚠️ PROVISOIRE (tests) : destination de repli tant que LEAD_TO_EMAIL n'est
     pas défini dans Vercel. */
  const destination = LEAD_TO_EMAIL || TEST_DESTINATION;
  const where = [
    `Province : ${lead.province || 'non précisée'}`,
    `Code postal : ${lead.postalCode}`,
    lead.commune ? `Commune : ${lead.commune}` : '',
    '',
  ]
    .filter(Boolean)
    .join('\n');

  // 1. Notification interne - si elle échoue, le lead est considéré comme non
  //    reçu : c'est le seul envoi dont dépend la suite. Pièces jointes incluses.
  try {
    await sendEmail({
      apiKey: RESEND_API_KEY,
      from: LEAD_FROM_EMAIL,
      to: destination,
      bcc: LEAD_BCC_EMAIL,
      replyTo: lead.email,
      subject: `Demande de devis - ${lead.projectType} - ${lead.postalCode}${lead.province ? `, ${lead.province.split(' ')[0]}` : ''}`,
      text: [
        `Type de projet : ${lead.projectType}`,
        `Type de bien : ${lead.propertyType || 'non précisé'}`,
        `Surface approximative : ${lead.surface || 'non précisée'}`,
        `Échéance souhaitée : ${lead.timeline || 'non précisée'}`,
        `Budget prévisionnel : ${lead.budget || 'non précisé'}`,
        `Situation : ${lead.ownerStatus || 'non précisée'}`,
        `Le logement sera occupé pendant les travaux : ${lead.occupied ? `oui - ${lead.occupied}` : 'non précisé'}`,
        '',
        'Lieu du chantier :',
        where,
        'Description :',
        lead.description,
        '',
        `Pièces jointes : ${attachments.length ? `${attachments.length} fichier(s) joints` : 'aucune'}`,
        '',
        `Nom : ${lead.name}`,
        `Téléphone : ${lead.phone}`,
        `E-mail : ${lead.email}`,
        '',
        `Consentement RGPD : ${lead.consent ? 'oui' : 'non'}`,
        `Reçu le : ${new Date().toISOString()}`,
      ].join('\n'),
      attachments,
    });
  } catch (err) {
    console.error('[lead] Notification interne impossible', err.message);
    return res.status(502).json({
      error: "L'envoi a échoué. Réessayez, ou appelez-nous si cela se reproduit.",
    });
  }

  // 2. Confirmation automatique au visiteur - best-effort : le lead est déjà
  //    chez nous, un échec ici ne doit pas faire échouer la demande.
  try {
    const recap = [
      `· Type de travaux : ${lead.projectType}`,
      `· Type de bien : ${lead.propertyType || 'non précisé'}`,
      `· Surface approximative : ${lead.surface || 'non précisée'}`,
      `· Échéance : ${lead.timeline || 'non précisée'}`,
      `· Budget prévisionnel : ${lead.budget || 'non précisé'}`,
      `· Lieu : ${lead.postalCode}${lead.province ? `, ${lead.province}` : ''}`,
    ];
    if (lead.occupied) recap.push(`· Logement occupé pendant les travaux : ${lead.occupied}`);
    if (attachments.length) recap.push(`· ${attachments.length} fichier(s) joint${attachments.length > 1 ? 's' : ''} à la demande`);

    const lines = [
      `Bonjour ${lead.firstName || 'et merci pour votre message'},`,
      '',
      `Nous venons de recevoir votre demande de devis (${lead.projectType}${lead.postalCode ? ` à ${lead.postalCode}` : ''}). Un artisan vous recontacte sous 48 h ouvrées.`,
      '',
      'Récapitulatif de votre demande :',
      ...recap,
      '',
      'La suite, en trois temps :',
      '1. Nous analysons votre demande (photos et plan compris) et organisons une visite sur place, gratuite et sans engagement.',
      '2. Vous recevez un devis détaillé, poste par poste.',
      '3. Nous planifions le chantier ensemble, dates à l’appui.',
      '',
      'Besoin de nous joindre avant ? Appelez le +32 477 27 31 18 ou écrivez-nous sur WhatsApp.',
      '',
      'À bientôt,',
      'L’équipe Chaudrel',
    ];

    await sendEmail({
      apiKey: RESEND_API_KEY,
      from: LEAD_FROM_EMAIL,
      to: lead.email,
      subject: 'Chaudrel - votre demande de devis est bien reçue',
      text: lines.join('\n'),
    });
  } catch (err) {
    // La demande est déjà chez nous : on ne renvoie pas d'erreur au visiteur
    // pour une confirmation qui n'a pas pu partir.
    console.error('[lead] Confirmation visiteur impossible', err.message);
  }

  return res.status(200).json({ ok: true });
}

function safeParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}