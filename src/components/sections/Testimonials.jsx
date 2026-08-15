import { Star } from 'lucide-react';
import Reveal from '@/lib/reveal';
import { Container, Section, SectionHeading } from '@/components/ui';
import { TESTIMONIALS, GOOGLE_REVIEWS_URL } from '@/data/testimonials';

function Stars({ count = 5 }) {
  return (
    <div className="flex gap-0.5" aria-label={`Note ${count} sur 5`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-brand-gold text-brand-gold" aria-hidden="true" />
      ))}
    </div>
  );
}

export default function Testimonials({ limit }) {
  const items = limit ? TESTIMONIALS.slice(0, limit) : TESTIMONIALS;

  return (
    <Section tone="white" id="avis">
      <Container>
        <SectionHeading eyebrow="Avis clients" title="Ce que disent" accent="nos clients" />

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t, i) => (
            <Reveal
              as="article"
              key={t.id}
              delay={i * 70}
              className="flex flex-col border border-brand-ink/8 bg-brand-cream p-6 transition-colors duration-300 hover:border-brand-gold/30 hover:bg-white"
            >
              <div className="flex items-center justify-between">
                <Stars count={t.rating} />
                <span className="text-[10px] uppercase tracking-[0.12em] text-brand-ink/30">{t.date}</span>
              </div>
              <blockquote className="mt-5 flex-1 text-[14px] font-light italic leading-[1.8] text-brand-ink/65">
                « {t.quote} »
              </blockquote>
              <footer className="mt-6 flex items-center justify-between gap-3 border-t border-brand-ink/8 pt-4">
                <div>
                  <p className="font-display text-[15px] font-light text-brand-ink">{t.name}</p>
                  <p className="mt-0.5 text-[11px] text-brand-gold">{t.location}</p>
                </div>
                <span className="rounded-full bg-brand-gold/10 px-3 py-1 text-[10px] font-medium text-brand-gold">
                  {t.project}
                </span>
              </footer>
            </Reveal>
          ))}
        </div>

        {GOOGLE_REVIEWS_URL && (
          <p className="mt-10 text-center text-[14px] font-light text-brand-ink/55">
            <a
              href={GOOGLE_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline text-brand-gold"
            >
              Voir tous les avis Google
            </a>
          </p>
        )}
      </Container>
    </Section>
  );
}
