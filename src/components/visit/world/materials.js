import * as THREE from 'three';
import { LIBRARY, STYLES, DEFAULT_STYLE } from './styles.js';

/**
 * Matériaux de la maison.
 *
 * Quatre familles, toutes MeshStandardMaterial (PBR) :
 *   static    façades, menuiseries extérieures, vitrages - jamais transformés
 *   surface   sols, murs, plafonds d'une pièce : mélange chantier → fini
 *   furniture mobilier et équipements : apparaissent quand la pièce est finie
 *   raw       accessoires de chantier : disparaissent quand elle l'est
 *
 * La transformation est un front circulaire qui part d'un point (souvent la
 * place du visiteur) et s'étend dans la pièce. Il est bruité pour ne pas lire
 * comme un compas, et souligné d'un filet de laiton. Chaque pièce a son
 * propre front (uniforms partagés par tous ses matériaux).
 *
 * Rugosité : stockée dans l'alpha de la texture de couleur (surfaces.js).
 */

const GLOW = new THREE.Color('#e7c991').multiplyScalar(2.2);
/* Uniforms neutres des matériaux qui ne se transforment jamais. */
const STILL = { uXpO: { value: new THREE.Vector3() }, uXpR: { value: -100 } };

const HEADER_V = /* glsl */ `
varying vec3 vXpW;
`;
const HEADER_F = /* glsl */ `
varying vec3 vXpW;
uniform vec3 uXpO;
uniform float uXpR;
uniform vec3 uXpGlow;
float xpHash(vec3 p){ p = fract(p * .3183099 + .1); p *= 17.; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float xpNoise(vec3 x){
  vec3 i = floor(x), f = fract(x); f = f * f * (3. - 2. * f);
  return mix(mix(mix(xpHash(i), xpHash(i + vec3(1,0,0)), f.x), mix(xpHash(i + vec3(0,1,0)), xpHash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(xpHash(i + vec3(0,0,1)), xpHash(i + vec3(1,0,1)), f.x), mix(xpHash(i + vec3(0,1,1)), xpHash(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float xpFront(){
  float d = distance(vXpW.xz, uXpO.xz);
  return uXpR - d - xpNoise(vXpW * 3.1) * .55 - xpNoise(vXpW * 11.) * .14 + vXpW.y * .04;
}
`;

function inject(material, kind, extra = {}) {
  const uniforms = extra.uniforms;
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms, { uXpGlow: { value: GLOW } }, extra.shaderUniforms || {});
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${HEADER_V}`)
      .replace('#include <project_vertex>', '#include <project_vertex>\nvXpW = (modelMatrix * vec4(transformed, 1.0)).xyz;');

    let f = shader.fragmentShader.replace('#include <common>', `#include <common>\n${HEADER_F}`);
    if (kind === 'surface') {
      f = f
        .replace(
          '#include <common>',
          '#include <common>\nuniform sampler2D uXpRawMap; uniform sampler2D uXpRawNormal; uniform float uXpRawScale;'
        )
        .replace(
          '#include <map_fragment>',
          `float xpF = xpFront();
           float xpFin = smoothstep(-.03, .03, xpF);
           vec4 xpMap = texture2D(map, vMapUv);
           vec4 xpRaw = texture2D(uXpRawMap, vMapUv * uXpRawScale);
           diffuseColor.rgb *= mix(xpRaw.rgb, xpMap.rgb, xpFin);`
        )
        .replace(
          '#include <roughnessmap_fragment>',
          'float roughnessFactor = roughness * mix(xpRaw.a, xpMap.a, xpFin);'
        )
        .replace(
          'vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;',
          'vec3 mapN = mix(texture2D(uXpRawNormal, vNormalMapUv * uXpRawScale).xyz, texture2D(normalMap, vNormalMapUv).xyz, xpFin) * 2.0 - 1.0;'
        )
        .replace(
          '#include <emissivemap_fragment>',
          '#include <emissivemap_fragment>\ntotalEmissiveRadiance += uXpGlow * (1. - smoothstep(0., .035, abs(xpF))) * step(-50., uXpR) * step(uXpR, 50.);'
        );
    } else {
      // Mobilier et accessoires : rugosité dans l'alpha si une texture est posée
      f = f.replace(
        '#include <roughnessmap_fragment>',
        `#include <roughnessmap_fragment>
         #ifdef USE_MAP
           roughnessFactor *= texture2D(map, vMapUv).a;
         #endif`
      );
      if (kind === 'furniture' || kind === 'raw') {
        const keep = kind === 'furniture' ? 'xpF < 0.' : 'xpF > 0.';
        f = f
          .replace('void main() {', `void main() {\n  float xpF = xpFront();\n  if (${keep}) discard;`)
          .replace(
            '#include <emissivemap_fragment>',
            '#include <emissivemap_fragment>\ntotalEmissiveRadiance += uXpGlow * (1. - smoothstep(0., .06, abs(xpF))) * step(-50., uXpR) * step(uXpR, 50.);'
          );
      }
    }
    shader.fragmentShader = f;
  };
  material.customProgramCacheKey = () => `xp-${kind}`;
  return material;
}

