import PageHero from '@/components/sections/PageHero';
import Zigzag from '@/components/sections/Zigzag';
import { SERVICES } from '@/data/services';
import { EVENTS, track } from '@/lib/analytics';
import CTASection from '@/components/sections/CTASection';

export default function Services() {
  return (
    <>
      <PageHero title="Six métiers, un seul interlocuteur." />

      <Zigzag
        items={SERVICES.map((s) => ({
          key: s.slug,
          to: `/services/${s.slug}`,
          image: { src: s.image, w: 1200, h: 900 },
          title: s.title,
          text: s.intro,
          cta: 'Découvrir le métier',
          onClick: () => track(EVENTS.SERVICE_VIEW, { service: s.slug, source: 'zigzag' }),
        }))}
      />

      <CTASection source="services" />
    </>
  );
}