/**
 * La maison - plan, ouvertures, pièces, points de vue.
 *
 * Une maison d'étude (pas un chantier Chaudrel) dessinée pour être visitée à
 * hauteur d'œil : deux niveaux, un rez ouvert (hall, cuisine, salle à manger,
 * séjour) bouclé par un cellier et une terrasse, un étage de nuit (palier,
 * suite parentale, chambre, salle de bain) relié par un escalier en travertin
 * sous un puits de lumière.
 *
 * Repère : x vers l'est, z de la façade avant (z = 0) vers le jardin, y vers le
 * haut, en mètres. Les ouvertures sont exprimées sur la ligne de mur qui les
 * porte ; chaque pièce en déduit ses demi-murs, la façade les siens.
 */

export const LEVELS = [
  { y: 0, h: 3.0 }, // rez : sol fini 0, plafond 3,00
  { y: 3.2, h: 2.8 }, // étage : sol fini 3,20, plafond 6,00
];
export const ROOF = 6.32;
export const FOOTPRINT = [0, 17, 0, 11];
export const EYE = 1.62;

/* Escalier : 16 marches de 20 cm, giron 26 cm, de z = 0,9 à z = 5,06. */
export const STAIR = { x0: 9.62, x1: 10.98, z0: 0.9, steps: 16, rise: 0.2, run: 0.26 };
STAIR.z1 = STAIR.z0 + STAIR.steps * STAIR.run;
export const STAIR_HOLE = [9.6, 11, 0, 5.1];

/**
 * Ouvertures. `o: 'z'` : mur à z = at, l'ouverture va de x = a0 à a1.
 * `o: 'x'` : mur à x = at, de z = a0 à a1. y0 / y1 relatifs au sol du niveau.
 *   front   porte d'entrée (vantail animé)
 *   door    passage avec huisserie, vantail ouvert
 *   closed  porte fermée (pièce hors visite)
 *   arch    baie libre, sans huisserie
 *   window  fenêtre : cadre, vitrage, tablette
 *   glazing baie vitrée toute hauteur ; `open` = partie coulissée ouverte
 */
