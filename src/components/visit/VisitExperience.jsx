import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui';
import { canUseWebGL, prefersSavedData } from '@/lib/webgl';
import useReducedMotion from '@/hooks/useMotionPreferences';
import { cn } from '@/lib/utils';
import { EYE, FOOTPRINT, NODES, ROOMS, TOUR, neighbours, nodeById, roomById } from './world/layout.js';
import { DEFAULT_STYLE, STYLES } from './world/styles.js';

const VISIT_ROOMS = ROOMS.filter((r) => !r.closed && r.id !== 'stairwell');
const mainNode = (roomId) => NODES.find((n) => n.room === roomId && n.main)?.id;
const area = (r) => Math.round((r.r[1] - r.r[0]) * (r.r[3] - r.r[2]));
const LEVEL_NAME = ['Rez-de-chaussée', 'Étage'];

/**
 * La visite : une maison qu'on parcourt à hauteur d'œil.
 *
 *   - se déplacer : cliquer une pastille, un point du sol, une pièce du plan
 *     ou du bandeau ; ou marcher au clavier (flèches, ZQSD) ;
 *   - regarder : glisser sur l'image (souris ou doigt) ;
 *   - transformer : chaque pièce s'ouvre en chantier ; « Révéler » la finit ;
 *   - finitions : trois styles pour la même maison.
 *
 * Sans WebGL, ou avec le mouvement réduit : la page reste une description
 * complète des pièces (prérendue, lisible par les moteurs).
 */
