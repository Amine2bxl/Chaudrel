import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/**
 * La maison - une maquette d'étude, pas un chantier Chaudrel.
 *
 * Géométrie réelle, en mètres : murs à ouvertures, menuiseries à cadres et
 * traverses, dalles, cloisons, escalier, mobilier, toiture plate à acrotère,
 * terrasse, bassin, plantations. Tout est réparti en couches (`LAYERS`) qui
 * correspondent aux métiers de l'entreprise : ce sont elles qui se séparent
 * dans la vue éclatée.
 *
 * Les volumes d'une même couche et d'une même matière sont fusionnés : la
 * scène complète se dessine en quelques dizaines d'appels, pas en milliers.
 */

export const LAYERS = ['site', 'ground', 'groundFacade', 'upper', 'upperFacade', 'roof'];

/* Niveaux (m) */
const Y = {
  g0: 0.3, // sol fini du rez
  g1: 3.2, // sous-face de la dalle d'étage
  u0: 3.5, // sol fini de l'étage
  u1: 6.3, // sous-face de la dalle de toiture
  r0: 6.55, // dessus de la dalle de toiture
  r1: 6.9, // dessus de l'acrotère
};
/* Emprises (m) */
const G = { x0: -6, x1: 5, z0: -4, z1: 3.5 };
const U = { x0: -3.2, x1: 6, z0: -4, z1: 4.7 };
const T = 0.3; // épaisseur des murs

class Kit {
  constructor() {
    this.bins = new Map();
  }

  add(layer, mat, geometry) {
    const key = `${layer}|${mat}`;
    if (!this.bins.has(key)) this.bins.set(key, []);
    const g = geometry.index ? geometry.toNonIndexed() : geometry;
    this.bins.get(key).push(g);
  }

  /** Parallélépipède aligné sur les axes, UV en mètres (projection par face). */
  box(layer, mat, x0, x1, y0, y1, z0, z1) {
    const w = Math.abs(x1 - x0);
    const h = Math.abs(y1 - y0);
    const d = Math.abs(z1 - z0);
    if (w < 1e-4 || h < 1e-4 || d < 1e-4) return;
    const g = new THREE.BoxGeometry(w, h, d).toNonIndexed();
    g.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
    worldUV(g);
    this.add(layer, mat, g);
  }

  build(materials) {
    const groups = {};
    for (const name of LAYERS) {
      groups[name] = new THREE.Group();
      groups[name].name = name;
    }
    for (const [key, list] of this.bins) {
      const [layer, mat] = key.split('|');
      const merged = mergeGeometries(list, false);
      list.forEach((g) => g.dispose());
      const mesh = new THREE.Mesh(merged, materials[mat]);
      mesh.castShadow = mat !== 'glass' && mat !== 'water' && mat !== 'light';
      mesh.receiveShadow = mat !== 'glass' && mat !== 'light';
      if (mat === 'glass') mesh.renderOrder = 2;
      groups[layer].add(mesh);
    }
    return groups;
  }
}

function worldUV(g) {
  const p = g.attributes.position;
  const n = g.attributes.normal;
  const uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) {
    const ax = Math.abs(n.getX(i));
    const ay = Math.abs(n.getY(i));
    if (ax > 0.5) uv.setXY(i, p.getZ(i), p.getY(i));
    else if (ay > 0.5) uv.setXY(i, p.getX(i), p.getZ(i));
    else uv.setXY(i, p.getX(i), p.getY(i));
  }
}

/**
 * Mur percé. `axis` est la direction du mur ('x' ou 'z'), `c0..c1` son
 * épaisseur sur l'autre axe, `a0..a1` sa longueur. `openings` : [{a0, a1, y0,
 * y1, mullions, transom}] - chaque baie reçoit linteau, allège, cadre, vitrage.
 * `out` (+1 / -1) indique le côté extérieur, pour poser le vitrage au nu
 * intérieur et le bardage au nu extérieur.
 */
