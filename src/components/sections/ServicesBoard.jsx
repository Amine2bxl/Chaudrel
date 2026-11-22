import { useState } from 'react';
import { HouseIcon, SERVICE_ICONS } from '@/components/ui/Icons';
import { Panel } from '@/components/ui';
import { Row } from '@/components/layout/ContactList';
import Reveal from '@/lib/reveal';
import { SERVICES } from '@/data/services';
import { EVENTS, track } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { imageAttrs, SIZES } from '@/lib/image';

/**
 * Les métiers, sur la carte de verre du site : une rangée par métier (son
 * symbole, son nom, une ligne), qui mène à sa page. Le détail vit sur la page
 * du métier, pas ici : la section reste courte.
 *
 * `visual` : la photo du métier survolé à gauche, posée en fondu (opacity
 * seule). Sans `visual`, les rangées se rangent sur deux colonnes.
 */
export default function ServicesBoard({ services = SERVICES, visual = false, className }) {
  const [hoverSlug, setHoverSlug] = useState(null);
  const shown = hoverSlug ?? services[0]?.slug;

  const list = (
    <Reveal>
      <Panel as="ul" className={cn('grid gap-2.5', !visual && 'sm:grid-cols-2')} onMouseLeave={() => setHoverSlug(null)}>
        {services.map((s) => (
          <li key={s.slug} onMouseEnter={() => setHoverSlug(s.slug)} onFocus={() => setHoverSlug(s.slug)}>
            <Row
              to={`/services/${s.slug}`}
              icon={SERVICE_ICONS[s.slug] || HouseIcon}
              label={s.title}
              hint={s.excerpt}
              onClick={() => track(EVENTS.SERVICE_VIEW, { service: s.slug })}
              className="h-full"
            />
          </li>
        ))}
      </Panel>
    </Reveal>
  );

  if (!visual) return <div className={className}>{list}</div>;

  return (
    <div className={cn('lg:grid lg:grid-cols-12 lg:items-center lg:gap-10', className)}>
      <div className="hidden lg:col-span-5 lg:block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-sand">
          {services.map((s) => (
            <img
              key={s.slug}
              {...imageAttrs(s.image, SIZES.half)}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className={cn(
                'absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-soft',
                shown === s.slug ? 'scale-100 opacity-100' : 'scale-[1.04] opacity-0'
              )}
            />
          ))}
          {/* Le nom du métier montré, posé en bas de la photo. */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bark/85 via-bark/35 to-transparent p-7 pt-20">
            <p key={shown} className="rise-in font-display text-[1.75rem] leading-tight text-white">
              {services.find((s) => s.slug === shown)?.title}
            </p>
          </div>
        </div>
      </div>
      <div className="lg:col-span-7">{list}</div>
    </div>
  );
}
