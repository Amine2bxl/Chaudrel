import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { FOOTPRINT, LEVELS, OPENINGS, ROOF, ROOMS, STAIR, STAIR_HOLE } from './layout.js';

/**
 * Architecture : sols, murs percés, plafonds, menuiseries, escalier, façades,
 * jardin. Tout est rangé dans des « bacs » (groupe × matériau) puis fusionné :
 * une pièce entière se dessine en une poignée d'appels.
 *
 * Murs : chaque pièce pose ses propres demi-murs, côté intérieur. Une cloison
 * entre deux pièces est donc faite de deux moitiés - chacune prend la matière
 * (et l'état de chantier) de la pièce qu'elle regarde. La façade pose la
 * moitié extérieure des murs de périmètre.
 */

const TI = 0.075; // demi-cloison
const TE = 0.1; // doublage intérieur d'un mur de façade
const TO = 0.16; // parement extérieur

/* ------------------------------------------------------------ outillage */

/** UV en mètres, projetés selon la normale dominante de chaque face. */
export function worldUV(g, rot = 0) {
  const p = g.attributes.position;
  const n = g.attributes.normal;
  const uv = g.attributes.uv || new THREE.BufferAttribute(new Float32Array(p.count * 2), 2);
  const c = Math.cos(rot);
  const s = Math.sin(rot);
  for (let i = 0; i < p.count; i++) {
    const ax = Math.abs(n.getX(i));
    const ay = Math.abs(n.getY(i));
    const az = Math.abs(n.getZ(i));
    let u;
    let v;
    if (ay >= ax && ay >= az) {
      u = p.getX(i);
      v = p.getZ(i);
      const ru = u * c - v * s;
      v = u * s + v * c;
      u = ru;
    } else if (ax >= az) {
      u = p.getZ(i);
      v = p.getY(i);
    } else {
      u = p.getX(i);
      v = p.getY(i);
    }
    uv.setXY(i, u, v);
  }
  g.setAttribute('uv', uv);
  return g;
}

export function boxGeo(x0, x1, y0, y1, z0, z1) {
  const w = Math.abs(x1 - x0);
  const h = Math.abs(y1 - y0);
  const d = Math.abs(z1 - z0);
  if (w < 1e-4 || h < 1e-4 || d < 1e-4) return null;
  const g = new THREE.BoxGeometry(w, h, d);
  g.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
  return g;
}

/**
 * Bacs de géométrie. `add(group, material, geometry)` ; `build()` rend un
 * Map groupe → THREE.Group de meshes fusionnés.
 */
export function createBins() {
  const bins = new Map();
  return {
    add(group, material, g, opts = {}) {
      if (!g) return;
      if (!g.attributes.uv || opts.uv !== false) worldUV(g, opts.rot || 0);
      const geo = g.index ? g.toNonIndexed() : g;
      if (geo !== g) g.dispose();
      for (const k of Object.keys(geo.attributes)) if (!['position', 'normal', 'uv'].includes(k)) geo.deleteAttribute(k);
      const key = `${group}|${material.uuid}`;
      if (!bins.has(key)) bins.set(key, { group, material, list: [], shadow: opts.shadow !== false });
      bins.get(key).list.push(geo);
    },
    build() {
      const groups = new Map();
      for (const { group, material, list, shadow } of bins.values()) {
        const merged = mergeGeometries(list, false);
        list.forEach((g) => g.dispose());
        const mesh = new THREE.Mesh(merged, material);
        const transparent = material.transparent;
        mesh.castShadow = shadow && !transparent && !material.emissive?.getHex?.();
        mesh.receiveShadow = !transparent;
        if (transparent) mesh.renderOrder = 2;
        if (!groups.has(group)) {
          const gr = new THREE.Group();
          gr.name = group;
          groups.set(group, gr);
        }
        groups.get(group).add(mesh);
      }
      bins.clear();
      return groups;
    },
  };
}

