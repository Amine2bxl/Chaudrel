/**
 * Un seul monde pour tout le site.
 *
 * La maison est construite une fois (textures, géométrie, lumière) et gardée
 * en mémoire : l'accueil et la page de visite s'y attachent tour à tour, en
 * déplaçant le même canvas d'un conteneur à l'autre. Passer du film d'accueil
 * à la visite ne recharge rien. Le monde est libéré s'il reste détaché trop
 * longtemps.
 *
 * Ce module n'importe pas three.js : le moteur arrive à la demande.
 */
import { isLowPower } from '@/lib/webgl';

let pending = null;
let world = null;
let canvas = null;
let owner = null;
let timer = 0;
const KEEP_MS = 120000;

export function acquireWorld() {
  if (pending) return pending;
  canvas = document.createElement('canvas');
  canvas.className = 'world-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  const quality = window.__XP_LOW ? 'low' : window.__XP_HQ || !isLowPower() ? 'high' : 'low';
  pending = import('./world/world.js')
    .then(({ createWorld }) => createWorld(canvas, { quality }))
    .then((w) => {
      world = w;
      window.__chaudrelWorld = w;
      canvas.addEventListener('webglcontextlost', (e) => {
        e.preventDefault();
        disposeWorld();
      });
      return w;
    })
    .catch((err) => {
      pending = null;
      throw err;
    });
  return pending;
}

/** Place le canvas dans `container` ; le précédent propriétaire le perd. */
export function attachWorld(container, who) {
  clearTimeout(timer);
  owner = who;
  if (canvas && canvas.parentNode !== container) container.appendChild(canvas);
  const r = container.getBoundingClientRect();
  world?.resize(r.width, r.height, Math.min(window.devicePixelRatio || 1, isLowPower() ? 1.25 : 1.75));
}

export function releaseWorld(who) {
  if (owner !== who) return;
  owner = null;
  canvas?.remove();
  clearTimeout(timer);
  timer = setTimeout(() => !owner && disposeWorld(), KEEP_MS);
}

export function disposeWorld() {
  world?.dispose();
  world = null;
  pending = null;
  canvas = null;
  delete window.__chaudrelWorld;
}
