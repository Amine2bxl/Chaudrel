import { useState } from 'react';
import { HouseIcon, SERVICE_ICONS } from '@/components/ui/Icons';
import { Container, Panel, SectionHeading } from '@/components/ui';
import { Row } from '@/components/layout/ContactList';
import Reveal from '@/lib/reveal';
import { SERVICES } from '@/data/services';
import { EVENTS, track } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { imageAttrs, SIZES } from '@/lib/image';

/**
 * Les métiers, sur la photo du métier survolé : la photo occupe toute la
 * section, voilée ; les rangées vivent dans une plaque de verre qui la floute
 * réellement. Une rangée = un métier, une ligne, le chemin vers sa page.
 * Les photos se relaient en fondu (opacity seule).
 */
export default function ServicesBoard({ services = SERVICES, title, className }) {
  const [hoverSlug, setHoverSlug] = useState(null);
  const shown = hoverSlug ?? services[0]?.slug;

  return (
    <section className={cn('relative isolate overflow-hidden py-section', className)}>
      {services.map((s) => (
        <img
          key={s.slug}
          {...imageAttrs(s.image, SIZES.full)}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className={cn(
            'absolute inset-0 -z-20 h-full w-full object-cover transition-opacity duration-700 ease-soft',
            shown === s.slug ? 'opacity-100' : 'opacity-0'
          )}
        />
      ))}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-[#110F0D]/90 via-[#110F0D]/70 to-[#110F0D]/45" />

      <Container className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
        {title && (
          <div className="lg:col-span-5">
            <SectionHeading title={title} />
          </div>
        )}

        <Reveal className={title ? 'lg:col-span-7' : 'lg:col-span-12'}>
          <Panel glass as="ul" className={cn('grid gap-2.5 sm:grid-cols-2', !title && 'lg:grid-cols-3')} onMouseLeave={() => setHoverSlug(null)}>
            {services.map((s) => (
              <li key={s.slug} onMouseEnter={() => setHoverSlug(s.slug)} onFocus={() => setHoverSlug(s.slug)}>
                <Row
                  to={`/services/${s.slug}`}
                  icon={SERVICE_ICONS[s.slug] || HouseIcon}
                  label={s.title}
                  onClick={() => track(EVENTS.SERVICE_VIEW, { service: s.slug })}
                  className="h-full !border-white/10 !bg-white/[0.06] hover:!bg-white/[0.12]"
                />
              </li>
            ))}
          </Panel>
        </Reveal>
      </Container>
    </section>
  );
}