/** Rectangle [a0, a1] × [y0, y1] moins des trous : bandes verticales. */
function wallPieces(a0, a1, y0, y1, holes) {
  const cuts = new Set([a0, a1]);
  for (const h of holes) {
    if (h.a1 <= a0 || h.a0 >= a1) continue;
    cuts.add(Math.max(a0, h.a0));
    cuts.add(Math.min(a1, h.a1));
  }
  const xs = [...cuts].sort((p, q) => p - q);
  const out = [];
  for (let i = 0; i < xs.length - 1; i++) {
    const c0 = xs[i];
    const c1 = xs[i + 1];
    if (c1 - c0 < 1e-4) continue;
    const mid = (c0 + c1) / 2;
    const inside = holes.filter((h) => h.a0 <= mid && h.a1 >= mid).sort((p, q) => p.y0 - q.y0);
    let y = y0;
    for (const h of inside) {
      if (h.y0 > y) out.push([c0, c1, y, Math.min(h.y0, y1)]);
      y = Math.max(y, h.y1);
    }
    if (y < y1) out.push([c0, c1, y, y1]);
  }
  return out;
}

/* ------------------------------------------------------------ construction */

/**
 * @param M  bibliothèque de matériaux (materials.js)
 * @returns { groups, frontDoor, colliders, windows }
 */
