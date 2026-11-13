import * as THREE from 'three';

/**
 * Surfaces - textures de matière calculées sur la carte graphique.
 *
 * Chaque matière est une fonction GLSL qui donne, pour un point d'une dalle
 * carrée, sa couleur, sa rugosité et son relief. Elle est rendue une fois dans
 * une texture (couleur + rugosité dans l'alpha), puis une seconde fois pour en
 * tirer la carte de normales. Tout est périodique : la dalle se répète sans
 * raccord. Aucune image à télécharger, et la définition suit l'appareil.
 *
 * Les couleurs sont écrites en sRGB et converties en linéaire à la sortie.
 */

const GLSL = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform int uType;
uniform int uPass;          // 0 couleur + rugosité, 1 normales
uniform float uTexel;
uniform float uSize;        // côté de la dalle, en mètres
uniform vec3 uTint;
uniform vec3 uTint2;
uniform float uSeed;

float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031 + uSeed * .0137); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
vec2 hash22(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973) + uSeed * .0137); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.xx + p3.yz) * p3.zy); }

// Bruit de gradient périodique (période entière en cellules)
float gnoise(vec2 p, vec2 per){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * f * (f * (f * 6. - 15.) + 10.);
  vec2 g00 = hash22(mod(i, per)) * 2. - 1.;
  vec2 g10 = hash22(mod(i + vec2(1, 0), per)) * 2. - 1.;
  vec2 g01 = hash22(mod(i + vec2(0, 1), per)) * 2. - 1.;
  vec2 g11 = hash22(mod(i + vec2(1, 1), per)) * 2. - 1.;
  float a = dot(g00, f), b = dot(g10, f - vec2(1, 0)), c = dot(g01, f - vec2(0, 1)), d = dot(g11, f - vec2(1, 1));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y) * 0.5 + 0.5;
}
// fbm périodique sur la dalle [0,1]² ; f = fréquences de départ (entières)
float fbm(vec2 uv, vec2 f, int oct){
  float s = 0., a = .5, n = 0.;
  for (int k = 0; k < 7; k++) {
    if (k >= oct) break;
    s += a * gnoise(uv * f, f); n += a; f *= 2.; a *= .5;
  }
  return s / n;
}
float cellular(vec2 p, vec2 per){
  vec2 i = floor(p), f = fract(p); float d = 8.;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 o = vec2(x, y); vec2 r = o + hash22(mod(i + o, per)) - f; d = min(d, dot(r, r));
  }
  return sqrt(d);
}
float joint(float t, float w){ float e = min(fract(t), 1. - fract(t)); return smoothstep(w * .5, w, e); }

// ---------------------------------------------------------------- matières
// Chaque fonction : uv dans [0,1], sortie couleur sRGB, rugosité, relief [0,1].

void travertine(vec2 uv, out vec3 c, out float r, out float h){
  // dalles 1,20 × 0,60, joints décalés d'une demi-dalle
  float row = floor(uv.y * 2.);
  float jx = joint(uv.x + row * .5, .0035), jy = joint(uv.y * 2., .007);
  vec2 q = vec2(fbm(uv, vec2(2, 6), 4), fbm(uv + .37, vec2(2, 6), 4));
  float band = fbm(vec2(uv.x, uv.y) + q * .08, vec2(3, 34), 5);
  float cloud = fbm(uv, vec2(4, 4), 5);
  float pit = cellular(vec2(uv.x * 36., uv.y * 150.), vec2(36, 150));
  float pits = 1. - smoothstep(.06, .16, pit) * 1.;
  pits *= smoothstep(.45, .7, fbm(uv, vec2(6, 12), 3));
  c = uTint * (0.9 + 0.16 * band + 0.06 * (cloud - .5));
  c = mix(c, uTint2, smoothstep(.62, .8, band) * .55);
  c = mix(c, c * .62, pits * .85);
  float j = uSize > 5. ? 1. : min(jx, jy);
  c = mix(c * .72, c, j);
  r = .42 + .12 * cloud + pits * .3;
  h = .55 + .05 * band - pits * .35 - (1. - j) * .5;
}

