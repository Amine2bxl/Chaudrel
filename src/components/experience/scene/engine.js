import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { createMaterials } from './materials.js';
import { ANCHORS, createBuilding } from './building.js';
import { createAtelier } from './atelier.js';

/**
 * Moteur de la maquette : rendu, lumière, application d'un état du storyboard.
 *
 * Il ne connaît ni le défilement ni React. On lui donne un état
 * (`apply(state)`), il dessine UNE image. Pas de boucle permanente : tant que
 * l'état ne change pas, le GPU ne travaille pas.
 */

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const lerp = (a, b, t) => a + (b - a) * t;

/* Vue éclatée : hauteur gagnée par chaque couche, et fenêtre de départ - la
   toiture part la première, la façade du rez la dernière. */
const EXPLODE = {
  roof: { dy: 9.6, from: 0, to: 0.72 },
  upperFacade: { dy: 6.4, from: 0.08, to: 0.8 },
  upper: { dy: 3.9, from: 0.16, to: 0.88 },
  groundFacade: { dy: 1.5, from: 0.26, to: 1, dz: 0 },
};

/* Rend la main au navigateur : l'initialisation est découpée en étapes courtes. */
const pause = () => new Promise((resolve) => setTimeout(resolve, 0));

export async function createEngine(canvas, { lowPower = false, quality = 'auto' } = {}) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new RoomEnvironment();
  scene.environment = pmrem.fromScene(envScene, 0.04).texture;
  envScene.traverse((o) => {
    o.geometry?.dispose();
    o.material?.dispose();
  });
  pmrem.dispose();
  await pause();

  const camera = new THREE.PerspectiveCamera(26, 1, 1, 400);

  /* ---------- Lumière ---------- */
  const hemi = new THREE.HemisphereLight('#fff7ea', '#8f8371', 0.42);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight('#fff1dc', 3.6);
  sun.castShadow = true;
  sun.shadow.mapSize.setScalar(lowPower ? 1024 : 2048);
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.03;
  sun.shadow.radius = lowPower ? 3 : 5;
  /* Le cône d'ombre couvre la maquette et tout l'atelier autour d'elle. */
  const sc = sun.shadow.camera;
  sc.left = -46;
  sc.right = 46;
  sc.top = 40;
  sc.bottom = -36;
  sc.near = 1;
  sc.far = 120;
  scene.add(sun, sun.target);

  /* Trois sources chaudes à l'intérieur, sans ombres portées : elles ne
     s'allument qu'au crépuscule. */
  const lamps = [
    [-2.6, 2.6, 1.2, 26],
    [2.8, 2.6, 0.6, 12],
    [-0.6, 5.7, 2.4, 18],
  ].map(([x, y, z, power]) => {
    const l = new THREE.PointLight('#ffc98a', 0, 11, 1.8);
    l.position.set(x, y, z);
    l.userData.power = power;
    return l;
  });

  /* ---------- Maquette ---------- */
  const mats = await createMaterials({
    textureSize: quality === 'high' ? 512 : 256,
    anisotropy: Math.min(8, renderer.capabilities.getMaxAnisotropy()),
    pause,
  });
  await pause();
  const { root, groups } = createBuilding(mats.M);
  await pause();
  root.add(...lamps);
  scene.add(root);
  await pause();

  const atelier = createAtelier(mats.T, { anisotropy: Math.min(8, renderer.capabilities.getMaxAnisotropy()) });
  scene.add(atelier.group);
  await pause();

  /* Ombre portée sur la page : un plan qui ne reçoit que l'ombre. */
  const shadowMat = new THREE.ShadowMaterial({ opacity: 0.26, color: '#3a2f22' });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(140, 140), shadowMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.7;
  floor.receiveShadow = true;
  scene.add(floor);

  const dayHemiSky = new THREE.Color('#fff7ea');
  const duskHemiSky = new THREE.Color('#5a6478');
  const daySun = new THREE.Color('#fff1dc');
  const duskSun = new THREE.Color('#9aa6c4');

  let width = 1;
  let height = 1;
  let ratio = 0;
  let last = null;
  let lastShadowKey = '';
  let disposed = false;
  let queued = false;

  /* Plusieurs `apply` dans la même tâche (défilement + redimensionnement, par
     exemple) ne coûtent qu'une image : le rendu part en fin de tâche. */
  function flush() {
    queued = false;
    if (!disposed) renderer.render(scene, camera);
  }
  function requestRender() {
    if (queued) return;
    queued = true;
    queueMicrotask(flush);
  }

  function resize(w, h, dpr) {
    const nw = Math.max(1, w);
    const nh = Math.max(1, h);
    if (nw === width && nh === height && dpr === ratio) return;
    width = nw;
    height = nh;
    ratio = dpr;
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    if (last) apply(last);
  }

  function apply(s) {
    if (disposed) return;
    last = s;

    // Caméra en coordonnées sphériques autour du point visé
    const az = THREE.MathUtils.degToRad(s.az);
    const el = THREE.MathUtils.degToRad(s.el);
    const c = Math.cos(el);
    camera.position.set(s.tx + Math.sin(az) * c * s.dist, s.ty + Math.sin(el) * s.dist, s.tz + Math.cos(az) * c * s.dist);
    camera.lookAt(s.tx, s.ty, s.tz);
    camera.setViewOffset(width, height, -(s.sx || 0) * width, -(s.sy || 0) * height, width, height);
    camera.updateMatrixWorld();

    // Vue éclatée
    for (const name in EXPLODE) {
      const e = EXPLODE[name];
      groups[name].position.y = e.dy * smooth(e.from, e.to, s.explode);
    }

    // Finition : le plan monte de sous la dalle jusqu'au-dessus de la toiture.
    // Pendant l'éclaté, la hauteur est lue dans le repère de chaque couche :
    // le plan traverse donc toutes les couches à leur niveau d'origine.
    mats.uniforms.uWipe.value = lerp(-1.2, 8.6, s.wipe);
    mats.uniforms.uLineOn.value = s.wipe > 0.001 && s.wipe < 0.999 ? 1 : 0;

    // Le tracé des plans
    atelier.uniforms.uDraw.value = s.draw ?? 1;

    // Jour → crépuscule
    const d = s.dusk;
    hemi.intensity = lerp(0.42, 0.2, d);
    hemi.color.lerpColors(dayHemiSky, duskHemiSky, d);
    sun.intensity = lerp(3.6, 0.3, d);
    sun.color.lerpColors(daySun, duskSun, d);
    scene.environmentIntensity = lerp(0.34, 0.12, d);
    shadowMat.opacity = lerp(0.26, 0.0, smooth(0, 0.7, d));
    renderer.toneMappingExposure = lerp(1.05, 1.2, d);
    const on = smooth(0.25, 1, d);
    mats.M.light.emissiveIntensity = on * 5;
    lamps.forEach((l) => (l.intensity = l.userData.power * on));

    // Le soleil ne bouge pas avec la caméra : l'ombre reste celle d'une
    // maquette posée, et la carte d'ombres n'est recalculée que si la
    // géométrie a bougé.
    sun.position.set(-22, 24 + s.explode * 6, 15);
    sun.target.position.set(0, 3 + s.explode * 4, 0);
    const key = `${s.explode.toFixed(3)}`;
    if (key !== lastShadowKey) {
      renderer.shadowMap.needsUpdate = true;
      lastShadowKey = key;
    }

    requestRender();
  }

  const v = new THREE.Vector3();
  /** Position écran (px, repère du canvas) d'un point d'ancrage nommé. */
  function project(name) {
    const a = ANCHORS[name];
    const b = atelier.anchors[name];
    if (!a && !b) return null;
    if (a) v.set(a.at[0], a.at[1] + groups[a.layer].position.y, a.at[2]);
    else v.set(b[0], b[1], b[2]);
    v.project(camera);
    return { x: (v.x * 0.5 + 0.5) * width, y: (-v.y * 0.5 + 0.5) * height, visible: v.z < 1 };
  }

  function dispose() {
    disposed = true;
    scene.traverse((o) => o.geometry?.dispose());
    mats.dispose();
    atelier.dispose();
    shadowMat.dispose();
    scene.environment?.dispose();
    sun.shadow.map?.dispose();
    renderer.dispose();
  }

  /** Image PNG de l'état courant (fond transparent) - sert aux visuels de repli. */
  function capture(type = 'image/png', quality = 0.92) {
    if (last) apply(last);
    flush();
    return canvas.toDataURL(type, quality);
  }

  /* Compilation des shaders hors du fil principal quand le pilote le permet
     (KHR_parallel_shader_compile) : la première image n'est pas une longue tâche. */
  try {
    await renderer.compileAsync(scene, camera);
  } catch {
    /* compilation synchrone au premier rendu */
  }

  return { apply, resize, project, dispose, capture, flush, renderer, info: () => renderer.info.render };
}
