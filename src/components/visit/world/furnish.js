import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { LEVELS } from './layout.js';
import { boxGeo } from './build.js';

/**
 * Mobilier, équipements, plantes, et accessoires de chantier.
 *
 * Tout est paramétrique : des volumes arrondis, des tours (vases, vasques,
 * suspensions), des lames. Les matières viennent de la bibliothèque (le
 * plateau de marbre change avec le style choisi). Chaque pièce a deux jeux :
 * `furn` (pièce finie) et `raw` (pièce en chantier).
 */

/* ---------- Tableaux : toiles abstraites dessinées au pinceau ---------- */
function painting(seed, palette) {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 640;
  const g = c.getContext('2d');
  let s = seed;
  const r = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  g.fillStyle = palette[0];
  g.fillRect(0, 0, 512, 640);
  for (let i = 0; i < 3; i++) {
    g.fillStyle = palette[1 + (i % (palette.length - 1))];
    g.globalAlpha = 0.85;
    g.beginPath();
    const x = 60 + r() * 300;
    const y = 80 + r() * 380;
    g.ellipse(x, y, 90 + r() * 140, 70 + r() * 160, r() * 3, 0, Math.PI * 2);
    g.fill();
  }
  g.globalAlpha = 1;
  g.strokeStyle = '#1d1a17';
  g.lineCap = 'round';
  for (let i = 0; i < 4; i++) {
    g.lineWidth = 6 + r() * 26;
    g.beginPath();
    g.moveTo(r() * 512, r() * 640);
    g.bezierCurveTo(r() * 512, r() * 640, r() * 512, r() * 640, r() * 512, r() * 640);
    g.stroke();
  }
  // grain de toile
  const img = g.getImageData(0, 0, 512, 640);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (r() - 0.5) * 14;
    img.data[i] += n;
    img.data[i + 1] += n;
    img.data[i + 2] += n;
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

export function furnish(M, bins, colliders) {
  const textures = [];

  function kit(room, level, raw = false) {
    const L = LEVELS[level].y;
    const group = `${room}:${raw ? 'raw' : 'furn'}`;
    const mat = (spec) => (typeof spec === 'object' && spec.isMaterial ? spec : raw ? M.raw(room, spec) : M.furniture(room, spec));
    const add = (spec, g, opts) => bins.add(group, mat(spec), g, opts);
    const place = (g, x, y, z, ry = 0) => {
      if (ry) g.rotateY(ry);
      g.translate(x, L + y, z);
      return g;
    };
    return {
      L,
      box: (spec, x0, x1, y0, y1, z0, z1) => add(spec, boxGeo(x0, x1, L + y0, L + y1, z0, z1)),
      /** Volume arrondi centré en (x, z), posé à la hauteur y (dessous). */
      rb: (spec, x, y, z, w, h, d, r = 0.04, ry = 0) => add(spec, place(new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w * 0.49, h * 0.49, d * 0.49)).translate(0, h / 2, 0), x, y, z, ry)),
      cyl: (spec, x, y, z, r, h, seg = 24, rt) => add(spec, place(new THREE.CylinderGeometry(rt ?? r, r, h, seg).translate(0, h / 2, 0), x, y, z)),
      sphere: (spec, x, y, z, r, sy = 1, seg = 20) => add(spec, place(new THREE.SphereGeometry(r, seg, Math.round(seg * 0.7)).scale(1, sy, 1), x, y, z)),
      lathe: (spec, pts, x, y, z, sx = 1, sz = 1, seg = 40) =>
        add(spec, place(new THREE.LatheGeometry(pts.map(([a, b]) => new THREE.Vector2(a, b)), seg).scale(sx, 1, sz), x, y, z)),
      tube: (spec, pts, r, x = 0, y = 0, z = 0) =>
        add(spec, place(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p))), 24, r, 8), x, y, z)),
      art: (x, y, z, w, h, ry, seed, palette) => {
        const t = painting(seed, palette);
        textures.push(t);
        const frame = boxGeo(-w / 2 - 0.025, w / 2 + 0.025, -h / 2 - 0.025, h / 2 + 0.025, -0.02, 0.02);
        add('black', place(frame, x, y, z, ry));
        const pg = new THREE.PlaneGeometry(w, h);
        pg.translate(0, 0, 0.021);
        add({ id: `art-${seed}`, map: t, roughness: 1 }, place(pg, x, y, z, ry), { uv: false });
      },
      /** Emprise au sol infranchissable (marche libre). */
      solid: (x0, x1, z0, z1) => colliders.push({ l: level, x0, x1, z0, z1, room }),
      add,
    };
  }

  /* ================================================================ REZ */

  /* ---------- Entrée ---------- */
  {
    const k = kit('hall', 0);
    // mur de noyer à rainures, banc suspendu, miroir rond
    k.box('joinery', 5.075, 5.105, 0, 2.95, 0.12, 3.12);
    for (let z = 0.42; z < 3.1; z += 0.3) k.box('black', 5.1, 5.108, 0, 2.95, z, z + 0.006);
    k.rb('joinery', 5.33, 0.42, 1.65, 0.44, 0.05, 2.0, 0.01);
    k.rb('fabric', 5.32, 0.47, 1.65, 0.38, 0.07, 1.4, 0.03);
    k.add('metal', new THREE.TorusGeometry(0.42, 0.018, 12, 64).rotateY(Math.PI / 2).translate(5.13, 1.75, 1.65));
    k.add('mirror', new THREE.CircleGeometry(0.41, 48).rotateY(Math.PI / 2).translate(5.125, 1.75, 1.65), { uv: false });
    k.solid(5.1, 5.6, 0.6, 2.7);
    // grande suspension opaline
    k.cyl('metal', 7.6, 2.5, 3.6, 0.006, 0.5, 6);
    k.sphere('lamp', 7.6, 2.38, 3.6, 0.22);
    k.cyl('metal', 7.6, 2.96, 3.6, 0.06, 0.04, 20);
    // olivier en pot
    tree(k, 5.6, 0, 4.85, 0.9);
    // console contre la claustra
    k.box('stoneSolid', 8.95, 9.5, 0.82, 0.86, 1.3, 3.6);
    k.cyl('metal', 9.0, 0, 1.38, 0.015, 0.82, 8);
    k.cyl('metal', 9.0, 0, 3.52, 0.015, 0.82, 8);
    k.cyl('metal', 9.45, 0, 1.38, 0.015, 0.82, 8);
    k.cyl('metal', 9.45, 0, 3.52, 0.015, 0.82, 8);
    k.lathe('clay', [[0, 0], [0.09, 0.02], [0.13, 0.16], [0.07, 0.34], [0.05, 0.4], [0, 0.4]], 9.2, 0.86, 2.2);
    k.solid(8.9, 9.55, 1.3, 3.6);
  }

  /* ---------- Cellier ---------- */
  {
    const k = kit('pantry', 0);
    k.box('joinery', 0.1, 0.72, 0, 2.6, 0.3, 5.3);
    for (let z = 0.9; z < 5.3; z += 0.6) k.box('black', 0.72, 0.725, 0.05, 2.6, z, z + 0.005);
    k.box('black', 0.1, 0.7, 0, 0.08, 0.3, 5.3);
    for (const y of [0.9, 1.35, 1.8, 2.25]) k.box('oak', 4.62, 4.925, y, y + 0.03, 0.4, 2.9);
    for (let i = 0; i < 10; i++) k.lathe('ceramic', [[0, 0], [0.06, 0], [0.065, 0.14], [0.05, 0.16], [0, 0.16]], 4.77, 0.93 + Math.floor(i / 5) * 0.45, 0.6 + (i % 5) * 0.45);
    k.cyl('metal', 2.5, 2.4, 2.8, 0.005, 0.6, 6);
    k.sphere('lamp', 2.5, 2.38, 2.8, 0.12);
    k.solid(0.1, 0.72, 0.3, 5.3);
  }

  /* ---------- Cuisine ---------- */
  {
    const k = kit('kitchen', 0);
    // linéaire sous la fenêtre
    k.box('black', 0.15, 5.85, 0, 0.1, 10.35, 10.85);
    k.box('joinery', 0.1, 5.9, 0.1, 0.88, 10.3, 10.9);
    for (let x = 0.7; x < 5.9; x += 0.6) k.box('black', x, x + 0.005, 0.12, 0.88, 10.295, 10.3);
    k.box('marble', 0.1, 5.9, 0.88, 0.92, 10.25, 10.9);
    k.box('marble', 0.1, 5.9, 0.92, 1.05, 10.88, 10.9);
    k.box('black', 2.55, 3.35, 0.9, 0.921, 10.4, 10.78); // évier
    k.tube('metal', [[2.95, 0.92, 10.82], [2.95, 1.2, 10.82], [2.95, 1.32, 10.7], [2.95, 1.25, 10.55]], 0.012);
    k.solid(0.1, 5.9, 10.25, 10.9);
    // colonnes : four, réfrigérateur
    k.box('joinery', 0.1, 2.1, 0, 2.55, 5.575, 6.2);
    k.box('black', 0.75, 1.42, 0.85, 1.45, 6.2, 6.205);
    k.box('black', 0.1, 2.1, 2.55, 2.6, 5.575, 6.2);
    for (const x of [0.72, 1.44]) k.box('black', x, x + 0.005, 0.05, 2.55, 6.2, 6.205);
    k.solid(0.1, 2.1, 5.575, 6.2);
    // îlot : marbre en cascade
    const ix0 = 1.6;
    const ix1 = 4.4;
    const iz0 = 7.65;
    const iz1 = 8.75;
    k.box('joinery', ix0 + 0.06, ix1 - 0.06, 0.08, 0.86, iz0, iz1 - 0.3);
    k.box('black', ix0 + 0.12, ix1 - 0.12, 0, 0.08, iz0 + 0.05, iz1 - 0.35);
    k.box('marble', ix0, ix1, 0.86, 0.92, iz0, iz1);
    k.box('marble', ix0, ix0 + 0.06, 0, 0.86, iz0, iz1);
    k.box('marble', ix1 - 0.06, ix1, 0, 0.86, iz0, iz1);
    k.solid(ix0, ix1, iz0, iz1);
    for (const x of [2.15, 3.0, 3.85]) {
      k.cyl('oak', x, 0.64, iz1 + 0.42, 0.19, 0.05, 28);
      k.cyl('steel', x, 0, iz1 + 0.42, 0.012, 0.64, 8);
      k.add('steel', new THREE.TorusGeometry(0.17, 0.008, 6, 32).rotateX(Math.PI / 2).translate(x, 0.3, iz1 + 0.42));
      k.cyl('steel', x, 0, iz1 + 0.42, 0.2, 0.015, 24);
    }
    for (const x of [2.2, 3.0, 3.8]) {
      k.cyl('metal', x, 1.95, 8.2, 0.004, 1.05, 6);
      k.lathe('metal', [[0, 0.22], [0.02, 0.22], [0.15, 0.04], [0.16, 0], [0.155, 0], [0, 0.18]], x, 1.75, 8.2);
      k.sphere('bulb', x, 1.78, 8.2, 0.035);
    }
    k.lathe('clay', [[0, 0], [0.12, 0], [0.13, 0.18], [0.1, 0.24], [0, 0.24]], 4.0, 0.92, 8.0);
    k.sphere('leaf', 4.0, 1.2, 8.0, 0.16, 1.2, 12);
    k.lathe('ceramic', [[0, 0], [0.16, 0.01], [0.17, 0.06], [0, 0.06]], 2.0, 0.92, 8.1);
  }

  /* ---------- Salle à manger ---------- */
  {
    const k = kit('dining', 0);
    const cx = 8.35;
    const cz = 8.4;
    k.rb('wool', cx, 0, cz, 3.6, 0.012, 2.6, 0.005);
    k.rb('oak', cx, 0.71, cz, 2.6, 0.05, 1.04, 0.012);
    k.rb('stoneSolid', cx - 0.8, 0, cz, 0.28, 0.71, 0.62, 0.12);
    k.rb('stoneSolid', cx + 0.8, 0, cz, 0.28, 0.71, 0.62, 0.12);
    k.solid(cx - 1.3, cx + 1.3, cz - 0.52, cz + 0.52);
    const chair = (x, z, ry) => {
      k.rb('fabric', x, 0.43, z, 0.46, 0.06, 0.46, 0.025, ry);
      const back = new RoundedBoxGeometry(0.46, 0.38, 0.05, 3, 0.02).translate(0, 0.19, -0.22);
      back.rotateX(-0.12);
      k.add('fabric', back.rotateY(ry).translate(x, k.L + 0.47, z));
      for (const [dx, dz] of [
        [-0.19, -0.19],
        [0.19, -0.19],
        [-0.19, 0.19],
        [0.19, 0.19],
      ]) {
        const c = Math.cos(ry);
        const s = Math.sin(ry);
        k.cyl('oak', x + dx * c + dz * s, 0, z - dx * s + dz * c, 0.016, 0.43, 8);
      }
    };
    for (const x of [-0.85, 0, 0.85]) {
      chair(cx + x, cz - 0.82, 0);
      chair(cx + x, cz + 0.82, Math.PI);
    }
    chair(cx - 1.55, cz, Math.PI / 2);
    chair(cx + 1.55, cz, -Math.PI / 2);
    // suspension linéaire
    k.box('metal', cx - 0.85, cx + 0.85, 1.86, 1.89, cz - 0.03, cz + 0.03);
    k.box('lamp', cx - 0.83, cx + 0.83, 1.84, 1.86, cz - 0.025, cz + 0.025);
    for (const x of [-0.7, 0.7]) k.cyl('metal', cx + x, 1.89, cz, 0.003, 1.11, 6);
    // buffet en noyer, toile, vase
    k.box('joinery', 9.35, 10.85, 0.18, 0.78, 5.6, 6.05);
    for (const x of [9.35, 10.81]) k.box('steel', x, x + 0.04, 0, 0.18, 5.62, 6.03);
    k.lathe('ceramic', [[0, 0], [0.07, 0], [0.11, 0.12], [0.06, 0.3], [0.04, 0.34], [0, 0.34]], 10.4, 0.78, 5.83);
    k.lathe('clay', [[0, 0], [0.12, 0], [0.14, 0.05], [0, 0.05]], 9.8, 0.78, 5.83);
    k.art(10.1, 1.85, 5.6, 1.05, 1.3, 0, 7, ['#e7dfd2', '#b5562f', '#d79f5c', '#3f4a3c']);
    k.solid(9.35, 10.85, 5.6, 6.05);
    tree(k, 6.7, 0, 10.4, 1.1);
  }

  /* ---------- Séjour ---------- */
  {
    const k = kit('living', 0);
    // mur du foyer habillé de pierre, banquette, feu
    k.box('stone', 16.75, 16.9, 0, 3.0, 2.6, 7.6);
    k.box('stone', 16.25, 16.9, 0, 0.36, 2.6, 7.6);
    k.box('charcoal', 16.74, 16.76, 0.5, 1.12, 4.05, 6.15);
    k.box('fire', 16.7, 16.745, 0.52, 0.66, 4.15, 6.05);
    k.box('black', 16.6, 16.75, 0.5, 0.505, 4.05, 6.15);
    k.solid(16.25, 16.9, 2.6, 7.6);
    // tapis, canapé d'angle en bouclette
    k.rb('wool', 14.7, 0, 5.1, 3.8, 0.012, 4.6, 0.005);
    const sx = 13.0;
    k.rb('fabric', sx + 0.5, 0, 5.0, 1.0, 0.42, 4.0, 0.08);
    k.rb('fabric', sx + 0.13, 0.42, 5.0, 0.26, 0.38, 4.0, 0.1);
    for (const z of [3.55, 4.55, 5.55, 6.45]) k.rb('fabric', sx + 0.56, 0.42, z, 0.72, 0.12, 0.96, 0.05);
    k.rb('fabric', sx + 1.4, 0, 6.6, 1.8, 0.42, 0.95, 0.08);
    k.rb('fabric', sx + 1.4, 0.42, 6.88, 1.8, 0.36, 0.26, 0.1);
    k.rb('linen', sx + 0.4, 0.5, 3.4, 0.18, 0.42, 0.45, 0.06, 0.3);
    k.rb('linenSage', sx + 0.4, 0.5, 6.15, 0.16, 0.4, 0.42, 0.06, -0.3);
    k.solid(sx, sx + 2.3, 3.0, 7.1);
    // tables basses en travertin
    k.cyl('stoneSolid', 14.95, 0, 4.9, 0.62, 0.32, 48);
    k.cyl('stoneSolid', 15.55, 0, 5.85, 0.36, 0.42, 40);
    k.lathe('ceramic', [[0, 0], [0.09, 0], [0.1, 0.07], [0.05, 0.2], [0, 0.2]], 14.8, 0.32, 4.7);
    k.rb('linen', 15.15, 0.32, 5.05, 0.32, 0.05, 0.24, 0.01, 0.4);
    k.solid(14.3, 15.95, 4.2, 6.25);
    // fauteuils
    for (const [x, z, ry] of [
      [14.3, 1.65, 0.35],
      [15.7, 1.75, -0.35],
    ]) {
      k.rb('fabric', x, 0.12, z, 0.8, 0.3, 0.78, 0.12, ry);
      const back = new RoundedBoxGeometry(0.8, 0.42, 0.2, 3, 0.09).translate(0, 0.21, -0.32);
      k.add('fabric', back.rotateY(ry).translate(x, k.L + 0.38, z));
      k.cyl('joinery', x, 0, z, 0.32, 0.12, 24);
      k.solid(x - 0.45, x + 0.45, z - 0.45, z + 0.45);
    }
    // lampadaire en arc
    k.cyl('steel', 12.75, 0, 2.55, 0.16, 0.03, 24);
    k.tube('metal', [[12.75, 0.02, 2.55], [12.75, 1.5, 2.55], [13.1, 2.05, 2.75], [13.55, 2.05, 3.05], [13.7, 1.85, 3.15]], 0.012);
    k.lathe('linen', [[0.06, 0.18], [0.2, 0], [0.205, 0], [0.065, 0.18]], 13.7, 1.65, 3.15);
    // banc sous la fenêtre, livres
    k.box('joinery', 12.8, 15.4, 0.38, 0.42, 0.12, 0.52);
    k.box('steel', 12.85, 12.89, 0, 0.38, 0.14, 0.5);
    k.box('steel', 15.31, 15.35, 0, 0.38, 0.14, 0.5);
    books(k, 13.2, 0.42, 0.3, 9, 'x');
    k.lathe('clay', [[0, 0], [0.1, 0], [0.12, 0.22], [0.05, 0.38], [0.06, 0.42], [0, 0.42]], 14.9, 0.42, 0.3);
    // toile sur le mur de l'escalier
    k.art(11.09, 1.65, 2.4, 1.5, 1.15, Math.PI / 2, 21, ['#ece4d6', '#c45a2c', '#e2b071', '#273126']);
    tree(k, 16.25, 0, 10.3, 1.25);
  }

  /* ================================================================ ÉTAGE */

  /* ---------- Suite parentale ---------- */
  {
    const k = kit('master', 1);
    // cloison tête de lit en chêne, lit, chevets suspendus
    k.box('joinery', 12.4, 15.6, 0, 2.3, 4.6, 4.9);
    for (let x = 12.55; x < 15.6; x += 0.15) k.box('black', x, x + 0.004, 0, 2.3, 4.9, 4.903);
    k.box('joinery', 12.4, 15.6, 2.3, 2.34, 4.58, 4.92);
    k.solid(12.4, 15.6, 4.6, 4.9);
    const bx = 14.0;
    k.rb('joinery', bx, 0, 6.0, 1.9, 0.3, 2.15, 0.03);
    k.rb('linen', bx, 0.3, 6.02, 1.82, 0.24, 2.05, 0.08);
    k.rb('linen', bx, 0.5, 6.4, 1.86, 0.1, 1.4, 0.05);
    k.rb('linenSage', bx, 0.56, 6.85, 1.9, 0.05, 0.5, 0.02);
    for (const x of [-0.45, 0.45]) {
      k.rb('linen', bx + x, 0.54, 5.15, 0.75, 0.18, 0.18, 0.08, 0.04);
      k.rb('linen', bx + x * 0.9, 0.56, 5.32, 0.6, 0.16, 0.16, 0.07, -0.05);
    }
    k.solid(bx - 0.95, bx + 0.95, 4.9, 7.1);
    for (const x of [12.7, 15.3]) {
      k.box('joinery', x - 0.25, x + 0.25, 0.42, 0.56, 4.9, 5.3);
      k.cyl('metal', x, 1.2, 5.2, 0.003, 1.6, 6);
      k.sphere('lamp', x, 1.2, 5.2, 0.11);
    }
    k.rb('fabric', bx, 0, 7.55, 1.5, 0.44, 0.42, 0.08);
    k.rb('wool', bx, 0, 6.6, 3.4, 0.012, 3.6, 0.005);
    // dressing en noyer
    k.box('joinery', 11.075, 11.7, 0, 2.6, 0.2, 4.45);
    for (let z = 0.8; z < 4.45; z += 0.6) k.box('black', 11.7, 11.705, 0.05, 2.6, z, z + 0.005);
    k.solid(11.075, 11.7, 0.2, 4.45);
    // fauteuil de lecture face au jardin
    k.rb('fabric', 15.9, 0.15, 9.5, 0.78, 0.28, 0.8, 0.12, -2.4);
    k.add('fabric', new RoundedBoxGeometry(0.78, 0.5, 0.18, 3, 0.08).translate(0, 0.25, -0.33).rotateY(-2.4).translate(15.9, k.L + 0.4, 9.5));
    k.cyl('joinery', 15.9, 0, 9.5, 0.3, 0.15, 24);
    k.cyl('stoneSolid', 15.2, 0, 10.0, 0.22, 0.5, 32);
    k.solid(15.45, 16.35, 9.05, 9.95);
    // voilages de lin le long de la baie
    for (const [a, b] of [
      [11.85, 12.75],
      [15.25, 16.15],
    ]) {
      const g = new THREE.PlaneGeometry(b - a, 2.48, 48, 1);
      const p = g.attributes.position;
      for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin((p.getX(i) / (b - a)) * Math.PI * 9) * 0.035);
      g.computeVertexNormals();
      g.translate((a + b) / 2, k.L + 1.26, 10.78);
      k.add({ id: 'voile', color: '#efe9de', roughness: 0.95, transparent: true, opacity: 0.88, side: THREE.DoubleSide }, g);
    }
    k.box('steel', 11.8, 16.2, 2.48, 2.5, 10.76, 10.8);
    tree(k, 11.6, 0, 10.4, 0.85);
  }

  /* ---------- Chambre ---------- */
  {
    const k = kit('bedroom2', 1);
    k.rb('linen', 9.47, 0.3, 2.8, 0.1, 1.05, 1.9, 0.04);
    k.rb('joinery', 8.5, 0, 2.8, 1.95, 0.32, 1.65, 0.03);
    k.rb('linen', 8.48, 0.32, 2.8, 1.85, 0.22, 1.6, 0.08);
    k.rb('linenSage', 8.15, 0.5, 2.8, 0.7, 0.05, 1.66, 0.02);
    k.rb('linen', 9.25, 0.54, 2.38, 0.2, 0.17, 0.62, 0.07);
    k.rb('linen', 9.25, 0.54, 3.22, 0.2, 0.17, 0.62, 0.07);
    k.solid(7.5, 9.5, 1.95, 3.65);
    k.box('joinery', 9.05, 9.5, 0, 0.5, 1.35, 1.8);
    k.lathe('ceramic', [[0, 0], [0.07, 0], [0.08, 0.2], [0.02, 0.26], [0, 0.26]], 9.27, 0.5, 1.57);
    k.lathe('linen', [[0.05, 0.16], [0.12, 0], [0.125, 0], [0.055, 0.16]], 9.27, 0.72, 1.57);
    // bureau à la fenêtre
    k.box('oak', 5.8, 7.6, 0.72, 0.75, 0.15, 0.75);
    for (const [x, z] of [
      [5.85, 0.2],
      [7.55, 0.2],
      [5.85, 0.7],
      [7.55, 0.7],
    ])
      k.cyl('steel', x, 0, z, 0.012, 0.72, 8);
    k.rb('fabric', 6.7, 0.45, 1.25, 0.46, 0.06, 0.46, 0.025);
    k.add('fabric', new RoundedBoxGeometry(0.46, 0.34, 0.05, 3, 0.02).translate(6.7, k.L + 0.68, 1.47));
    for (const [dx, dz] of [
      [-0.19, -0.19],
      [0.19, -0.19],
      [-0.19, 0.19],
      [0.19, 0.19],
    ])
      k.cyl('oak', 6.7 + dx, 0, 1.25 + dz, 0.014, 0.45, 8);
    k.tube('metal', [[7.35, 0.75, 0.45], [7.35, 1.15, 0.45], [7.15, 1.3, 0.5]], 0.008);
    k.lathe('metal', [[0, 0.1], [0.012, 0.1], [0.07, 0], [0.065, 0], [0, 0.08]], 7.15, 1.2, 0.5);
    k.solid(5.8, 7.6, 0.15, 1.6);
    // bibliothèque encastrée
    k.box('oak', 4.575, 4.9, 0, 2.6, 0.25, 0.28);
    k.box('oak', 4.575, 4.9, 0, 2.6, 4.25, 4.28);
    for (const y of [0, 0.45, 0.9, 1.35, 1.8, 2.25, 2.57]) k.box('oak', 4.575, 4.9, y, y + 0.03, 0.25, 4.28);
    for (const y of [0.03, 0.48, 0.93, 1.38, 1.83]) books(k, 4.62, y, 0.4, 12, 'z');
    k.solid(4.575, 4.9, 0.25, 4.28);
    k.rb('wool', 7.4, 0, 3.0, 2.4, 0.012, 2.2, 0.005);
  }

  /* ---------- Salle de bain ---------- */
  {
    const k = kit('bath', 1);
    // baignoire îlot sous la fenêtre
    k.lathe('ceramic', [[0, 0], [0.42, 0.0], [0.47, 0.25], [0.5, 0.56], [0.47, 0.58], [0.42, 0.3], [0.36, 0.12], [0, 0.12]], 2.3, 0, 0.8, 1.85, 0.85, 64);
    k.tube('metal', [[1.2, 0, 1.05], [1.2, 0.95, 1.05], [1.3, 1.02, 1.05]], 0.015);
    k.solid(1.4, 3.2, 0.4, 1.2);
    // double vasque
    k.box('joinery', 0.1, 0.62, 0.38, 0.84, 1.3, 3.7);
    k.box('marble', 0.1, 0.64, 0.84, 0.88, 1.28, 3.72);
    for (const z of [1.95, 3.05]) {
      k.lathe('ceramic', [[0, 0], [0.16, 0.0], [0.2, 0.06], [0.21, 0.14], [0.19, 0.14], [0.17, 0.05], [0, 0.03]], 0.37, 0.88, z);
      k.tube('metal', [[0.1, 1.15, z], [0.24, 1.15, z], [0.27, 1.12, z]], 0.011);
      k.add('metal', new THREE.TorusGeometry(0.3, 0.012, 10, 48).rotateY(Math.PI / 2).translate(0.1, k.L + 1.55, z));
      k.add('mirror', new THREE.CircleGeometry(0.29, 40).rotateY(Math.PI / 2).translate(0.106, k.L + 1.55, z), { uv: false });
    }
    k.solid(0.1, 0.64, 1.28, 3.72);
    // douche à l'italienne
    k.box('showerGlass', 3.35, 3.37, 0, 2.05, 0.12, 1.65);
    k.box('metal', 3.34, 3.38, 2.05, 2.07, 0.12, 1.65);
    k.cyl('metal', 3.95, 2.3, 0.85, 0.15, 0.012, 32);
    k.cyl('metal', 3.95, 2.3, 0.85, 0.008, 0.5, 8);
    k.box('steel', 3.6, 4.3, 0.001, 0.004, 1.5, 1.56);
    k.solid(3.33, 3.39, 0.12, 1.65);
    // tabouret, serviettes, plante
    k.cyl('oak', 3.35, 0, 2.1, 0.17, 0.45, 24);
    k.add('metal', new THREE.CylinderGeometry(0.012, 0.012, 0.6, 8).rotateZ(Math.PI / 2).translate(1.9, k.L + 1.1, 5.0));
    k.rb('linen', 1.9, 0.8, 4.98, 0.5, 0.4, 0.05, 0.02);
    tree(k, 4.1, 0, 4.7, 0.6);
  }

  /* ---------- Palier, puits de lumière ---------- */
  {
    const k = kit('corridor', 1);
    k.rb('wool', 5.5, 0, 5.95, 7.6, 0.01, 0.9, 0.004);
    for (const x of [2, 5, 8]) k.cyl('lamp', x, 2.79, 5.95, 0.09, 0.012, 24);
    k.art(4.4, 1.55, 6.725, 0.8, 1.0, Math.PI, 33, ['#efe9df', '#7d8a6a', '#c9a467', '#2d2a26']);
  }
  {
    const k = kit('stairwell', 1);
    k.cyl('metal', 10.3, 0.4, 2.6, 0.004, 2.4, 6);
    k.sphere('lamp', 10.3, 0.4, 2.6, 0.2);
  }

  /* ---------- Terrasse et jardin ---------- */
  {
    const site = (spec) => M.fixed(spec);
    const B = (spec, g) => bins.add('site', site(spec), g);
    for (const x of [13.6, 15.2]) {
      B('timber', boxGeo(x - 0.35, x + 0.35, 0.28, 0.33, 12.3, 14.1));
      B('linen', new RoundedBoxGeometry(0.62, 0.08, 1.6, 3, 0.03).translate(x, 0.37, 13.2));
      for (const z of [12.4, 14.0]) B('timber', boxGeo(x - 0.33, x + 0.33, 0, 0.28, z - 0.03, z + 0.03));
    }
    for (const [x, z, s] of [
      [1.2, -6.5, 1.3],
      [15.5, -8.5, 1.5],
      [2, 24, 2.2],
      [9, 26.5, 2.6],
      [18, 24.5, 2.3],
      [21, 8, 2.0],
      [-4, 9, 2.1],
      [19.5, 15.5, 1.8],
    ])
      gardenTree(B, x, z, s);
  }

  /* ================================================================ CHANTIER */
  const RAW = [
    ['hall', 0, 7.6, 3.4],
    ['pantry', 0, 2.6, 2.2],
    ['kitchen', 0, 3.0, 8.0],
    ['dining', 0, 8.4, 8.4],
    ['living', 0, 14.6, 5.0],
    ['corridor', 1, 6.0, 5.95],
    ['master', 1, 14.0, 6.6],
    ['bedroom2', 1, 7.4, 2.6],
    ['bath', 1, 2.2, 2.6],
  ];
  RAW.forEach(([room, level, cx, cz], i) => worksite(kit(room, level, true), cx, cz, i));
  // tuyaux en attente
  {
    const k = kit('kitchen', 0, true);
    for (const x of [2.8, 3.1]) k.tube('pipe', [[x, 0, 10.88], [x, 0.45, 10.88], [x, 0.5, 10.8]], 0.011);
    const b = kit('bath', 1, true);
    for (const z of [1.95, 3.05]) b.tube('pipe', [[0.1, 0.6, z], [0.2, 0.6, z]], 0.011);
  }

  return {
    dispose() {
      textures.forEach((t) => t.dispose());
    },
  };

  /* ---------- assortiments ---------- */

  function books(k, x, y, z, n, axis) {
    const tones = ['book', { id: 'book2', color: '#5f4f3f', roughness: 0.8 }, { id: 'book3', color: '#c9b79a', roughness: 0.8 }, { id: 'book4', color: '#7f5a3e', roughness: 0.8 }];
    let a = 0;
    for (let i = 0; i < n; i++) {
      const w = 0.025 + ((i * 37) % 7) * 0.006;
      const h = 0.22 + ((i * 53) % 5) * 0.025;
      const d = 0.17;
      if (axis === 'x') k.box(tones[i % 4], x + a, x + a + w, y, y + h, z - d / 2, z + d / 2);
      else k.box(tones[i % 4], x, x + d, y, y + h, z + a, z + a + w);
      a += w + 0.004;
    }
  }

  function tree(k, x, y, z, s) {
    k.lathe('terracotta', [[0, 0], [0.2 * s, 0], [0.26 * s, 0.42 * s], [0.25 * s, 0.45 * s], [0, 0.42 * s]], x, y, z);
    k.cyl('trunk', x, y + 0.42 * s, z, 0.025 * s, 0.9 * s, 8, 0.015 * s);
    let seed = Math.abs(Math.round(x * 100 + z * 10)) + 11;
    const r = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    // branches fines, feuillage de petites feuilles lancéolées
    for (let b = 0; b < 5; b++) {
      const a = r() * Math.PI * 2;
      const bx = x + Math.cos(a) * 0.32 * s;
      const bz = z + Math.sin(a) * 0.32 * s;
      const by = y + (1.15 + r() * 0.35) * s;
      k.tube('trunk', [[x, y + 1.0 * s, z], [(x + bx) / 2, by - 0.05 * s, (z + bz) / 2], [bx, by + 0.12 * s, bz]], 0.008 * s);
    }
    for (let i = 0; i < 150; i++) {
      const a = r() * Math.PI * 2;
      const rad = Math.sqrt(r()) * 0.48 * s;
      const g = new THREE.PlaneGeometry(0.11 * s, 0.022 * s);
      g.rotateY(r() * 6.3);
      g.rotateX((r() - 0.5) * 1.6);
      g.rotateZ((r() - 0.5) * 0.9);
      k.add(i % 3 ? 'olive' : 'leaf', g.translate(x + Math.cos(a) * rad, k.L + y + (1.1 + r() * 0.75) * s, z + Math.sin(a) * rad));
    }
  }

  function gardenTree(B, x, z, s) {
    // tronc ramifié et houppier de feuilles (cartes doubles), pas de volumes géométriques
    let seed = Math.abs(Math.round(x * 31 + z * 17)) + 11;
    const r = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    const H = 2.6 * s;
    B('trunk', new THREE.CylinderGeometry(0.05 * s, 0.1 * s, H, 8).translate(x, H / 2, z));
    const crowns = [];
    for (let b = 0; b < 6; b++) {
      const a = r() * Math.PI * 2;
      const len = (0.7 + r() * 0.6) * s;
      const ex = x + Math.cos(a) * len;
      const ez = z + Math.sin(a) * len;
      const ey = H * (0.75 + r() * 0.35);
      B('trunk', new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(x, H * 0.55, z), new THREE.Vector3((x + ex) / 2, ey * 0.9, (z + ez) / 2), new THREE.Vector3(ex, ey, ez)]), 8, 0.03 * s, 6));
      crowns.push([ex, ey + 0.35 * s, ez]);
    }
    crowns.push([x, H * 1.15, z]);
    const leaves = [];
    for (const [cx, cy, cz] of crowns) {
      for (let i = 0; i < 150; i++) {
        const u = r() * Math.PI * 2;
        const v = Math.acos(2 * r() - 1);
        const rad = Math.cbrt(r()) * 0.75 * s;
        const g = new THREE.PlaneGeometry(0.1 * s, 0.045 * s);
        g.rotateX(r() * 3.1);
        g.rotateY(r() * 6.3);
        g.translate(cx + Math.sin(v) * Math.cos(u) * rad, cy + Math.cos(v) * rad * 0.7, cz + Math.sin(v) * Math.sin(u) * rad);
        leaves.push(g);
      }
    }
    leaves.forEach((g, i) => B(i % 3 === 0 ? 'olive' : 'leaf', g));
  }

  function worksite(k, cx, cz, i) {
    // bâche au sol, sacs d'enduit, seaux, escabeau, projecteur de chantier
    const tarp = new THREE.PlaneGeometry(2.6, 1.8, 20, 14);
    const p = tarp.attributes.position;
    for (let j = 0; j < p.count; j++) p.setZ(j, Math.max(0, Math.sin(p.getX(j) * 5 + j) * 0.012 + Math.sin(p.getY(j) * 7) * 0.01));
    tarp.rotateX(-Math.PI / 2);
    tarp.computeVertexNormals();
    k.add('tarp', tarp.rotateY(i * 0.7).translate(cx + 0.3, k.L + 0.004, cz - 0.2));
    for (let j = 0; j < 3; j++) k.rb('sack', cx - 1.1 + j * 0.05, j * 0.13, cz + 0.9, 0.42, 0.13, 0.62, 0.05, 0.2 * j + i);
    k.lathe(i % 2 ? 'bucketOrange' : 'bucket', [[0, 0], [0.13, 0], [0.16, 0.34], [0.165, 0.34], [0, 0.32]], cx + 0.9, 0, cz + 0.7);
    k.lathe('bucket', [[0, 0], [0.13, 0], [0.16, 0.34], [0.165, 0.34], [0, 0.32]], cx + 1.25, 0, cz + 0.55);
    // escabeau en aluminium
    const lx = cx - 0.6;
    const lz = cz - 0.9;
    for (const s of [-1, 1]) {
      for (const side of [-0.22, 0.22]) {
        const g = new THREE.BoxGeometry(0.035, 1.75, 0.06);
        g.rotateX(s * 0.24);
        g.translate(side, 0.85, s * 0.2);
        k.add('alu', g.rotateY(i).translate(lx, k.L, lz));
      }
    }
    for (let j = 1; j < 6; j++) {
      const g = new THREE.BoxGeometry(0.44, 0.025, 0.08);
      g.translate(0, j * 0.28, -0.2 + j * 0.035);
      k.add('alu', g.rotateY(i).translate(lx, k.L, lz));
    }
    // projecteur sur trépied
    const wx = cx + 1.3;
    const wz = cz - 1.1;
    for (let j = 0; j < 3; j++) {
      const a = (j / 3) * Math.PI * 2;
      k.tube('cable', [[wx + Math.cos(a) * 0.35, 0, wz + Math.sin(a) * 0.35], [wx, 1.3, wz]], 0.012);
    }
    k.rb('worklight', wx, 1.32, wz, 0.32, 0.24, 0.1, 0.02, 2.4 + i);
    k.tube('cable', [[wx, 1.3, wz], [wx + 0.3, 0.02, wz + 0.6], [wx + 1.2, 0.01, wz + 0.4]], 0.008);
    // planches et cartons de carrelage
    for (let j = 0; j < 4; j++) k.box('timber', cx - 1.5, cx + 0.9, j * 0.025, j * 0.025 + 0.022, cz + 1.5 + j * 0.13, cz + 1.62 + j * 0.13);
    k.rb('tileBox', cx + 0.2, 0, cz - 1.3, 0.62, 0.22, 0.42, 0.01, 0.1);
    k.rb('tileBox', cx + 0.22, 0.22, cz - 1.28, 0.62, 0.22, 0.42, 0.01, 0.05);
  }
}