function wall(kit, layer, mat, axis, a0, a1, c0, c1, y0, y1, openings = [], opt = {}) {
  const put = (m, lyr, s0, s1, ya, yb, k0 = c0, k1 = c1) =>
    axis === 'x' ? kit.box(lyr, m, s0, s1, ya, yb, k0, k1) : kit.box(lyr, m, k0, k1, ya, yb, s0, s1);

  const sorted = [...openings].sort((p, q) => p.a0 - q.a0);
  const out = opt.out ?? 1;
  const face = out > 0 ? Math.max(c0, c1) : Math.min(c0, c1);
  const inner = out > 0 ? Math.min(c0, c1) : Math.max(c0, c1);

  const clad = (s0, s1, ya, yb) => {
    if (!opt.boards) return;
    /* Bardage vertical : lames de 14 cm, joint creux de 2 cm. */
    const n = Math.max(1, Math.round((s1 - s0) / 0.16));
    const step = (s1 - s0) / n;
    for (let i = 0; i < n; i++) {
      const b0 = s0 + i * step + 0.01;
      const b1 = s0 + (i + 1) * step - 0.01;
      put(opt.boards, layer, b0, b1, ya, yb, face, face + out * 0.035);
    }
  };

  let cursor = a0;
  for (const o of sorted) {
    if (o.a0 > cursor) {
      put(mat, layer, cursor, o.a0, y0, y1);
      clad(cursor, o.a0, y0, y1);
    }
    if (o.y0 > y0) {
      put(mat, layer, o.a0, o.a1, y0, o.y0);
      clad(o.a0, o.a1, y0, o.y0);
    }
    if (o.y1 < y1) {
      put(mat, layer, o.a0, o.a1, o.y1, y1);
      clad(o.a0, o.a1, o.y1, y1);
    }
    cursor = o.a1;

    if (o.bare) continue;
    /* Menuiserie : dormant de 6 cm en retrait de 10 cm du nu extérieur. */
    const f = 0.06;
    const k0 = face - out * 0.1;
    const k1 = face - out * 0.18;
    put('frame', layer, o.a0, o.a1, o.y0, o.y0 + f, k0, k1);
    put('frame', layer, o.a0, o.a1, o.y1 - f, o.y1, k0, k1);
    put('frame', layer, o.a0, o.a0 + f, o.y0 + f, o.y1 - f, k0, k1);
    put('frame', layer, o.a1 - f, o.a1, o.y0 + f, o.y1 - f, k0, k1);
    const m = o.mullions ?? 0;
    for (let i = 1; i <= m; i++) {
      const p = o.a0 + ((o.a1 - o.a0) * i) / (m + 1);
      put('frame', layer, p - 0.03, p + 0.03, o.y0 + f, o.y1 - f, k0, k1);
    }
    if (o.transom) put('frame', layer, o.a0 + f, o.a1 - f, o.transom - 0.025, o.transom + 0.025, k0, k1);
    put(o.door ? 'oak' : 'glass', layer, o.a0 + f, o.a1 - f, o.y0 + f, o.y1 - f, face - out * 0.13, face - out * 0.15);
    /* Tablette de fenêtre / seuil. */
    if (!o.door) put('coping', layer, o.a0 - 0.04, o.a1 + 0.04, o.y0 - 0.03, o.y0, face + out * 0.05, inner + out * 0.12);
  }
  if (cursor < a1) {
    put(mat, layer, cursor, a1, y0, y1);
    clad(cursor, a1, y0, y1);
  }
}

