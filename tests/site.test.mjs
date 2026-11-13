/**
 * Tests de bout en bout - le site construit (`dist/`), dans un vrai navigateur.
 *   npm test        (construit puis lance tout)
 */
import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { BASE, PHONE, launch, open, overflowsX, startServer, stopServer } from './helpers.mjs';
import { PROJECTS, LEGACY_SLUGS } from '../src/data/projects.js';

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
const htmlOf = (route) => readFileSync(route === '/' ? 'dist/index.html' : `dist${route}/index.html`, 'utf8');

describe('prérendu et SEO', () => {
  it('le sitemap liste les pages indexables', () => {
    assert.ok(ROUTES.length >= 15, `seulement ${ROUTES.length} routes`);
    assert.ok(ROUTES.includes('/'));
    assert.ok(!ROUTES.includes('/visite'), 'plus de visite 3D');
  });

  it("l'accueil est lisible sans JavaScript", () => {
    const html = htmlOf('/');
    assert.match(html, /<h1[^>]*>Transformer un espace, <em>créer un lieu\.<\/em><\/h1>/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, 'un seul H1');
    // Les apparitions au défilement ne cachent rien sans JavaScript : la
    // classe `js` n'est posée que par le script en ligne.
    assert.match(html, /<script>document\.documentElement\.classList\.add\('js'\)<\/script>/);
    assert.doesNotMatch(html, /<html[^>]*class="[^"]*\bjs\b/);
    assert.match(html, /<link rel="canonical" href="https:\/\/chaudrel\.be\/"/);
    assert.match(html, /application\/ld\+json/);
    assert.match(html, /href="\/devis"/);
    for (const p of PROJECTS.filter((x) => x.featured)) assert.ok(html.includes(`/realisations/${p.slug}`), p.slug);
  });

  it('aucune 3D, aucune image de synthèse, aucune photo de banque', () => {
    const assets = readdirSync('dist/assets');
    assert.ok(!assets.some((f) => /three|world|webgl|gsap/i.test(f)), assets.join(', '));
    for (const route of ROUTES) {
      const html = htmlOf(route);
      assert.doesNotMatch(html, /<canvas/, `canvas sur ${route}`);
      assert.doesNotMatch(html, /\/photos\/hero\.webp|unsplash|pexels/i, `image de banque sur ${route}`);
    }
  });

  it('la CSP autorise le script en ligne par son empreinte, rien d’autre', () => {
    const csp = JSON.parse(readFileSync('vercel.json', 'utf8'))
      .headers.flatMap((h) => h.headers)
      .find((h) => h.key === 'Content-Security-Policy').value;
    assert.match(csp, /script-src 'self' 'sha256-[A-Za-z0-9+/=]+';/);
    assert.doesNotMatch(csp, /script-src[^;]*'unsafe-inline'/);
  });

  for (const route of ROUTES) {
    it(`${route} : un H1, titre, canonical, aucune erreur`, async () => {
      /* Le HTML prérendu de la route, lu tel qu'il sera servi : `vite preview`
         renvoie l'accueil pour une route sans slash final (repli SPA). */
      const html = htmlOf(route);
      assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, 'un seul H1 dans le HTML prérendu');
      assert.ok(html.includes(`<link rel="canonical" href="https://chaudrel.be${route}"`), 'canonical de la route');
      assert.match(html, /<title>[^<]{10,}<\/title>/);
      if (!route.startsWith('/legal')) assert.match(html, /application\/ld\+json/);
      if (route !== '/') assert.doesNotMatch(html, /rel="preload" as="image"/, 'pas de préchargement d’image hors accueil');

      const { ctx, page, errors } = await open(browser, route === '/' ? '/' : `${route}/`);
      assert.ok((await page.title()).length > 10);
      await page.waitForSelector('h1');
      assert.equal(await page.locator('h1').count(), 1);
      await page.waitForTimeout(300);
      // Aucune erreur - y compris d'hydratation : le HTML prérendu est repris tel quel.
      assert.deepEqual(errors, []);
      assert.equal(await overflowsX(page), false, 'pas de débordement horizontal (bureau)');
      // Aucune image cassée
      const broken = await page.evaluate(async () => {
        const imgs = [...document.images];
        await Promise.all(imgs.map((i) => (i.loading === 'lazy' ? null : i.decode().catch(() => null))));
        return imgs.filter((i) => i.complete && i.loading !== 'lazy' && i.naturalWidth === 0).map((i) => i.src);
      });
      assert.deepEqual(broken, []);
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

describe('réalisations : des photos réelles, décrites fidèlement', () => {
  it('chaque photo existe sur le disque et porte une description', () => {
    for (const p of PROJECTS) {
      for (const im of [p.cover, ...p.images]) {
        assert.ok(existsSync(`public${im.src}`), im.src);
        assert.ok(im.alt && im.alt.length >= 15, `alt trop court : ${im.src}`);
        assert.ok(im.w > 0 && im.h > 0);
      }
      // Rien d'affiché qui n'ait été confirmé
      assert.equal(p.location, null, `${p.slug} : lieu non confirmé`);
      assert.equal(p.year, null, `${p.slug} : année non confirmée`);
    }
  });

  it('les anciennes adresses mènent au bon dossier (301 + routeur)', async () => {
    const redirects = JSON.parse(readFileSync('vercel.json', 'utf8')).redirects;
    for (const [from, to] of Object.entries(LEGACY_SLUGS)) {
      assert.ok(
        redirects.some((r) => r.source === `/realisations/${from}` && r.destination === `/realisations/${to}` && r.permanent),
        from
      );
    }
    const { ctx, page } = await open(browser, '/realisations/cuisine-ixelles');
    await page.waitForURL('**/realisations/toitures-et-volumes');
    assert.match(await page.locator('h1').innerText(), /Toitures et volumes/);
    await ctx.close();
  });

  it('filtres du portfolio : un état pressé, une liste filtrée', async () => {
    const { ctx, page } = await open(browser, '/realisations');
    const cards = page.locator('main ul > li a[href^="/realisations/"]');
    assert.equal(await cards.count(), PROJECTS.length);
    await page.getByRole('button', { name: 'Toiture' }).click();
    assert.equal(await page.getByRole('button', { name: 'Toiture' }).getAttribute('aria-pressed'), 'true');
    const expected = PROJECTS.filter((p) => p.categories.includes('toiture')).length;
    await page.waitForFunction((n) => document.querySelectorAll('main ul > li a[href^="/realisations/"]').length === n, expected);
    await ctx.close();
  });
});

describe('navigation', () => {
  it('menu mobile : ouvre, mène à une page, se referme', async () => {
    const { ctx, page } = await open(browser, '/services', { viewport: PHONE, isMobile: true, hasTouch: true });
    await page.getByRole('button', { name: 'Ouvrir le menu' }).click();
    await page.getByRole('navigation', { name: 'Navigation mobile' }).getByRole('link', { name: /Réalisations/ }).click();
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
    assert.doesNotMatch(await dialog.innerText(), /Horaires/, 'horaires non validés, non affichés');
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

  it('carrousel des réalisations : clavier, compteur, flèches, lien vers la fiche', async () => {
    const { ctx, page, errors } = await open(browser, '/', { reducedMotion: 'reduce' });
    const carousel = page.locator('section[aria-roledescription="carrousel"]');
    const track = carousel.locator('.rc-track');
    await track.scrollIntoViewIfNeeded();
    const counter = carousel.locator('[aria-live="polite"]');
    const total = String(PROJECTS.filter((p) => p.featured).length).padStart(2, '0');
    assert.equal((await counter.innerText()).replace(/\s+/g, ' '), `01 / ${total}`);
    await track.focus();
    await page.keyboard.press('ArrowRight');
    await page.waitForFunction(() => /^02/.test(document.querySelector('section[aria-roledescription="carrousel"] [aria-live]').innerText));
    await carousel.getByRole('button', { name: 'Réalisation suivante' }).click();
    await page.waitForFunction(() => /^03/.test(document.querySelector('section[aria-roledescription="carrousel"] [aria-live]').innerText));
    // Les photos gardent leurs proportions : recadrées, jamais étirées
    const fits = await track.locator('img').evaluateAll((imgs) => imgs.map((i) => getComputedStyle(i).objectFit));
    assert.ok(fits.every((f) => f === 'cover'));
    await track.locator('.rc-slide').nth(2).locator('a').click();
    await page.waitForURL('**/realisations/*');
    assert.equal(await page.locator('h1').count(), 1);
    assert.deepEqual(errors, []);
    await ctx.close();
  });

  it('page services : six métiers, chacun avec son lien', async () => {
    const { ctx, page } = await open(browser, '/services');
    const links = await page.locator('main ol a[href^="/services/"]').evaluateAll((a) => a.map((x) => x.getAttribute('href')));
    assert.equal(links.length, 6);
    assert.equal(new Set(links).size, 6);
    await ctx.close();
  });

  it('une même identité partout : polices, palette, en-tête qui se pose au défilement', async () => {
    const { ctx, page } = await open(browser, '/services/toiture');
    const look = () =>
      page.evaluate(() => ({
        h1: getComputedStyle(document.querySelector('h1')).fontFamily,
        body: getComputedStyle(document.body).fontFamily,
        bg: getComputedStyle(document.body).backgroundColor,
      }));
    const a = await look();
    assert.match(a.h1, /Instrument Serif/);
    assert.match(a.body, /Manrope/);
    assert.equal(a.bg, 'rgb(244, 241, 234)');
    assert.equal(await page.locator('.footer-wordmark').count(), 1);
    const bar = page.locator('header.fixed > div').first();
    const bg = () => bar.evaluate((el) => getComputedStyle(el).backgroundColor);
    const before = await bg();
    await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'instant' }));
    await page.waitForTimeout(800);
    assert.notEqual(await bg(), before, 'l’en-tête prend son voile au défilement');
    await page.goto(BASE + '/devis');
    assert.deepEqual(await look(), a);
    await ctx.close();
  });

  it('réseaux : seulement des profils vérifiés', async () => {
    const { ctx, page } = await open(browser, '/liens');
    const hrefs = await page.locator('a[href^="http"]').evaluateAll((a) => a.map((x) => x.href));
    assert.ok(hrefs.some((h) => h.includes('instagram.com/chaudrel_renovation')));
    assert.ok(hrefs.some((h) => h.includes('tiktok.com/@chaudrel_renovation')));
    assert.ok(hrefs.some((h) => h.includes('facebook.com/profile.php?id=61574019493337')));
    assert.ok(!hrefs.some((h) => /youtube\.com|facebook\.com\/chaudrel_renovation/.test(h)));
    await ctx.close();
  });
});