void marble(vec2 uv, out vec3 c, out float r, out float h){
  vec2 q = vec2(fbm(uv, vec2(2), 5), fbm(uv + 3.1, vec2(2), 5));
  vec2 w = vec2(fbm(uv + q * 1.6, vec2(3), 5), fbm(uv + q * 1.6 + 7.7, vec2(3), 5));
  float n = fbm(uv + w * 1.2, vec2(2), 6);
  float v1 = 1. - smoothstep(.0, .022, abs(n - .52));
  float v2 = 1. - smoothstep(.0, .008, abs(fbm(uv + w * 2.3 + 1.9, vec2(4), 6) - .5));
  float cloud = fbm(uv + w, vec2(3), 4);
  c = uTint * (.97 + .05 * cloud);
  c = mix(c, uTint2, v1 * .85);
  c = mix(c, mix(uTint2, uTint, .45), v2 * .6);
  r = .1 + .05 * cloud;
  h = .5 - v1 * .03;
}

// Plancher de chêne en point de Hongrie : colonnes de 30 cm, lames à 45°
void chevron(vec2 uv, out vec3 c, out float r, out float h){
  vec2 m = uv * uSize;
  float W = uSize / 4.;               // 4 colonnes par dalle
  float col = floor(m.x / W);
  float xl = m.x - col * W;
  float s = mod(col, 2.) * 2. - 1.;
  float t = m.y + s * (xl - W * .5);
  float hgt = uSize / 12.;            // 12 lames par dalle
  float idx = floor(t / hgt);
  float across = fract(t / hgt);
  vec2 id = vec2(mod(col, 4.), mod(idx, 12.));
  float tone = hash12(id * 1.7 + 3.);
  float along = xl / W + hash12(id) * 9.;
  float g = fbm(vec2(fract(along * .11), across), vec2(1, 2), 3);
  float rings = fract(across * 3.5 + 1.8 * gnoise(vec2(along * 2.2, across * 3. + tone * 10.), vec2(1000.)));
  float grain = smoothstep(.0, .12, rings) * smoothstep(1., .55, rings);
  float fleck = smoothstep(.72, .9, gnoise(vec2(along * 18., across * 6. + tone * 20.), vec2(1000.)));
  c = uTint * (.86 + .22 * tone + .08 * g);
  c = mix(c, c * .78, (1. - grain) * .5);
  c = mix(c, uTint2, fleck * .25);
  float jc = smoothstep(.0, .004, min(xl, W - xl));
  float jp = joint(t / hgt, .03);
  float j = min(jc, jp);
  c = mix(c * .55, c, j);
  r = .52 + .08 * g - fleck * .05;
  h = .6 + .04 * (grain - .5) - (1. - j) * .5;
}

// Lames de chêne larges, longueurs alternées
void planks(vec2 uv, out vec3 c, out float r, out float h){
  float rows = 12.;
  float row = floor(uv.y * rows);
  float off = hash12(vec2(row, 5.));
  float x = fract(uv.x + off);
  float plank = floor(x * 2.);
  float lx = fract(x * 2.);
  float across = fract(uv.y * rows);
  vec2 id = vec2(row, plank);
  float tone = hash12(id * 2.3);
  float rings = fract(across * 2.5 + 2. * gnoise(vec2(lx * 3. + tone * 7., across * 2.), vec2(1000.)));
  float grain = smoothstep(.0, .1, rings) * smoothstep(1., .6, rings);
  float g = gnoise(vec2(lx * 40., across * 3. + tone * 9.), vec2(1000.));
  c = uTint * (.88 + .18 * tone);
  c = mix(c, c * .8, (1. - grain) * .45 + g * .06);
  float j = min(joint(uv.y * rows, .035), smoothstep(.0, .003, min(lx, 1. - lx)));
  c = mix(c * .6, c, j);
  r = .5 + .06 * g;
  h = .6 + .03 * grain - (1. - j) * .45;
}

void walnut(vec2 uv, out vec3 c, out float r, out float h){
  // fil droit, légèrement ondulé, bandes de débit (dosse / quartier)
  float warp = fbm(vec2(uv.x, uv.y), vec2(3, 1), 4);
  float a = uv.x * 22. + 1.6 * warp + .35 * fbm(vec2(uv.x * 4., uv.y * 2.), vec2(4, 2), 3);
  float rings = fract(a);
  float grain = smoothstep(.0, .25, rings) * smoothstep(1., .55, rings);
  float flitch = fbm(vec2(uv.x * 3., .5), vec2(3, 1), 2);
  float fine = gnoise(vec2(uv.x * 260., uv.y * 5.), vec2(260., 5.));
  c = uTint * (.86 + .22 * flitch);
  c = mix(c, uTint2, (1. - grain) * .35);
  c *= .95 + .07 * fine;
  r = .4 + .08 * fine;
  h = .5 + .025 * grain + .02 * fine;
}

