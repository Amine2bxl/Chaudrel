/**
 * Tests de bout en bout - le site construit (`dist/`), dans un vrai navigateur.
 *   npm test        (construit puis lance tout)
 */
import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { BASE, DESKTOP, PHONE, filmReady, launch, open, overflowsX, scrollFilm, startServer, stopServer } from './helpers.mjs';

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

const ROUTES = [...readFileSync('dist/sitemap.xml', 'utf8').matchAll(/<loc>https:\/\/chaudrel\.be([^<]*)<\/loc>/g)].map((m) => m[1] || '/');

describe('prérendu et SEO', () => {
  it('le sitemap liste les pages indexables', () => {
    assert.ok(ROUTES.length >= 15, `seulement ${ROUTES.length} routes`);
    assert.ok(ROUTES.includes('/'));
  });

  it("l'accueil est lisible sans JavaScript", () => {
    const html = readFileSync('dist/index.html', 'utf8');
    assert.match(html, /<h1[^>]*>Du premier plan à la dernière clé\.<\/h1>/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, 'un seul H1');
    assert.match(html, /Un chantier se lit couche par couche\./, 'chapitres dans le HTML');
    assert.match(html, /<link rel="canonical" href="https:\/\/chaudrel\.be\/"/);
    assert.match(html, /application\/ld\+json/);
    assert.match(html, /href="\/devis"/);
    assert.doesNotMatch(html, /<canvas[^>]*>[^<]/, 'le canvas ne porte aucun contenu');
  });

  for (const route of ROUTES) {
    it(`${route} : 200, un H1, titre, canonical, aucune erreur`, async () => {
      const { ctx, page, errors } = await open(browser, route);
      const res = await page.request.get(BASE + route);
      assert.equal(res.status(), 200);
      const html = await res.text();
      assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, 'un seul H1 dans le HTML prérendu');
      assert.match(html, /<link rel="canonical" href="https:\/\/chaudrel\.be/);
      assert.ok((await page.title()).length > 10);
      await page.waitForSelector('h1');
      assert.equal(await page.locator('h1').count(), 1);
      await page.waitForTimeout(300);
      assert.deepEqual(errors, []);
      assert.equal(await overflowsX(page), false, 'pas de débordement horizontal (bureau)');
      await ctx.close();
    });
  }

  it('aucune page ne déborde horizontalement sur mobile', async () => {
    const { ctx, page } = await open(browser, null, { viewport: PHONE, isMobile: true, hasTouch: true });
    for (const route of ROUTES) {
      await page.goto(BASE + route, { waitUntil: 'load' });
      assert.equal(await overflowsX(page), false, `débordement sur ${route}`);
    }
    await ctx.close();
  });

  it('une adresse inconnue affiche la page 404 du site', async () => {
    const { ctx, page } = await open(browser, '/cette-page-nexiste-pas');
    await page.waitForSelector('h1');
    assert.match(await page.locator('h1').innerText(), /n’existe pas/);
    await ctx.close();
  });
});