export const OPENINGS = [
  // ---------- rez ----------
  { l: 0, o: 'z', at: 0, a0: 7.0, a1: 8.3, y0: 0, y1: 2.6, t: 'front' },
  { l: 0, o: 'z', at: 0, a0: 5.5, a1: 6.5, y0: 0.35, y1: 2.6, t: 'window' },
  { l: 0, o: 'z', at: 0, a0: 9.9, a1: 10.7, y0: 0.35, y1: 2.8, t: 'window' },
  { l: 0, o: 'z', at: 0, a0: 12.6, a1: 15.6, y0: 0.5, y1: 2.55, t: 'window' },
  { l: 0, o: 'z', at: 0, a0: 1.6, a1: 3.4, y0: 1.2, y1: 2.3, t: 'window' },
  { l: 0, o: 'z', at: 11, a0: 11.6, a1: 16.4, y0: 0, y1: 2.72, t: 'glazing', open: [11.7, 12.9] },
  { l: 0, o: 'z', at: 11, a0: 6.6, a1: 10.4, y0: 0, y1: 2.72, t: 'glazing', open: [9.2, 10.3] },
  { l: 0, o: 'z', at: 11, a0: 1.0, a1: 5.0, y0: 1.05, y1: 2.45, t: 'window' },
  { l: 0, o: 'x', at: 0, a0: 6.8, a1: 9.6, y0: 0.9, y1: 2.5, t: 'window' },
  { l: 0, o: 'x', at: 17, a0: 8.4, a1: 10.2, y0: 0.4, y1: 2.6, t: 'window' },
  { l: 0, o: 'x', at: 5, a0: 3.2, a1: 4.2, y0: 0, y1: 2.45, t: 'door' },
  { l: 0, o: 'z', at: 5.5, a0: 2.2, a1: 3.2, y0: 0, y1: 2.45, t: 'door' },
  { l: 0, o: 'z', at: 5.5, a0: 6.4, a1: 9.2, y0: 0, y1: 2.72, t: 'arch' },
  { l: 0, o: 'x', at: 6, a0: 5.9, a1: 10.6, y0: 0, y1: 2.72, t: 'arch' },
  { l: 0, o: 'x', at: 11, a0: 5.9, a1: 10.6, y0: 0, y1: 2.72, t: 'arch' },
  // ---------- étage ----------
  { l: 1, o: 'z', at: 0, a0: 1.2, a1: 3.4, y0: 1.15, y1: 2.35, t: 'window' },
  { l: 1, o: 'z', at: 0, a0: 5.6, a1: 8.6, y0: 0.45, y1: 2.45, t: 'window' },
  { l: 1, o: 'z', at: 0, a0: 9.9, a1: 10.7, y0: 0.2, y1: 2.6, t: 'window' },
  { l: 1, o: 'z', at: 0, a0: 13.0, a1: 15.5, y0: 0.8, y1: 2.4, t: 'window' },
  { l: 1, o: 'z', at: 11, a0: 11.8, a1: 16.2, y0: 0, y1: 2.5, t: 'glazing' },
  { l: 1, o: 'z', at: 11, a0: 6.5, a1: 9.5, y0: 0.8, y1: 2.4, t: 'window' },
  { l: 1, o: 'z', at: 11, a0: 1.0, a1: 4.0, y0: 0.8, y1: 2.4, t: 'window' },
  { l: 1, o: 'x', at: 17, a0: 2.5, a1: 5.5, y0: 0.6, y1: 2.4, t: 'window' },
  { l: 1, o: 'x', at: 0, a0: 5.4, a1: 6.5, y0: 0.9, y1: 2.4, t: 'window' },
  { l: 1, o: 'z', at: 5.1, a0: 2.6, a1: 3.5, y0: 0, y1: 2.3, t: 'door' },
  { l: 1, o: 'z', at: 5.1, a0: 5.4, a1: 6.3, y0: 0, y1: 2.3, t: 'door' },
  { l: 1, o: 'z', at: 5.1, a0: 9.6, a1: 11, y0: 0, y1: 2.8, t: 'arch' },
  { l: 1, o: 'x', at: 11, a0: 5.35, a1: 6.55, y0: 0, y1: 2.35, t: 'door' },
  { l: 1, o: 'z', at: 6.8, a0: 7.2, a1: 8.1, y0: 0, y1: 2.3, t: 'closed' },
  { l: 1, o: 'z', at: 6.8, a0: 1.6, a1: 2.5, y0: 0, y1: 2.3, t: 'closed' },
];

/**
 * Pièces. `r` : [x0, x1, z0, z1]. Les emplacements de matière (`floor`,
 * `walls`, `ceiling`) renvoient aux emplacements du style choisi
 * (surfaces.js) ; `raw*` à l'état de chantier.
 */