void plaster(vec2 uv, out vec3 c, out float r, out float h){
  float m = fbm(uv, vec2(3), 6);
  float tr = fbm(vec2(uv.x + uv.y * .3, uv.y), vec2(12, 3), 4);
  float spot = smoothstep(.6, .75, fbm(uv + 1.3, vec2(8), 4));
  c = uTint * (.965 + .05 * (m - .5) + .015 * (tr - .5));
  c = mix(c, uTint2, spot * .18);
  r = .88 - .1 * tr;
  h = .5 + .06 * (m - .5) + .03 * tr;
}

void concrete(vec2 uv, out vec3 c, out float r, out float h){
  float m = fbm(uv, vec2(3), 6);
  float cl = fbm(uv + 2.2, vec2(8), 4);
  float pore = 1. - smoothstep(.03, .09, cellular(uv * 90., vec2(90.)));
  pore *= step(.55, hash12(floor(uv * 90.)));
  c = uTint * (.92 + .14 * (m - .5) + .06 * (cl - .5));
  c = mix(c, uTint2, smoothstep(.55, .8, cl) * .25);
  c *= 1. - pore * .35;
  r = .7 + .1 * m;
  h = .5 + .04 * m - pore * .2;
}

// Tissu bouclette : boucles serrées
void boucle(vec2 uv, out vec3 c, out float r, out float h){
  float a = cellular(uv * 22., vec2(22.));
  float b = cellular(uv * 37. + .5, vec2(37.));
  float loops = 1. - min(a, b) * 1.3;
  float n = fbm(uv, vec2(6), 3);
  c = uTint * (.82 + .25 * loops + .05 * n);
  r = .96;
  h = loops;
}

// Lin : trame toile
void linen(vec2 uv, out vec3 c, out float r, out float h){
  float N = 64.;
  vec2 p = uv * N;
  float ck = mod(floor(p.x) + floor(p.y), 2.);
  float wx = sin(fract(p.x) * 3.1416), wy = sin(fract(p.y) * 3.1416);
  float slub = fbm(vec2(uv.x * 2., uv.y), vec2(8, 64), 3);
  float v = mix(wx, wy, ck);
  c = uTint * (.86 + .14 * v + .06 * (slub - .5));
  r = .95;
  h = .4 + .5 * v + .1 * slub;
}

void wool(vec2 uv, out vec3 c, out float r, out float h){
  float n = fbm(uv, vec2(40), 3);
  float big = fbm(uv, vec2(3), 4);
  float stripe = smoothstep(.0, .05, abs(fract(uv.y * 8.) - .5) - .45);
  c = uTint * (.88 + .16 * n + .06 * (big - .5));
  c = mix(c, uTint2, (1. - stripe) * .5);
  r = .98;
  h = n;
}

void brushed(vec2 uv, out vec3 c, out float r, out float h){
  float s = gnoise(vec2(uv.x * 3., uv.y * 400.), vec2(3., 400.));
  float s2 = gnoise(vec2(uv.x * 9., uv.y * 900.), vec2(9., 900.));
  c = uTint * (.92 + .08 * s + .04 * s2);
  r = .28 + .12 * s2;
  h = .5 + .05 * s;
}

void lawn(vec2 uv, out vec3 c, out float r, out float h){
  float big = fbm(uv, vec2(3), 5);
  float blades = gnoise(uv * vec2(260., 90.), vec2(260., 90.));
  c = mix(uTint, uTint2, big) * (.82 + .3 * blades);
  r = .95;
  h = blades;
}

void pavers(vec2 uv, out vec3 c, out float r, out float h){
  float j = min(joint(uv.x * 2., .012), joint(uv.y * 2., .012));
  vec2 id = floor(uv * 2.);
  float tone = hash12(id + 11.);
  float m = fbm(uv, vec2(5), 5);
  float speck = smoothstep(.62, .7, gnoise(uv * 120., vec2(120.)));
  c = uTint * (.9 + .12 * tone + .1 * (m - .5));
  c = mix(c, uTint2, speck * .3);
  c = mix(c * .6, c, j);
  r = .82;
  h = .55 + .05 * m - (1. - j) * .4;
}

