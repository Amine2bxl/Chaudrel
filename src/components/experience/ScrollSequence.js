import { EYE } from '@/components/visit/world/layout.js';
import { DOOR, REVEAL, poseAt } from './content';

/**
 * Le film au défilement : GSAP ScrollTrigger pilote une seule timeline. Elle
 * fait avancer la caméra dans la maison (porte, entrée, salle à manger,
 * séjour), transforme le séjour, et fait entrer les textes sur la même
 * horloge. Réversible : remonter la page rejoue le film à l'envers.
 *
 * Le monde 3D est partagé avec la page /visite (components/visit/store.js) :
 * il est construit au premier geste du visiteur et garde son état d'une page
 * à l'autre. D'ici là, l'image du premier plan tient l'écran.
 */
export async function mountSequence(els, { chapters, onReady, onFail, onStep }) {
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
  gsap.registerPlugin(ScrollTrigger);

  const state = { p: 0 };
  let world = null;
  let store = null;
  let tl = null;
  let destroyed = false;
  let step = -1;
  const smooth = (a, b, x) => Math.min(1, Math.max(0, (x - a) / (b - a)));

  function draw() {
    if (destroyed || !world) return;
    const p = state.p;
    const pose = poseAt(p);
    world.setPose({ x: pose.x, z: pose.z, y: EYE, yaw: pose.yaw, pitch: pose.pitch, level: 0 });
    world.setDoor(smooth(DOOR[0], DOOR[1], p));
    const t = smooth(REVEAL.from, REVEAL.to, p);
    world.setRoomProgress(REVEAL.room, t, origin);
  }
  // origine du front de transformation (objet compatible Vector3.copy)
  const origin = { x: REVEAL.origin[0], y: REVEAL.origin[1], z: REVEAL.origin[2] };

  function setStep(p) {
    let i = 0;
    els.index.forEach((el, n) => {
      if (p >= Number(el.dataset.at) - 0.06) i = n;
    });
    if (i === step) return;
    step = i;
    els.index.forEach((el, n) => el.toggleAttribute('data-active', n === i));
    onStep?.(i);
  }

  function build() {
    tl?.scrollTrigger?.kill();
    tl?.kill();
    tl = gsap.timeline({
      defaults: { ease: 'none' },
      onUpdate: draw,
      scrollTrigger: {
        trigger: els.root,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.7,
        onUpdate: (self) => setStep(self.progress),
      },
    });
    tl.fromTo(state, { p: 0 }, { p: 1, duration: 1, immediateRender: false }, 0);
    tl.to(els.hero, { autoAlpha: 0, y: -24, duration: 0.05, ease: 'power1.in' }, 0.02);
    tl.to(els.hint, { autoAlpha: 0, duration: 0.03 }, 0.01);
    // l'index n'apparaît qu'une fois la promesse partie : un seul bloc à lire à la fois
    tl.fromTo(els.indexBox, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.03, immediateRender: true }, 0.05);
    tl.to(els.wordmark, { yPercent: -18, autoAlpha: 0, duration: 0.12, ease: 'sine.in' }, 0.03);
    chapters.forEach((c, i) => {
      const el = els.chapters[i];
      tl.fromTo(el, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.035, ease: 'power2.out', immediateRender: true }, c.at);
      if (c.until < 1) tl.to(el, { autoAlpha: 0, y: -16, duration: 0.03, ease: 'power1.in' }, c.until);
    });
    tl.set({}, {}, 1);
    setStep(tl.scrollTrigger.progress);
  }
  build();

  async function startWorld() {
    try {
      store = await import('@/components/visit/store.js');
      const w = await store.acquireWorld();
      if (destroyed) return;
      world = w;
      store.attachWorld(els.host, 'film');
      // dans le film, la maison est finie - sauf le séjour, que le défilement transforme
      for (const id of ['hall', 'dining', 'kitchen', 'pantry']) w.setRoomProgress(id, 1);
      const ro = new ResizeObserver(() => {
        const r = els.host.getBoundingClientRect();
        w.resize(r.width, r.height, Math.min(window.devicePixelRatio || 1, 1.75));
      });
      ro.observe(els.host);
      cleanup.push(() => ro.disconnect());
      state.p = tl.scrollTrigger?.progress ?? 0;
      draw();
      window.__chaudrelXP = {
        progress: () => tl?.scrollTrigger?.progress ?? 0,
        played: () => state.p,
        state: () => ({ p: state.p, ...world.view, living: world.roomState('living') }),
        captureAt(p, type, quality) {
          state.p = p;
          draw();
          return world.capture(type, quality);
        },
      };
      onReady?.();
    } catch (err) {
      onFail?.(err);
    }
  }

  /* Le monde démarre au premier signe d'intérêt (souris, doigt, défilement,
     touche) ou après quelques secondes : un visiteur qui repart aussitôt ne
     télécharge jamais la 3D. */
  const cleanup = [];
  const WAKE = ['pointermove', 'pointerdown', 'touchstart', 'wheel', 'scroll', 'keydown'];
  let woke = false;
  let timer = 0;
  function wake() {
    if (woke) return;
    woke = true;
    WAKE.forEach((type) => window.removeEventListener(type, wake));
    window.clearTimeout(timer);
    startWorld();
  }
  if (window.__XP_HQ || window.scrollY > 4) wake();
  else {
    WAKE.forEach((type) => window.addEventListener(type, wake, { passive: true, once: true }));
    timer = window.setTimeout(wake, 9000);
  }

  return function destroy() {
    destroyed = true;
    WAKE.forEach((type) => window.removeEventListener(type, wake));
    window.clearTimeout(timer);
    cleanup.forEach((fn) => fn());
    tl?.scrollTrigger?.kill();
    tl?.kill();
    gsap.set([els.hero, els.hint, els.wordmark, els.indexBox, ...els.chapters], { clearProps: 'all' });
    store?.releaseWorld('film');
    world = null;
    delete window.__chaudrelXP;
  };
}