export const ROOMS = [
  {
    id: 'hall', l: 0, r: [5, 11, 0, 5.5], name: 'Entrée',
    floor: 'stone', walls: 'plaster', rawWalls: 'rawPlaster', rawFloor: 'screed',
    ceilings: [[5, 9.6, 0, 5.5], [9.6, 11, 5.1, 5.5]],
    title: 'Entrer sur le travertin',
    text: 'Un sol de travertin adouci qui monte jusqu’à l’étage, un mur de noyer qui cache les rangements, et la lumière du puits qui descend le long de l’escalier.',
    materials: ['stone', 'joinery', 'plaster', 'metal'],
    detail: 'Les nez de marche sont taillés dans la même pierre que le sol : un seul matériau, sans profilé.',
  },
  {
    id: 'pantry', l: 0, r: [0, 5, 0, 5.5], name: 'Cellier',
    floor: 'stone', walls: 'plaster', rawWalls: 'rawPlaster', rawFloor: 'screed',
    title: 'Le passage de service',
    text: 'Entre l’entrée et la cuisine, un couloir de rangements toute hauteur. On rentre les courses sans traverser le séjour.',
    materials: ['joinery', 'stone', 'plaster'],
  },
  {
    id: 'kitchen', l: 0, r: [0, 6, 5.5, 11], name: 'Cuisine',
    floor: 'chevron', walls: 'plaster', rawWalls: 'brick', rawFloor: 'screed',
    title: 'Un îlot de marbre, à hauteur de main',
    text: 'Façades sans poignée, plan de travail en marbre veiné de cinq centimètres, retombées en cascade. Le mur de brique d’origine est enduit, la fenêtre élargie sur le jardin.',
    materials: ['marble', 'joinery', 'chevron', 'metal'],
    detail: 'Le marbre est poli sur le plateau, adouci sur la tranche : la lumière n’y accroche pas de la même façon.',
  },
  {
    id: 'dining', l: 0, r: [6, 11, 5.5, 11], name: 'Salle à manger',
    floor: 'chevron', walls: 'plaster', rawWalls: 'brick', rawFloor: 'screed',
    title: 'Une table pour huit, face au jardin',
    text: 'Le point de Hongrie traverse cuisine, salle à manger et séjour sans seuil : un seul parquet, trois pièces.',
    materials: ['chevron', 'joinery', 'metal'],
  },
  {
    id: 'living', l: 0, r: [11, 17, 0, 11], name: 'Séjour',
    floor: 'chevron', walls: 'plaster', rawWalls: 'brick', rawFloor: 'screed',
    title: 'Chêne, bouclette et pierre',
    text: 'Le mur du foyer est habillé de la même pierre que l’entrée. Baie coulissante de presque cinq mètres sur la terrasse.',
    materials: ['chevron', 'stone', 'fabric', 'plaster'],
    detail: 'Le parquet est posé en point de Hongrie : chaque lame est coupée à 45° et ajustée à la main.',
  },
  {
    id: 'corridor', l: 1, r: [0, 11, 5.1, 6.8], name: 'Palier',
    floor: 'oak', walls: 'plaster', rawWalls: 'rawPlaster', rawFloor: 'screed',
    title: 'Le couloir des chambres',
    text: 'Un parquet de chêne en lames larges pour tout l’étage, un garde-corps de verre sur le vide de l’escalier.',
    materials: ['oak', 'plaster', 'glass'],
  },
  {
    id: 'stairwell', l: 1, r: [9.6, 11, 0, 5.1], name: 'Escalier', noFloor: true,
    floor: 'stone', walls: 'plaster', rawWalls: 'rawPlaster', rawFloor: 'screed',
    skylight: [9.75, 10.85, 0.5, 4.6],
    title: 'Le puits de lumière',
    text: 'Seize marches de travertin entre deux murs d’enduit à la chaux, sous un lanterneau.',
    materials: ['stone', 'plaster'],
  },
  {
    id: 'master', l: 1, r: [11, 17, 0, 11], name: 'Suite parentale',
    floor: 'oak', walls: 'plaster', rawWalls: 'rawPlaster', rawFloor: 'screed',
    title: 'Se réveiller face aux arbres',
    text: 'Tête de lit en chêne toute hauteur, dressing en noyer, baie vitrée sur le jardin. Les rideaux de lin filtrent la lumière du matin.',
    materials: ['oak', 'joinery', 'fabric', 'plaster'],
  },
  {
    id: 'bedroom2', l: 1, r: [4.5, 9.6, 0, 5.1], name: 'Chambre',
    floor: 'oak', walls: 'plaster', rawWalls: 'rawPlaster', rawFloor: 'screed',
    title: 'Une chambre avec un bureau à la fenêtre',
    text: 'Une pièce calme sur rue, un bureau sous la fenêtre, une bibliothèque encastrée.',
    materials: ['oak', 'joinery', 'plaster'],
  },
  {
    id: 'bath', l: 1, r: [0, 4.5, 0, 5.1], name: 'Salle de bain',
    floor: 'stone', walls: 'stone', rawWalls: 'rawPlaster', rawFloor: 'screed',
    title: 'Pierre, lumière et eau',
    text: 'Travertin au sol et aux murs, double vasque sur un meuble en noyer, baignoire îlot sous la fenêtre et douche à l’italienne.',
    materials: ['stone', 'marble', 'joinery', 'metal'],
    detail: 'Les joints sont de deux millimètres, teintés dans la masse de la pierre.',
  },
  // Pièces hors visite : construites (on les voit depuis le jardin), portes fermées.
  { id: 'bedroom3', l: 1, r: [5, 11, 6.8, 11], name: 'Chambre 3', closed: true, floor: 'oak', walls: 'plaster', rawWalls: 'plaster', rawFloor: 'oak' },
  { id: 'study', l: 1, r: [0, 5, 6.8, 11], name: 'Bureau', closed: true, floor: 'oak', walls: 'plaster', rawWalls: 'plaster', rawFloor: 'oak' },
];

