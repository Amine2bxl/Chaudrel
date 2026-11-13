import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui';
import { BRAND, whatsappUrl } from '@/data/site';
import { EVENTS, track } from '@/lib/analytics';
import { canUseWebGL, prefersSavedData, supportsStickyStage } from '@/lib/webgl';
import useReducedMotion from '@/hooks/useMotionPreferences';
import { cn } from '@/lib/utils';
import { CHAPTERS, INDEX, SHEET } from './content';

/**
 * Hero d'accueil : on entre dans la maison d'étude, à hauteur d'œil.
 *
 * Deux modes, un seul balisage :
 *   statique  (prérendu, sans JS, sans WebGL, mouvement réduit, économie de
 *             données) - l'image d'ouverture, la promesse, les actions, puis
 *             les six temps en lecture normale ;
 *   vivant    la section devient une piste haute ; la scène reste collée à
 *             l'écran et le défilement fait avancer la caméra.
 *
 * Tout le texte est dans le DOM dans les deux cas. La maison est annoncée
 * comme une maquette d'étude, pas comme un chantier de Chaudrel.
 */
export default function ArchitecturalExperience() {
  const reduced = useReducedMotion();
  const [live, setLive] = useState(false);
  const [ready, setReady] = useState(false);

  const root = useRef(null);
  const stage = useRef(null);
  const host = useRef(null);
  const wordmark = useRef(null);
  const hero = useRef(null);
  const hint = useRef(null);
  const index = useRef(null);

  useEffect(() => {
    setLive(!reduced && !prefersSavedData() && supportsStickyStage() && canUseWebGL());
  }, [reduced]);

  useEffect(() => {
    if (!live) return undefined;
    let cancelled = false;
    let destroy = null;
    const el = root.current;
    import('./ScrollSequence.js')
      .then(({ mountSequence }) => {
        if (cancelled) return null;
        return mountSequence(
          {
            root: el,
            host: host.current,
            wordmark: wordmark.current,
            hero: hero.current,
            hint: hint.current,
            indexBox: index.current,
            chapters: [...el.querySelectorAll('[data-chapter]')],
            index: [...el.querySelectorAll('[data-at]')],
          },
          {
            chapters: CHAPTERS,
            onReady: () => !cancelled && setReady(true),
            // WebGL refusé, contexte perdu : l'image d'ouverture reste à
            // l'écran et le récit continue sans la 3D.
            onFail: () => !cancelled && setReady(false),
          }
        );
      })
      .then((fn) => {
        if (cancelled) fn?.();
        else destroy = fn;
      })
      .catch(() => !cancelled && setLive(false));
    return () => {
      cancelled = true;
      destroy?.();
      setReady(false);
    };
  }, [live]);

  const goTo = (p) => {
    const el = root.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + p * (el.offsetHeight - window.innerHeight) });
  };

  return (
    <section ref={root} className={cn('xp', live && 'xp-live', ready && 'xp-ready')} aria-label="Chaudrel, entreprise de rénovation">
      <div ref={stage} className="xp-stage">
        <div className="xp-frame">
          {/* Image d'ouverture : visible tout de suite, remplacée par la 3D
              quand elle a dessiné sa première image (même cadrage). */}
          <picture className="xp-poster">
            <source media="(max-aspect-ratio: 4/5)" srcSet="/experience/entree-portrait.webp" width="1080" height="1620" />
            <img
              src="/experience/entree.webp"
              alt="Maquette 3D d’une maison contemporaine vue depuis l’allée - illustration, pas un chantier Chaudrel"
              width="2400"
              height="1350"
              fetchpriority="high"
              decoding="sync"
            />
          </picture>
          <div ref={host} className="xp-canvas" aria-hidden="true" />
          <div className="xp-fade" aria-hidden="true" />

          <p ref={wordmark} className="xp-wordmark" aria-hidden="true">
            Chaudrel<span className="text-gold">.</span>
          </p>

          <div className="xp-corners">
            <p className="t-label">Entreprise de rénovation</p>
            <p className="t-label text-right">
              Bruxelles
              <br />
              {BRAND.zone}
            </p>
          </div>

          {/* ---------- Promesse et actions ---------- */}
          <div ref={hero} className="xp-hero">
            <div className="xp-hero-copy">
              <h1 className="xp-h1">
                Du premier plan à la <em>dernière clé.</em>
              </h1>
              <p className="t-lead mt-4 max-w-[40ch] text-ink/70">
                Rénovation complète, finitions, toiture, façade et extérieurs. Un seul interlocuteur, du devis à la remise
                des clés, partout en Belgique.
              </p>
              <div data-page-cta className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
                <Button to="/devis" size="lg" arrow className="w-full justify-center sm:w-auto" onClick={() => track(EVENTS.QUOTE_CTA, { source: 'hero' })}>
                  Demander un devis
                </Button>
                <div className="flex gap-2.5">
                  <Button
                    href={`tel:${BRAND.phones[0].tel}`}
                    variant="outline"
                    size="lg"
                    className="flex-1 justify-center px-6 sm:flex-none"
                    onClick={() => track(EVENTS.PHONE_CLICK, { source: 'hero' })}
                  >
                    <span className="tabular-nums">{BRAND.phones[0].number}</span>
                  </Button>
                  <Button
                    href={whatsappUrl()}
                    variant="outline"
                    size="lg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 justify-center px-6 sm:flex-none"
                    onClick={() => track(EVENTS.WHATSAPP_CLICK, { source: 'hero' })}
                  >
                    WhatsApp
                  </Button>
                </div>
              </div>
            </div>

            <dl className="xp-sheet">
              {SHEET.map(([k, v]) => (
                <div key={k} className="xp-sheet-row">
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>

            <p className="xp-disclaimer">Maquette d’étude · illustration 3D</p>
          </div>

          {/* ---------- Index du film ---------- */}
          <ol ref={index} className="xp-index" aria-label="Étapes de la présentation">
            {INDEX.map((s) => (
              <li key={s.n}>
                <button type="button" data-at={s.at} onClick={() => goTo(s.at)} tabIndex={live ? 0 : -1}>
                  <span className="t-num">{s.n}</span>
                  <span className="xp-index-label">{s.label}</span>
                </button>
              </li>
            ))}
          </ol>

          <p ref={hint} className="xp-hint" aria-hidden="true">
            Faites défiler pour entrer
            <i />
          </p>
        </div>

        {/* ---------- Chapitres ---------- */}
        <ol className="xp-chapters">
          {CHAPTERS.map((c) => (
            <li key={c.id} data-chapter={c.id} className="xp-chapter">
              <p className="xp-chapter-label">
                <span className="t-num">{c.n}</span>
                <i aria-hidden="true" />
                {c.verb}
              </p>
              <h2 className="xp-chapter-title">{c.title}</h2>
              <p className="xp-chapter-text">{c.text}</p>
              {c.id === 'reveler' && (
                <div className="xp-chapter-cta">
                  <Button to="/visite" arrow>
                    Visiter la maison
                  </Button>
                  <Button to="/realisations" variant="outline">
                    Nos chantiers
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ol>

        <figure className="xp-static-figure">
          <img src="/experience/sejour.webp" alt="Maquette 3D : le séjour terminé, vue sur le jardin" width="2400" height="1350" loading="lazy" decoding="async" />
          <figcaption className="t-label">Maquette d’étude · illustration 3D, pas un chantier Chaudrel</figcaption>
        </figure>
      </div>
    </section>
  );
}