/** Préréglages de matières non texturées. */
const PRESETS = {
  glass: { color: '#c9d3d2', roughness: 0.04, metalness: 0, transparent: true, opacity: 0.16, envMapIntensity: 1.4, depthWrite: false },
  showerGlass: { color: '#d6dddc', roughness: 0.08, metalness: 0, transparent: true, opacity: 0.1, envMapIntensity: 0.3, depthWrite: false },
  mirror: { color: '#d8dcdc', roughness: 0.02, metalness: 1 },
  ceramic: { color: '#f3f1ec', roughness: 0.18 },
  black: { color: '#1b1a19', roughness: 0.55 },
  charcoal: { color: '#2a2826', roughness: 0.7 },
  paintWhite: { color: '#f1ede6', roughness: 0.75 },
  lamp: { color: '#fff1d6', roughness: 0.9, emissive: '#ffd9a3', emissiveIntensity: 1.6 },
  bulb: { color: '#fff5e6', roughness: 0.5, emissive: '#ffe2b8', emissiveIntensity: 4 },
  fire: { color: '#2a1408', roughness: 1, emissive: '#ff8a3a', emissiveIntensity: 2.2 },
  leaf: { color: '#55603f', roughness: 0.75, side: THREE.DoubleSide },
  olive: { color: '#7d8668', roughness: 0.8, side: THREE.DoubleSide },
  trunk: { color: '#5b4a3a', roughness: 0.9 },
  terracotta: { color: '#b0735a', roughness: 0.85 },
  clay: { color: '#d8cdbd', roughness: 0.85 },
  water: { color: '#4e8e95', roughness: 0.03, metalness: 0.1, envMapIntensity: 1.6 },
  hedge: { color: '#3f4d31', roughness: 0.95 },
  book: { color: '#9a8a72', roughness: 0.8 },
  canvas: { color: '#ffffff', roughness: 0.9 },
  // Chantier
  bucket: { color: '#e9e4da', roughness: 0.6 },
  bucketOrange: { color: '#d4692c', roughness: 0.55 },
  sack: { color: '#cfc3ad', roughness: 0.95 },
  tarp: { color: '#c7c9c3', roughness: 0.7, side: THREE.DoubleSide },
  alu: { color: '#b9bcbf', roughness: 0.35, metalness: 1 },
  timber: { color: '#cdb38d', roughness: 0.85 },
  worklight: { color: '#f5f2e8', roughness: 0.4, emissive: '#fff4dd', emissiveIntensity: 3 },
  cable: { color: '#2c2b29', roughness: 0.6 },
  tileBox: { color: '#b9a98c', roughness: 0.9 },
  pipe: { color: '#b87849', roughness: 0.35, metalness: 1 },
};