export const roomById = (id) => ROOMS.find((r) => r.id === id);

/** Dans quelle pièce se trouve un point ? (le niveau départage). */
export function roomAt(x, z, level) {
  return ROOMS.find((r) => r.l === level && x >= r.r[0] && x <= r.r[1] && z >= r.r[2] && z <= r.r[3]) || null;
}

/**
 * Points de vue. `p` : [x, z] au sol, `y` : hauteur du sol (0, 3.2, ou sur
 * l'escalier), `yaw` en degrés (0 = vers le jardin, +z ; 90 = vers l'est),
 * `pitch` en degrés. `main` : le point d'arrivée de la pièce.
 */
export const NODES = [
  { id: 'dehors', room: 'outside', p: [7.65, -6.5], y: 0, yaw: 0, pitch: 2, label: 'Devant la maison' },
  { id: 'seuil', room: 'outside', p: [7.65, -1.3], y: 0, yaw: 0, label: 'Le seuil' },
  { id: 'hall', room: 'hall', p: [7.2, 2.2], y: 0, yaw: 8, main: true, label: 'Entrée' },
  { id: 'hall-escalier', room: 'hall', p: [8.6, 0.9], y: 0, yaw: 62, pitch: 14, label: 'Pied de l’escalier' },
  { id: 'cellier', room: 'pantry', p: [2.6, 2.8], y: 0, yaw: 0, main: true, label: 'Cellier' },
  { id: 'salle-a-manger', room: 'dining', p: [8.4, 7.6], y: 0, yaw: 34, main: true, label: 'Salle à manger' },
  { id: 'cuisine', room: 'kitchen', p: [5.35, 6.25], y: 0, yaw: -46, pitch: -6, main: true, label: 'Cuisine' },
  { id: 'cuisine-detail', room: 'kitchen', p: [3.4, 7.2], y: 0, yaw: -12, pitch: -40, label: 'Le plan de marbre', detail: true },
  { id: 'sejour', room: 'living', p: [12.4, 6.4], y: 0, yaw: 98, main: true, label: 'Séjour' },
  { id: 'sejour-detail', room: 'living', p: [13.2, 2.0], y: 0, yaw: 128, pitch: -48, label: 'Le point de Hongrie', detail: true },
  { id: 'terrasse', room: 'outside', p: [11.2, 12.6], y: 0, yaw: 180, label: 'Terrasse' },
  { id: 'escalier', room: 'stairwell', p: [10.3, 2.9], y: 1.54, yaw: 0, pitch: 12, label: 'Escalier' },
  { id: 'palier', room: 'corridor', p: [9.4, 5.95], y: 3.2, yaw: -90, main: true, label: 'Palier' },
  { id: 'couloir', room: 'corridor', p: [4.2, 5.95], y: 3.2, yaw: -90, label: 'Couloir' },
  { id: 'suite', room: 'master', p: [11.95, 9.4], y: 3.2, yaw: 142, pitch: -6, main: true, label: 'Suite parentale' },
  { id: 'chambre', room: 'bedroom2', p: [6.0, 4.0], y: 3.2, yaw: 170, main: true, label: 'Chambre' },
  { id: 'bain', room: 'bath', p: [3.0, 4.2], y: 3.2, yaw: -160, main: true, label: 'Salle de bain' },
  { id: 'bain-detail', room: 'bath', p: [1.15, 3.0], y: 3.2, yaw: -98, pitch: -30, label: 'La vasque', detail: true },
];

