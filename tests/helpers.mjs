import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';

export const PORT = 4319;
export const BASE = `http://127.0.0.1:${PORT}`;

/** Sert `dist/` (le site tel qu'il sera déployé, prérendu compris). */
export async function startServer() {
  const proc = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'], {
    stdio: 'ignore',
    detached: true,
  });
  for (let i = 0; i < 80; i++) {
    try {
      const r = await fetch(BASE);
      if (r.ok) return proc;
    } catch {
      /* pas encore prêt */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error('Le serveur de prévisualisation ne répond pas.');
}

export function stopServer(proc) {
  try {
    process.kill(-proc.pid);
  } catch {
    /* déjà arrêté */
  }
}

/* WebGL logiciel : la scène 3D tourne aussi sur une machine sans carte graphique (CI). */
export const launch = () =>
  chromium.launch({
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
  });

export const DESKTOP = { width: 1440, height: 900 };
export const PHONE = { width: 390, height: 844 };

/** Ouvre une page et collecte les erreurs console / exceptions. */
export async function open(browser, path, { viewport = DESKTOP, ...ctxOptions } = {}) {
  const ctx = await browser.newContext({ viewport, ...ctxOptions });
  const page = await ctx.newPage();
  const errors = [];
  const requests = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(`exception: ${e.message}`));
  page.on('request', (r) => requests.push(r.url()));
  if (path) await page.goto(BASE + path, { waitUntil: 'load' });
  return { ctx, page, errors, requests };
}

/** Amène le film d'accueil à la position `p` (0 → 1) et attend que le scrub rattrape. */
export async function scrollFilm(page, p) {
  await page.evaluate((v) => {
    const el = document.querySelector('.xp');
    window.scrollTo({ top: el.offsetTop + v * (el.offsetHeight - window.innerHeight), behavior: 'instant' });
  }, p);
  await page.waitForFunction((v) => Math.abs(window.__chaudrelXP.played() - v) < 0.0005, p, { timeout: 60000 });
  await page.waitForTimeout(150);
}

export const overflowsX = (page) => page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