export function buildArchitecture(M, bins) {
  const colliders = []; // { l, x0, x1, z0, z1 }
  const windows = []; // pour les sources de lumière : { l, o, at, a0, a1, y0, y1, dir }
  const [FX0, FX1, FZ0, FZ1] = FOOTPRINT;
  const steel = M.fixed('steel');
  const glass = M.fixed('glass');
  const onLine = (o, at, l) => OPENINGS.filter((op) => op.o === o && Math.abs(op.at - at) < 1e-3 && (l === undefined || op.l === l));

  /** Un pan de mur (demi-épaisseur) le long d'une ligne, côté `side` (+1/-1). */
  function wall(group, material, o, at, a0, a1, side, t, yBase, h, holes, l, skirt) {
    const pieces = wallPieces(a0, a1, yBase, yBase + h, holes);
    for (const [c0, c1, y0, y1] of pieces) {
      const g =
        o === 'z'
          ? boxGeo(c0, c1, y0, y1, side > 0 ? at : at - t, side > 0 ? at + t : at)
          : boxGeo(side > 0 ? at : at - t, side > 0 ? at + t : at, y0, y1, c0, c1);
      bins.add(group, material, g);
      // plinthe : seulement au pied du mur
      if (skirt && Math.abs(y0 - yBase) < 1e-3) {
        const k = 0.012;
        const sg =
          o === 'z'
            ? boxGeo(c0, c1, yBase, yBase + 0.075, side > 0 ? at + t : at - t - k, side > 0 ? at + t + k : at - t)
            : boxGeo(side > 0 ? at + t : at - t - k, side > 0 ? at + t + k : at - t, yBase, yBase + 0.075, c0, c1);
        bins.add(skirt.group, skirt.material, sg);
      }
      if (l !== undefined && y0 < yBase + 1.2) {
        if (o === 'z') colliders.push({ l, x0: c0, x1: c1, z0: Math.min(at, at + side * t), z1: Math.max(at, at + side * t) });
        else colliders.push({ l, x0: Math.min(at, at + side * t), x1: Math.max(at, at + side * t), z0: c0, z1: c1 });
      }
    }
  }

  /* ---------- Pièces : sols, plafonds, demi-murs ---------- */
  for (const room of ROOMS) {
    const L = LEVELS[room.l];
    const [x0, x1, z0, z1] = room.r;
    const surf = `${room.id}:surf`;
    const furn = `${room.id}:furn`;
    const floorMat = M.surface(room.id, room.floor, room.rawFloor);
    const wallMat = M.surface(room.id, room.walls, room.rawWalls);
    const ceilMat = M.surface(room.id, room.ceiling || 'plaster', room.rawWalls === 'brick' ? 'rawPlaster' : room.rawWalls);
    const skirt = room.walls === 'stone' ? null : { group: furn, material: M.furniture(room.id, 'paintWhite') };

    if (!room.noFloor) {
      // le sol de l'entrée et de l'étage s'arrête au vide de l'escalier
      const holes = room.l === 1 ? [STAIR_HOLE] : [];
      const rects = subtractRect([x0, x1, z0, z1], holes);
      for (const [a, b, c, d] of rects) bins.add(surf, floorMat, boxGeo(a, b, L.y - 0.03, L.y, c, d), { rot: room.floor === 'chevron' ? 0 : 0 });
    }
    const ceilings = room.ceilings || (room.skylight ? subtractRect(room.r, [room.skylight]) : [room.r]);
    for (const [a, b, c, d] of ceilings) {
      const g = new THREE.PlaneGeometry(b - a, d - c);
      g.rotateX(Math.PI / 2);
      g.translate((a + b) / 2, L.y + L.h, (c + d) / 2);
      bins.add(surf, ceilMat, g);
    }

    const ext = (o, at) => (o === 'z' ? at === FZ0 || at === FZ1 : at === FX0 || at === FX1);
    const tS = ext('z', z0) ? TE : TI;
    const tN = ext('z', z1) ? TE : TI;
    const edges = [
      ['z', z0, x0, x1, +1, tS],
      ['z', z1, x0, x1, -1, tN],
      ['x', x0, z0 + tS, z1 - tN, +1, ext('x', x0) ? TE : TI],
      ['x', x1, z0 + tS, z1 - tN, -1, ext('x', x1) ? TE : TI],
    ];
    for (const [o, at, a0, a1, side, t] of edges) {
      const holes = onLine(o, at, room.l).map((h) => ({ ...h, y0: L.y + h.y0, y1: L.y + h.y1 }));
      wall(surf, wallMat, o, at, a0, a1, side, t, L.y, L.h, holes, room.l, skirt);
    }
  }

  /* ---------- Façades : parement extérieur, sur toute la hauteur ---------- */
  const render = M.fixed({ color: '#efebe4', roughness: 0.92 });
  const stoneExt = M.fixed('travertine');
  const lines = [
    ['z', FZ0, FX0 - TO, FX1 + TO, -1],
    ['z', FZ1, FX0 - TO, FX1 + TO, +1],
    ['x', FX0, FZ0, FZ1, -1],
    ['x', FX1, FZ0, FZ1, +1],
  ];
  for (const [o, at, a0, a1, side] of lines) {
    const holes = OPENINGS.filter((op) => op.o === o && Math.abs(op.at - at) < 1e-3).map((op) => ({
      a0: op.a0,
      a1: op.a1,
      y0: LEVELS[op.l].y + op.y0,
      y1: LEVELS[op.l].y + op.y1,
    }));
    // rez en pierre côté rue, enduit au-dessus
    const gfHoles = holes.filter((h) => h.y0 < LEVELS[1].y);
    const ufHoles = holes.filter((h) => h.y0 >= LEVELS[1].y - 0.01);
    const lower = o === 'z' && at === FZ0 ? stoneExt : render;
    wall('static', lower, o, at, a0, a1, side, TO, -0.25, LEVELS[1].y + 0.0 + 0.25, gfHoles);
    wall('static', render, o, at, a0, a1, side, TO, LEVELS[1].y, ROOF + 0.2 - LEVELS[1].y, ufHoles);
    colliders.push(
      o === 'z'
        ? { l: 0, x0: a0, x1: a1, z0: Math.min(at, at + side * TO), z1: Math.max(at, at + side * TO), ext: true, holes }
        : { l: 0, x0: Math.min(at, at + side * TO), x1: Math.max(at, at + side * TO), z0: a0, z1: a1, ext: true, holes }
    );
  }
  // couvertine, dalle de toiture, planchers (structure), bandeau du vide d'escalier
  const coping = M.fixed({ color: '#2b2a28', roughness: 0.5, metalness: 0.6 });
  bins.add('static', coping, boxGeo(FX0 - TO - 0.03, FX1 + TO + 0.03, ROOF + 0.2, ROOF + 0.25, FZ0 - TO - 0.03, FZ1 + TO + 0.03));
  bins.add('static', render, boxGeo(FX0, FX1, LEVELS[1].y + LEVELS[1].h, ROOF, FZ0, FZ1));
  for (const [a, b, c, d] of subtractRect(FOOTPRINT, [STAIR_HOLE])) bins.add('static', render, boxGeo(a, b, LEVELS[0].h, LEVELS[1].y - 0.03, c, d));
  const band = M.fixed('plaster');
  bins.add('static', band, boxGeo(STAIR_HOLE[0] - TI, STAIR_HOLE[0], LEVELS[0].h, LEVELS[1].y, STAIR_HOLE[2], STAIR_HOLE[3]));
  bins.add('static', band, boxGeo(STAIR_HOLE[0], STAIR_HOLE[1], LEVELS[0].h, LEVELS[1].y, STAIR_HOLE[3], STAIR_HOLE[3] + TI));

  /* ---------- Menuiseries ---------- */
  const casing = M.fixed('paintWhite');
  const leafMat = M.fixed('joinery');
  const brass = M.fixed('metal');
  const sillIn = M.fixed('stone');
  let frontDoor = null;

  for (const op of OPENINGS) {
    const L = LEVELS[op.l];
    const y0 = L.y + op.y0;
    const y1 = L.y + op.y1;
    const w = op.a1 - op.a0;
    const isExt = op.o === 'z' ? op.at === FZ0 || op.at === FZ1 : op.at === FX0 || op.at === FX1;
    // repère local : u le long du mur, n à travers (vers +z ou +x)
    const put = (mat, u0, u1, yy0, yy1, n0, n1, group = 'static') => {
      const g = op.o === 'z' ? boxGeo(u0, u1, yy0, yy1, op.at + n0, op.at + n1) : boxGeo(op.at + n0, op.at + n1, yy0, yy1, u0, u1);
      bins.add(group, mat, g);
    };
    const inward = isExt ? (op.at === FZ0 || op.at === FX0 ? 1 : -1) : 1;

    if (op.t === 'window' || op.t === 'glazing') {
      const f = 0.045;
      const n0 = -0.03;
      const n1 = 0.03;
      put(steel, op.a0, op.a1, y0, y0 + f, n0, n1);
      put(steel, op.a0, op.a1, y1 - f, y1, n0, n1);
      put(steel, op.a0, op.a0 + f, y0, y1, n0, n1);
      put(steel, op.a1 - f, op.a1, y0, y1, n0, n1);
      const panels = op.t === 'glazing' ? Math.max(2, Math.round(w / 1.2)) : w > 1.7 ? 2 : 1;
      for (let i = 1; i < panels; i++) {
        const u = op.a0 + (w * i) / panels;
        put(steel, u - f / 2, u + f / 2, y0, y1, n0, n1);
      }
      const open = op.open;
      for (let i = 0; i < panels; i++) {
        const u0 = op.a0 + (w * i) / panels + f / 2;
        const u1 = op.a0 + (w * (i + 1)) / panels - f / 2;
        const isOpen = open && u0 < open[1] && u1 > open[0];
        if (isOpen) {
          // panneau coulissé derrière son voisin, côté extérieur
          const shift = (u1 - u0 + f) * (i === panels - 1 ? -1 : 1);
          put(glass, u0 + shift, u1 + shift, y0 + f, y1 - f, -0.06 * inward - 0.005, -0.06 * inward + 0.005);
          put(steel, u0 + shift - f / 2, u0 + shift, y0, y1, -0.06 * inward - 0.02, -0.06 * inward + 0.02);
          continue;
        }
        put(glass, u0, u1, y0 + f, y1 - f, -0.004, 0.004);
        if (op.y0 < 0.5) {
          if (op.o === 'z') colliders.push({ l: op.l, x0: u0, x1: u1, z0: op.at - 0.05, z1: op.at + 0.05 });
          else colliders.push({ l: op.l, x0: op.at - 0.05, x1: op.at + 0.05, z0: u0, z1: u1 });
        }
      }
      if (op.t === 'window') {
        // tablette intérieure en pierre, appui extérieur métal
        put(sillIn, op.a0 - 0.03, op.a1 + 0.03, y0 - 0.03, y0, inward > 0 ? 0 : -(TE + 0.05), inward > 0 ? TE + 0.05 : 0);
        put(coping, op.a0 - 0.02, op.a1 + 0.02, y0 - 0.025, y0, inward > 0 ? -(TO + 0.04) : 0, inward > 0 ? 0 : TO + 0.04);
      } else {
        put(steel, op.a0, op.a1, y0, y0 + 0.012, -0.12, 0.12);
      }
      windows.push({ ...op, y0, y1, inward });
      continue;
    }

    if (op.t === 'arch') continue;

    // huisserie (chambranle) des deux côtés
    if (op.t !== 'front') {
      const c = 0.055;
      for (const side of [1, -1]) {
        const n0 = side > 0 ? TI : -TI - 0.012;
        const n1 = side > 0 ? TI + 0.012 : -TI;
        put(casing, op.a0 - c, op.a0, y0, y1 + c, n0, n1);
        put(casing, op.a1, op.a1 + c, y0, y1 + c, n0, n1);
        put(casing, op.a0 - c, op.a1 + c, y1, y1 + c, n0, n1);
      }
    }
    if (op.t === 'door') {
      // porte à galandage : le vantail est escamoté dans la cloison
    } else if (op.t === 'closed') {
      put(leafMat, op.a0 + 0.005, op.a1 - 0.005, y0, y1 - 0.005, -0.02, 0.02);
      if (op.o === 'z') colliders.push({ l: op.l, x0: op.a0, x1: op.a1, z0: op.at - 0.05, z1: op.at + 0.05 });
      else colliders.push({ l: op.l, x0: op.at - 0.05, x1: op.at + 0.05, z0: op.a0, z1: op.a1 });
      put(brass, op.a1 - 0.12, op.a1 - 0.1, y0 + 0.98, y0 + 1.06, -0.06, 0.06);
    } else if (op.t === 'front') {
      // porte d'entrée pivotante : vantail plein en noyer, tirage en laiton
      const g = new THREE.Group();
      const leafG = boxGeo(0, w - 0.02, 0, y1 - y0 - 0.01, -0.03, 0.03);
      worldUV(leafG);
      const leafMesh = new THREE.Mesh(leafG, leafMat);
      leafMesh.castShadow = true;
      leafMesh.receiveShadow = true;
      g.add(leafMesh);
      const pull = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.4, 12), brass);
      pull.position.set(w - 0.16, 1.15, -0.09);
      pull.castShadow = true;
      g.add(pull);
      for (const yy of [0.5, 1.8]) {
        const s = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.06, 8), brass);
        s.rotation.x = Math.PI / 2;
        s.position.set(w - 0.16, yy, -0.06);
        g.add(s);
      }
      g.position.set(op.a0 + 0.01, y0, op.at);
      frontDoor = g;
      put(steel, op.a0 - 0.04, op.a1 + 0.04, y1, y1 + 0.04, -0.04, 0.04);
    }
  }

  /* ---------- Escalier : marches massives, nez en pierre, claustra ---------- */
  const stairRoom = 'hall';
  const tread = M.surface(stairRoom, 'stone', 'screed');
  const stairBody = M.surface(stairRoom, 'plaster', 'rawPlaster');
  for (let i = 0; i < STAIR.steps; i++) {
    const z0 = STAIR.z0 + i * STAIR.run;
    const top = (i + 1) * STAIR.rise;
    bins.add(`${stairRoom}:surf`, stairBody, boxGeo(STAIR.x0, STAIR.x1, 0, top - 0.04, z0, z0 + STAIR.run));
    bins.add(`${stairRoom}:surf`, tread, boxGeo(STAIR.x0 - 0.015, STAIR.x1, top - 0.04, top, z0 - 0.02, z0 + STAIR.run));
  }
  // claustra de chêne côté entrée : lames verticales du sol au plafond
  const slat = M.furniture('hall', 'oak');
  for (let z = STAIR.z0 + 0.06; z < STAIR_HOLE[3] - 0.02; z += 0.095) {
    bins.add('hall:furn', slat, boxGeo(STAIR.x0 - 0.06, STAIR.x0 - 0.015, 0, LEVELS[0].h, z, z + 0.04));
  }
  colliders.push({ l: 0, x0: STAIR.x0 - 0.06, x1: STAIR.x0 - 0.015, z0: STAIR.z0, z1: STAIR_HOLE[3], screen: true });
  // puits de lumière : gaine, vitrage, ciel
  const [sx0, sx1, sz0, sz1] = ROOMS.find((r) => r.id === 'stairwell').skylight;
  const top = LEVELS[1].y + LEVELS[1].h;
  bins.add('static', band, boxGeo(sx0 - 0.02, sx0, top, top + 0.5, sz0, sz1));
  bins.add('static', band, boxGeo(sx1, sx1 + 0.02, top, top + 0.5, sz0, sz1));
  bins.add('static', band, boxGeo(sx0, sx1, top, top + 0.5, sz0 - 0.02, sz0));
  bins.add('static', band, boxGeo(sx0, sx1, top, top + 0.5, sz1, sz1 + 0.02));
  bins.add('static', M.fixed({ color: '#dfe9ef', emissive: '#e9f1f6', emissiveIntensity: 2.2, roughness: 1 }), boxGeo(sx0, sx1, top + 0.5, top + 0.52, sz0, sz1));
  windows.push({ skylight: true, x0: sx0, x1: sx1, z0: sz0, z1: sz1, y: top });

  /* ---------- Abords : jardin, allée, terrasse, bassin, haies ---------- */
  const lawn = M.fixed('lawn');
  const pavers = M.fixed('pavers');
  const hedge = M.fixed('hedge');
  const water = M.fixed('water');
  bins.add('site', lawn, boxGeo(-30, 47, -0.12, -0.04, -30, 45), { shadow: false });
  bins.add('site', pavers, boxGeo(6.9, 8.4, -0.06, -0.02, -20, -1.6));
  bins.add('site', pavers, boxGeo(6.0, 9.6, -0.04, 0.0, -1.6, 0));
  bins.add('site', pavers, boxGeo(4.6, 17.4, -0.04, 0.0, 11, 14.8));
  // auvent d'entrée en noyer
  bins.add('static', leafMat, boxGeo(6.2, 9.4, 2.9, 3.0, -1.5, 0));
  // bassin
  bins.add('site', pavers, boxGeo(6.3, 14.9, -0.04, 0.0, 15.6, 16.0));
  bins.add('site', pavers, boxGeo(6.3, 14.9, -0.04, 0.0, 20.0, 20.4));
  bins.add('site', pavers, boxGeo(6.3, 6.7, -0.04, 0.0, 16.0, 20.0));
  bins.add('site', pavers, boxGeo(14.5, 14.9, -0.04, 0.0, 16.0, 20.0));
  bins.add('site', water, boxGeo(6.7, 14.5, -0.3, -0.12, 16.0, 20.0), { shadow: false });
  for (const [a, b, c, d] of [
    [-8, 6.6, -20, -19],
    [8.7, 25, -20, -19],
    [-8, -7, -20, 30],
    [24, 25, -20, 30],
    [-8, 25, 29, 30],
  ]) {
    bins.add('site', hedge, boxGeo(a, b, -0.05, 1.9, c, d));
  }

  return { frontDoor, colliders, windows };
}

/** Rectangle moins des trous rectangulaires (découpe en bandes). */
export function subtractRect([x0, x1, z0, z1], holes) {
  const hs = holes.filter((h) => h[0] < x1 && h[1] > x0 && h[2] < z1 && h[3] > z0);
  if (!hs.length) return [[x0, x1, z0, z1]];
  const xs = [...new Set([x0, x1, ...hs.flatMap((h) => [Math.max(x0, h[0]), Math.min(x1, h[1])])])].sort((a, b) => a - b);
  const out = [];
  for (let i = 0; i < xs.length - 1; i++) {
    const a = xs[i];
    const b = xs[i + 1];
    const mid = (a + b) / 2;
    const inside = hs.filter((h) => h[0] <= mid && h[1] >= mid).sort((p, q) => p[2] - q[2]);
    let z = z0;
    for (const h of inside) {
      if (h[2] > z) out.push([a, b, z, Math.min(h[2], z1)]);
      z = Math.max(z, h[3]);
    }
    if (z < z1) out.push([a, b, z, z1]);
  }
  return out;
}
