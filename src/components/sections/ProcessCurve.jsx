import { useEffect, useId, useRef, useState } from 'react';
import { METHOD } from '@/data/method';
import { ICONS } from '@/components/ui/BrandIcons';
import { cn } from '@/lib/utils';

/**
 * Les étapes d'un chantier, en trois dimensions.
 *
 * Plus de serpent : quatre colonnes se dressent depuis une même ligne de sol —
 * le « niveau » de chaque étape est sa charge (le contact ne coûte rien, le
 * chantier est le sommet, la livraison redescend au calme). Les colonnes
 * se dressent au scroll chacune à leur rythme, et la livraison se scelle
 * en vert quand tout est en place.
 *
 * La profondeur tient à trois gestes, sans décor superflu :
 *   · les colonnes sont des volumes — dégradé de matière et ombre portée ;
 *   · les cartes posées sur leur sommet basculent d'un léger quart de tour à
 *     l'apparition (perspective), puis se stabilisent à plat ;
 *   · tout est posé sur la même ligne de sol, qui ancre la lecture.
 *
 * Sur les petits écrans la même progression devient une liste verticale —
 * même donnée, autre lecture.
 */

/* Niveau de chaque étape, en px depuis la ligne de sol : la charge. */
const ELEV = [32, 104, 188, 88];
const CARD = 58;
/* Marge entre la ligne de sol et le bas du cadre, pour que l'ombre respire. */
const GROUND = 30;
const H = 300;