// Chape brute : traces de lissage, auréoles
void screed(vec2 uv, out vec3 c, out float r, out float h){
  float m = fbm(uv, vec2(3), 6);
  vec2 cell = floor(uv * 4.);
  vec2 lc = fract(uv * 4.) - .5 + (hash22(mod(cell, 4.)) - .5) * .4;
  float swirl = .5 + .5 * sin(length(lc) * 60. + hash12(cell) * 6.);
  float stain = smoothstep(.55, .75, fbm(uv + 4.4, vec2(4), 4));
  float crack = 1. - smoothstep(.0, .004, abs(fbm(uv + 9.1, vec2(2), 5) - .5));
  c = uTint * (.9 + .14 * (m - .5) + .03 * swirl);
  c = mix(c, uTint2, stain * .35);
  c *= 1. - crack * .35;
  r = .8 - .1 * stain;
  h = .5 + .04 * swirl + .04 * m - crack * .3;
}

// Plaques de plâtre : joints bandés, vis, reprises d'enduit
void rawplaster(vec2 uv, out vec3 c, out float r, out float h){
  float m = fbm(uv, vec2(3), 5);
  float bx = fract(uv.x * 2.);
  float tape = 1. - smoothstep(.015, .03, min(bx, 1. - bx));
  vec2 sg = fract(uv * vec2(2., 8.)) - vec2(.0, .5);
  float screw = 1. - smoothstep(.0035, .006, length(vec2(min(sg.x, 1. - sg.x) * .5, sg.y * .125)));
  float pch = smoothstep(.56, .62, fbm(uv + 2.7, vec2(5), 5));
  c = uTint * (.93 + .08 * (m - .5));
  c = mix(c, vec3(.93, .9, .86), tape * .7);
  c = mix(c, uTint2, pch * .75);
  c = mix(c, c * .55, screw);
  r = .9;
  h = .5 + .03 * m + tape * .05 + pch * .04;
}

// Brique bruxelloise : 24 × 7,5 cm, appareil en panneresse
void brick(vec2 uv, out vec3 c, out float r, out float h){
  float course = floor(uv.y * 16.);
  float x = uv.x * 5. + mod(course, 2.) * .5;
  vec2 id = vec2(mod(floor(x), 5.), course);
  float lx = fract(x), ly = fract(uv.y * 16.);
  float mort = min(smoothstep(.0, .04, min(lx, 1. - lx)), smoothstep(.0, .12, min(ly, 1. - ly)));
  float tone = hash12(id * 1.3);
  float n = fbm(uv, vec2(20, 20), 4);
  vec3 b = mix(uTint, uTint2, tone);
  b *= .85 + .3 * n;
  b = mix(b, b * .6, smoothstep(.7, .95, hash12(id + 7.)) * .5);
  vec3 m = vec3(.62, .6, .56) * (.9 + .2 * n);
  c = mix(m, b, mort);
  r = .9;
  h = mort * (.7 + .1 * n);
}

void steel(vec2 uv, out vec3 c, out float r, out float h){
  float n = fbm(uv, vec2(6), 4);
  c = uTint * (.9 + .2 * n);
  r = .42 + .1 * n;
  h = .5;
}

void surface(vec2 uv, out vec3 c, out float r, out float h){
  if (uType == 0) travertine(uv, c, r, h);
  else if (uType == 1) marble(uv, c, r, h);
  else if (uType == 2) chevron(uv, c, r, h);
  else if (uType == 3) planks(uv, c, r, h);
  else if (uType == 4) walnut(uv, c, r, h);
  else if (uType == 5) plaster(uv, c, r, h);
  else if (uType == 6) concrete(uv, c, r, h);
  else if (uType == 7) boucle(uv, c, r, h);
  else if (uType == 8) linen(uv, c, r, h);
  else if (uType == 9) wool(uv, c, r, h);
  else if (uType == 10) brushed(uv, c, r, h);
  else if (uType == 11) lawn(uv, c, r, h);
  else if (uType == 12) pavers(uv, c, r, h);
  else if (uType == 13) screed(uv, c, r, h);
  else if (uType == 14) rawplaster(uv, c, r, h);
  else if (uType == 15) brick(uv, c, r, h);
  else steel(uv, c, r, h);
}

uniform float uBump;

