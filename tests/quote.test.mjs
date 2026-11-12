/**
 * Parcours de devis (navigateur, API simulée) et endpoint `api/lead.js` (appel direct).
 * Aucun e-mail réel n'est envoyé : Resend est remplacé par un double.
 */
import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { launch, open, startServer, stopServer } from './helpers.mjs';

let server;
let browser;
before(async () => {
  server = await startServer();
  browser = await launch();
});
after(async () => {
  await browser?.close();
  if (server) stopServer(server);
});

const next = (page) => page.getByRole('button', { name: 'Continuer' }).click();
const pick = (page, text) => page.locator('label', { hasText: text }).first().click();
const stepLabel = (page) => page.locator('span.t-label', { hasText: /^0\d - / }).innerText();

async function fillToLastStep(page) {
  await pick(page, 'Toiture');
  await pick(page, 'Maison');
  await pick(page, '50 à 100 m²');
  await next(page);
  await page.fill('#description', 'Toiture plate à refaire, infiltrations côté jardin.');
  await pick(page, 'Partiellement');
  await next(page);
  await page.selectOption('#province', { index: 1 });
  await page.fill('#postalCode', '1030');
  await next(page);
  await pick(page, 'Dans le mois');
  await pick(page, '10 000 à 30 000 €');
  await pick(page, 'Je suis propriétaire');
  await next(page);
  await page.fill('#firstName', 'Test');
  await page.fill('#lastName', 'Automatique');
  await page.fill('#phone', '0477 00 00 00');
  await page.fill('#email', 'test@example.com');
}

describe('formulaire de devis', () => {
  it('valide chaque étape, permet le retour et garde le brouillon après rechargement', async () => {
    const { ctx, page, errors } = await open(browser, '/devis');
    assert.match(await stepLabel(page), /^01/);

    await next(page);
    assert.match(await stepLabel(page), /^01/, 'on ne passe pas sans réponse');
    assert.ok((await page.getByRole('alert').count()) >= 3, 'trois erreurs annoncées');

    await pick(page, 'Toiture');
    await pick(page, 'Maison');
    await pick(page, '50 à 100 m²');
    await next(page);
    assert.match(await stepLabel(page), /^02/);

    await page.fill('#description', 'court');
    await next(page);
    assert.match(await stepLabel(page), /^02/, 'description trop courte refusée');
    await page.fill('#description', 'Toiture plate à refaire, infiltrations côté jardin.');
    await pick(page, 'Partiellement');
    await next(page);
    assert.match(await stepLabel(page), /^03/);

    await page.fill('#postalCode', '10');
    await next(page);
    assert.match(await stepLabel(page), /^03/, 'code postal invalide refusé');

    await page.getByRole('button', { name: 'Retour' }).click();
    assert.match(await stepLabel(page), /^02/);
    assert.equal(await page.inputValue('#description'), 'Toiture plate à refaire, infiltrations côté jardin.');

    await page.waitForTimeout(600);
    await page.reload();
    await page.waitForSelector('#description');
    assert.match(await stepLabel(page), /^02/, 'étape conservée après F5');
    assert.equal(await page.inputValue('#description'), 'Toiture plate à refaire, infiltrations côté jardin.');
    assert.deepEqual(errors, []);
    await ctx.close();
  });

  it('exige le consentement, envoie la demande complète et confirme', async () => {
    const { ctx, page } = await open(browser, '/devis');
    let sent = null;
    await page.route('**/api/lead', async (route) => {
      sent = route.request().postDataJSON();
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
    });
    await fillToLastStep(page);

    await page.getByRole('button', { name: 'Envoyer ma demande' }).click();
    assert.equal(sent, null, 'rien ne part sans consentement');
    await page.locator('input[type="checkbox"]').check();
    await page.getByRole('button', { name: 'Envoyer ma demande' }).click();
    await page.getByRole('link', { name: 'Voir les réalisations' }).waitFor();

    assert.equal(sent.projectType, 'Toiture');
    assert.equal(sent.postalCode, '1030');
    assert.equal(sent.email, 'test@example.com');
    assert.equal(sent.consent, true);
    assert.equal(sent.company, '', 'pot de miel vide');
    assert.equal(await page.evaluate(() => Object.keys(localStorage).filter((k) => /devis|quote|draft/i.test(k)).length), 0, 'brouillon effacé après envoi');
    await ctx.close();
  });

  it('envoi indisponible : le visiteur garde sa saisie et reçoit e-mail, WhatsApp et téléphone', async () => {
    const { ctx, page } = await open(browser, '/devis');
    await page.route('**/api/lead', (route) =>
      route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ code: 'email_unconfigured', error: 'indisponible' }) })
    );
    await fillToLastStep(page);
    await page.locator('input[type="checkbox"]').check();
    await page.getByRole('button', { name: 'Envoyer ma demande' }).click();

    const alert = page.getByRole('alert').filter({ hasText: 'n’a pas pu être envoyée' });
    await alert.waitFor();
    const mailto = await alert.getByRole('link', { name: 'Envoyer par e-mail' }).getAttribute('href');
    assert.match(mailto, /^mailto:Info@chaudrel\.be\?/i, 'repli vers la boîte de l’entreprise');
    assert.match(decodeURIComponent(mailto), /Toiture/);
    assert.match(await alert.getByRole('link', { name: 'WhatsApp' }).getAttribute('href'), /^https:\/\/wa\.me\//);
    assert.ok(await alert.locator('a[href^="tel:"]').count());
    assert.equal(await page.inputValue('#email'), 'test@example.com', 'la saisie reste en place');
    await ctx.close();
  });
});

