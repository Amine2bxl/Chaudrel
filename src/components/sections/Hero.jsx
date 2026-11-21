import { useCallback, useEffect, useId, useRef } from 'react';
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform } from 'motion/react';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui';
import { BronzeGradient, DOOR_POINTS, LETTERS_PATH, MONO_VIEWBOX } from '@/components/ui/Logo';
import { WhatsappIcon } from '@/components/ui/BrandIcons';
import { BRAND, whatsappUrl } from '@/data/site';
import { EVENTS, track } from '@/lib/analytics';
import { imageAttrs, SIZES } from '@/lib/image';
import { EASE } from '@/lib/motion';
import usePointerGlow from '@/lib/usePointerGlow';
import useSectionProgress from '@/lib/useSectionProgress';

/* Repère du monogramme : viewBox « x y largeur hauteur » du tracé d'origine. */
const [VX, VY, VW, VH] = MONO_VIEWBOX.split(' ').map(Number);
/* Centre de la porte, en fraction du monogramme : c'est là qu'on entre. */
const DOOR_CX = (DOOR_POINTS.reduce((s, p) => s + p[0], 0) / 4 - VX) / VW;
const DOOR_CY = (DOOR_POINTS.reduce((s, p) => s + p[1], 0) / 4 - VY) / VH;
const DOOR_D = `M${DOOR_POINTS.map((p) => p.join(' ')).join(' L')} Z`;

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const lerp = (a, b, t) => a + (b - a) * t;
/** Grossissement du monogramme : lent au départ, puis on traverse la porte. */
const zoom = (p) => 1 + Math.pow(p, 2.2) * 11;

const HEADLINE = 'Du premier plan à la dernière clé.';

/**
 * Hero - la porte du logo s'ouvre sur une maison.
 *
 * Premier écran : le monogramme CR en crème sur la nuit, la porte bronze, la
 * promesse et les trois issues (devis, appel, WhatsApp). Au défilement, on
 * avance vers la porte : le monogramme grossit autour d'elle, la porte
 * s'efface et laisse voir la photo à travers son contour, puis le contour se
 * redresse jusqu'au plein écran. Une carte de verre porte alors l'offre.
 *
 * Le contour de la photo suit les quatre coins de la porte, recalculés à
 * chaque image à partir de la progression du défilement (Motion `useScroll`) :
 * aucune image clé à maintenir, rien ne dérive au redimensionnement.
 *
 * `prefers-reduced-motion` : pas d'épinglage ni de zoom, la section affiche
 * directement l'état final - photo, carte, actions.
 *
 * La photo est une image d'ambiance : elle ne montre pas un chantier
 * Chaudrel et n'est jamais légendée comme tel.
 */