const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export default function ProcessCurve({ steps = METHOD, tone = 'dark', className }) {
  const light = tone === 'light'; // « light » = texte clair sur fond sombre
  const uid = useId().replace(/:/g, '');
  const ref = useRef(null);
  const [drawn, setDrawn] = useState(reducedMotion);
  const [sealed, setSealed] = useState(false);

  useEffect(() => {
    if (!drawn) return undefined;
    const id = setTimeout(() => setSealed(true), 1900);
    return () => clearTimeout(id);
  }, [drawn]);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { rootMargin: '-60px', threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const accent = light ? 'text-gold-light' : 'text-gold';
  const ghost = light ? 'text-cream/[0.08]' : 'text-ink/[0.07]';

  const standBg = light
    ? 'linear-gradient(180deg, rgb(255 255 255 / 0.12) 0%, rgb(255 255 255 / 0.03) 100%)'
    : 'linear-gradient(180deg, rgb(255 255 255 / 0.02) 0%, rgb(255 255 255 / 0.09) 100%)';
  const standBorder = light ? 'rgb(255 255 255 / 0.16)' : 'rgb(0 0 0 / 0.45)';
  const groundLine = light ? 'rgb(140 118 78 / 0.55)' : 'rgb(201 174 131 / 0.55)';

  /**
   * Le repère posé sur le sommet de chaque colonne : pastille pleine, symbole
   * de l'étape. La dernière passe au vert quand le chantier est livré : le vert
   * est la seule couleur du site réservée à un état achevé.
   */
  const Badge = ({ step, size = CARD, last = false }) => {
    const Icon = ICONS[step.icon];
    const done = last && sealed;
    return (
      <span className="relative grid place-items-center">
        {done && (
          <span
            aria-hidden="true"
            className={cn('seal-ring pointer-events-none absolute inset-0 rounded-md', light ? 'bg-green-light' : 'bg-green')}
          />
        )}
        <span
          className={cn(
            'relative grid place-items-center rounded-md transition-colors duration-[550ms] ease-soft',
            size === CARD ? 'shadow-lift' : 'shadow-soft',
            done
              ? light
                ? 'bg-green-light text-bark'
                : 'bg-green text-cream'
              : light
                ? 'bg-cream text-bark'
                : 'bg-shell text-ink'
          )}
          style={{ width: size, height: size }}
        >
          {Icon ? <Icon width={size * 0.42} height={size * 0.42} {...(last ? { draw: done } : {})} /> : null}
        </span>
      </span>
    );
  };

  return (
    <div ref={ref} className={className}>
      {/* ---------- Desktop : les colonnes ---------- */}
      <div className="relative hidden lg:block">
        {/* Le cadre : hauteur fixe, colonnes en absolu, débordements rognés ;
            c'est lui qui donne la perspective aux cartes qui basculent. */}
        <div className="relative overflow-hidden" style={{ height: H, perspective: '1200px' }}>
          {/* Ligne de sol : une seule, qui ancre toutes les colonnes. */}
          <span
            aria-hidden="true"
            className="absolute left-0 right-0 block transition-opacity duration-slow"
            style={{
              bottom: GROUND - 6,
              height: 1,
              background: groundLine,
              boxShadow: `0 0 18px ${groundLine}`,
              opacity: drawn ? 1 : 0,
            }}
          />

          {steps.map((s, i) => {
            const x = `${((i + 0.5) / steps.length) * 100}%`;

            return (
              <div
                key={s.n}
                aria-hidden={!drawn}
                className="absolute flex flex-col items-center justify-end"
                style={{ left: x, bottom: GROUND, width: 56, transform: 'translateX(-50%)' }}
              >
                {/* Chiffre en filigrane derrière la carte. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    'pointer-events-none absolute select-none font-display leading-[0.75] transition-opacity duration-[1200ms]',
                    'text-[6.5rem] xl:text-[7.5rem]',
                    ghost,
                    drawn ? 'opacity-100' : 'opacity-0'
                  )}
                  style={{
                    left: '50%',
                    bottom: ELEV[i] + CARD * 0.5,
                    transform: 'translate(-50%, 50%)',
                    zIndex: 0,
                    transitionDelay: `${600 + i * 120}ms`,
                  }}
                />

                {/* La carte, posée sur le sommet de la colonne. Elle bascule
                    d'un léger quart de tour à l'apparition puis se stabilise. */}
                <span
                  className="relative z-10 transition-[opacity,transform] duration-[650ms] ease-soft"
                  style={{
                    transitionDelay: `${260 + i * 120}ms`,
                    opacity: drawn ? 1 : 0,
                    transform: drawn
                      ? 'rotateX(0deg) translateY(0) scale(1)'
                      : 'rotateX(-26deg) translateY(18px) scale(0.86)',
                  }}
                >
                  <Badge step={s} last={i === steps.length - 1} />
                </span>

                {/* La colonne : volume en dégradé, elle se dresse depuis le sol. */}
                <span
                  aria-hidden="true"
                  className="block w-full rounded-b-md transition-transform duration-[900ms] ease-soft"
                  style={{
                    height: ELEV[i],
                    background: standBg,
                    border: `0.5px solid ${standBorder}`,
                    boxShadow: '0 18px 30px -18px rgb(0 0 0 / 0.35)',
                    transform: drawn ? 'translateY(0)' : `translateY(${ELEV[i]}px)`,
                    transitionDelay: `${100 + i * 120}ms`,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Les textes forment une vraie liste ordonnée : c'est l'ordre qui
            porte le sens, et un lecteur d'écran doit l'entendre. */}
        <ol className="mt-10 grid grid-cols-4 gap-x-6">
          {steps.map((s, i) => (
            <li
              key={s.n}
              className={cn('text-center transition-opacity duration-slow', drawn ? 'opacity-100' : 'opacity-0')}
              style={{ transitionDelay: `${420 + i * 120}ms` }}
            >
              <span className={cn('t-label', accent)}>{s.n}</span>
              <h3 className={cn('t-h3 mt-3 text-balance', light ? 'text-cream' : 'text-ink')}>{s.title}</h3>
              <p className={cn('t-small mx-auto mt-2 max-w-[24ch]', light ? 'text-cream/65' : 'text-ink/65')}>
                {s.text}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {/* ---------- Mobile : la même progression, en liste ---------- */}
      <div className="relative lg:hidden">
        {/* Rail de liaison vertical, derrière les repères. */}
        <span
          aria-hidden="true"
          className="absolute bottom-5 left-[23px] top-5 w-px"
          style={{ backgroundColor: light ? 'rgb(255 255 255 / 0.18)' : 'rgb(26 26 26 / 0.12)' }}
        />

        <ol className="relative">
          {steps.map((s, i) => {
            const last = i === steps.length - 1;
            return (
              <li
                key={s.n}
                className={cn(
                  'relative flex gap-5 pb-9 transition-opacity duration-slow last:pb-0',
                  drawn ? 'opacity-100' : 'opacity-0'
                )}
                style={{ transitionDelay: `${150 + i * 130}ms` }}
              >
                <span className="relative mt-1 flex-none">
                  <Badge step={s} size={46} last={last} />
                </span>
                <div>
                  <span className={cn('t-label', accent)}>{s.n}</span>
                  <h3 className={cn('t-h3 mt-2', light ? 'text-cream' : 'text-ink')}>{s.title}</h3>
                  <p className={cn('t-small mt-2', light ? 'text-cream/65' : 'text-ink/65')}>{s.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}