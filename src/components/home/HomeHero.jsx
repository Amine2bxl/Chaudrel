import { BRAND } from '@/data/site';
import { EVENTS, track } from '@/lib/analytics';
import { imageAttrs } from '@/lib/image';
import { Button, Container } from '@/components/ui';

/**
 * 01 · Ouverture.
 * Le titre à gauche, la photographie à droite : une vraie façade Chaudrel,
 * cadrée en portrait, avec un gros plan de matière posé en recouvrement.
 * Les entrées sont jouées en CSS (`.enter`) dès le premier rendu, sans
 * attendre le script : le titre - plus grand élément affiché au téléphone -
 * n'est jamais retardé.
 */
export default function HomeHero() {
  return (
    <section className="relative overflow-hidden pb-section pt-[calc(var(--header-h)+2rem)] lg:pt-[calc(var(--header-h)+3.5rem)]">
      <Container className="grid items-end gap-y-12 lg:grid-cols-12 lg:gap-x-12">
        <div className="lg:col-span-6 lg:pb-10">
          <p className="eyebrow enter">Rénovation · Bruxelles et toute la Belgique</p>
          <h1 className="t-hero enter d1 mt-7 max-w-[15ch] text-balance">
            Transformer un espace, <em>créer un lieu.</em>
          </h1>
          <p className="t-lead enter d2 mt-6 max-w-[44ch] text-ink/70">
            Depuis {BRAND.founded}, Chaudrel rénove maisons, façades et toitures. Un seul interlocuteur, du premier
            relevé à la remise des clés.
          </p>
          <div className="enter d3 mt-9 flex flex-wrap items-center gap-3" data-page-cta>
            <Button to="/devis" arrow onClick={() => track(EVENTS.QUOTE_CTA, { source: 'home_hero' })}>
              Demander un devis
            </Button>
            <Button to="/realisations" variant="outline">
              Voir les réalisations
            </Button>
          </div>
          <ul className="enter d4 mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-ink/10 pt-5 text-[12.5px] text-ink/70">
            {[BRAND.promises.quote, BRAND.promises.responseTime, `Depuis ${BRAND.founded}`].map((t) => (
              <li key={t} className="flex items-center gap-2.5">
                <span aria-hidden="true" className="h-1 w-1 flex-none rotate-45 bg-gold" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative lg:col-span-6">
          <figure className="relative">
            <div className="enter-mask relative aspect-[4/5] overflow-hidden rounded-img bg-stone sm:aspect-[5/4] lg:aspect-[4/5]">
              <img
                {...imageAttrs('/photos/facade-garages.webp', '(min-width: 1024px) 46vw, 100vw', 1920)}
                alt="Façade en brique sombre, volume enduit gris clair et deux portes de garage sectionnelles"
                width="1920"
                height="1080"
                fetchpriority="high"
                decoding="async"
                className="photo h-full w-full object-cover"
                style={{ objectPosition: '62% 50%' }}
              />
            </div>
            <figcaption className="mt-3 flex items-center justify-between text-[12px] text-ink/65">
              <span>Façade enduite et portes de garage</span>
              <span>Photo de chantier</span>
            </figcaption>
          </figure>

          {/* Gros plan de matière, en recouvrement - bureau seulement. */}
          <div className="enter d5 absolute -left-14 bottom-24 hidden w-[34%] xl:block">
            <div className="aspect-[4/5] overflow-hidden rounded-img bg-stone shadow-lift ring-[6px] ring-ivory">
              <img
                src="/photos/detail-enduit.webp"
                alt="Gros plan : enduit gris clair contre la brique et menuiserie sombre"
                width="480"
                height="600"
                loading="lazy"
                decoding="async"
                className="photo h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
