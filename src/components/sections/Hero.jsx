import { Button, Container } from '@/components/ui';
import { PROOF } from '@/data/site';
import { EVENTS, track } from '@/lib/analytics';

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-bark">
      <img
        src="/photos/hero.webp"
        alt="Maison rénovée par Chaudrel, façade et intérieur éclairé à la tombée du jour"
        width="1920"
        height="1280"
        fetchpriority="high"
        decoding="sync"
        className="slow-zoom absolute inset-0 -z-10 h-full w-full object-cover"
      />
      {/* Deux voiles : un dégradé qui remonte du bas pour asseoir le texte, et
          un lavis brun très léger qui réchauffe la photo et la relie à la
          palette au lieu de la laisser grise et générique. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-bark via-bark/60 to-bark/20" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 bg-umber/10 mix-blend-multiply" aria-hidden="true" />

      {/* pb mobile = hauteur de la barre d'action fixe + respiration */}
      <Container className="pb-[calc(66px+2.75rem)] pt-28 lg:pb-16">
        <h1 className="hero-in hero-d2 t-display max-w-[15ch] text-cream">Du premier plan à la dernière clé.</h1>

        <p className="hero-in hero-d3 t-lead mt-7 max-w-[44ch] text-cream/75">
          Cuisines, salles de bain et rénovations complètes. Un seul interlocuteur, du devis à la remise des clés,
          partout en Belgique.
        </p>

        <div className="hero-in hero-d4 mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button to="/devis" variant="solidLight" size="lg" onClick={() => track(EVENTS.QUOTE_CTA, { source: 'hero' })}>
            Demander un devis
          </Button>
          <Button to="/realisations" variant="outlineLight" size="lg">
            Voir nos réalisations
          </Button>
        </div>

        {/* Ligne de méta éditoriale, sur un filet, à la place de l'eyebrow :
            l'information de cadrage se lit en bas, discrètement, une fois la
            promesse reçue — pas posée en étiquette au-dessus du titre. */}
        <dl className="hero-in hero-d5 mt-12 hidden max-w-3xl grid-cols-3 gap-8 border-t border-cream/20 pt-6 lg:grid">
          {PROOF.map((p) => (
            <div key={p.label}>
              <dt className="t-label text-cream/50">{p.label}</dt>
              <dd className="mt-2 font-display text-[1.375rem] leading-none text-cream">{p.value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

/**
 * Bandeau de preuves — mobile et tablette uniquement. Sur grand écran, les
 * mêmes trois faits vivent dans le hero, sur son filet ; les répéter ici ferait
 * doublon.
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
