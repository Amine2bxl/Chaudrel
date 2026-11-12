import * as THREE from 'three';
import { createTextures } from './textures.js';

/** Plâtre de maquette : l'état « brut » de toute la scène. */
export const CLAY = new THREE.Color('#d8d0c3');

/**
 * Matériaux PBR de la maison.
 *
 * Chaque matériau existe en deux états, mélangés dans le shader :
 *   - brut  : plâtre de maquette uniforme, mat ;
 *   - fini  : sa vraie matière (pierre, bardage, chêne, verre, métal…).
 * La frontière entre les deux est un plan horizontal, `uWipe`, qui monte des
 * fondations à la toiture : c'est la rénovation, racontée dans l'ordre où un
 * chantier se finit. Le plan est légèrement ondulé pour ne pas lire comme une
 * coupe d'ordinateur, et souligné d'un filet laiton - le trait d'un niveau laser.
 */
export function createMaterials({ textureSize = 512, anisotropy = 4 } = {}) {
  const T = createTextures(textureSize);
  Object.values(T).forEach((t) => (t.anisotropy = anisotropy));

  const uniforms = {
    uWipe: { value: -2 },
    uClay: { value: CLAY.clone() },
    uLine: { value: new THREE.Color('#c9ae83') },
    uLineOn: { value: 1 },
  };

  const inject = (material, { clayAlpha = 1 } = {}) => {
    material.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms, { uClayAlpha: { value: clayAlpha } });
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vLocal;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvLocal = position;');
      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          `#include <common>
           varying vec3 vLocal;
           uniform float uWipe; uniform vec3 uClay; uniform vec3 uLine;
           uniform float uLineOn; uniform float uClayAlpha;
           float xpFin;`
        )
        .replace(
          '#include <map_fragment>',
          `#include <map_fragment>
           float xpH = vLocal.y + sin(vLocal.x * 1.3 + vLocal.z * 0.9) * 0.07;
           xpFin = 1.0 - smoothstep(uWipe - 0.22, uWipe + 0.22, xpH);
           diffuseColor.rgb = mix(uClay, diffuseColor.rgb, xpFin);
           diffuseColor.a = mix(uClayAlpha, diffuseColor.a, xpFin);`
        )
        .replace(
          '#include <roughnessmap_fragment>',
          `#include <roughnessmap_fragment>
           roughnessFactor = mix(0.94, roughnessFactor, xpFin);`
        )
        .replace(
          '#include <metalnessmap_fragment>',
          `#include <metalnessmap_fragment>
           metalnessFactor = mix(0.0, metalnessFactor, xpFin);`
        )
        .replace(
          '#include <emissivemap_fragment>',
          `#include <emissivemap_fragment>
           totalEmissiveRadiance *= xpFin;
           float xpBand = 1.0 - smoothstep(0.0, 0.035, abs(xpH - uWipe));
           totalEmissiveRadiance += uLine * xpBand * uLineOn * 1.6;`
        );
    };
    return material;
  };

  const std = (opts, extra) => inject(new THREE.MeshStandardMaterial(opts), extra);

  const M = {
    // Enveloppe
    stone: std({ map: T.stone, bumpMap: T.stoneBump, bumpScale: 0.6, roughness: 0.86 }),
    cladding: std({ map: T.cladding, bumpMap: T.oakBump, bumpScale: 0.9, roughness: 0.78 }),
    oak: std({ map: T.oak, bumpMap: T.oakBump, bumpScale: 0.8, roughness: 0.62 }),
    frame: std({ color: '#2a2622', roughness: 0.42, metalness: 0.75 }),
    coping: std({ color: '#3a3632', roughness: 0.4, metalness: 0.8 }),
    glass: std(
      {
        color: '#aebbc0',
        roughness: 0.04,
        metalness: 0.2,
        transparent: true,
        opacity: 0.2,
        envMapIntensity: 1.6,
        depthWrite: false,
      },
      { clayAlpha: 0.5 }
    ),
    // Structure
    slab: std({ map: T.stone, color: '#cfcac2', roughness: 0.9 }),
    steel: std({ color: '#2f2c29', roughness: 0.5, metalness: 0.7 }),
    // Intérieur
    plaster: std({ map: T.plaster, roughness: 0.92 }),
    parquet: std({ map: T.parquet, roughness: 0.55 }),
    counter: std({ color: '#34302c', roughness: 0.5 }),
    counterTop: std({ color: '#d9d4cb', roughness: 0.35 }),
    fabric: std({ color: '#b9ab98', roughness: 1 }),
    rug: std({ color: '#d8d0c2', roughness: 1 }),
    // Toiture
    gravel: std({ map: T.gravel, roughness: 0.98 }),
    // Extérieurs
    deck: std({ map: T.deck, bumpMap: T.oakBump, bumpScale: 0.5, roughness: 0.7 }),
    lawn: std({ map: T.lawn, roughness: 1 }),
    paving: std({ map: T.paving, roughness: 0.82 }),
    base: std({ color: '#ddd6ca', map: T.plaster, roughness: 0.9 }),
    water: std({ color: '#5d8189', roughness: 0.05, metalness: 0.3, envMapIntensity: 1.4 }),
    poolWall: std({ color: '#c8d3d2', roughness: 0.6 }),
    foliage: std({ color: '#5b6150', roughness: 1 }),
    trunk: std({ color: '#5a4a3c', roughness: 0.9 }),
    corten: std({ color: '#7c4f37', roughness: 0.8, metalness: 0.3 }),
    // Lumière intérieure : éteinte de jour, allumée au crépuscule.
    light: std({ color: '#fff4e2', emissive: '#ffd9a0', emissiveIntensity: 0, roughness: 1 }),
  };

  return {
    M,
    uniforms,
    dispose() {
      Object.values(M).forEach((m) => m.dispose());
      Object.values(T).forEach((t) => t.dispose());
    },
  };
}
