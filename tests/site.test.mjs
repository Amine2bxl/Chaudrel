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
    assert.match(html, /<h1[^>]*>Du premier plan à la <em>dernière clé\.<\/em><\/h1>/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, 'un seul H1');
    assert.match(html, /Un chantier se lit <em>couche par couche\.<\/em>/, 'chapitres dans le HTML');
    for (const verb of ['Imaginer', 'Concevoir', 'Préparer', 'Rénover', 'Transformer', 'Révéler']) assert.ok(html.includes(verb), `le fil de l'histoire : ${verb}`);
    assert.match(html, /<link rel="canonical" href="https:\/\/chaudrel\.be\/"/);
    assert.match(html, /application\/ld\+json/);
    assert.match(html, /href="\/devis"/);
    assert.doesNotMatch(html, /<canvas[^>]*>[^<]/, 'le canvas ne porte aucun contenu');
  });

  for (const route of ROUTES) {
    it(`${route} : 200, un H1, titre, canonical, aucune erreur`, async () => {
      /* Le HTML prérendu de la route, lu tel qu'il sera servi : `vite preview`
         renvoie l'accueil pour une route sans slash final (repli SPA), ce qui
         ferait passer ces contrôles à vide. Vercel (`cleanUrls`) sert ce fichier. */
      const html = readFileSync(route === '/' ? 'dist/index.html' : `dist${route}/index.html`, 'utf8');
      assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, 'un seul H1 dans le HTML prérendu');
      assert.ok(html.includes(`<link rel="canonical" href="https://chaudrel.be${route}"`), 'canonical de la route');
      assert.match(html, /<title>[^<]{10,}<\/title>/);
      // Les mentions légales n'ont pas de données structurées - les autres pages, si.
      if (!route.startsWith('/legal')) assert.match(html, /application\/ld\+json/);
      if (route !== '/') assert.doesNotMatch(html, /rel="preload" as="image"/, 'pas de préchargement d’image hors accueil');

      const { ctx, page, errors } = await open(browser, route === '/' ? '/' : `${route}/`);
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

    // Concevoir : les plans sont tracés, la caméra a quitté la maquette
    await scrollFilm(page, 0.24);
    const plans = await page.evaluate(() => window.__chaudrelXP.state());
    assert.ok(plans.draw > 0.99 && plans.tx < -20, 'la caméra est au-dessus des plans');
    assert.ok(await page.locator('[data-chapter="concevoir"]').isVisible());

    // Préparer : les échantillons, étiquetés
    await scrollFilm(page, 0.41);
    assert.ok((await page.evaluate(() => window.__chaudrelXP.state().tx)) > 20, 'la caméra est sur les échantillons');
    assert.ok(await page.locator('.xp-tag span').first().isVisible(), 'étiquettes de matières visibles');

    // Rénover : vue éclatée
    await scrollFilm(page, 0.6);
    const mid = await page.evaluate(() => window.__chaudrelXP.state());
    assert.ok(mid.explode > 0.95, `vue éclatée attendue, explode=${mid.explode}`);
    assert.ok(await page.locator('[data-chapter="renover"]').isVisible());
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
    assert.ok(await page.getByRole('heading', { name: 'Donnons vie à votre projet.' }).isVisible());
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
    assert.ok(await page.locator('[data-chapter="renover"]').isVisible(), 'chapitres en lecture normale');
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
      window.scrollTo({ top: el.offsetTop + 0.6 * (el.offsetHeight - window.innerHeight), behavior: 'instant' });
    });
    await page.locator('[data-chapter="renover"]').waitFor({ state: 'visible', timeout: 10000 });
    assert.deepEqual(errors.filter((e) => !/WebGL|webgl/.test(e)), []);
    await ctx.close();
  });

  it('mobile : la scène vit, la promesse et le devis sont à l’écran', async () => {
    const { ctx, page, errors } = await open(browser, '/', { viewport: PHONE, isMobile: true, hasTouch: true });
    await filmReady(page);
    const box = await page.locator('.xp-hero a[href="/devis"]').boundingBox();
    assert.ok(box && box.y + box.height <= PHONE.height, 'le bouton devis tient dans le premier écran');
    assert.ok(box.height >= 44, 'cible tactile suffisante');
    await scrollFilm(page, 0.6);
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
    await page.getByRole('button', { name: 'Contact' }).first().click();
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

  it('galerie des chantiers : clavier, compteur, et chaque titre mène à sa fiche', async () => {
    const { ctx, page, errors } = await open(browser, '/realisations');
    const track = page.locator('.gallery-track');
    await track.scrollIntoViewIfNeeded();
    const counter = page.locator('.gallery [aria-live="polite"]');
    assert.match(await counter.innerText(), /^01 \/ 06/);
    await track.focus();
    await page.keyboard.press('ArrowRight');
    await page.waitForFunction(() => /^02/.test(document.querySelector('.gallery [aria-live]').innerText), null, { timeout: 5000 });
    assert.equal(await page.locator('.gallery-slide[data-active]').count(), 1);
    // Les photos gardent leurs proportions d'origine : aucune n'est étirée
    const ratios = await page.locator('.gallery-frame img').evaluateAll((imgs) =>
      imgs.map((i) => [i.getAttribute('width') / i.getAttribute('height'), getComputedStyle(i).objectFit])
    );
    for (const [r, fit] of ratios) assert.ok(r > 0.5 && r < 2 && fit === 'cover');
    await page.locator('.gallery-slide[data-active] .gallery-title a').click();
    await page.waitForURL('**/realisations/*');
    assert.equal(await page.locator('h1').count(), 1);
    assert.deepEqual(errors, []);
    await ctx.close();
  });

  it('page services : six métiers, chacun avec son lien', async () => {
    const { ctx, page } = await open(browser, '/services');
    const links = await page.locator('main h2 a[href^="/services/"]').evaluateAll((a) => a.map((x) => x.getAttribute('href')));
    assert.equal(links.length, 6);
    assert.equal(new Set(links).size, 6);
    await ctx.close();
  });

  it('une même identité partout : fil de l’histoire, mot-symbole, barre qui se resserre', async () => {
    const { ctx, page } = await open(browser, '/services/toiture');
    // Le cartouche de l'en-tête et le pied de page portent le même temps du récit
    assert.match(await page.locator('main header').first().innerText(), /04\s*Rénover/i);
    assert.equal(await page.locator('footer [aria-current="step"]').innerText().then((t) => t.replace(/\s+/g, ' ').trim().toLowerCase()), '04 rénover');
    assert.equal(await page.locator('.footer-wordmark').count(), 1);
    // Mêmes polices sur toutes les pages
    const fonts = async () => page.evaluate(() => [getComputedStyle(document.querySelector('h1')).fontFamily, getComputedStyle(document.body).fontFamily]);
    const a = await fonts();
    const bar = page.locator('header.fixed > div').first();
    const wide = (await bar.boundingBox()).width;
    await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'instant' }));
    await page.waitForTimeout(800);
    assert.ok((await bar.boundingBox()).width < wide, 'la barre se resserre au défilement');
    await page.goto(BASE + '/devis');
    assert.deepEqual(await fonts(), a);
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