export function createMaterials(baker, { style = DEFAULT_STYLE } = {}) {
  let styleKey = style;
  const roomUniforms = new Map();
  const made = new Map(); // clé -> matériau
  const textured = []; // { material, slot, raw? } à re-texturer quand le style change

  /** Uniforms de transformation d'une pièce (créés à la demande). */
  function uniformsFor(room) {
    if (!roomUniforms.has(room)) {
      roomUniforms.set(room, { uXpO: { value: new THREE.Vector3() }, uXpR: { value: -100 } });
    }
    return roomUniforms.get(room);
  }

  /** Nom de matière concret pour un emplacement de style (ou une matière directe). */
  const resolve = (slotOrKey) => STYLES[styleKey].slots[slotOrKey] || slotOrKey;

  function applyTexture(material, slot) {
    const key = resolve(slot);
    const t = baker.bake(key);
    const def = LIBRARY[key];
    material.map = t.map;
    material.normalMap = t.normalMap;
    material.userData.tile = t.size;
    material.normalScale.set(1, 1);
    // La répétition est portée par la texture (UV en mètres) : clonage léger
    // si la même texture doit vivre à une autre échelle.
    t.map.repeat.set(1 / t.size, 1 / t.size);
    t.normalMap.repeat.set(1 / t.size, 1 / t.size);
    material.metalness = def.type === 'brushed' ? 1 : def.type === 'steel' ? 0.6 : 0;
    material.roughness = 1;
    material.envMapIntensity = def.type === 'marble' ? 1.25 : 1;
    material.needsUpdate = true;
    return t;
  }

  function surface(room, slot, rawKey) {
    const id = `s|${room}|${slot}|${rawKey}`;
    if (made.has(id)) return made.get(id);
    const m = new THREE.MeshStandardMaterial();
    const t = applyTexture(m, slot);
    const raw = baker.bake(resolve(rawKey));
    const shaderUniforms = {
      uXpRawMap: { value: raw.map },
      uXpRawNormal: { value: raw.normalMap },
      uXpRawScale: { value: t.size / raw.size },
    };
    m.userData.shaderUniforms = shaderUniforms;
    inject(m, 'surface', { uniforms: uniformsFor(room), shaderUniforms });
    textured.push({ material: m, slot, rawKey });
    made.set(id, m);
    return m;
  }

  function plain(kind, room, spec) {
    const name = typeof spec === 'string' ? spec : spec.id || JSON.stringify(spec);
    const id = `${kind}|${room || ''}|${name}`;
    if (made.has(id)) return made.get(id);
    const m = new THREE.MeshStandardMaterial();
    if (typeof spec === 'string' && PRESETS[spec]) {
      const p = { ...PRESETS[spec] };
      if (p.color) p.color = new THREE.Color(p.color);
      if (p.emissive) p.emissive = new THREE.Color(p.emissive);
      m.setValues(p);
    } else if (typeof spec === 'string') {
      applyTexture(m, spec);
      textured.push({ material: m, slot: spec });
    } else {
      const p = { ...spec };
      delete p.id;
      if (typeof p.color === 'string') p.color = new THREE.Color(p.color);
      if (typeof p.emissive === 'string') p.emissive = new THREE.Color(p.emissive);
      m.setValues(p);
    }
    inject(m, kind, { uniforms: kind === 'static' ? STILL : uniformsFor(room) });
    made.set(id, m);
    return m;
  }

  return {
    surface,
    furniture: (room, spec) => plain('furniture', room, spec),
    raw: (room, spec) => plain('raw', room, spec),
    fixed: (spec) => plain('static', null, spec),
    uniformsFor,
    get style() {
      return styleKey;
    },
    /** Change de finition sans reconstruire la géométrie. */
    setStyle(next) {
      if (!STYLES[next] || next === styleKey) return;
      styleKey = next;
      for (const { material, slot } of textured) applyTexture(material, slot);
    },
    /** Pose une carte d'environnement (sonde de lumière) sur les matériaux d'un niveau. */
    forEach(fn) {
      made.forEach((m) => fn(m));
    },
    dispose() {
      made.forEach((m) => m.dispose());
      made.clear();
    },
  };
}