export function createBuilding(materials) {
  const k = new Kit();
  const b = (...a) => k.box(...a);

  /* ===================== SITE ===================== */
  b('site', 'base', -8.6, 8.6, -0.7, -0.02, -5.6, 9.2);
  b('site', 'paving', -8.45, 8.45, -0.02, 0.02, -5.45, 9.05);
  // Pelouse légèrement en relief sur le dallage
  b('site', 'lawn', 1.9, 7.7, 0.02, 0.07, 4.9, 8.7);
  b('site', 'lawn', 5.5, 7.7, 0.02, 0.07, -5.1, 4.9);
  // Terrasse bois, ouverte autour du bassin
  const P = { x0: -5.6, x1: -1.6, z0: 5.5, z1: 7.3 };
  b('site', 'deck', -6.9, 1.4, 0.06, 0.3, 3.5, P.z0);
  b('site', 'deck', -6.9, 1.4, 0.06, 0.3, P.z1, 8.1);
  b('site', 'deck', -6.9, P.x0, 0.06, 0.3, P.z0, P.z1);
  b('site', 'deck', P.x1, 1.4, 0.06, 0.3, P.z0, P.z1);
  b('site', 'poolWall', P.x0, P.x1, 0.02, 0.1, P.z0, P.z1);
  b('site', 'water', P.x0, P.x1, 0.1, 0.24, P.z0, P.z1);
  // Marche de terrasse
  b('site', 'deck', -6.9, 1.4, 0.02, 0.16, 8.1, 8.45);
  // Allée d'entrée : pas japonais, puis seuil
  for (let i = 0; i < 4; i++) b('site', 'stone', 2.0, 3.6, 0.02, 0.1, 5.0 + i * 1.0, 5.75 + i * 1.0);
  b('site', 'stone', 1.8, 3.8, 0.02, 0.17, 3.5, 4.75);
  b('site', 'stone', 2.0, 3.6, 0.17, 0.3, 3.5, 4.3);
  // Jardinières en acier corten et haies
  b('site', 'corten', 1.5, 1.75, 0.02, 0.62, 5.0, 8.1);
  b('site', 'foliage', 1.52, 1.73, 0.62, 0.95, 5.05, 8.05);
  b('site', 'corten', 4.2, 7.6, 0.02, 0.5, 3.7, 4.2);
  b('site', 'foliage', 4.25, 7.55, 0.5, 0.86, 3.74, 4.16);
  b('site', 'foliage', 7.75, 8.25, 0.02, 1.25, -5.2, 8.8);
  b('site', 'foliage', -8.25, -7.75, 0.02, 1.25, -5.2, 3.2);

  /* ===================== REZ - structure et intérieur ===================== */
  b('ground', 'slab', G.x0, G.x1, 0, Y.g0 - 0.02, G.z0, G.z1);
  b('ground', 'parquet', G.x0 + T, G.x1 - T, Y.g0 - 0.02, Y.g0, G.z0 + T, G.z1 - T);
  // Refend porteur entre séjour et hall, avec passage
  wall(k, 'ground', 'plaster', 'z', G.z0 + T, G.z1 - T, 0.9, 1.08, Y.g0, Y.g1, [{ a0: 0.4, a1: 1.5, y0: Y.g0, y1: 2.5, bare: true }]);
  // Poteaux acier sous le porte-à-faux
  b('ground', 'steel', -3.12, -3.0, Y.g0 - 0.24, Y.g1, 4.48, 4.6);
  b('ground', 'steel', 5.8, 5.92, 0.02, Y.g1, 4.48, 4.6);
  // Escalier droit le long du mur arrière (16 marches)
  for (let i = 0; i < 16; i++) {
    const x = 1.5 + i * 0.2;
    b('ground', 'oak', x, x + 0.24, Y.g0 + i * 0.2, Y.g0 + (i + 1) * 0.2, -3.6, -2.65);
  }
  b('ground', 'plaster', 1.5, 4.7, Y.g0, Y.g1, -2.65, -2.55);
  // Cuisine : linéaire, colonnes, îlot
  b('ground', 'counter', -4.2, -1.3, Y.g0, 1.18, -3.68, -3.08);
  b('ground', 'counterTop', -4.22, -1.28, 1.18, 1.22, -3.7, -3.04);
  b('ground', 'counter', -5.68, -4.2, Y.g0, 2.6, -3.68, -3.05);
  b('ground', 'oak', -3.9, -1.5, Y.g0, 1.18, -1.75, -0.85);
  b('ground', 'counterTop', -4.0, -1.4, 1.18, 1.23, -1.85, -0.75);
  for (let i = 0; i < 3; i++) {
    const x = -3.5 + i * 0.8;
    b('ground', 'steel', x - 0.015, x + 0.015, 0.72, 0.98, -0.52, -0.49);
    b('ground', 'fabric', x - 0.19, x + 0.19, 0.94, 0.99, -0.68, -0.34);
    b('ground', 'steel', x - 0.02, x + 0.02, Y.g0, 0.94, -0.53, -0.49);
  }
  // Table et chaises devant la baie
  b('ground', 'oak', -4.9, -2.5, 1.02, 1.07, 1.0, 2.0);
  for (const [x, z] of [[-4.8, 1.1], [-2.66, 1.1], [-4.8, 1.84], [-2.66, 1.84]]) b('ground', 'steel', x, x + 0.06, Y.g0, 1.02, z, z + 0.06);
  for (let i = 0; i < 3; i++) {
    for (const side of [0.55, 2.1]) {
      const x = -4.55 + i * 0.75;
      b('ground', 'fabric', x, x + 0.44, 0.72, 0.78, side, side + 0.42);
      const back = side < 1 ? side : side + 0.38;
      b('ground', 'fabric', x, x + 0.44, 0.78, 1.14, back, back + 0.04);
      for (const [lx, lz] of [[0.02, 0.02], [0.39, 0.02], [0.02, 0.37], [0.39, 0.37]]) b('ground', 'steel', x + lx, x + lx + 0.03, Y.g0, 0.72, side + lz, side + lz + 0.03);
    }
  }
  // Salon : canapé d'angle, table basse, tapis
  b('ground', 'rug', -1.6, 0.6, Y.g0, Y.g0 + 0.015, -0.1, 2.5);
  b('ground', 'fabric', -1.4, 0.5, Y.g0 + 0.08, 0.72, -0.2, 0.65);
  b('ground', 'fabric', -1.4, 0.5, 0.72, 1.05, -0.2, 0.0);
  b('ground', 'fabric', -0.2, 0.5, Y.g0 + 0.08, 0.72, 0.65, 1.9);
  b('ground', 'fabric', 0.32, 0.5, 0.72, 1.05, 0.0, 1.9);
  b('ground', 'oak', -1.25, -0.5, 0.56, 0.6, 1.2, 1.9);
  b('ground', 'steel', -1.2, -0.55, Y.g0, 0.56, 1.25, 1.85);
  // Meuble bas du hall
  b('ground', 'oak', 4.2, 4.68, Y.g0, 1.1, -1.9, 1.6);
  // Luminaires : suspensions sur table et îlot, ruban au plafond
  for (const [x, z] of [[-4.2, 1.5], [-3.2, 1.5], [-3.3, -1.3], [-2.1, -1.3]]) {
    b('ground', 'steel', x - 0.006, x + 0.006, 2.1, Y.g1, z - 0.006, z + 0.006);
    b('ground', 'light', x - 0.11, x + 0.11, 1.95, 2.1, z - 0.11, z + 0.11);
  }
  b('ground', 'light', -5.5, 0.7, Y.g1 - 0.03, Y.g1, 2.7, 2.82);
  b('ground', 'light', 1.3, 4.5, Y.g1 - 0.03, Y.g1, 0.2, 0.32);

  /* ===================== REZ - façades ===================== */
  wall(k, 'groundFacade', 'stone', 'x', G.x0, 0.9, G.z1 - T, G.z1, Y.g0, Y.g1, [{ a0: -5.3, a1: 0.5, y0: Y.g0, y1: 2.95, mullions: 3 }]);
  // Volume d'entrée habillé de chêne
  wall(
    k, 'groundFacade', 'stone', 'x', 0.9, G.x1, G.z1 - T, G.z1, Y.g0, Y.g1,
    [
      { a0: 2.25, a1: 3.35, y0: Y.g0, y1: 2.6, door: true },
      { a0: 3.6, a1: 4.0, y0: Y.g0, y1: 2.6 },
    ],
    { boards: 'oak' }
  );
  b('groundFacade', 'frame', 3.2, 3.24, 1.2, 1.9, G.z1 - 0.08, G.z1 - 0.02); // poignée
  wall(k, 'groundFacade', 'stone', 'z', G.z0, G.z1 - T, G.x0, G.x0 + T, Y.g0, Y.g1, [{ a0: -2.6, a1: -0.4, y0: Y.g0, y1: 2.95, mullions: 1 }], { out: -1 });
  wall(k, 'groundFacade', 'stone', 'z', G.z0, G.z1 - T, G.x1 - T, G.x1, Y.g0, Y.g1, [{ a0: -1.6, a1: 0.9, y0: 1.2, y1: 2.6, mullions: 1 }]);
  wall(k, 'groundFacade', 'stone', 'x', G.x0 + T, G.x1 - T, G.z0, G.z0 + T, Y.g0, Y.g1, [
    { a0: -3.9, a1: -1.6, y0: 1.35, y1: 2.6, mullions: 1 },
    { a0: 2.2, a1: 3.4, y0: 1.2, y1: 2.6 },
  ], { out: -1 });
  // Soubassement
  b('groundFacade', 'slab', G.x0 - 0.03, G.x1 + 0.03, 0.02, Y.g0, G.z1 - 0.02, G.z1 + 0.03);

  /* ===================== ÉTAGE - dalle et intérieur ===================== */
  b('upper', 'slab', G.x0, U.x0, Y.g1, Y.u0 - 0.05, G.z0, G.z1); // toit-terrasse du rez
  b('upper', 'slab', U.x0, U.x1, Y.g1, Y.u0 - 0.02, U.z0, U.z1);
  b('upper', 'oak', U.x0, U.x1, Y.g1 - 0.03, Y.g1, G.z1 + 0.03, U.z1); // sous-face du porte-à-faux
  b('upper', 'oak', G.x1 + 0.03, U.x1, Y.g1 - 0.03, Y.g1, U.z0, G.z1 + 0.03);
  b('upper', 'paving', G.x0 + 0.15, U.x0, Y.u0 - 0.05, Y.u0, G.z0 + 0.15, G.z1 - 0.15);
  b('upper', 'parquet', U.x0 + T, U.x1 - T, Y.u0 - 0.02, Y.u0, U.z0 + T, -2.5);
  b('upper', 'parquet', U.x0 + T, 1.4, Y.u0 - 0.02, Y.u0, -2.5, U.z1 - T);
  b('upper', 'parquet', 4.8, U.x1 - T, Y.u0 - 0.02, Y.u0, -2.5, U.z1 - T);
  b('upper', 'parquet', 1.4, 4.8, Y.u0 - 0.02, Y.u0, -2.5, U.z1 - T);
  // Garde-corps vitré du toit-terrasse
  for (const [x0, x1, z0, z1] of [
    [G.x0 + 0.05, G.x0 + 0.07, G.z0 + 0.1, G.z1 - 0.1],
    [G.x0 + 0.1, U.x0, G.z1 - 0.07, G.z1 - 0.05],
    [G.x0 + 0.1, U.x0, G.z0 + 0.05, G.z0 + 0.07],
  ]) {
    b('upper', 'glass', x0, x1, Y.u0, Y.u0 + 1.05, z0, z1);
    b('upper', 'frame', x0 - 0.015, x1 + 0.015, Y.u0 + 1.05, Y.u0 + 1.09, z0 - 0.015, z1 + 0.015);
  }
  // Cloisons : chambre / palier / salle de bain
  wall(k, 'upper', 'plaster', 'z', U.z0 + T, U.z1 - T, 1.4, 1.52, Y.u0, Y.u1, [{ a0: -0.6, a1: 0.4, y0: Y.u0, y1: 5.6, bare: true }]);
  wall(k, 'upper', 'plaster', 'x', 1.52, U.x1 - T, 0.9, 1.02, Y.u0, Y.u1, [{ a0: 2.2, a1: 3.1, y0: Y.u0, y1: 5.6, bare: true }]);
  // Chambre : lit, tête de lit, chevets, dressing
  b('upper', 'oak', -2.1, 0.1, Y.u0, Y.u0 + 0.28, 0.6, 2.9);
  b('upper', 'rug', -2.05, 0.05, Y.u0 + 0.28, Y.u0 + 0.5, 0.75, 2.85);
  b('upper', 'fabric', -2.05, 0.05, Y.u0 + 0.5, Y.u0 + 0.58, 1.5, 2.85);
  b('upper', 'oak', -2.6, 0.6, Y.u0, Y.u0 + 1.15, 0.5, 0.6);
  b('upper', 'oak', -2.6, -2.2, Y.u0, Y.u0 + 0.45, 0.62, 1.0);
  b('upper', 'oak', 0.2, 0.6, Y.u0, Y.u0 + 0.45, 0.62, 1.0);
  b('upper', 'counter', -2.8, 1.3, Y.u0, 6.0, -3.68, -3.1);
  // Salle de bain : baignoire, meuble vasque
  b('upper', 'counterTop', 3.4, 5.6, Y.u0, Y.u0 + 0.58, 3.4, 4.3);
  b('upper', 'oak', 2.0, 3.2, Y.u0 + 0.35, Y.u0 + 0.85, 1.05, 1.55);
  b('upper', 'counterTop', 1.98, 3.22, Y.u0 + 0.85, Y.u0 + 0.9, 1.03, 1.57);
  // Garde-corps de la trémie d'escalier
  b('upper', 'glass', 1.6, 4.7, Y.u0, Y.u0 + 1.0, -2.57, -2.55);
  b('upper', 'light', -2.6, 1.2, Y.u1 - 0.03, Y.u1, 3.6, 3.72);
  b('upper', 'light', 1.8, 5.5, Y.u1 - 0.03, Y.u1, 3.6, 3.72);
  b('upper', 'light', 1.8, 5.5, Y.u1 - 0.03, Y.u1, -1.2, -1.08);

  /* ===================== ÉTAGE - façades (bardage sombre) ===================== */
  const CL = { boards: 'cladding' };
  wall(k, 'upperFacade', 'slab', 'x', U.x0, U.x1, U.z1 - T, U.z1, Y.g1, Y.u1 + 0.25, [
    { a0: -2.5, a1: 1.1, y0: Y.u0, y1: 6.0, mullions: 2 },
    { a0: 2.3, a1: 3.3, y0: Y.u0, y1: 6.0 },
    { a0: 4.3, a1: 5.2, y0: Y.u0, y1: 6.0 },
  ], CL);
  wall(k, 'upperFacade', 'slab', 'z', U.z0, U.z1 - T, U.x0, U.x0 + T, Y.u0 - 0.05, Y.u1 + 0.25, [{ a0: -1.2, a1: 2.2, y0: Y.u0, y1: 5.9, mullions: 1 }], { ...CL, out: -1 });
  wall(k, 'upperFacade', 'slab', 'z', U.z0, U.z1 - T, U.x1 - T, U.x1, Y.g1, Y.u1 + 0.25, [
    { a0: -2.6, a1: -2.0, y0: 4.0, y1: 6.0 },
    { a0: -0.2, a1: 0.4, y0: 4.0, y1: 6.0 },
    { a0: 2.0, a1: 2.6, y0: 4.0, y1: 6.0 },
  ], CL);
  wall(k, 'upperFacade', 'slab', 'x', U.x0 + T, U.x1 - T, U.z0, U.z0 + T, Y.g1, Y.u1 + 0.25, [{ a0: -1.6, a1: 0.6, y0: 4.5, y1: 5.9, mullions: 1 }], { ...CL, out: -1 });
  // Brise-soleil en chêne devant la fenêtre d'angle
  for (let i = 0; i < 9; i++) {
    const x = 4.24 + i * 0.115;
    b('upperFacade', 'oak', x, x + 0.045, Y.u0 - 0.1, 6.1, U.z1 + 0.05, U.z1 + 0.15);
  }

  /* ===================== TOITURE ===================== */
  const R = { x0: U.x0 - 0.08, x1: U.x1 + 0.08, z0: U.z0 - 0.08, z1: U.z1 + 0.08 };
  b('roof', 'slab', R.x0, R.x1, Y.u1 + 0.25, Y.r0 + 0.02, R.z0, R.z1);
  b('roof', 'gravel', R.x0 + 0.3, R.x1 - 0.3, Y.r0 + 0.02, Y.r0 + 0.07, R.z0 + 0.3, R.z1 - 0.3);
  // Acrotère et couvertine métallique
  for (const [x0, x1, z0, z1] of [
    [R.x0, R.x1, R.z1 - 0.3, R.z1],
    [R.x0, R.x1, R.z0, R.z0 + 0.3],
    [R.x0, R.x0 + 0.3, R.z0 + 0.3, R.z1 - 0.3],
    [R.x1 - 0.3, R.x1, R.z0 + 0.3, R.z1 - 0.3],
  ]) {
    b('roof', 'slab', x0, x1, Y.r0 + 0.02, Y.r1 - 0.04, z0, z1);
    b('roof', 'coping', x0 - 0.03, x1 + 0.03, Y.r1 - 0.04, Y.r1, z0 - 0.03, z1 + 0.03);
  }
  // Lanterneau, souche, sortie de ventilation
  b('roof', 'coping', 0.2, 2.4, Y.r0 + 0.07, Y.r0 + 0.32, -1.9, -0.3);
  b('roof', 'glass', 0.28, 2.32, Y.r0 + 0.32, Y.r0 + 0.35, -1.82, -0.38);
  b('roof', 'slab', 4.1, 4.75, Y.r0 + 0.07, Y.r0 + 1.05, -3.2, -2.55);
  b('roof', 'coping', 4.05, 4.8, Y.r0 + 1.05, Y.r0 + 1.1, -3.25, -2.5);
  b('roof', 'coping', -1.9, -1.6, Y.r0 + 0.07, Y.r0 + 0.4, 2.2, 2.5);

  const groups = k.build(materials);
  const root = new THREE.Group();
  LAYERS.forEach((name) => root.add(groups[name]));
  return { root, groups, levels: Y };
}

/**
 * Points d'ancrage des annotations, en coordonnées de la maquette. Chacun suit
 * sa couche pendant la vue éclatée.
 */
export const ANCHORS = {
  toiture: { layer: 'roof', at: [1.3, 6.9, -1.1] },
  facade: { layer: 'upperFacade', at: [6.0, 5.0, 1.4] },
  structure: { layer: 'upper', at: [-4.6, 3.5, 3.4] },
  finitions: { layer: 'ground', at: [-2.7, 1.25, -1.3] },
  exterieur: { layer: 'site', at: [-3.6, 0.3, 7.7] },
  // Repère de la fiche du hero (baie du séjour)
  hero: { layer: 'upperFacade', at: [6.0, 5.2, 4.7] },
};