export default function VisitExperience() {
  const reduced = useReducedMotion();
  const [live, setLive] = useState(false);
  const [phase, setPhase] = useState('idle'); // idle | loading | intro | visit | error
  const [node, setNode] = useState('dehors');
  const [roomId, setRoomId] = useState('outside');
  const [rawT, setRawT] = useState(1);
  const [moving, setMoving] = useState(false);
  const [style, setStyle] = useState(DEFAULT_STYLE);
  const [busy, setBusy] = useState(false);
  const [walkMode, setWalkMode] = useState(false);
  const [touring, setTouring] = useState(false);
  const [level, setLevel] = useState(0);

  const host = useRef(null);
  const stage = useRef(null);
  const hotLayer = useRef(null);
  const dot = useRef(null);
  const worldRef = useRef(null);
  const tourToken = useRef(0);
  const store = useRef(null);

  useEffect(() => {
    setLive(!reduced && !prefersSavedData() && canUseWebGL());
  }, [reduced]);

  /* ---------- chargement du monde ---------- */
  const start = useCallback(async () => {
    if (phase !== 'idle') return;
    setPhase('loading');
    try {
      const s = (store.current ||= await import('./store.js'));
      const w = await s.acquireWorld();
      worldRef.current = w;
      s.attachWorld(host.current, 'visit');
      if (!w.visitReady) {
        // à la première visite, chaque pièce attend son chantier
        for (const r of VISIT_ROOMS) w.setRoomProgress(r.id, 0);
        w.visitReady = true;
      }
      w.setDoor(1);
      w.jump('dehors');
      setStyle(w.style);
      setPhase('intro');
    } catch {
      setPhase('error');
    }
  }, [phase]);

  useEffect(() => {
    if (!live) return undefined;
    // le moteur se prépare dès que la page est là : la visite est l'objet de la page
    const id = window.requestIdleCallback ? window.requestIdleCallback(start, { timeout: 600 }) : window.setTimeout(start, 200);
    return () => {
      if (window.cancelIdleCallback && window.requestIdleCallback) window.cancelIdleCallback(id);
      else window.clearTimeout(id);
    };
  }, [live, start]);

  useEffect(
    () => () => {
      tourToken.current++;
      store.current?.releaseWorld('visit');
    },
    []
  );

  /* ---------- redimensionnement ---------- */
  useEffect(() => {
    if (phase === 'idle' || phase === 'error') return undefined;
    const ro = new ResizeObserver(() => {
      const w = worldRef.current;
      if (!w || !host.current) return;
      const r = host.current.getBoundingClientRect();
      w.resize(r.width, r.height, Math.min(window.devicePixelRatio || 1, 1.75));
    });
    ro.observe(host.current);
    return () => ro.disconnect();
  }, [phase]);

  /* ---------- événements du monde ---------- */
  useEffect(() => {
    const w = worldRef.current;
    if (!w || phase === 'idle' || phase === 'loading') return undefined;
    const sync = () => {
      const id = w.room();
      setRoomId(id);
      setNode(w.current);
      setRawT(id === 'outside' ? 1 : w.roomState(id));
      setLevel(w.view.level);
    };
    sync();
    const off = w.on((type) => {
      if (type === 'frame') placeHotspots();
      else if (type === 'depart') setMoving(true);
      else if (type === 'arrive' || type === 'reveal') {
        setMoving(false);
        sync();
      } else if (type === 'walk') sync();
    });
    return off;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  /* ---------- pastilles de déplacement, posées dans la scène ---------- */
  const targets = phase === 'visit' && !moving ? neighbours(node).map((n) => nodeById(n.id)) : [];
  const placeHotspots = () => {
    const w = worldRef.current;
    const layer = hotLayer.current;
    if (!w || !layer) return;
    for (const el of layer.children) {
      const n = nodeById(el.dataset.node);
      if (!n) continue;
      const p = w.project(n.p[0], n.y + (n.detail ? 1.0 : 0.05), n.p[1]);
      el.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0)`;
      el.style.visibility = p.visible ? 'visible' : 'hidden';
    }
    // position sur le plan
    if (dot.current) {
      const [x0, x1, z0, z1] = FOOTPRINT;
      const v = w.view;
      dot.current.setAttribute('transform', `translate(${((v.x - x0) / (x1 - x0)) * 170},${((v.z - z0) / (z1 - z0)) * 110}) rotate(${-v.yaw})`);
    }
  };
  useEffect(() => {
    worldRef.current?.invalidate();
  }, [node, moving, phase]);

  /* ---------- actions ---------- */
  const go = useCallback(async (id) => {
    const w = worldRef.current;
    if (!w || !id) return;
    tourToken.current++;
    setTouring(false);
    setWalkMode(false);
    await w.goTo(id);
  }, []);

  const enter = async (guided) => {
    setPhase('visit');
    if (guided) runTour();
    else await worldRef.current.goTo('hall');
  };

  const reveal = (finished) => {
    const w = worldRef.current;
    if (!w || roomId === 'outside') return;
    w.reveal(roomId, finished);
  };

  async function runTour() {
    const w = worldRef.current;
    const token = ++tourToken.current;
    setTouring(true);
    setWalkMode(false);
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    for (const id of TOUR) {
      if (token !== tourToken.current) return;
      const ok = await w.goTo(id, { speed: 1.25 });
      if (!ok || token !== tourToken.current) return;
      const room = nodeById(id).room;
      if (w.roomState(room) < 1) {
        await wait(700);
        if (token !== tourToken.current) return;
        await w.reveal(room, true);
      }
      await wait(nodeById(id).detail ? 2600 : 2200);
    }
    if (token === tourToken.current) setTouring(false);
  }

  const stopTour = () => {
    if (!touring) return;
    tourToken.current++;
    setTouring(false);
    worldRef.current?.stop();
  };

  const chooseStyle = async (key) => {
    const w = worldRef.current;
    if (!w || key === style) return;
    setBusy(true);
    await new Promise((r) => setTimeout(r, 30));
    w.setStyle(key);
    setStyle(key);
    setBusy(false);
  };

  /* ---------- regard : glisser ; aller : toucher le sol ---------- */
  const drag = useRef(null);
  const onPointerDown = (e) => {
    if (phase !== 'visit' || e.button > 0) return;
    // les commandes posées sur l'image ne déplacent pas la caméra
    if (e.target.closest('button, a, .visit-card, .visit-plan, .visit-tools, .visit-rail')) return;
    stopTour();
    drag.current = { x: e.clientX, y: e.clientY, moved: false, id: e.pointerId };
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.moved && Math.hypot(dx, dy) > 6) {
      d.moved = true;
      stage.current.setPointerCapture?.(d.id);
    }
    if (d.moved) {
      const k = e.pointerType === 'touch' ? 0.22 : 0.16;
      worldRef.current?.look(-dx * k, dy * k);
      d.x = e.clientX;
      d.y = e.clientY;
    }
  };
  const onPointerUp = (e) => {
    const d = drag.current;
    drag.current = null;
    if (!d || d.moved) return;
    const w = worldRef.current;
    const r = stage.current.getBoundingClientRect();
    const hit = w?.pick(e.clientX - r.left, e.clientY - r.top);
    if (!hit) return;
    const id = w.nearestNode(hit.x, hit.z, hit.level);
    if (id && id !== w.current) go(id);
  };

  /* ---------- clavier ---------- */
  useEffect(() => {
    if (phase !== 'visit') return undefined;
    const keys = new Set();
    let raf = 0;
    let last = 0;
    const MAP = { ArrowUp: 'f', KeyW: 'f', KeyZ: 'f', ArrowDown: 'b', KeyS: 'b', ArrowLeft: 'l', KeyA: 'l', KeyQ: 'l', ArrowRight: 'r', KeyD: 'r' };
    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      const w = worldRef.current;
      const f = (keys.has('f') ? 1 : 0) - (keys.has('b') ? 1 : 0);
      const turn = (keys.has('r') ? 1 : 0) - (keys.has('l') ? 1 : 0);
      if (walkMode) {
        if (f) w.walk(f, 0, dt);
        if (turn) w.look(turn * 80 * dt, 0);
      } else if (turn) w.look(turn * 70 * dt, 0);
      raf = keys.size ? requestAnimationFrame(loop) : 0;
    };
    const down = (e) => {
      if (e.target.closest?.('input, textarea, select')) return;
      const k = MAP[e.code];
      if (!k) {
        if (e.code === 'Escape') setWalkMode(false);
        return;
      }
      if (!walkMode && (k === 'f' || k === 'b')) return;
      e.preventDefault();
      stopTour();
      keys.add(k);
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };
    const up = (e) => {
      const k = MAP[e.code];
      if (k) keys.delete(k);
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, walkMode, touring]);

  const room = roomById(roomId);
  const here = nodeById(node);
  const styleDef = STYLES[style];
  const detailNode = room ? NODES.find((n) => n.room === room.id && n.detail) : null;
  const atDetail = here?.detail;
  const ready = phase === 'intro' || phase === 'visit';

  return (
    <section className={cn('visit', live && 'visit-live', ready && 'visit-ready', phase === 'visit' && 'visit-on')} aria-label="Visite de la maison d’étude">
      <div
        ref={stage}
        className="visit-stage"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (drag.current = null)}
      >
        <img className="visit-poster" src="/visite/entree.webp" alt="" width="1600" height="1000" decoding="async" />
        <div ref={host} className="visit-canvas" />
        <div className="visit-shade" aria-hidden="true" />

        {/* pastilles de déplacement */}
        <div ref={hotLayer} className="visit-hot" aria-hidden={phase !== 'visit'}>
          {targets.map((n) => (
            <button
              key={n.id}
              type="button"
              data-node={n.id}
              className={cn('visit-spot', n.detail && 'visit-spot-detail')}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => go(n.id)}
            >
              <i aria-hidden="true" />
              <span>{n.detail ? 'Détail' : n.label}</span>
            </button>
          ))}
        </div>

        {/* ---------- ouverture ---------- */}
        {phase !== 'visit' && (
          <div className="visit-intro">
            <p className="visit-kicker">Visite 3D · maison d’étude</p>
            <h1 className="visit-title">
              Entrez. <em>Tout est à visiter.</em>
            </h1>
            <p className="visit-lead">
              Neuf pièces sur deux niveaux, à parcourir à hauteur d’œil. Chaque pièce s’ouvre en chantier : à vous de
              révéler la rénovation.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {live ? (
                <>
                  <Button size="lg" arrow disabled={!ready} onClick={() => enter(true)}>
                    {ready ? 'Visite guidée' : 'Préparation des matières…'}
                  </Button>
                  <Button size="lg" variant="outlineLight" disabled={!ready} onClick={() => enter(false)}>
                    Explorer librement
                  </Button>
                </>
              ) : (
                <Button href="#pieces" size="lg" variant="outlineLight">
                  Parcourir les pièces
                </Button>
              )}
            </div>
            <p className="visit-note">
              Environnement conceptuel conçu pour montrer nos matières et nos finitions - pas un chantier Chaudrel.
              {phase === 'error' && ' La 3D n’a pas pu démarrer sur cet appareil : les pièces sont décrites ci-dessous.'}
            </p>
          </div>
        )}

        {/* ---------- visite ---------- */}
        {phase === 'visit' && (
          <>
            <div className="visit-where" aria-live="polite">
              <span className="t-num">{LEVEL_NAME[level]}</span>
              <strong>{room?.name || here?.label || 'Jardin'}</strong>
            </div>

            {room && (
              <article className={cn('visit-card', moving && 'is-moving')}>
                <p className="visit-card-k">
                  {room.name} · ≈ {area(room)} m²
                </p>
                <h2 className="visit-card-title">{atDetail ? here.label : room.title}</h2>
                <p className="visit-card-text">{atDetail ? room.detail : room.text}</p>
                <ul className="visit-mats">
                  {room.materials.map((m) => (
                    <li key={m}>{styleDef.labels[m]}</li>
                  ))}
                </ul>
                <div className="visit-card-actions">
                  {rawT < 1 ? (
                    <Button size="sm" arrow onClick={() => reveal(true)}>
                      Révéler la rénovation
                    </Button>
                  ) : (
                    <div className="visit-toggle" role="group" aria-label="Avant ou après travaux">
                      <button type="button" aria-pressed={false} onClick={() => reveal(false)}>
                        Avant
                      </button>
                      <button type="button" aria-pressed>
                        Après
                      </button>
                    </div>
                  )}
                  {detailNode && !atDetail && (
                    <button type="button" className="visit-link" onClick={() => go(detailNode.id)}>
                      Voir le détail
                    </button>
                  )}
                  {atDetail && (
                    <button type="button" className="visit-link" onClick={() => go(mainNode(room.id))}>
                      Revenir
                    </button>
                  )}
                </div>
                {rawT < 1 && <p className="visit-card-raw">Cette pièce est dans l’état où nous la trouvons souvent.</p>}
              </article>
            )}

            {/* plan */}
            <nav className="visit-plan" aria-label="Plan de la maison">
              <div className="visit-plan-tabs">
                {LEVEL_NAME.map((n, i) => (
                  <button key={n} type="button" aria-pressed={level === i} onClick={() => go(i ? 'palier' : 'hall')}>
                    {i ? 'Étage' : 'Rez'}
                  </button>
                ))}
              </div>
              <svg viewBox="-4 -4 178 118" role="img" aria-label={`Plan - ${LEVEL_NAME[level]}`}>
                {ROOMS.filter((r) => r.l === level).map((r) => {
                  const [x0, x1, z0, z1] = r.r;
                  const sx = 170 / 17;
                  const sz = 110 / 11;
                  const target = mainNode(r.id);
                  return (
                    <g key={r.id} className={cn('visit-plan-room', r.id === roomId && 'is-here', !target && 'is-off')}>
                      <rect x={x0 * sx} y={z0 * sz} width={(x1 - x0) * sx} height={(z1 - z0) * sz} onClick={() => target && go(target)}>
                        <title>{r.name}</title>
                      </rect>
                    </g>
                  );
                })}
                <g ref={dot}>
                  <path d="M0 0 L-9 16 A18 18 0 0 0 9 16 Z" className="visit-plan-cone" />
                  <circle r="3.2" className="visit-plan-dot" />
                </g>
              </svg>
            </nav>

            {/* commandes */}
            <div className="visit-tools">
              <button type="button" className="visit-tool" aria-pressed={touring} onClick={() => (touring ? stopTour() : runTour())}>
                {touring ? 'Pause' : 'Visite guidée'}
              </button>
              <button type="button" className="visit-tool hidden lg:inline-flex" aria-pressed={walkMode} onClick={() => (stopTour(), setWalkMode((v) => !v))}>
                {walkMode ? 'Marche libre · Échap' : 'Marche libre'}
              </button>
              <div className="visit-styles" role="group" aria-label="Finitions">
                {Object.entries(STYLES).map(([k, s]) => (
                  <button key={k} type="button" aria-pressed={style === k} disabled={busy} onClick={() => chooseStyle(k)} title={s.line}>
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* pièces */}
            <ol className="visit-rail" aria-label="Pièces">
              {VISIT_ROOMS.map((r) => (
                <li key={r.id}>
                  <button type="button" aria-current={r.id === roomId ? 'location' : undefined} onClick={() => go(mainNode(r.id))}>
                    {r.name}
                  </button>
                </li>
              ))}
            </ol>

            <p className="visit-help" aria-hidden="true">
              {walkMode ? 'Flèches ou ZQSD pour marcher · Échap pour arrêter' : 'Glissez pour regarder · touchez le sol pour avancer'}
            </p>
          </>
        )}
      </div>

      {/* ---------- description complète (prérendue) ---------- */}
      <div id="pieces" className="visit-rooms">
        <div className="visit-rooms-head">
          <p className="eyebrow">
            <span aria-hidden="true" />
            Les pièces
          </p>
          <h2 className="t-h2 mt-6 max-w-[20ch]">
            Neuf pièces, <em>trois finitions.</em>
          </h2>
          <p className="t-lead mt-5 max-w-[56ch] text-ink/65">
            La même maison existe en {Object.keys(STYLES).length} finitions :{' '}
            {Object.values(STYLES)
              .map((s) => s.name.toLowerCase())
              .join(', ')}
            . Les surfaces sont celles de la maquette d’étude.
          </p>
        </div>
        <ol className="visit-rooms-list">
          {VISIT_ROOMS.map((r, i) => (
            <li key={r.id}>
              <p className="t-label flex items-center gap-3 text-ink/65">
                <span className="t-num tracking-normal text-gold-deep">{String(i + 1).padStart(2, '0')}</span>
                {r.name} · {LEVEL_NAME[r.l]} · ≈ {area(r)} m²
              </p>
              <h3 className="mt-3 font-display text-[1.5rem] leading-tight">{r.title}</h3>
              <p className="t-small mt-2 text-ink/70">{r.text}</p>
            </li>
          ))}
        </ol>
        <div className="visit-rooms-foot">
          <p className="t-lead max-w-[48ch] text-ink/70">Les vraies réalisations, elles, se regardent en photographies.</p>
          <Link to="/realisations" className="link-line t-label">
            Voir nos chantiers
          </Link>
        </div>
      </div>
    </section>
  );
}

export { EYE };
