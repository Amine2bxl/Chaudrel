import * as THREE from 'three';

/**
 * Textures procédurales - dessinées dans un canvas au démarrage de la scène.
 * Aucun fichier image à télécharger : le coût réseau de la matière est nul,
 * et chaque texture se répète sans raccord (toutes les opérations bouclent).
 */

/* Générateur déterministe : la maquette est identique à chaque visite. */
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function canvas(size) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  return [c, c.getContext('2d')];
}

/** Bruit de valeur multi-octave, périodique. Retourne un Float32Array [0..1]. */
function fbm(size, seed, octaves = 5, base = 4) {
  const out = new Float32Array(size * size);
  let amp = 1;
  let total = 0;
  for (let o = 0; o < octaves; o++) {
    const cells = base << o;
    const r = rng(seed + o * 101);
    const grid = new Float32Array(cells * cells);
    for (let i = 0; i < grid.length; i++) grid[i] = r();
    const step = size / cells;
    for (let y = 0; y < size; y++) {
      const gy = y / step;
      const y0 = Math.floor(gy) % cells;
      const y1 = (y0 + 1) % cells;
      let fy = gy - Math.floor(gy);
      fy = fy * fy * (3 - 2 * fy);
      for (let x = 0; x < size; x++) {
        const gx = x / step;
        const x0 = Math.floor(gx) % cells;
        const x1 = (x0 + 1) % cells;
        let fx = gx - Math.floor(gx);
        fx = fx * fx * (3 - 2 * fx);
        const a = grid[y0 * cells + x0] * (1 - fx) + grid[y0 * cells + x1] * fx;
        const b = grid[y1 * cells + x0] * (1 - fx) + grid[y1 * cells + x1] * fx;
        out[y * size + x] += (a * (1 - fy) + b * fy) * amp;
      }
    }
    total += amp;
    amp *= 0.5;
  }
  for (let i = 0; i < out.length; i++) out[i] /= total;
  return out;
}

