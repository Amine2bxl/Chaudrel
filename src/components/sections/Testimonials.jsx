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

        {/* Le premier avis est traité comme une citation d'ouverture, les
            suivants comme des notes en marge. Pas de colonnes identiques. */}
        <div className="mt-14 lg:mt-20 lg:grid lg:grid-cols-12 lg:gap-16">
          {items[0] && (
            <Reveal as="figure" className="lg:col-span-7">
              <blockquote className="t-h2 text-[1.375rem] leading-[1.45] text-ink sm:text-[1.625rem]">
                « {items[0].quote} »
              </blockquote>
              <figcaption className="mt-8 flex items-baseline gap-4 border-t border-ink/12 pt-4">
                <span className="t-h3">{items[0].name}</span>
                <span className="t-label text-ink/35">{items[0].location}</span>
                <span className="t-small ml-auto text-ink/40">{items[0].project}</span>
              </figcaption>
            </Reveal>
          )}

          <div className="mt-14 space-y-10 lg:col-span-4 lg:col-start-9 lg:mt-0">
            {items.slice(1).map((t, i) => (
              <Reveal as="figure" key={t.id} delay={120 + i * 90} className="border-t border-ink/12 pt-5">
                <blockquote className="t-small text-ink/70">« {t.quote} »</blockquote>
                <figcaption className="t-label mt-4 text-ink/40">
                  {t.name} — {t.location}
                </figcaption>
              </Reveal>
            ))}
          </div>
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
