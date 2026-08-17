import { Container } from '@/components/ui';
import { Button } from '@/components/ui';
import { PROOF } from '@/data/site';
import { EVENTS, track } from '@/lib/analytics';

/**
 * Hero — la photo, la promesse, l'action.
 *
 * Aucun chiffre n'est affiché. Les références de ce genre annoncent « 5.9K+
 * projets » ou « +300 clients » ; Chaudrel n'a communiqué aucun chiffre
 * vérifié, et un compteur inventé abîmerait exactement ce que la page cherche
 * à établir. Les trois faits affichés sont vérifiables.
 */
export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-bark">
      <img
        src="/photos/hero.webp"
        alt="Maison rénovée par Chaudrel, façade et intérieur éclairé à la tombée du jour"
        width="1920"
        height="1280"
        fetchpriority="high"
        decoding="sync"
        className="slow-zoom absolute inset-0 -z-20 h-full w-full object-cover"
      />
      {/* Deux voiles : un dégradé qui remonte du bas pour asseoir le texte, et
          un lavis brun très léger qui réchauffe la photo et la relie à la
          palette au lieu de la laisser grise et générique. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-bark via-bark/55 to-bark/45" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 bg-gold/10 mix-blend-multiply" aria-hidden="true" />

      {/* ---------- Ancres de coin ----------
          Deux repères courts, opposés en diagonale, qui cadrent la photo sans
          se poser en étiquette au-dessus d'un titre. */}
      <Container className="pointer-events-none relative z-10 pt-28 lg:pt-32">
        {/* Coupures explicites plutôt qu'une mesure en `ch` : cette unité vaut
            la largeur du zéro et ignore l'interlettrage, largement ouvert sur
            ces capitales — la ligne cassait une fois de trop. */}
        <div className="hero-in hero-d1 flex items-start justify-between gap-8">
          <p className="t-label whitespace-nowrap text-cream/75">
            Entreprise
            <br />
            de rénovation
          </p>
          <p className="t-label whitespace-nowrap text-right text-cream/75">
            Bruxelles
            <br />
            Toute la Belgique
          </p>
        </div>
      </Container>

      {/* ---------- Bloc de promesse ---------- */}
      <Container className="relative z-10 mt-auto pb-[calc(66px+2.5rem)] lg:pb-20">
        <div className="lg:flex lg:items-end lg:justify-between lg:gap-16">
          <div className="lg:max-w-[46ch]">
            <h1 className="hero-in hero-d2 t-h1 max-w-[15ch] text-cream">Du premier plan à la dernière clé.</h1>

            <p className="hero-in hero-d3 t-lead mt-6 max-w-[44ch] text-cream/75">
              Cuisines, salles de bain et rénovations complètes. Un seul interlocuteur, du devis à la remise des clés,
              partout en Belgique.
            </p>

            <div data-page-cta className="hero-in hero-d4 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                to="/devis"
                variant="solidLight"
                size="lg"
                arrow
                onClick={() => track(EVENTS.QUOTE_CTA, { source: 'hero' })}
              >
                Devis gratuit
              </Button>
              <Button to="/realisations" variant="outlineLight" size="lg">
                Voir les réalisations
              </Button>
            </div>
          </div>

          {/* Carte flottante : trois faits, aucun chiffre inventé. Elle se pose
              sur la photo comme dans les références, mais elle porte de
              l'information vérifiable, pas un compteur décoratif. */}
          <dl className="hero-in hero-d5 mt-10 hidden w-full max-w-xs rounded-lg border border-cream/15 bg-bark/45 p-6 backdrop-blur-md lg:mt-0 lg:block">
            {PROOF.map((p, i) => (
              <div key={p.label} className={i > 0 ? 'mt-5 border-t border-cream/12 pt-5' : ''}>
                <dt className="t-label text-cream/50">{p.label}</dt>
                <dd className="mt-1.5 font-display text-[1.375rem] leading-none text-cream">{p.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>

    </section>
  );
}

/**
 * Bandeau de preuves — mobile et tablette uniquement. Sur grand écran, les
 * mêmes trois faits vivent dans la carte du hero ; les répéter ferait doublon.
 */
export function ProofBand() {
  return (
    <section className="border-b border-ink/10 bg-cream py-10 lg:hidden">
      <Container>
        <dl className="grid gap-6 sm:grid-cols-3 sm:gap-10">
          {PROOF.map((p) => (
            <div key={p.label} className="border-t border-ink/15 pt-4">
              <dt className="t-small text-ink/65">{p.label}</dt>
              <dd className="mt-1.5 font-display text-[1.375rem] leading-none text-ink">{p.value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