export default function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const monoRef = useRef(null);
  const photoRef = useRef(null);
  const gid = useId().replace(/:/g, '');
  const glow = usePointerGlow();

  const scrolled = useSectionProgress(sectionRef, ['start start', 'end end']);
  const done = useMotionValue(1);
  const progress = reduce ? done : scrolled;

  const monoScale = useTransform(progress, zoom);
  const monoOpacity = useTransform(progress, [0.72, 0.9], [1, 0]);
  const lettersOpacity = useTransform(progress, [0.1, 0.32], [1, 0]);
  const doorOpacity = useTransform(progress, [0.04, 0.24], [1, 0]);
  const introOpacity = useTransform(progress, [0, 0.16], [1, 0]);
  const introY = useTransform(progress, [0, 0.16], [0, -24]);
  const photoScale = useTransform(progress, [0.35, 1], [1.18, 1]);
  const finalOpacity = useTransform(progress, [0.8, 0.98], [0, 1]);
  const finalY = useTransform(progress, [0.8, 0.98], [28, 0]);
  const veilOpacity = useTransform(progress, [0.55, 1], [0, 1]);

  /* Le contour de la photo : les coins de la porte à l'écran, puis le
     plein cadre. Écrit directement dans le style - pas de rendu React. */
  const paint = useCallback(
    (p) => {
      const stage = stageRef.current;
      const mono = monoRef.current;
      const photo = photoRef.current;
      if (!stage || !mono || !photo) return;
      const W = stage.clientWidth;
      const H = stage.clientHeight;
      if (reduce || p >= 0.999) {
        photo.style.clipPath = 'inset(0 0 0 0)';
        return;
      }
      // Boîte du monogramme hors transformation (offset* ignore le zoom).
      const mw = mono.offsetWidth;
      const mh = mono.offsetHeight;
      const ml = mono.offsetLeft;
      const mt = mono.offsetTop;
      const ox = ml + DOOR_CX * mw;
      const oy = mt + DOOR_CY * mh;
      const s = zoom(p);
      const t = easeOut(clamp01((p - 0.34) / 0.6));
      const full = [
        [0, 0],
        [W, 0],
        [W, H],
        [0, H],
      ];
      const pts = DOOR_POINTS.map(([x, y], i) => {
        const px = ml + ((x - VX) / VW) * mw;
        const py = mt + ((y - VY) / VH) * mh;
        const sx = ox + (px - ox) * s;
        const sy = oy + (py - oy) * s;
        return `${lerp(sx, full[i][0], t).toFixed(1)}px ${lerp(sy, full[i][1], t).toFixed(1)}px`;
      });
      photo.style.clipPath = `polygon(${pts.join(',')})`;
    },
    [reduce],
  );

  useMotionValueEvent(progress, 'change', paint);

  useEffect(() => {
    const run = () => paint(progress.get());
    run();
    window.addEventListener('resize', run);
    document.fonts?.ready.then(run);
    return () => window.removeEventListener('resize', run);
  }, [paint, progress]);

  const words = HEADLINE.split(' ');

  return (
    <section
      ref={sectionRef}
      aria-label="Chaudrel Rénovation"
      className={reduce ? 'relative bg-bark' : 'relative h-[230svh] bg-bark lg:h-[250vh]'}
    >
      <div
        ref={stageRef}
        className="sticky top-0 flex h-[100svh] min-h-[600px] flex-col items-center justify-center overflow-hidden bg-[radial-gradient(900px_700px_at_50%_42%,#2b251e,#191714_72%)] text-cream"
      >
        {/* La maison derrière la porte. */}
        <div ref={photoRef} className="absolute inset-0 z-[1]" style={{ clipPath: 'inset(50% 50% 50% 50%)' }}>
          <motion.img
            {...imageAttrs('/photos/hero.webp', SIZES.full)}
            alt="Maison contemporaine à façade sombre, intérieur éclairé à la tombée du jour"
            width="1920"
            height="1080"
            decoding="async"
            style={{ scale: photoScale }}
            className="h-full w-full object-cover"
          />
          <motion.div
            aria-hidden="true"
            style={{ opacity: veilOpacity }}
            className="absolute inset-0 bg-gradient-to-t from-bark/90 via-bark/25 to-bark/40"
          />
        </div>

        {/* Le monogramme, la porte. */}
        <motion.div
          ref={monoRef}
          aria-hidden="true"
          style={{ scale: monoScale, opacity: monoOpacity, transformOrigin: `${DOOR_CX * 100}% ${DOOR_CY * 100}%` }}
          className="relative z-[2] w-[min(74vw,380px)] will-change-transform sm:w-[min(52vw,480px)] lg:w-[min(40vw,560px)]"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.4, ease: EASE }}
          >
            <svg viewBox={MONO_VIEWBOX} className="block h-auto w-full overflow-visible">
              <defs>
                <BronzeGradient id={gid} />
              </defs>
              <motion.path
                d={LETTERS_PATH}
                fillRule="evenodd"
                className="fill-cream"
                style={{ opacity: lettersOpacity }}
              />
              <motion.path
                d={DOOR_D}
                fill={`url(#${gid})`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.1, ease: EASE, delay: 0.55 }}
                style={{ opacity: doorOpacity, transformBox: 'fill-box', transformOrigin: 'left center' }}
              />
            </svg>
          </motion.div>
        </motion.div>

        {/* Promesse et actions du premier écran. */}
        <motion.div
          style={{ opacity: introOpacity, y: introY }}
          className="relative z-[3] mt-10 flex w-full flex-col items-center px-5 text-center sm:mt-12"
        >
          <h1 className="t-h1 max-w-[16ch] text-balance sm:max-w-none" aria-label={HEADLINE}>
            {words.map((w, i) => (
              <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.12em] align-bottom">
                <motion.span
                  className="inline-block"
                  initial={{ y: '105%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1, ease: EASE, delay: 0.7 + i * 0.06 }}
                >
                  {w}
                  {i < words.length - 1 && ' '}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div
            data-page-cta
            {...glow}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 1.15 }}
            className="glass-dark mt-8 flex w-full max-w-[22rem] items-center gap-1.5 rounded-full p-1.5 sm:w-auto sm:max-w-none"
          >
            <Button
              to="/devis"
              size="lg"
              className="flex-1 sm:flex-none"
              onClick={() => track(EVENTS.QUOTE_CTA, { source: 'hero' })}
            >
              Devis gratuit
            </Button>
            <a
              href={`tel:${BRAND.phones[0].tel}`}
              onClick={() => track(EVENTS.PHONE_CLICK, { source: 'hero' })}
              aria-label={`Appeler ${BRAND.phones[0].name} au ${BRAND.phones[0].number}`}
              className="flex h-14 flex-none items-center justify-center gap-2.5 rounded-full px-5 text-[15px] font-medium text-cream transition-[background-color,transform] duration-200 hover:bg-cream/10 active:scale-[0.97]"
            >
              <Phone size={16} strokeWidth={1.7} aria-hidden="true" />
              <span className="hidden tabular-nums sm:inline">{BRAND.phones[0].number}</span>
            </a>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track(EVENTS.WHATSAPP_CLICK, { source: 'hero' })}
              aria-label="Écrire sur WhatsApp"
              className="flex h-14 flex-none items-center justify-center gap-2.5 rounded-full px-5 text-[15px] font-medium text-cream transition-[background-color,transform] duration-200 hover:bg-cream/10 active:scale-[0.97]"
            >
              <WhatsappIcon width={17} height={17} />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </motion.div>
        </motion.div>

        {/* Repères de coin. */}
        <motion.p
          style={{ opacity: introOpacity }}
          className="t-label absolute bottom-8 left-8 z-[3] hidden text-cream/60 md:block lg:left-12"
        >
          Rénovation · depuis {BRAND.founded}
        </motion.p>
        <motion.p
          style={{ opacity: introOpacity }}
          className="t-label absolute bottom-8 right-8 z-[3] hidden text-right leading-[1.9] text-cream/60 md:block lg:right-12"
        >
          Bruxelles
          <br />
          Toute la Belgique
        </motion.p>
        {!reduce && (
          <motion.span
            aria-hidden="true"
            style={{ opacity: introOpacity }}
            className="absolute bottom-0 left-1/2 z-[3] h-12 w-px -translate-x-1/2 overflow-hidden bg-cream/10"
          >
            <motion.span
              className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-transparent to-gold-light"
              animate={{ y: ['-100%', '200%'] }}
              transition={{ duration: 2.2, ease: EASE, repeat: Infinity, repeatDelay: 0.6 }}
            />
          </motion.span>
        )}

        {/* Derrière la porte : l'offre, sur une carte de verre. */}
        <motion.div
          data-page-cta
          {...glow}
          style={{ opacity: finalOpacity, y: finalY }}
          className="glass-dark absolute inset-x-4 bottom-4 z-[4] rounded-[28px] p-6 sm:inset-x-auto sm:bottom-10 sm:left-8 sm:w-[34rem] sm:p-9 lg:bottom-14 lg:left-12"
        >
          <h2 className="t-h2">Bienvenue chez vous.</h2>
          <p className="t-lead mt-4 text-cream/80">
            Façades, toitures, châssis et rénovations complètes. {BRAND.founders[0].name} et {BRAND.founders[1].name}{' '}
            suivent chaque chantier en personne, du devis à la remise des clés.
          </p>
          <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
            <Button to="/devis" size="lg" arrow onClick={() => track(EVENTS.QUOTE_CTA, { source: 'hero_card' })}>
              Demander un devis gratuit
            </Button>
            <Button to="/realisations" variant="outlineLight" size="lg">
              Nos réalisations
            </Button>
          </div>
          <p className="t-small mt-5 text-cream/60">
            {BRAND.promises.quote} · {BRAND.promises.responseTime}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
