import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Container } from '@/components/ui';
import { cn } from '@/lib/utils';
import { imageAttrs, SIZES } from '@/lib/image';
import { EASE } from '@/lib/motion';

const rise = (delay) => ({
  initial: { opacity: 0, y: 22, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 0.9, ease: EASE, delay },
});

/**
 * En-tête de page intérieure - un champ nuit, comme l'ouverture de l'accueil :
 * on change de page sans changer de maison. Fil d'Ariane, titre en Prata,
 * une phrase.
 *
 * Sans photo, la porte bronze du logo se tient à droite, entrouverte : la
 * signature de la marque, à l'échelle d'un élément d'architecture. Avec une
 * photo (service, chantier), la photo prend le fond sous un voile.
 */
export default function PageHero({ title, intro, image, breadcrumb = [], aside }) {
  const hasImage = Boolean(image);

  return (
    <header className="on-dark relative isolate overflow-hidden bg-bark text-cream">
      {hasImage ? (
        <>
          <motion.img
            {...imageAttrs(image, SIZES.full)}
            alt=""
            aria-hidden="true"
            width="1920"
            height="1080"
            fetchpriority="high"
            decoding="async"
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.8, ease: EASE }}
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div
            className="absolute inset-0 -z-10 bg-gradient-to-t from-bark via-bark/75 to-bark/55"
            aria-hidden="true"
          />
        </>
      ) : (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-20 bg-[radial-gradient(900px_600px_at_75%_30%,#2b251e,#191714_70%)]"
          />
          <motion.svg
            aria-hidden="true"
            viewBox="0 0 67 165"
            className="absolute bottom-0 right-[7%] -z-10 hidden h-[86%] w-auto md:block"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 0.9 }}
            transition={{ duration: 1.3, ease: EASE, delay: 0.2 }}
            style={{ transformOrigin: 'left center' }}
          >
            <defs>
              <linearGradient id="page-door" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#9C7946" stopOpacity="0.55" />
                <stop offset="0.55" stopColor="#B8945F" stopOpacity="0.32" />
                <stop offset="1" stopColor="#A27F4C" stopOpacity="0.08" />
              </linearGradient>
            </defs>
            <path d="M0 38 L67 0 L67 165 L0 142 Z" fill="url(#page-door)" />
          </motion.svg>
        </>
      )}

      <Container className={cn('pb-16 pt-36 lg:pb-24 lg:pt-44', hasImage && 'lg:pt-52')}>
        {breadcrumb.length > 0 && (
          <motion.nav aria-label="Fil d'Ariane" className="mb-8" {...rise(0)}>
            <ol className="t-label flex flex-wrap items-center gap-2 text-cream/65">
              {breadcrumb.map((b, i) => (
                <li key={b.to || b.label} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden="true">/</span>}
                  {b.to ? (
                    <Link to={b.to} className="tap transition-colors hover:text-gold-light">
                      {b.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-cream/80">
                      {b.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </motion.nav>
        )}

        <div className={cn(aside && 'lg:grid lg:grid-cols-12 lg:gap-12')}>
          <motion.div className={cn(aside && 'lg:col-span-7')} {...rise(0.08)}>
            <h1 className="t-h1 max-w-[16ch] text-balance text-cream">{title}</h1>
          </motion.div>

          {(intro || aside) && (
            <motion.div
              className={cn('mt-6 text-cream/75', aside && 'lg:col-span-5 lg:mt-0 lg:self-end')}
              {...rise(0.18)}
            >
              {intro && <p className="t-lead measure">{intro}</p>}
              {aside}
            </motion.div>
          )}
        </div>
      </Container>
    </header>
  );
}
