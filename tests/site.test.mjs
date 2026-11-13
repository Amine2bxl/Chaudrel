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
    assert.match(html, /Ici, le chantier <em>commence\.<\/em>/, 'chapitres dans le HTML');
    assert.match(html, /href="\/visite"/, 'lien vers la visite');
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

describe('film d’entrée au défilement', () => {
  it('ne charge le monde 3D qu’au premier geste du visiteur', async () => {
    const { ctx, page, requests } = await open(browser, '/');
    await page.waitForSelector('.xp.xp-live');
    await page.waitForTimeout(2500);
    assert.ok(!requests.some((u) => /world-/.test(u)), 'three.js ne part pas pendant le chargement');
    assert.ok(await page.locator('.xp-poster img').isVisible(), 'l’image d’ouverture tient l’écran');
    await page.mouse.move(300, 300);
    await page.waitForFunction(() => window.__chaudrelXP, null, { timeout: 300000 });
    assert.ok(requests.some((u) => /world-/.test(u)));
    await ctx.close();
  });

  it('on entre dans la maison, le séjour se transforme, et tout revient en remontant', async () => {
    const { ctx, page, errors } = await open(browser, '/');
    await filmReady(page);
    assert.equal(await page.locator('.xp.xp-live.xp-ready').count(), 1);
    const start = await page.evaluate(() => window.__chaudrelXP.state());
    assert.ok(start.z < -10, 'on commence dans l’allée, devant la maison');
    assert.ok(await page.locator('.xp-hero').isVisible());

    await scrollFilm(page, 0.4);
    const hall = await page.evaluate(() => window.__chaudrelXP.state());
    assert.ok(hall.z > 1 && hall.z < 5.5 && hall.y < 2, 'la caméra est entrée, à hauteur d’œil');
    assert.ok(await page.locator('[data-chapter="concevoir"]').isVisible());
    assert.ok(!(await page.locator('.xp-hero').isVisible()), 'la promesse s’efface');

    await scrollFilm(page, 0.56);
    assert.equal(await page.evaluate(() => window.__chaudrelXP.state().living), 0, 'le séjour est en chantier');
    await scrollFilm(page, 0.72);
    const mid = await page.evaluate(() => window.__chaudrelXP.state().living);
    assert.ok(mid > 0.2 && mid < 0.8, `transformation en cours (${mid})`);
    await scrollFilm(page, 1);
    assert.equal(await page.evaluate(() => window.__chaudrelXP.state().living), 1);
    assert.ok(await page.getByRole('link', { name: 'Visiter la maison' }).isVisible());

    await scrollFilm(page, 0);
    const back = await page.evaluate(() => window.__chaudrelXP.state());
    for (const k of ['x', 'z', 'yaw', 'pitch']) assert.ok(Math.abs(back[k] - start[k]) < 1e-3, `${k} ne revient pas`);
    assert.equal(back.living, 0, 'le séjour redevient chantier');
    assert.ok(await page.locator('.xp-hero').isVisible());
    assert.deepEqual(errors, []);
    await ctx.close();
  });

  it('mouvement réduit : version statique, aucun module 3D chargé', async () => {
    const { ctx, page, requests, errors } = await open(browser, '/', { reducedMotion: 'reduce' });
    await page.waitForSelector('h1');
    await page.waitForTimeout(2500);
    assert.equal(await page.locator('.xp-live').count(), 0);
    assert.ok(await page.locator('.xp-poster img').isVisible());
    assert.ok(await page.locator('[data-chapter="renover"]').isVisible(), 'chapitres en lecture normale');
    assert.ok(!requests.some((u) => /world-|ScrollTrigger-/.test(u)), 'ni three ni GSAP téléchargés');
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
    await page.evaluate(() => {
      const el = document.querySelector('.xp');
      window.scrollTo({ top: el.offsetTop + 0.68 * (el.offsetHeight - window.innerHeight), behavior: 'instant' });
    });
    await page.locator('[data-chapter="renover"]').waitFor({ state: 'visible', timeout: 10000 });
    assert.deepEqual(errors.filter((e) => !/WebGL|webgl/.test(e)), []);
    await ctx.close();
  });

  it('mobile : la promesse et le devis tiennent dans le premier écran', async () => {
    const { ctx, page, errors } = await open(browser, '/', { viewport: PHONE, isMobile: true, hasTouch: true });
    await page.waitForSelector('.xp.xp-live');
    const box = await page.locator('.xp-hero a[href="/devis"]').boundingBox();
    assert.ok(box && box.y + box.height <= PHONE.height, 'le bouton devis tient dans le premier écran');
    assert.ok(box.height >= 44, 'cible tactile suffisante');
    assert.deepEqual(errors, []);
    await ctx.close();
  });
});