/**
 * Liaisons. `via` : points de passage (seuils de porte, marches) pour que la
 * caméra franchisse les ouvertures au lieu de traverser les murs.
 */
export const EDGES = [
  ['dehors', 'seuil'],
  ['seuil', 'hall', { via: [[7.65, 0.2, 0]] }],
  ['hall', 'hall-escalier'],
  ['hall', 'cellier', { via: [[5.6, 3.7, 0], [4.4, 3.7, 0]] }],
  ['cellier', 'cuisine', { via: [[2.7, 4.9, 0], [2.7, 6.6, 0], [4.2, 6.9, 0]] }],
  ['hall', 'salle-a-manger', { via: [[7.8, 5.5, 0]] }],
  ['salle-a-manger', 'cuisine', { via: [[6, 6.6, 0]] }],
  ['cuisine', 'cuisine-detail'],
  ['salle-a-manger', 'sejour', { via: [[11, 7.4, 0]] }],
  ['sejour', 'sejour-detail'],
  ['sejour', 'terrasse', { via: [[12.3, 10.3, 0], [12.3, 11.8, 0]] }],
  ['salle-a-manger', 'terrasse', { via: [[9.75, 10.3, 0], [9.75, 11.8, 0]] }],
  [
    'hall-escalier',
    'escalier',
    { via: [[10.3, 0.45, 0], [10.3, 1.4, 0.4]] },
  ],
  ['escalier', 'palier', { via: [[10.3, 4.7, 2.95], [10.3, 5.5, 3.2]] }],
  ['palier', 'couloir'],
  ['palier', 'suite', { via: [[11, 5.95, 3.2], [11.9, 6.6, 3.2]] }],
  ['couloir', 'chambre', { via: [[5.85, 5.1, 3.2]] }],
  ['couloir', 'bain', { via: [[3.05, 5.95, 3.2], [3.05, 5.1, 3.2]] }],
  ['bain', 'bain-detail'],
];

export const nodeById = (id) => NODES.find((n) => n.id === id);

export function neighbours(id) {
  const out = [];
  for (const [a, b, opt] of EDGES) {
    if (a === id) out.push({ id: b, via: opt?.via || [] });
    else if (b === id) out.push({ id: a, via: [...(opt?.via || [])].reverse() });
  }
  return out;
}

/** Plus court chemin (en nombre d'étapes) entre deux points de vue. */
export function route(from, to) {
  if (from === to) return [from];
  const prev = { [from]: null };
  const queue = [from];
  while (queue.length) {
    const cur = queue.shift();
    for (const n of neighbours(cur)) {
      if (n.id in prev) continue;
      prev[n.id] = cur;
      if (n.id === to) {
        const path = [to];
        let k = cur;
        while (k) {
          path.unshift(k);
          k = prev[k];
        }
        return path;
      }
      queue.push(n.id);
    }
  }
  return null;
}

/** Points de la visite guidée, dans l'ordre. */
export const TOUR = ['hall', 'hall-escalier', 'salle-a-manger', 'sejour', 'sejour-detail', 'cuisine', 'cuisine-detail', 'escalier', 'palier', 'suite', 'couloir', 'chambre', 'bain', 'bain-detail'];

/** Hauteur du sol sous un point : rampe continue sur l'escalier (pour la caméra). */
export function floorAt(x, z, level = 0) {
  const onStair = x >= STAIR.x0 - 0.05 && x <= STAIR.x1 + 0.05 && z >= STAIR.z0 - 0.02 && z <= STAIR.z1 + 0.02;
  if (onStair) return Math.min(1, Math.max(0, (z - STAIR.z0) / (STAIR.z1 - STAIR.z0))) * LEVELS[1].y;
  return LEVELS[level].y;
}
