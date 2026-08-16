import { Button, Container } from '@/components/ui';
import { PROOF } from '@/data/site';
import { EVENTS, track } from '@/lib/analytics';

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-carbon">
      <img
        src="/photos/hero.webp"
        alt="Maison rénovée par Chaudrel, façade et intérieur éclairé à la tombée du jour"
        width="1920"
        height="1280"
        fetchpriority="high"
        decoding="sync"
        className="slow-zoom absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-t from-carbon via-carbon/55 to-carbon/25"
        aria-hidden="true"
      />

      {/* pb mobile = hauteur de la barre d'action fixe + respiration */}
      <Container className="pb-[calc(58px+2.5rem)] pt-28 lg:pb-20">
        <p className="hero-in hero-d1 t-label text-paper/60">Entreprise de rénovation · Belgique</p>

        <h1 className="hero-in hero-d2 t-display mt-7 max-w-[16ch] text-paper">
          Du premier plan à la dernière clé.
        </h1>

        <p className="hero-in hero-d3 t-body mt-8 max-w-[46ch] text-paper/70">
          Cuisines, salles de bain et rénovations complètes. Un seul interlocuteur, du devis à la remise des clés,
          partout en Belgique.
        </p>

        <div className="hero-in hero-d4 mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button to="/devis" variant="solidLight" size="lg" onClick={() => track(EVENTS.QUOTE_CTA, { source: 'hero' })}>
            Demander un devis
          </Button>
          <Button to="/realisations" variant="outlineLight" size="lg">
            Voir nos réalisations
          </Button>
        </div>

        {/* Les preuves ne sont pas dans le hero : un hero porte une promesse et
            une action, pas un tableau de bord. Elles ouvrent la page juste en
            dessous — voir <ProofBand />. */}
      </Container>
    </section>
  );
}

/** Bandeau de preuves qui ouvre la page, sous le hero. */
export function ProofBand() {
  return (
    <section className="border-b border-ink/10 bg-paper py-10 lg:py-12">
      <Container>
        <dl className="grid gap-6 sm:grid-cols-3 sm:gap-10">
          {PROOF.map((p) => (
            <div key={p.label} className="border-t border-ink/15 pt-4">
              <dt className="t-small text-ink/65">{p.label}</dt>
              <dd className="t-h3 mt-1.5">{p.value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
