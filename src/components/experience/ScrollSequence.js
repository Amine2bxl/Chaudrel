import { isLowPower } from '@/lib/webgl';

/**
 * Séquence au défilement - GSAP ScrollTrigger pilote une timeline unique.
 *
 * La timeline dure 1 (= toute la piste de défilement). Elle interpole l'état
 * de la maquette entre les images-clés du storyboard et, sur la même horloge,
 * fait entrer et sortir les textes. La scène 3D n'est qu'un abonné : tant que
 * le moteur n'est pas chargé, les textes suivent déjà le défilement.
 *
 * Tout est réversible (scrub) et rien ne capture la molette : la page défile
 * à sa vitesse naturelle, la scène est collée par `position: sticky`.
 *
 * Module impératif, chargé à la demande. Retourne une fonction de nettoyage.
 */
export async function mountSequence(els, { chapters, onReady, onFail, onStep }) {
  const [{ gsap }, { ScrollTrigger }, sb] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
    import('./scene/storyboard.js'),
  ]);
  gsap.registerPlugin(ScrollTrigger);

  const lowPower = !window.__XP_HQ && isLowPower();
  const state = {};
  let engine = null;
  let tl = null;
  let frames = null;
  let portrait = null;
  let builtAspect = 0;
  let destroyed = false;
  let dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1.5 : 2);
  let slow = 0;
  let step = -1;

  const pick = (f) => Object.fromEntries(sb.STATE_KEYS.map((k) => [k, f[k]]));
  const size = () => ({ w: els.stage.clientWidth || 1, h: els.stage.clientHeight || 1 });
  const progress = () => tl?.scrollTrigger?.progress ?? 0;

  function placeAnchors() {
    const p = progress();
    if (els.pin && p < 0.2) {
      const a = engine.project('hero');
      els.pin.style.transform = `translate3d(${a.x.toFixed(1)}px, ${a.y.toFixed(1)}px, 0)`;
    }
    if (p > 0.38 && p < 0.7) {
      /* Écran étroit : l'étiquette est centrée sur son point, et retenue
         dans le cadre pour ne jamais sortir de l'écran. */
      const w = els.stage.clientWidth;
      const narrow = w < 1024;
      for (const el of els.notes) {
        const a = engine.project(el.dataset.anchor);
        const x = narrow ? Math.min(w - 68, Math.max(68, a.x)) : a.x;
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${a.y.toFixed(1)}px, 0)`;
      }
    }
  }

  function draw() {
    if (destroyed) return;
    els.root.style.setProperty('--xp-dusk', state.dusk.toFixed(3));
    els.root.classList.toggle('xp-night', state.dusk > 0.5);
    if (!engine) return;
    const t0 = performance.now();
    engine.apply(state);
    placeAnchors();
    /* Résolution adaptative : si l'image coûte durablement trop cher, on
       descend d'un cran plutôt que de laisser le défilement saccader. */
    const dt = performance.now() - t0;
    slow = dt > 40 ? slow + 1 : Math.max(0, slow - 1);
    if (slow > 12 && dpr > 1) {
      dpr = Math.max(1, dpr - 0.5);
      slow = 0;
      const { w, h } = size();
      engine.resize(w, h, dpr);
    }
  }

  function setStep(p) {
    let i = 0;
    els.index.forEach((el, n) => {
      if (p >= Number(el.dataset.at) - 0.13) i = n;
    });
    if (i === step) return;
    step = i;
    els.index.forEach((el, n) => el.toggleAttribute('data-active', n === i));
    onStep?.(i);
  }

  function build() {
    tl?.scrollTrigger?.kill();
    tl?.kill();
    const { w, h } = size();
    portrait = sb.isPortrait(w / h);
    builtAspect = w / h;
    frames = sb.keyframes(w / h);
    Object.assign(state, pick(frames[0]));

    tl = gsap.timeline({
      defaults: { ease: 'none' },
      onUpdate: draw,
      scrollTrigger: {
        trigger: els.root,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        invalidateOnRefresh: false,
        onUpdate: (self) => setStep(self.progress),
      },
    });

    // Maquette : une interpolation par segment du storyboard
    for (let i = 0; i < frames.length - 1; i++) {
      const a = frames[i];
      const b = frames[i + 1];
      tl.fromTo(state, pick(a), { ...pick(b), duration: b.at - a.at, ease: 'sine.inOut', immediateRender: false }, a.at);
    }

    // Composition d'ouverture
    tl.to(els.hero, { autoAlpha: 0, y: -28, duration: 0.07, ease: 'power1.in' }, 0.05);
    tl.to(els.hint, { autoAlpha: 0, duration: 0.03 }, 0.01);
    tl.to(els.pin, { autoAlpha: 0, duration: 0.05 }, 0.05);
    tl.to(els.wordmark, { yPercent: -10, opacity: 0.1, duration: 0.2, ease: 'sine.inOut' }, 0.06);

    // Chapitres
    chapters.forEach((c, i) => {
      const el = els.chapters[i];
      tl.fromTo(el, { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.05, ease: 'power2.out', immediateRender: true }, c.at);
      if (c.until < 1) tl.to(el, { autoAlpha: 0, y: -18, duration: 0.04, ease: 'power1.in' }, c.until);
    });

    // Annotations de la vue éclatée
    tl.fromTo(els.notesBox, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05, immediateRender: true }, 0.46);
    tl.to(els.notesBox, { autoAlpha: 0, duration: 0.04 }, 0.615);

    // La timeline doit durer exactement 1 : c'est l'échelle du défilement.
    tl.set({}, {}, 1);
    draw();
    setStep(progress());
  }

  function resize() {
    const { w, h } = size();
    engine?.resize(w, h, dpr);
    /* Le storyboard dépend du format : on le reconstruit quand l'écran change
       d'orientation, ou de proportions en portrait (tablette redimensionnée). */
    const a = w / h;
    if (sb.isPortrait(a) !== portrait || (portrait && Math.abs(a - builtAspect) > 0.02)) build();
    else draw();
  }

  build();
  const ro = new ResizeObserver(resize);
  ro.observe(els.stage);

  const onLost = (e) => {
    e.preventDefault();
    const lost = engine;
    engine = null;
    delete window.__chaudrelXP;
    lost?.dispose();
    onFail?.(new Error('webglcontextlost'));
  };

  async function startEngine() {
    try {
      const { createEngine } = await import('./scene/engine.js');
      if (destroyed) return;
      const created = await createEngine(els.canvas, { lowPower, quality: window.__XP_HQ ? 'high' : 'auto' });
      if (destroyed) {
        created.dispose();
        return;
      }
      engine = created;
      els.canvas.addEventListener('webglcontextlost', onLost);
      const { w, h } = size();
      engine.resize(w, h, dpr);
      draw();
      window.__chaudrelXP = {
        progress,
        /* Position réellement jouée (le scrub lisse et rattrape `progress`). */
        played: () => tl?.progress() ?? 0,
        state: () => pick(state),
        info: () => engine.info(),
        captureAt(p, type, quality) {
          engine.apply(sb.stateAt(frames, p));
          const url = engine.capture(type, quality);
          draw();
          return url;
        },
      };
      onReady?.();
    } catch (err) {
      engine = null;
      onFail?.(err);
    }
  }

  /* Le moteur démarre au premier signe d'intérêt : un mouvement de souris, un
     doigt posé, un début de défilement, une touche. D'ici là l'image de repli
     est à l'écran, au même cadrage - la page se charge sans rien payer pour
     la 3D, et un visiteur qui repart aussitôt ne la télécharge jamais.
     Sans geste, il démarre seul au bout de quelques secondes. */
  const WAKE = ['pointermove', 'pointerdown', 'touchstart', 'wheel', 'scroll', 'keydown'];
  let woke = false;
  let timer = 0;
  function wake() {
    if (woke) return;
    woke = true;
    WAKE.forEach((type) => window.removeEventListener(type, wake));
    window.clearTimeout(timer);
    startEngine();
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
    ro.disconnect();
    els.canvas.removeEventListener('webglcontextlost', onLost);
    tl?.scrollTrigger?.kill();
    tl?.kill();
    gsap.set([els.hero, els.hint, els.pin, els.wordmark, els.notesBox, ...els.chapters], { clearProps: 'all' });
    els.root.style.removeProperty('--xp-dusk');
    els.root.classList.remove('xp-night');
    engine?.dispose();
    engine = null;
    delete window.__chaudrelXP;
  };
}
