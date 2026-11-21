import { Container } from '@/components/ui';
import { cn } from '@/lib/utils';
import { imageAttrs, SIZES } from '@/lib/image';

/**
 * En-tête de page intérieure - un champ profond, comme l'ouverture de
 * l'accueil : on change de page sans changer de maison. Le titre seul, en
 * Prata ; entrée en CSS (transform / opacity).
 *
 * Sans photo, la porte bronze du logo se tient à droite, entrouverte : la
 * signature de la marque, à l'échelle d'un élément d'architecture. Avec une
 * photo (service, chantier), la photo prend le fond sous un voile.
 */
export default function PageHero({ title, image }) {
  const hasImage = Boolean(image);

  return (
    <header className="on-dark relative isolate overflow-hidden bg-bark text-cream">
      {hasImage ? (
        <>
          <img
            {...imageAttrs(image, SIZES.full)}
            alt=""
            aria-hidden="true"
            width="1920"
            height="1080"
            fetchpriority="high"
            decoding="async"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-bark via-bark/75 to-bark/55" aria-hidden="true" />
        </>
      ) : (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-20 bg-[radial-gradient(900px_600px_at_75%_30%,rgb(var(--c-gold-rgb)/0.1),transparent_70%)]"
          />
          <svg
            aria-hidden="true"
            viewBox="0 0 67 165"
            className="door-open-in absolute bottom-0 right-[7%] -z-10 hidden h-[78%] w-auto md:block"
          >
            <defs>
              <linearGradient id="page-door" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#9C7946" stopOpacity="0.5" />
                <stop offset="0.55" stopColor="#B8945F" stopOpacity="0.28" />
                <stop offset="1" stopColor="#A27F4C" stopOpacity="0.06" />
              </linearGradient>
            </defs>
            <path d="M0 38 L67 0 L67 165 L0 142 Z" fill="url(#page-door)" />
          </svg>
        </>
      )}

      <Container className={cn('pb-9 pt-[6.5rem] lg:pb-12 lg:pt-32', hasImage && 'lg:pb-14 lg:pt-36')}>
        <h1 className="rise-in t-h2 max-w-[22ch] text-balance text-cream">{title}</h1>
      </Container>
    </header>
  );
}