/** Peint un canvas à partir d'une fonction (x, y, i) -> [r, g, b] en 0..255. */
function paint(size, fn) {
  const [c, ctx] = canvas(size);
  const img = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = y * size + x;
      const [r, g, b] = fn(x, y, i);
      img.data[i * 4] = r;
      img.data[i * 4 + 1] = g;
      img.data[i * 4 + 2] = b;
      img.data[i * 4 + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

function tex(c, metres, { color = true, aniso = 4 } = {}) {
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  /* Les UV des volumes sont en mètres : `metres` est la taille réelle couverte
     par une répétition de la texture. */
  t.repeat.set(1 / metres, 1 / metres);
  t.anisotropy = aniso;
  if (color) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const mix = (a, b, t) => a + (b - a) * t;
const tint = (rgb, k) => [rgb[0] * k, rgb[1] * k, rgb[2] * k];

/* Une valeur aléatoire stable par lame / par dalle, calculée une fois. */
const perIndex = (seed, n) => Array.from({ length: n }, (_, i) => rng(seed + i)());

/**
 * `pause` rend la main au navigateur entre deux textures : la génération ne
 * forme jamais une longue tâche qui figerait le défilement.
 */
export async function createTextures(size = 256, pause = async () => {}) {
  const S = size;

  /* Pierre / béton clair : grain fin, nuages larges, très léger calepinage. */
  const nA = fbm(S, 11, 5, 4);
  await pause();
  const nB = fbm(S, 23, 4, 32);
  await pause();
  const stone = paint(S, (x, y, i) => {
    let k = 0.86 + nA[i] * 0.2 + (nB[i] - 0.5) * 0.1;
    const jointY = y % (S / 4) < 1.2 ? 0.9 : 1;
    const row = Math.floor(y / (S / 4));
    const jointX = (x + (row % 2) * (S / 4)) % (S / 2) < 1.2 ? 0.92 : 1;
    k *= jointY * jointX;
    return tint([214, 207, 196], k);
  });
  await pause();
  const stoneBump = paint(S, (x, y, i) => {
    const row = Math.floor(y / (S / 4));
    const joint = y % (S / 4) < 2 || (x + (row % 2) * (S / 4)) % (S / 2) < 2 ? 0.25 : 1;
    const v = (0.5 + (nB[i] - 0.5) * 0.5) * joint * 255;
    return [v, v, v];
  });

  /* Bois : fil étiré dans le sens de la lame (axe V). */
  const grain = (seed, stretch) => {
    const n = fbm(S, seed, 5, 8);
    const out = new Float32Array(S * S);
    for (let y = 0; y < S; y++)
      for (let x = 0; x < S; x++) {
        const sy = Math.floor(y / stretch) % S;
        out[y * S + x] = n[sy * S + x] * 0.65 + n[y * S + x] * 0.35;
      }
    return out;
  };
  const rOak = perIndex(900, 9);
  const rDeck = perIndex(300, 7);
  const rPar = perIndex(500, 6);
  const rSlab = perIndex(700, 80);
  await pause();
  const gOak = grain(41, 14);
  await pause();
  const oak = paint(S, (x, y, i) => {
    const br = rOak[Math.floor(x / (S / 8))];
    const gap = x % (S / 8) < 1.5 ? 0.55 : 1;
    const k = (0.78 + gOak[i] * 0.36) * mix(0.9, 1.08, br) * gap;
    return tint([170, 137, 100], k);
  });
  await pause();
  const oakBump = paint(S, (x, y, i) => {
    const gap = x % (S / 8) < 2.5 ? 0 : 1;
    const v = (0.45 + gOak[i] * 0.5) * gap * 255;
    return [v, v, v];
  });

  await pause();
  const gDark = grain(57, 18);
  const cladding = paint(S, (x, y, i) => {
    const k = 0.75 + gDark[i] * 0.5;
    return tint([52, 49, 46], k);
  });

  await pause();
  const gDeck = grain(71, 10);
  const deck = paint(S, (x, y, i) => {
    const br = rDeck[Math.floor(x / (S / 6))];
    const gap = x % (S / 6) < 2 ? 0.45 : 1;
    const k = (0.8 + gDeck[i] * 0.32) * mix(0.9, 1.06, br) * gap;
    return tint([158, 124, 92], k);
  });

  await pause();
  /* Parquet : lames plus larges, teinte chêne clair. */
  const parquet = paint(S, (x, y, i) => {
    const board = Math.floor(x / (S / 5));
    const br = rPar[board];
    const gap = x % (S / 5) < 1.2 ? 0.7 : 1;
    const butt = (y + board * 97) % (S / 1.6) < 1.2 ? 0.75 : 1;
    const k = (0.84 + gOak[i] * 0.26) * mix(0.93, 1.05, br) * gap * butt;
    return tint([196, 160, 118], k);
  });

  await pause();
  /* Gravier de toiture, pelouse : mouchetis serré. */
  const nC = fbm(S, 5, 3, 64);
  const gravel = paint(S, (x, y, i) => tint([88, 86, 82], 0.7 + nC[i] * 0.7));
  const lawn = paint(S, (x, y, i) => {
    const k = 0.72 + nC[i] * 0.4 + (nA[i] - 0.5) * 0.3;
    return tint([112, 114, 92], k);
  });

  await pause();
  /* Dallage : grandes dalles 60 × 60 à joint fin. */
  const paving = paint(S, (x, y, i) => {
    const joint = x % (S / 4) < 1.5 || y % (S / 4) < 1.5 ? 0.86 : 1;
    const slab = rSlab[Math.floor(x / (S / 4)) * 13 + Math.floor(y / (S / 4))];
    const k = (0.9 + nA[i] * 0.14) * mix(0.96, 1.03, slab) * joint;
    return tint([201, 195, 185], k);
  });

  await pause();
  const plaster = paint(S, (x, y, i) => tint([240, 236, 229], 0.95 + nB[i] * 0.07));

  return {
    stone: tex(stone, 2.4),
    stoneBump: tex(stoneBump, 2.4, { color: false }),
    oak: tex(oak, 0.96),
    oakBump: tex(oakBump, 0.96, { color: false }),
    cladding: tex(cladding, 1.6),
    deck: tex(deck, 0.84),
    parquet: tex(parquet, 0.9),
    gravel: tex(gravel, 1.2),
    lawn: tex(lawn, 3),
    paving: tex(paving, 2.4),
    plaster: tex(plaster, 2),
  };
}
