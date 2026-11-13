import * as THREE from 'three';

/**
 * L'atelier - ce qui entoure la maquette sur le plan de travail.
 *
 * À gauche, les plans : le rez-de-chaussée de la maison, tracé à la même
 * échelle que la maquette, et l'élévation glissée dessous. À droite, les
 * échantillons : les vraies matières, à leur grain réel, avant qu'elles ne
 * montent sur la maquette pendant la séquence de finition.
 *
 * Le plan de travail lui-même n'existe pas comme objet : c'est la page. Tout
 * est posé sur le même sol que la maquette (y = FLOOR) et y projette son
 * ombre - un seul espace, que la caméra parcourt sans coupe.
 */

export const FLOOR = -0.7;

const INK = '#27384a';
const PAPER = '#f3f0e8';

/* Emprises reprises de building.js : le plan dessine la maison telle qu'elle est. */
const G = { x0: -6, x1: 5, z0: -4, z1: 3.5 };
const SITE = { x0: -8.6, x1: 8.6, z0: -5.6, z1: 9.2 };

function sheetCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, w, h);
  // Trame de fond, à peine visible
  ctx.strokeStyle = 'rgba(39,56,74,0.07)';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  ctx.strokeStyle = INK;
  ctx.fillStyle = INK;
  ctx.lineCap = 'square';
  return [c, ctx];
}

function cartouche(ctx, w, h, lines) {
  const bw = 300;
  const bh = 118;
  const x = w - bw - 40;
  const y = h - bh - 40;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, bw, bh);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, y + 44);
  ctx.lineTo(x + bw, y + 44);
  ctx.moveTo(x, y + 82);
  ctx.lineTo(x + bw, y + 82);
  ctx.moveTo(x + 190, y + 82);
  ctx.lineTo(x + 190, y + bh);
  ctx.stroke();
  ctx.font = '600 21px "Schibsted Grotesk", system-ui, sans-serif';
  ctx.fillText(lines[0], x + 14, y + 29);
  ctx.font = '500 16px "Schibsted Grotesk", system-ui, sans-serif';
  ctx.fillText(lines[1], x + 14, y + 68);
  ctx.font = '500 14px "Schibsted Grotesk", system-ui, sans-serif';
  ctx.fillText(lines[2], x + 14, y + 105);
  ctx.fillText(lines[3], x + 204, y + 105);
  // Cadre de la feuille
  ctx.lineWidth = 2;
  ctx.strokeRect(22, 22, w - 44, h - 44);
}

