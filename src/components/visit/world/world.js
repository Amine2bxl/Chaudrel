import * as THREE from 'three';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { createSurfaceBaker } from './surfaces.js';
import { createMaterials } from './materials.js';
import { buildArchitecture, createBins } from './build.js';
import { furnish } from './furnish.js';
import { EYE, LEVELS, NODES, ROOMS, STAIR, floorAt, neighbours, nodeById, roomAt, roomById, route } from './layout.js';

/**
 * Le monde : une maison qu'on visite à hauteur d'œil.
 *
 * Rien n'est rendu tant que rien ne bouge. Une image est demandée quand la
 * caméra se déplace, qu'une pièce se transforme ou que la fenêtre change de
 * taille ; la boucle s'arrête d'elle-même ensuite.
 */

const D2R = Math.PI / 180;
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const wrap = (a) => ((((a + 180) % 360) + 360) % 360) - 180;
const pause = () => new Promise((r) => setTimeout(r, 0));

function skyTexture() {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 512;
  const g = c.getContext('2d');
  const grad = g.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#9fbbd6');
  grad.addColorStop(0.42, '#d6e2ea');
  grad.addColorStop(0.5, '#eef0ea');
  grad.addColorStop(0.53, '#b4bca2');
  grad.addColorStop(1, '#8c9670');
  g.fillStyle = grad;
  g.fillRect(0, 0, 1024, 512);
  // lisière d'arbres floue, comme vue à travers une vitre
  g.filter = 'blur(6px)';
  let s = 7;
  const r = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  for (let i = 0; i < 70; i++) {
    g.fillStyle = ['#5f6d48', '#6f7c55', '#4f5c3c', '#7c8a63'][i % 4];
    g.beginPath();
    g.ellipse(r() * 1024, 250 + r() * 20, 30 + r() * 60, 18 + r() * 40, 0, 0, Math.PI * 2);
    g.fill();
  }
  g.filter = 'none';
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export async function createWorld(canvas, { quality = 'high', style } = {}) {
  const hi = quality === 'high';
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !hi, powerPreference: 'high-performance' });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.AgXToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false;
  if (hi) RectAreaLightUniformsLib.init();

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(62, 1, 0.05, 160);
  camera.rotation.order = 'YXZ';
  await pause();

  /* ---------- Matières, architecture, mobilier ---------- */
  const baker = createSurfaceBaker(renderer, { quality });
  const M = createMaterials(baker, { style });
  await pause();
  const bins = createBins();
  const arch = buildArchitecture(M, bins);
  await pause();
  const furn = furnish(M, bins, arch.colliders);
  const groups = bins.build();
  groups.forEach((g) => scene.add(g));
  if (arch.frontDoor) scene.add(arch.frontDoor);
  await pause();

  const sky = new THREE.Mesh(new THREE.SphereGeometry(110, 32, 16), new THREE.MeshBasicMaterial({ map: skyTexture(), side: THREE.BackSide, fog: false }));
  sky.material.color.setScalar(1.6);
  sky.position.set(8.5, -12, 6);
  scene.add(sky);

  /* ---------- Lumière ---------- */
  const hemi = new THREE.HemisphereLight('#e4ecf2', '#b8a78f', hi ? 0.35 : 0.7);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight('#fff0dc', 3.4);
  sun.position.set(-4, 15, 26);
  sun.target.position.set(9, 0, 6);
  sun.castShadow = true;
  sun.shadow.mapSize.setScalar(hi ? 2048 : 1024);
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.025;
  sun.shadow.radius = 3;
  Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 60 });
  scene.add(sun, sun.target);

  // Lumière du ciel par les grandes baies : sources surfaciques, tournées vers l'intérieur
  if (hi) {
    const big = arch.windows
      .filter((w) => !w.skylight && (w.a1 - w.a0) * (w.y1 - w.y0) > 2.4)
      .sort((a, b) => (b.a1 - b.a0) * (b.y1 - b.y0) - (a.a1 - a.a0) * (a.y1 - a.y0))
      .slice(0, 6);
    for (const w of big) {
      const width = w.a1 - w.a0;
      const height = w.y1 - w.y0;
      const l = new THREE.RectAreaLight('#e9eff5', 2.2, width, height);
      const cy = (w.y0 + w.y1) / 2;
      if (w.o === 'z') {
        l.position.set((w.a0 + w.a1) / 2, cy, w.at + w.inward * 0.02);
        l.lookAt((w.a0 + w.a1) / 2, cy, w.at + w.inward * 5);
      } else {
        l.position.set(w.at + w.inward * 0.02, cy, (w.a0 + w.a1) / 2);
        l.lookAt(w.at + w.inward * 5, cy, (w.a0 + w.a1) / 2);
      }
      scene.add(l);
    }
    const s = arch.windows.find((w) => w.skylight);
    if (s) {
      const l = new THREE.RectAreaLight('#eef4f8', 4, s.x1 - s.x0, s.z1 - s.z0);
      l.position.set((s.x0 + s.x1) / 2, s.y - 0.01, (s.z0 + s.z1) / 2);
      l.lookAt((s.x0 + s.x1) / 2, 0, (s.z0 + s.z1) / 2);
      scene.add(l);
    }
  }
  // quelques lampes chaudes, sans ombres
  for (const [x, y, z, p] of [
    [7.6, 1.9, 2.6, 2.5],
    [8.35, 1.7, 8.4, 2.5],
    [3.0, 1.6, 8.2, 2],
    [10.3, 3.4, 2.6, 2],
  ]) {
    const l = new THREE.PointLight('#ffcf98', p, 7, 2);
    l.position.set(x, y, z);
    scene.add(l);
  }

  /* ---------- Sondes d'environnement : la lumière rebondit ---------- */
  const pmrem = new THREE.PMREMGenerator(renderer);
  const cubeRT = new THREE.WebGLCubeRenderTarget(hi ? 256 : 128, { type: THREE.HalfFloatType });
  const cubeCam = new THREE.CubeCamera(0.05, 80, cubeRT);
  scene.add(cubeCam);
  const probes = [null, null];
  const PROBE_AT = [new THREE.Vector3(9.5, 1.5, 6.5), new THREE.Vector3(8.5, 4.7, 5.95)];
  const levelOf = new Map(ROOMS.map((r) => [r.id, r.l]));
  const meshLevel = (mesh) => {
    const room = mesh.parent?.name?.split(':')[0];
    return levelOf.has(room) ? levelOf.get(room) : 0;
  };
  function renderProbe(level) {
    renderer.shadowMap.needsUpdate = true;
    cubeCam.position.copy(PROBE_AT[level]);
    cubeCam.update(renderer, scene);
    const env = pmrem.fromCubemap(cubeRT.texture);
    probes[level]?.dispose();
    probes[level] = env;
    scene.traverse((o) => {
      if (!o.isMesh || o === sky) return;
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      if (meshLevel(o) !== level && o.parent?.name !== 'static' && o.parent?.name !== 'site') return;
      for (const m of mats) {
        if (!m.isMeshStandardMaterial) continue;
        m.envMap = env.texture;
        m.needsUpdate = true;
      }
    });
  }

  /* ---------- Post-traitement : occlusion ambiante (ordinateur) ---------- */
  let composer = null;
  let gtao = null;
  if (hi) {
    const rt = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 });
    composer = new EffectComposer(renderer, rt);
    composer.addPass(new RenderPass(scene, camera));
    gtao = new GTAOPass(scene, camera, 1, 1);
    gtao.blendIntensity = 0.9;
    gtao.updateGtaoMaterial({ radius: 0.45, distanceExponent: 1.4, thickness: 1.2, scale: 1, samples: 12 });
    gtao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 12 });
    composer.addPass(gtao);
    composer.addPass(new OutputPass());
  }

  /* ---------- État des pièces (chantier ↔ fini) ---------- */
  const rooms = new Map();
  for (const r of ROOMS) {
    const [x0, x1, z0, z1] = r.r;
    rooms.set(r.id, {
      def: r,
      u: M.uniformsFor(r.id),
      diag: Math.hypot(x1 - x0, z1 - z0),
      t: 1, // 0 chantier, 1 fini
      furn: groups.get(`${r.id}:furn`),
      raw: groups.get(`${r.id}:raw`),
      anim: null,
    });
  }

  function applyRoom(state, t, origin) {
    state.t = t;
    if (origin) state.u.uXpO.value.copy(origin);
    if (t <= 0) state.u.uXpR.value = -100;
    else if (t >= 1) state.u.uXpR.value = 100;
    else state.u.uXpR.value = -0.8 + t * (state.diag + 1.8);
    const transit = t > 0 && t < 1;
    if (state.furn) {
      state.furn.visible = t > 0;
      state.furn.traverse((o) => o.isMesh && (o.castShadow = !transit && !o.material.transparent));
    }
    if (state.raw) {
      state.raw.visible = t < 1;
      state.raw.traverse((o) => o.isMesh && (o.castShadow = !transit));
    }
    renderer.shadowMap.needsUpdate = true;
  }
  for (const s of rooms.values()) applyRoom(s, 1);

  /* ---------- Caméra ---------- */
  const view = { x: 7.65, y: EYE, z: -6.5, yaw: 0, pitch: 2, level: 0 };
  let width = 1;
  let height = 1;
  let dpr = 1;
  let maxDpr = 1;
  function applyCamera() {
    camera.position.set(view.x, view.y, view.z);
    camera.rotation.set(view.pitch * D2R, Math.PI + view.yaw * D2R, 0);
    camera.updateMatrixWorld();
  }

  /* ---------- Boucle de rendu à la demande ---------- */
  const tasks = new Set(); // fonctions (now) => bool (true = encore actif)
  let dirty = true;
  let raf = 0;
  let disposed = false;
  let slow = 0;
  let fast = 0;
  let lastFrame = 0;
  const listeners = new Set();

  function frame(now) {
    raf = 0;
    if (disposed) return;
    for (const task of [...tasks]) if (!task(now)) tasks.delete(task);
    applyCamera();
    const t0 = performance.now();
    if (composer) composer.render();
    else renderer.render(scene, camera);
    dirty = false;
    const dt = performance.now() - t0;
    // définition adaptative : on descend si l'image coûte trop cher
    if (lastFrame && now - lastFrame < 100) {
      if (dt > 30) slow++;
      else slow = Math.max(0, slow - 1);
      if (dt < 12) fast++;
      else fast = 0;
      if (slow > 20 && dpr > 0.75) {
        dpr = Math.max(0.75, dpr - 0.25);
        slow = 0;
        resize(width, height);
      } else if (fast > 90 && dpr < maxDpr) {
        dpr = Math.min(maxDpr, dpr + 0.25);
        fast = 0;
        resize(width, height);
      }
    }
    lastFrame = now;
    listeners.forEach((fn) => fn('frame'));
    if (tasks.size || dirty) raf = requestAnimationFrame(frame);
  }
  function invalidate() {
    dirty = true;
    if (!raf && !disposed) raf = requestAnimationFrame(frame);
  }
  function addTask(fn) {
    tasks.add(fn);
    invalidate();
  }

  function resize(w, h, ratio) {
    width = Math.max(1, w);
    height = Math.max(1, h);
    if (ratio) {
      maxDpr = ratio;
      dpr = Math.min(dpr || ratio, ratio);
      if (!dpr) dpr = ratio;
    }
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    composer?.setPixelRatio(dpr);
    composer?.setSize(width, height);
    camera.aspect = width / height;
    // écran en hauteur : on garde un champ horizontal suffisant
    camera.fov = camera.aspect < 0.8 ? 74 : 62;
    camera.updateProjectionMatrix();
    invalidate();
  }

  /* ---------- Déplacements ---------- */
  let current = 'dehors';
  let moving = null;

  function emit(type) {
    listeners.forEach((fn) => fn(type));
  }

  function stop() {
    if (moving) {
      tasks.delete(moving.task);
      moving.resolve(false);
      moving = null;
    }
  }

  /** Va jusqu'à un point de vue en suivant le plan (portes, escalier). */
  function goTo(id, { speed = 1.5 } = {}) {
    const target = nodeById(id);
    if (!target) return Promise.resolve(false);
    stop();
    const startNode = nodeAtView(0.5) || current;
    const path = route(startNode, id) || [startNode, id];
    const pts = [new THREE.Vector3(view.x, view.y - EYE, view.z)];
    for (let i = 1; i < path.length; i++) {
      const via = neighbours(path[i - 1]).find((n) => n.id === path[i])?.via || [];
      for (const [x, z, y] of via) pts.push(new THREE.Vector3(x, y ?? floorAt(x, z, 0), z));
      const n = nodeById(path[i]);
      pts.push(new THREE.Vector3(n.p[0], n.y, n.p[1]));
    }
    // les points de passage sur l'escalier suivent la rampe
    for (const p of pts) {
      if (p.x > STAIR.x0 - 0.1 && p.x < STAIR.x1 + 0.1 && p.z > STAIR.z0 && p.z < STAIR.z1) p.y = floorAt(p.x, p.z);
    }
    const clean = pts.filter((p, i) => i === 0 || p.distanceTo(pts[i - 1]) > 0.05);
    if (clean.length < 2) clean.push(new THREE.Vector3(target.p[0], target.y, target.p[1]));
    const curve = new THREE.CatmullRomCurve3(clean, false, 'centripetal', 0.5);
    const length = curve.getLength();
    const duration = Math.min(9, Math.max(0.9, length / speed)) * 1000;
    const y0 = view.yaw;
    const p0 = view.pitch;
    const yaw1 = target.yaw ?? y0;
    const pitch1 = target.pitch ?? 0;
    const tmp = new THREE.Vector3();
    const tan = new THREE.Vector3();
    let start = 0;
    return new Promise((resolve) => {
      const task = (now) => {
        if (!start) start = now;
        const k = Math.min(1, (now - start) / duration);
        const t = ease(k);
        curve.getPointAt(t, tmp);
        view.x = tmp.x;
        view.z = tmp.z;
        view.y = tmp.y + EYE;
        curve.getTangentAt(Math.min(0.999, t + 0.02), tan);
        const travelYaw = Math.atan2(tan.x, tan.z) / D2R;
        const flat = Math.hypot(tan.x, tan.z) > 0.2;
        const a = smooth(0, 0.18, t);
        const b = smooth(0.72, 1, t);
        let yaw = flat ? y0 + wrap(travelYaw - y0) * a : y0;
        yaw += wrap(yaw1 - yaw) * b;
        view.yaw = yaw;
        const climb = Math.atan2(tan.y, Math.hypot(tan.x, tan.z)) / D2R;
        view.pitch = p0 * (1 - a) + (climb * 0.5) * a * (1 - b) + pitch1 * b;
        if (k >= 1) {
          current = id;
          view.level = target.y > 1.7 ? 1 : 0;
          moving = null;
          resolve(true);
          emit('arrive');
          return false;
        }
        return true;
      };
      moving = { task, resolve };
      emit('depart');
      addTask(task);
    });
  }

  function jump(id) {
    stop();
    const n = nodeById(id);
    current = id;
    view.x = n.p[0];
    view.z = n.p[1];
    view.y = n.y + EYE;
    view.yaw = n.yaw ?? 0;
    view.pitch = n.pitch ?? 0;
    view.level = n.y > 1.7 ? 1 : 0;
    invalidate();
    emit('arrive');
  }

  function nodeAtView(max = 0.6) {
    let best = null;
    let bd = max;
    for (const n of NODES) {
      const d = Math.hypot(n.p[0] - view.x, n.p[1] - view.z) + Math.abs(n.y + EYE - view.y);
      if (d < bd) {
        bd = d;
        best = n.id;
      }
    }
    return best;
  }

  function look(dYaw, dPitch) {
    if (moving) return;
    view.yaw = wrap(view.yaw + dYaw);
    view.pitch = Math.max(-62, Math.min(48, view.pitch + dPitch));
    invalidate();
  }

  /* ---------- Marche libre (clavier) avec collisions ---------- */
  const R = 0.24;
  function blocked(x, z, level) {
    for (const c of arch.colliders) {
      if (c.ext || c.l !== level) continue;
      if (x + R > c.x0 && x - R < c.x1 && z + R > c.z0 && z - R < c.z1) return true;
    }
    // la maison est le seul terrain de marche, plus la terrasse et l'allée
    if (x < -3 || x > 20 || z < -9 || z > 15) return true;
    return false;
  }
  function walk(forward, strafe, dt) {
    if (moving) stop();
    const sp = 1.4 * dt;
    const a = view.yaw * D2R;
    const dx = (Math.sin(a) * forward + Math.cos(a) * strafe) * sp;
    const dz = (Math.cos(a) * forward - Math.sin(a) * strafe) * sp;
    const onStair = (x, z) => x > STAIR.x0 - 0.02 && x < STAIR.x1 + 0.02 && z > STAIR.z0 - 0.05 && z < STAIR.z1 + 0.05;
    const levelFor = (x, z) => (onStair(x, z) ? (floorAt(x, z) > 1.6 ? 1 : 0) : view.level);
    if (!blocked(view.x + dx, view.z, levelFor(view.x + dx, view.z))) view.x += dx;
    if (!blocked(view.x, view.z + dz, levelFor(view.x, view.z + dz))) view.z += dz;
    if (onStair(view.x, view.z)) view.level = floorAt(view.x, view.z) > 1.6 ? 1 : 0;
    const fy = onStair(view.x, view.z) ? floorAt(view.x, view.z) : LEVELS[view.level].y;
    view.y += (fy + EYE - view.y) * Math.min(1, dt * 10);
    const n = nodeAtView(0.9);
    if (n) current = n;
    invalidate();
    emit('walk');
  }

  /* ---------- Transformation d'une pièce ---------- */
  function reveal(roomId, finished, { origin, duration = 2600 } = {}) {
    const s = rooms.get(roomId);
    if (!s) return Promise.resolve();
    if (s.anim) tasks.delete(s.anim);
    const from = s.t;
    const to = finished ? 1 : 0;
    const o = origin || new THREE.Vector3(view.x, 0, view.z);
    let start = 0;
    return new Promise((resolve) => {
      const task = (now) => {
        if (!start) start = now;
        const k = Math.min(1, (now - start) / (duration * Math.max(0.2, Math.abs(to - from))));
        applyRoom(s, from + (to - from) * (k * k * (3 - 2 * k)), o);
        if (k >= 1) {
          s.anim = null;
          renderProbe(s.def.l);
          resolve();
          emit('reveal');
          return false;
        }
        return true;
      };
      s.anim = task;
      addTask(task);
    });
  }

  function setRoomProgress(roomId, t, origin) {
    const s = rooms.get(roomId);
    if (!s || Math.abs(s.t - t) < 1e-4) return;
    applyRoom(s, Math.min(1, Math.max(0, t)), origin);
    invalidate();
  }

  /* ---------- Projection, pointage ---------- */
  const v3 = new THREE.Vector3();
  function project(x, y, z) {
    v3.set(x, y, z);
    const d = v3.distanceTo(camera.position);
    v3.project(camera);
    return { x: (v3.x * 0.5 + 0.5) * width, y: (-v3.y * 0.5 + 0.5) * height, visible: v3.z < 1 && Math.abs(v3.x) < 1.2 && Math.abs(v3.y) < 1.2, d };
  }
  const ray = new THREE.Raycaster();
  /** Point du sol sous le pointeur, au niveau courant. */
  function pick(px, py) {
    ray.setFromCamera(new THREE.Vector2((px / width) * 2 - 1, -(py / height) * 2 + 1), camera);
    const fy = LEVELS[view.level].y;
    const o = ray.ray.origin;
    const d = ray.ray.direction;
    if (d.y > -0.02) return null;
    const t = (fy - o.y) / d.y;
    return { x: o.x + d.x * t, z: o.z + d.z * t, level: view.level };
  }
  /** Point de vue le plus proche d'un point du sol (même niveau). */
  function nearestNode(x, z, level) {
    let best = null;
    let bd = Infinity;
    for (const n of NODES) {
      if ((n.y > 1.7 ? 1 : 0) !== level || n.detail) continue;
      const d = Math.hypot(n.p[0] - x, n.p[1] - z);
      if (d < bd) {
        bd = d;
        best = n.id;
      }
    }
    return best;
  }

  /* ---------- Préparation ---------- */
  resize(1, 1, 1);
  applyCamera();
  renderProbe(0);
  await pause();
  renderProbe(1);
  if (composer) {
    // compile tout de suite, plutôt qu'à la première image
    try {
      await renderer.compileAsync(scene, camera);
    } catch {
      /* compilation au premier rendu */
    }
  }

  const door = arch.frontDoor;
  return {
    renderer,
    scene,
    camera,
    view,
    get current() {
      return current;
    },
    get moving() {
      return Boolean(moving);
    },
    room() {
      const r = roomAt(view.x, view.z, view.level);
      return r && !r.closed ? r.id : 'outside';
    },
    roomState: (id) => rooms.get(id)?.t ?? 1,
    resize,
    invalidate,
    goTo,
    jump,
    stop,
    look,
    walk,
    reveal,
    setRoomProgress,
    project,
    pick,
    nearestNode,
    /** Pose directe de la caméra (film au défilement). */
    setPose(p) {
      stop();
      Object.assign(view, p);
      invalidate();
    },
    setDoor(t) {
      if (!door) return;
      door.rotation.y = -Math.min(1, Math.max(0, t)) * 1.5;
      renderer.shadowMap.needsUpdate = true;
      invalidate();
    },
    setStyle(next) {
      M.setStyle(next);
      renderProbe(0);
      renderProbe(1);
      invalidate();
    },
    get style() {
      return M.style;
    },
    on(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    info: () => renderer.info.render,
    capture(type = 'image/webp', q = 0.9) {
      applyCamera();
      if (composer) composer.render();
      else renderer.render(scene, camera);
      return canvas.toDataURL(type, q);
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      tasks.clear();
      listeners.clear();
      scene.traverse((o) => {
        if (o.isMesh) o.geometry.dispose();
      });
      M.dispose();
      baker.dispose();
      furn.dispose();
      probes.forEach((p) => p?.dispose());
      pmrem.dispose();
      cubeRT.dispose();
      sky.material.map.dispose();
      composer?.dispose();
      renderer.dispose();
    },
  };
}

export { NODES, ROOMS, nodeById, roomById };