void main(){
  vec3 c; float r; float h;
  if (uPass == 0) {
    surface(vUv, c, r, h);
    gl_FragColor = vec4(pow(clamp(c, 0., 1.), vec3(2.2)), clamp(r, .02, 1.));
  } else {
    vec3 c2; float r2; float hx0, hx1, hy0, hy1;
    surface(fract(vUv - vec2(uTexel, 0.)), c2, r2, hx0);
    surface(fract(vUv + vec2(uTexel, 0.)), c2, r2, hx1);
    surface(fract(vUv - vec2(0., uTexel)), c2, r2, hy0);
    surface(fract(vUv + vec2(0., uTexel)), c2, r2, hy1);
    vec3 n = normalize(vec3((hx0 - hx1) * uBump, (hy0 - hy1) * uBump, 1.));
    gl_FragColor = vec4(n * .5 + .5, 1.);
  }
}
`;

/* Types de surface, dans l'ordre du `if` GLSL. */
const TYPE = {
  travertine: 0, marble: 1, chevron: 2, planks: 3, walnut: 4, plaster: 5, concrete: 6, boucle: 7,
  linen: 8, wool: 9, brushed: 10, lawn: 11, pavers: 12, screed: 13, rawplaster: 14, brick: 15, steel: 16,
};

const C = (hex) => new THREE.Color(hex);

export { LIBRARY, STYLES, DEFAULT_STYLE } from './styles.js';
import { LIBRARY } from './styles.js';

/**
 * Génère les textures d'une liste de matières. `quality` : 'high' (1024 pour
 * les sols, 512 ailleurs) ou 'low' (512 / 256).
 */
export function createSurfaceBaker(renderer, { quality = 'high' } = {}) {
  const scene = new THREE.Scene();
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const mat = new THREE.ShaderMaterial({
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }',
    fragmentShader: GLSL,
    uniforms: {
      uType: { value: 0 },
      uPass: { value: 0 },
      uTexel: { value: 1 / 512 },
      uSize: { value: 1 },
      uTint: { value: new THREE.Color() },
      uTint2: { value: new THREE.Color() },
      uSeed: { value: 0 },
      uBump: { value: 1 },
    },
    depthTest: false,
    depthWrite: false,
  });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
  scene.add(quad);
  const cache = new Map();
  const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());

  function target(size) {
    const rt = new THREE.WebGLRenderTarget(size, size, {
      type: THREE.UnsignedByteType,
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
      magFilter: THREE.LinearFilter,
      wrapS: THREE.RepeatWrapping,
      wrapT: THREE.RepeatWrapping,
      depthBuffer: false,
    });
    rt.texture.anisotropy = aniso;
    rt.texture.colorSpace = THREE.NoColorSpace;
    return rt;
  }

  /** { map, normalMap, size } pour une matière de la bibliothèque. */
  function bake(key) {
    if (cache.has(key)) return cache.get(key);
    const def = LIBRARY[key];
    const hi = def.res === 'hi';
    const size = quality === 'high' ? (hi ? 1024 : 512) : hi ? 512 : 256;
    const color = target(size);
    const normal = target(size);
    const u = mat.uniforms;
    u.uType.value = TYPE[def.type];
    u.uTexel.value = 1 / size;
    u.uSize.value = def.size;
    u.uTint.value.copy(C(def.tint)).convertLinearToSRGB();
    u.uTint2.value.copy(C(def.tint2 || def.tint)).convertLinearToSRGB();
    u.uSeed.value = key.length * 7.3;
    u.uBump.value = def.bump * size / 512;
    const prevTarget = renderer.getRenderTarget();
    const prevXr = renderer.xr.enabled;
    renderer.xr.enabled = false;
    u.uPass.value = 0;
    renderer.setRenderTarget(color);
    renderer.render(scene, cam);
    u.uPass.value = 1;
    renderer.setRenderTarget(normal);
    renderer.render(scene, cam);
    renderer.setRenderTarget(prevTarget);
    renderer.xr.enabled = prevXr;
    const out = { map: color.texture, normalMap: normal.texture, size: def.size, targets: [color, normal] };
    cache.set(key, out);
    return out;
  }

  return {
    bake,
    dispose() {
      for (const v of cache.values()) v.targets.forEach((t) => t.dispose());
      cache.clear();
      mat.dispose();
      quad.geometry.dispose();
    },
  };
}