/** Plan du rez-de-chaussée, dessiné à partir des cotes de la maquette. */
function drawPlan() {
  const W = 1280;
  const H = 1024;
  const [c, ctx] = sheetCanvas(W, H);
  const k = 56; // pixels par mètre
  const ox = W / 2 - ((SITE.x0 + SITE.x1) / 2) * k - 30;
  const oy = 90 - SITE.z0 * k;
  const X = (x) => ox + x * k;
  const Z = (z) => oy + z * k;
  const rect = (x0, x1, z0, z1) => [X(x0), Z(z0), (x1 - x0) * k, (z1 - z0) * k];
  const label = (t, x, z, size = 15) => {
    ctx.font = `600 ${size}px "Schibsted Grotesk", system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(t.split('').join(' '), X(x), Z(z));
    ctx.textAlign = 'left';
  };

  // Limite de parcelle
  ctx.setLineDash([10, 6]);
  ctx.lineWidth = 1.2;
  ctx.strokeRect(...rect(SITE.x0, SITE.x1, SITE.z0, SITE.z1));
  ctx.setLineDash([]);

  // Terrasse (lames) et bassin
  ctx.lineWidth = 0.8;
  ctx.globalAlpha = 0.55;
  for (let x = -6.9; x <= 1.4; x += 0.28) {
    ctx.beginPath();
    ctx.moveTo(X(x), Z(3.5));
    ctx.lineTo(X(x), Z(8.1));
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = PAPER;
  ctx.fillRect(...rect(-5.6, -1.6, 5.5, 7.3));
  ctx.fillStyle = INK;
  ctx.lineWidth = 1.6;
  ctx.strokeRect(...rect(-6.9, 1.4, 3.5, 8.1));
  ctx.strokeRect(...rect(-5.6, -1.6, 5.5, 7.3));
  ctx.lineWidth = 0.8;
  for (let z = 5.8; z < 7.2; z += 0.3) {
    ctx.beginPath();
    for (let x = -5.4; x <= -1.8; x += 0.1) ctx.lineTo(X(x), Z(z) + Math.sin(x * 9) * 2.2);
    ctx.stroke();
  }
  // Pas japonais
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 4; i++) ctx.strokeRect(...rect(2.0, 3.6, 5.0 + i, 5.75 + i));

  // Murs : pleins, percés de leurs baies
  const T = 0.3;
  const wall = (x0, x1, z0, z1) => ctx.fillRect(...rect(x0, x1, z0, z1));
  // façade avant (baie du séjour, porte, châssis fixe)
  wall(G.x0, -5.3, G.z1 - T, G.z1);
  wall(0.5, 2.25, G.z1 - T, G.z1);
  wall(3.35, 3.6, G.z1 - T, G.z1);
  wall(4.0, G.x1, G.z1 - T, G.z1);
  // arrière
  wall(G.x0, -3.9, G.z0, G.z0 + T);
  wall(-1.6, 2.2, G.z0, G.z0 + T);
  wall(3.4, G.x1, G.z0, G.z0 + T);
  // pignons
  wall(G.x0, G.x0 + T, G.z0, -2.6);
  wall(G.x0, G.x0 + T, -0.4, G.z1);
  wall(G.x1 - T, G.x1, G.z0, -1.6);
  wall(G.x1 - T, G.x1, 0.9, G.z1);
  // refend
  wall(0.9, 1.08, G.z0 + T, 0.4);
  wall(0.9, 1.08, 1.5, G.z1 - T);
  // Baies : double trait fin
  ctx.lineWidth = 1;
  const bay = (x0, x1, z0, z1) => ctx.strokeRect(...rect(x0, x1, z0, z1));
  bay(-5.3, 0.5, G.z1 - 0.2, G.z1 - 0.08);
  bay(3.6, 4.0, G.z1 - 0.2, G.z1 - 0.08);
  bay(-3.9, -1.6, G.z0 + 0.08, G.z0 + 0.2);
  bay(2.2, 3.4, G.z0 + 0.08, G.z0 + 0.2);
  bay(G.x0 + 0.08, G.x0 + 0.2, -2.6, -0.4);
  bay(G.x1 - 0.2, G.x1 - 0.08, -1.6, 0.9);
  // Porte d'entrée et son débattement
  ctx.beginPath();
  ctx.moveTo(X(2.25), Z(G.z1));
  ctx.lineTo(X(2.25), Z(G.z1 + 1.1));
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(X(2.25), Z(G.z1), 1.1 * k, 0, Math.PI / 2);
  ctx.stroke();

  // Escalier
  for (let i = 0; i <= 16; i++) {
    ctx.beginPath();
    ctx.moveTo(X(1.5 + i * 0.2), Z(-3.6));
    ctx.lineTo(X(1.5 + i * 0.2), Z(-2.65));
    ctx.stroke();
  }
  ctx.strokeRect(...rect(1.5, 4.7, -3.6, -2.65));
  ctx.beginPath();
  ctx.moveTo(X(1.7), Z(-3.12));
  ctx.lineTo(X(4.4), Z(-3.12));
  ctx.lineTo(X(4.25), Z(-3.25));
  ctx.moveTo(X(4.4), Z(-3.12));
  ctx.lineTo(X(4.25), Z(-2.99));
  ctx.stroke();

  // Mobilier, en trait léger
  ctx.globalAlpha = 0.6;
  ctx.strokeRect(...rect(-4.2, -1.3, -3.68, -3.08));
  ctx.strokeRect(...rect(-5.68, -4.2, -3.68, -3.05));
  ctx.strokeRect(...rect(-3.9, -1.5, -1.75, -0.85));
  ctx.strokeRect(...rect(-4.9, -2.5, 1.0, 2.0));
  for (let i = 0; i < 3; i++) {
    ctx.strokeRect(...rect(-4.55 + i * 0.75, -4.11 + i * 0.75, 0.55, 0.97));
    ctx.strokeRect(...rect(-4.55 + i * 0.75, -4.11 + i * 0.75, 2.1, 2.52));
  }
  ctx.strokeRect(...rect(-1.4, 0.5, -0.2, 0.65));
  ctx.strokeRect(...rect(-0.2, 0.5, 0.65, 1.9));
  ctx.strokeRect(...rect(-1.25, -0.5, 1.2, 1.9));
  ctx.globalAlpha = 1;

  // Cotes
  ctx.lineWidth = 1;
  const dimH = (x0, x1, z, text) => {
    ctx.beginPath();
    ctx.moveTo(X(x0), Z(z));
    ctx.lineTo(X(x1), Z(z));
    for (const x of [x0, x1]) {
      ctx.moveTo(X(x) - 6, Z(z) + 6);
      ctx.lineTo(X(x) + 6, Z(z) - 6);
      ctx.moveTo(X(x), Z(z) - 10);
      ctx.lineTo(X(x), Z(z) + 10);
    }
    ctx.stroke();
    ctx.font = '500 15px "Schibsted Grotesk", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(text, X((x0 + x1) / 2), Z(z) - 9);
    ctx.textAlign = 'left';
  };
  dimH(G.x0, G.x1, G.z0 - 0.75, '11,00');
  dimH(-5.3, 0.5, G.z0 - 0.75 + 0.02, '');
  ctx.beginPath();
  ctx.moveTo(X(G.x1 + 0.8), Z(G.z0));
  ctx.lineTo(X(G.x1 + 0.8), Z(G.z1));
  for (const z of [G.z0, G.z1]) {
    ctx.moveTo(X(G.x1 + 0.8) - 6, Z(z) + 6);
    ctx.lineTo(X(G.x1 + 0.8) + 6, Z(z) - 6);
    ctx.moveTo(X(G.x1 + 0.8) - 10, Z(z));
    ctx.lineTo(X(G.x1 + 0.8) + 10, Z(z));
  }
  ctx.stroke();
  ctx.save();
  ctx.translate(X(G.x1 + 0.8) + 22, Z((G.z0 + G.z1) / 2));
  ctx.rotate(Math.PI / 2);
  ctx.font = '500 15px "Schibsted Grotesk", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('7,50', 0, 0);
  ctx.restore();
  ctx.textAlign = 'left';

  // Noms des pièces
  label('SÉJOUR', -2.6, 2.75, 14);
  label('CUISINE', -2.7, -2.25, 14);
  label('HALL', 3.0, 0.2, 14);
  label('TERRASSE', -0.2, 4.4, 13);
  label('BASSIN', -3.6, 6.5, 13);
  label('JARDIN', 5.6, 7.4, 13);

  // Nord
  ctx.beginPath();
  ctx.arc(110, 120, 30, 0, Math.PI * 2);
  ctx.moveTo(110, 150);
  ctx.lineTo(110, 82);
  ctx.lineTo(100, 104);
  ctx.moveTo(110, 82);
  ctx.lineTo(120, 104);
  ctx.stroke();
  ctx.font = '600 16px "Schibsted Grotesk", system-ui, sans-serif';
  ctx.fillText('N', 104, 76);

  cartouche(ctx, W, H, ['CHAUDREL RÉNOVATION', 'Rez-de-chaussée', 'Maquette d’étude', '1 : 50']);
  return c;
}

/** Élévation de la façade avant : la feuille glissée sous le plan. */
function drawElevation() {
  const W = 1024;
  const H = 768;
  const [c, ctx] = sheetCanvas(W, H);
  const k = 50;
  const X = (x) => W / 2 + (x - 0.2) * k;
  const Yp = (y) => 560 - y * k;
  const rect = (x0, x1, y0, y1) => ctx.strokeRect(X(x0), Yp(y1), (x1 - x0) * k, (y1 - y0) * k);
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(60, Yp(0));
  ctx.lineTo(W - 60, Yp(0));
  ctx.stroke();
  ctx.lineWidth = 2;
  rect(-6, 5, 0.3, 3.2);
  rect(-3.2, 6, 3.2, 6.55);
  rect(-3.28, 6.08, 6.55, 6.9);
  ctx.lineWidth = 1.2;
  rect(-5.3, 0.5, 0.3, 2.95);
  for (let i = 1; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(X(-5.3 + i * 1.45), Yp(0.3));
    ctx.lineTo(X(-5.3 + i * 1.45), Yp(2.95));
    ctx.stroke();
  }
  rect(2.25, 3.35, 0.3, 2.6);
  rect(3.6, 4.0, 0.3, 2.6);
  rect(-2.5, 1.1, 3.5, 6.0);
  rect(2.3, 3.3, 3.5, 6.0);
  rect(4.3, 5.2, 3.5, 6.0);
  rect(-6, -3.2, 3.5, 4.55);
  // Bardage : hachures verticales
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = 0.8;
  for (let x = -3.2; x < 6; x += 0.16) {
    ctx.beginPath();
    ctx.moveTo(X(x), Yp(3.2));
    ctx.lineTo(X(x), Yp(6.55));
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  // Niveaux
  ctx.lineWidth = 1;
  ctx.font = '500 14px "Schibsted Grotesk", system-ui, sans-serif';
  for (const [y, t] of [[0.3, '± 0,00'], [3.5, '+ 3,20'], [6.9, '+ 6,60']]) {
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(X(6.4), Yp(y));
    ctx.lineTo(X(8.6), Yp(y));
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillText(t, X(7.2), Yp(y) - 8);
  }
  cartouche(ctx, W, H, ['CHAUDREL RÉNOVATION', 'Élévation avant', 'Maquette d’étude', '1 : 50']);
  return c;
}

function sheetTexture(canvas, anisotropy) {
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = anisotropy;
  return t;
}

/** Feuille posée à plat : un plan mince, UV 0 → 1, tourné de `rot` radians. */
function sheet(material, w, d, x, z, y, rot) {
  const g = new THREE.BoxGeometry(w, 0.025, d);
  const m = new THREE.Mesh(g, [material.edge, material.edge, material.face, material.edge, material.edge, material.edge]);
  m.position.set(x, FLOOR + y, z);
  m.rotation.y = rot;
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

/**
 * Fenêtre dans une texture : la face supérieure d'un échantillon posé en
 * (x0..x1, z0..z1) montre la portion [u0..u1] × [v0..v1] de l'image. C'est ce
 * qui donne aux échantillons leur grain « grandeur nature » - une seule lame
 * de chêne, une seule dalle - alors que la maquette porte la même matière au
 * 1 : 50.
 */
function windowed(source, [x0, x1, z0, z1], [u0, u1, v0, v1], anisotropy) {
  const t = source.clone();
  t.anisotropy = anisotropy;
  t.repeat.set((u1 - u0) / (x1 - x0), (v1 - v0) / (z1 - z0));
  t.offset.set(u0 - x0 * t.repeat.x, v0 - z0 * t.repeat.y);
  t.needsUpdate = true;
  return t;
}

export function createAtelier(T, { anisotropy = 4 } = {}) {
  const group = new THREE.Group();
  group.name = 'atelier';
  const disposables = [];
  const keep = (x) => {
    disposables.push(x);
    return x;
  };

  /* ---------- Plans ---------- */
  const uniforms = { uDraw: { value: 0 } };
  const paper = keep(new THREE.MeshStandardMaterial({ color: PAPER, roughness: 0.95 }));
  const drawn = (canvas) => {
    const map = keep(sheetTexture(canvas, anisotropy));
    const mat = keep(new THREE.MeshStandardMaterial({ map, roughness: 0.92 }));
    /* Le tracé apparaît en diagonale, comme sorti d'un traceur : avant le
       front, la feuille est vierge. */
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uDraw = uniforms.uDraw;
      shader.uniforms.uPaper = { value: new THREE.Color(PAPER) };
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', '#include <common>\nuniform float uDraw; uniform vec3 uPaper;')
        .replace(
          '#include <map_fragment>',
          `#include <map_fragment>
           float xpFront = (vMapUv.x + (1.0 - vMapUv.y)) * 0.5;
           float xpInk = 1.0 - smoothstep(uDraw * 1.15 - 0.12, uDraw * 1.15, xpFront);
           diffuseColor.rgb = mix(uPaper, diffuseColor.rgb, xpInk);`
        );
    };
    return { face: mat, edge: paper };
  };

  const PLAN = { x: -26, z: 19, w: 17.5, d: 14 };
  group.add(sheet(drawn(drawElevation()), 15, 11.25, PLAN.x - 3.4, PLAN.z - 4.6, 0.012, 0.16));
  group.add(sheet(drawn(drawPlan()), PLAN.w, PLAN.d, PLAN.x, PLAN.z, 0.04, -0.045));

  const wood = keep(new THREE.MeshStandardMaterial({ color: '#c9a779', roughness: 0.6 }));
  const brass = keep(new THREE.MeshStandardMaterial({ color: '#c8a96e', roughness: 0.32, metalness: 0.55 }));
  const graphite = keep(new THREE.MeshStandardMaterial({ color: '#2b2f2d', roughness: 0.6 }));
  const add = (geometry, material, x, y, z, ry = 0, rz = 0) => {
    const m = new THREE.Mesh(keep(geometry), material);
    m.position.set(x, FLOOR + y, z);
    m.rotation.set(0, ry, rz);
    m.castShadow = true;
    m.receiveShadow = true;
    group.add(m);
    return m;
  };
  // Rouleau de plans
  add(new THREE.CylinderGeometry(0.55, 0.55, 13, 28), paper, PLAN.x - 1.5, 0.55, PLAN.z - 9.6, 0.1, Math.PI / 2);
  // Règle et crayon
  add(new THREE.BoxGeometry(10.5, 0.09, 0.85), wood, PLAN.x + 2.2, 0.1, PLAN.z + 8.6, 0.05);
  const pencil = add(new THREE.CylinderGeometry(0.11, 0.11, 3.6, 6), brass, PLAN.x + 10.4, 0.16, PLAN.z + 3.4, 0.5, Math.PI / 2);
  const tip = new THREE.Mesh(keep(new THREE.ConeGeometry(0.11, 0.42, 6)), graphite);
  tip.position.y = -2.01;
  tip.rotation.z = Math.PI;
  tip.castShadow = true;
  pencil.add(tip);

  /* ---------- Échantillons ---------- */
  /* Disposés en damier devant la maquette, à droite ; `at` décale l'ensemble. */
  const at = ([x0, x1, z0, z1]) => [x0 + 3.4, x1 + 3.4, z0 + 14.2, z1 + 14.2];
  const SAMPLES = [
    // clé, emprise [x0, x1, z0, z1], épaisseur, texture, fenêtre [u0, u1, v0, v1], réglages
    ['pierre', at([14.2, 19.4, 2.4, 8.6]), 0.42, 'stone', [0.28, 0.72, 0.03, 0.22], { roughness: 0.82, bumpMap: 'stoneBump', bumpScale: 1.4 }],
    ['chene', at([20.2, 23.4, 1.6, 9.2]), 0.26, 'oak', [0.262, 0.368, 0, 0.92], { roughness: 0.55, bumpMap: 'oakBump', bumpScale: 1.2 }],
    ['bardage', at([24.2, 27.4, 2.6, 8.4]), 0.22, 'cladding', [0.05, 0.3, 0, 0.8], { roughness: 0.72, bumpMap: 'oakBump', bumpScale: 1.6 }],
    ['enduit', at([14.6, 18.8, 9.6, 13.6]), 0.3, 'plaster', [0, 1, 0, 1], { roughness: 0.96 }],
    ['dallage', at([19.6, 23.6, 10.0, 14.0]), 0.34, 'paving', [0.012, 0.238, 0.012, 0.238], { roughness: 0.7 }],
  ];
  const anchors = {};
  for (const [key, box, h, tex, win, opt] of SAMPLES) {
    const [x0, x1, z0, z1] = box;
    const map = keep(windowed(T[tex], box, win, anisotropy));
    const settings = { map, roughness: opt.roughness };
    if (opt.bumpMap) {
      settings.bumpMap = keep(windowed(T[opt.bumpMap], box, win, anisotropy));
      settings.bumpScale = opt.bumpScale;
    }
    const mat = keep(new THREE.MeshStandardMaterial(settings));
    const g = new THREE.BoxGeometry(x1 - x0, h, z1 - z0);
    g.translate((x0 + x1) / 2, h / 2, (z0 + z1) / 2);
    // UV en coordonnées du plan de travail : la fenêtre ci-dessus s'y applique.
    const p = g.attributes.position;
    const n = g.attributes.normal;
    const uv = g.attributes.uv;
    for (let i = 0; i < p.count; i++) {
      if (Math.abs(n.getY(i)) > 0.5) uv.setXY(i, p.getX(i), p.getZ(i));
      else if (Math.abs(n.getX(i)) > 0.5) uv.setXY(i, x0, p.getZ(i));
      else uv.setXY(i, p.getX(i), z0);
    }
    add(g, mat, 0, 0, 0);
    anchors[key] = [(x0 + x1) / 2, FLOOR + h, (z0 + z1) / 2];
  }
  // Plaque de laiton brossé : la quincaillerie, et la couleur de la maison.
  add(new THREE.BoxGeometry(2.6, 0.12, 3.6), brass, 29.3, 0.06, 26.1, -0.12);
  anchors.laiton = [29.3, FLOOR + 0.12, 26.1];
  anchors.plan = [PLAN.x + 4, FLOOR + 0.05, PLAN.z - 2];

  return {
    group,
    uniforms,
    anchors,
    dispose() {
      disposables.forEach((d) => d.dispose());
    },
  };
}