describe('visite 3D', () => {
  it('prérendue : titre, pièces et mention « maison d’étude » sans JavaScript', () => {
    const html = readFileSync('dist/visite/index.html', 'utf8');
    assert.match(html, /<h1[^>]*>Entrez\. <em>Tout est à visiter\.<\/em><\/h1>/);
    for (const room of ['Entrée', 'Cuisine', 'Séjour', 'Suite parentale', 'Salle de bain']) assert.ok(html.includes(room), room);
    assert.match(html, /pas un chantier Chaudrel/);
  });

  it('on entre, on regarde, on révèle une pièce, on change de pièce et de finition', async () => {
    const { ctx, page, errors } = await open(browser, '/visite');
    await page.waitForSelector('.visit-ready', { timeout: 300000 });
    await page.getByRole('button', { name: 'Explorer librement' }).click();
    const W = () => window.__chaudrelWorld;
    await page.waitForFunction(() => window.__chaudrelWorld.current === 'hall' && !window.__chaudrelWorld.moving, null, { timeout: 120000 });
    assert.ok((await page.evaluate(() => window.__chaudrelWorld.view.y)) < 2, 'à hauteur d’œil');
    assert.equal(await page.evaluate(() => window.__chaudrelWorld.roomState('hall')), 0, 'l’entrée est en chantier');

    // regarder : glisser sur l'image
    const yaw0 = await page.evaluate(() => window.__chaudrelWorld.view.yaw);
    const r = await page.locator('.visit-stage').boundingBox();
    await page.mouse.move(r.x + r.width * 0.6, r.y + r.height * 0.4);
    await page.mouse.down();
    await page.mouse.move(r.x + r.width * 0.4, r.y + r.height * 0.4, { steps: 6 });
    await page.mouse.up();
    assert.notEqual(await page.evaluate(() => window.__chaudrelWorld.view.yaw), yaw0, 'le regard tourne');
    assert.equal(await page.evaluate(() => window.__chaudrelWorld.current), 'hall', 'glisser ne déplace pas');

    // révéler : le bouton ne déplace pas la caméra
    await page.getByRole('button', { name: 'Révéler la rénovation' }).click();
    await page.waitForFunction(() => window.__chaudrelWorld.roomState('hall') === 1, null, { timeout: 120000 });
    assert.equal(await page.evaluate(() => window.__chaudrelWorld.current), 'hall');
    assert.ok(await page.getByRole('group', { name: 'Avant ou après travaux' }).isVisible());

    // changer de pièce par le bandeau : passage par les portes jusqu'à l'étage
    await page.locator('.visit-rail').getByRole('button', { name: 'Salle de bain' }).click();
    await page.waitForFunction(() => window.__chaudrelWorld.current === 'bain' && !window.__chaudrelWorld.moving, null, { timeout: 180000 });
    assert.ok((await page.evaluate(() => window.__chaudrelWorld.view.y)) > 4, 'on est monté à l’étage');
    assert.match(await page.locator('.visit-card-title').innerText(), /Pierre, lumière et eau/);

    // finition
    await page.getByRole('button', { name: 'Béton & laiton' }).click();
    await page.waitForFunction(() => window.__chaudrelWorld.style === 'beton-laiton', null, { timeout: 120000 });
    assert.deepEqual(errors, []);
    await ctx.close();
  });

  it('mouvement réduit : la page reste une description complète, sans 3D', async () => {
    const { ctx, page, requests } = await open(browser, '/visite', { reducedMotion: 'reduce' });
    await page.waitForSelector('h1');
    await page.waitForTimeout(2000);
    assert.equal(await page.locator('.visit-live').count(), 0);
    assert.ok(await page.getByRole('link', { name: 'Parcourir les pièces' }).isVisible());
    assert.ok(!requests.some((u) => /world-/.test(u)));
    assert.equal(await page.locator('.visit-rooms-list li').count(), 9);
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