/* ---------- Endpoint ---------- */

const VALID = {
  projectType: 'Toiture',
  description: 'Toiture plate à refaire, infiltrations côté jardin.',
  firstName: 'Test',
  lastName: 'Automatique',
  phone: '0477 00 00 00',
  email: 'test@example.com',
  postalCode: '1030',
  consent: true,
};

let ipCounter = 0;
async function call(body, { method = 'POST', env = {} } = {}) {
  const keys = ['RESEND_API_KEY', 'LEAD_TO_EMAIL', 'LEAD_FROM_EMAIL', 'LEAD_BCC_EMAIL'];
  const saved = Object.fromEntries(keys.map((k) => [k, process.env[k]]));
  keys.forEach((k) => delete process.env[k]);
  Object.assign(process.env, env);

  const mails = [];
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    mails.push({ url: String(url), body: JSON.parse(init.body) });
    return new Response('{"id":"test"}', { status: 200 });
  };
  const realError = console.error;
  console.error = () => {};

  const res = { statusCode: 200, headers: {}, body: null };
  res.setHeader = (k, v) => (res.headers[k] = v);
  res.status = (c) => ((res.statusCode = c), res);
  res.json = (b) => ((res.body = b), res);

  try {
    const { default: handler } = await import('../api/lead.js');
    await handler({ method, headers: { 'x-forwarded-for': `10.0.0.${++ipCounter}` }, body }, res);
  } finally {
    globalThis.fetch = realFetch;
    console.error = realError;
    keys.forEach((k) => (saved[k] === undefined ? delete process.env[k] : (process.env[k] = saved[k])));
  }
  return { res, mails };
}

const FULL_ENV = { RESEND_API_KEY: 're_test', LEAD_FROM_EMAIL: 'site@example.com', LEAD_TO_EMAIL: 'equipe@example.com' };

describe('api/lead', () => {
  it('refuse les autres méthodes', async () => {
    const { res } = await call({}, { method: 'GET' });
    assert.equal(res.statusCode, 405);
  });

  it('refuse une demande incomplète sans rien envoyer', async () => {
    const { res, mails } = await call({ ...VALID, email: 'pas-une-adresse', consent: false }, { env: FULL_ENV });
    assert.equal(res.statusCode, 400);
    assert.match(res.body.error, /e-mail/);
    assert.match(res.body.error, /consentement/);
    assert.equal(mails.length, 0);
  });

  it('pot de miel rempli : 200 muet, aucun envoi', async () => {
    const { res, mails } = await call({ ...VALID, company: 'Bot SARL' }, { env: FULL_ENV });
    assert.equal(res.statusCode, 200);
    assert.equal(mails.length, 0);
  });

  it('sans destinataire configuré : 503 explicite, jamais de boîte de repli silencieuse', async () => {
    const { res, mails } = await call(VALID, { env: { RESEND_API_KEY: 're_test', LEAD_FROM_EMAIL: 'site@example.com' } });
    assert.equal(res.statusCode, 503);
    assert.equal(res.body.code, 'email_unconfigured');
    assert.equal(mails.length, 0, 'aucun e-mail ne part vers une adresse par défaut');
  });

  it('configuré : notifie l’équipe à l’adresse configurée, puis confirme au visiteur', async () => {
    const { res, mails } = await call(VALID, { env: FULL_ENV });
    assert.equal(res.statusCode, 200);
    assert.ok(mails.length >= 1);
    assert.equal(mails[0].url, 'https://api.resend.com/emails');
    assert.deepEqual(mails[0].body.to, ['equipe@example.com']);
    assert.equal(mails[0].body.reply_to, 'test@example.com');
    if (mails[1]) assert.deepEqual(mails[1].body.to, ['test@example.com']);
  });

  it('refuse une pièce jointe d’un type non autorisé', async () => {
    const { res, mails } = await call(
      { ...VALID, files: [{ name: 'script.exe', type: 'application/x-msdownload', data: 'AAAA' }] },
      { env: FULL_ENV }
    );
    assert.equal(res.statusCode, 400);
    assert.equal(mails.length, 0);
  });
});