describe('film 3D au défilement', () => {
  it('ne charge le moteur 3D qu’au premier geste du visiteur', async () => {
    const { ctx, page, requests } = await open(browser, '/');
    await page.waitForSelector('.xp.xp-live');
    await page.waitForTimeout(2500);
    assert.ok(!requests.some((u) => /engine-/.test(u)), 'three.js ne part pas pendant le chargement');
    assert.ok(await page.locator('.xp-poster img').isVisible(), 'l’image de la maquette tient l’écran');
    await page.mouse.move(300, 300);
    await page.waitForFunction(() => window.__chaudrelXP, null, { timeout: 60000 });
    assert.ok(requests.some((u) => /engine-/.test(u)));
    await ctx.close();
  });

  it('se lance, suit le défilement et revient exactement à son état initial', async () => {
    const { ctx, page, errors } = await open(browser, '/');
    await filmReady(page);
    assert.equal(await page.locator('.xp.xp-live.xp-ready').count(), 1);
    assert.ok((await page.evaluate(() => window.__chaudrelXP.info().triangles)) > 1000, 'la maquette est dessinée');

    const start = await page.evaluate(() => window.__chaudrelXP.state());
    assert.equal(start.explode, 0);
    assert.ok(await page.locator('.xp-hero').isVisible());

    await scrollFilm(page, 0.53);
    const mid = await page.evaluate(() => window.__chaudrelXP.state());
    assert.ok(mid.explode > 0.95, `vue éclatée attendue, explode=${mid.explode}`);
    assert.ok(await page.locator('[data-chapter="couches"]').isVisible());
    assert.ok(!(await page.locator('.xp-hero').isVisible()), 'la composition d’ouverture s’efface');
    assert.ok(await page.locator('.xp-note a').first().isVisible(), 'annotations visibles');

    await scrollFilm(page, 1);
    const end = await page.evaluate(() => window.__chaudrelXP.state());
    assert.ok(end.dusk > 0.99 && end.wipe > 0.99 && end.explode < 0.01);
    assert.equal(await page.locator('.xp.xp-night').count(), 1);

    await scrollFilm(page, 0);
    const back = await page.evaluate(() => window.__chaudrelXP.state());
    for (const k of Object.keys(start)) assert.ok(Math.abs(back[k] - start[k]) < 1e-3, `${k} ne revient pas : ${back[k]} ≠ ${start[k]}`);
    assert.ok(await page.locator('.xp-hero').isVisible());
    assert.deepEqual(errors, []);
    await ctx.close();
  });

  it('se recompose quand la fenêtre passe en portrait, puis revient', async () => {
    const { ctx, page, errors } = await open(browser, '/');
    await filmReady(page);
    const wide = await page.evaluate(() => window.__chaudrelXP.state().dist);
    await page.setViewportSize(PHONE);
    await page.waitForFunction((d) => window.__chaudrelXP.state().dist > d + 20, wide, { timeout: 10000 });
    assert.equal(await overflowsX(page), false);
    await page.setViewportSize(DESKTOP);
    await page.waitForFunction((d) => Math.abs(window.__chaudrelXP.state().dist - d) < 0.01, wide, { timeout: 10000 });
    assert.deepEqual(errors, []);
    await ctx.close();
  });

  it("ne bloque pas la page : on atteint la suite et on revient en arrière d'une route", async () => {
    const { ctx, page } = await open(browser, '/');
    await filmReady(page);
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await page.waitForTimeout(400);
    assert.ok(await page.getByRole('heading', { name: 'Un projet en tête ?' }).isVisible());
    await page.goto(BASE + '/services');
    await page.goBack({ waitUntil: 'load' });
    await page.waitForSelector('.xp.xp-live');
    await filmReady(page);
    assert.equal(await page.locator('.xp.xp-live').count(), 1);
    await ctx.close();
  });

  it('mouvement réduit : version statique, aucun module 3D chargé', async () => {
    const { ctx, page, requests, errors } = await open(browser, '/', { reducedMotion: 'reduce' });
    await page.waitForSelector('h1');
    await page.waitForTimeout(2500);
    assert.equal(await page.locator('.xp-live').count(), 0);
    assert.ok(await page.locator('.xp-poster img').isVisible());
    assert.ok(await page.locator('[data-chapter="couches"]').isVisible(), 'chapitres en lecture normale');
    assert.ok(!requests.some((u) => /engine-|ScrollTrigger-/.test(u)), 'ni three ni GSAP téléchargés');
    assert.deepEqual(errors, []);
    await ctx.close();
  });

  it('WebGL refusé : le récit continue sur l’image, sans cadre vide ni erreur', async () => {
    const { ctx, page, errors } = await open(browser, null);
    await page.addInitScript(() => {
      const get = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
        return /webgl/.test(type) ? null : get.call(this, type, ...rest);
      };
    });
    await page.goto(BASE + '/', { waitUntil: 'load' });
    await page.waitForSelector('.xp.xp-live');
    await page.mouse.move(300, 300);
    await page.waitForTimeout(2500);
    assert.equal(await page.locator('.xp-ready').count(), 0, 'le canvas ne remplace pas l’image');
    assert.ok(await page.locator('.xp-poster img').isVisible());
    assert.ok(await page.locator('.xp-h1').isVisible());
    await page.evaluate(() => {
      const el = document.querySelector('.xp');
      window.scrollTo({ top: el.offsetTop + 0.53 * (el.offsetHeight - window.innerHeight), behavior: 'instant' });
    });
    await page.locator('[data-chapter="couches"]').waitFor({ state: 'visible', timeout: 10000 });
    assert.deepEqual(errors.filter((e) => !/WebGL|webgl/.test(e)), []);
    await ctx.close();
  });

  it('mobile : la scène vit, la promesse et le devis sont à l’écran', async () => {
    const { ctx, page, errors } = await open(browser, '/', { viewport: PHONE, isMobile: true, hasTouch: true });
    await filmReady(page);
    const box = await page.locator('.xp-hero a[href="/devis"]').boundingBox();
    assert.ok(box && box.y + box.height <= PHONE.height, 'le bouton devis tient dans le premier écran');
    assert.ok(box.height >= 44, 'cible tactile suffisante');
    await scrollFilm(page, 0.53);
    for (const el of await page.locator('.xp-note a').all()) {
      const b = await el.boundingBox();
      assert.ok(b.x >= 0 && b.x + b.width <= PHONE.width, 'annotation dans le cadre');
    }
    assert.deepEqual(errors, []);
    await ctx.close();
  });
});

describe('navigation', () => {
  it('menu mobile : ouvre, mène à une page, se referme', async () => {
    const { ctx, page } = await open(browser, '/services', { viewport: PHONE, isMobile: true, hasTouch: true });
    await page.getByRole('button', { name: 'Ouvrir le menu' }).click();
    await page.getByRole('navigation', { name: 'Navigation mobile' }).getByRole('link', { name: 'Réalisations' }).click();
    await page.waitForURL('**/realisations');
    assert.equal(await page.getByRole('navigation', { name: 'Navigation mobile' }).count(), 0);
    await ctx.close();
  });

  it('la fenêtre de contact s’ouvre depuis la barre et se ferme au clavier', async () => {
    const { ctx, page } = await open(browser, '/services');
    await page.getByRole('button', { name: 'Nous joindre' }).first().click();
    const dialog = page.getByRole('dialog');
    await dialog.waitFor();
    assert.ok(await dialog.locator('a[href^="tel:"]').first().isVisible());
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'detached' });
    await ctx.close();
  });

  it('les métiers de l’accueil mènent à leur page', async () => {
    const { ctx, page } = await open(browser, '/', { reducedMotion: 'reduce' });
    await page.locator('section ol a[href="/services/toiture"]').first().click();
    await page.waitForURL('**/services/toiture');
    assert.match(await page.locator('h1').innerText(), /Toiture/);
    await ctx.close();
  });

  it('comparateur avant / après : pilotable au clavier', async () => {
    const { ctx, page } = await open(browser, '/realisations/cuisine-ixelles');
    const range = page.locator('.ba-range');
    await range.scrollIntoViewIfNeeded();
    await range.focus();
    const read = () => page.locator('.ba').evaluate((el) => el.style.getPropertyValue('--ba'));
    assert.equal(await read(), '50%');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    assert.equal(await read(), '52%');
    await page.keyboard.press('Home');
    assert.equal(await read(), '0%');
    await ctx.close();
  });
});
