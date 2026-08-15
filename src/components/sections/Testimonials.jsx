import Reveal from '@/lib/reveal';
import { Container, Label, Section, SectionHeading } from '@/components/ui';
import { TESTIMONIALS, TESTIMONIALS_VALIDATED, GOOGLE_REVIEWS_URL } from '@/data/testimonials';
import { cn } from '@/lib/utils';

/**
 * Avis clients — présentation éditoriale, sans carte ni étoiles décoratives.
 *
 * ⚠️ PLACEHOLDER : les avis proviennent de la V1 et ne sont pas vérifiés
 * (`TESTIMONIALS_VALIDATED = false` dans src/data/testimonials.js).
 * La structure est en place ; le contenu doit être remplacé par de vrais avis
 * — idéalement des avis Google — avant la mise en production.
 */
export default function Testimonials({ limit, tone = 'white' }) {
  const items = limit ? TESTIMONIALS.slice(0, limit) : TESTIMONIALS;

  return (
    <Section tone={tone} id="avis">
      <Container>
        <SectionHeading
          label="Avis clients"
          title={
            <>
              Ce qu’en disent
              <br />
              celles et ceux qui nous ont fait confiance.
            </>
          }
        />

        <div className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {items.map((t, i) => (
            <Reveal as="figure" key={t.id} delay={i * 90} className="border-t border-ink/12 pt-6">
              <blockquote className="t-body text-ink/75">« {t.quote} »</blockquote>
              <figcaption className="mt-6 flex items-baseline justify-between gap-4">
                <span className="t-h3">{t.name}</span>
                <span className="t-label text-ink/35">{t.location}</span>
              </figcaption>
              <p className="t-small mt-1 text-ink/40">{t.project}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3">
          {GOOGLE_REVIEWS_URL && (
            <a
              href={GOOGLE_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="link-line t-label text-ink"
            >
              Voir les avis Google
            </a>
          )}
          {!TESTIMONIALS_VALIDATED && (
            <p className={cn('t-small text-ink/40')}>
              <Label>À valider</Label>{' '}
              <span className="ml-2">
                avis repris de l’ancien site, à confirmer ou à remplacer par des avis Google avant publication.
              </span>
            </p>
          )}
        </div>
      </Container>
    </Section>
  );
}
