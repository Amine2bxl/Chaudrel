import { Button, Container } from '@/components/ui';
import { PROOF } from '@/data/site';
import { EVENTS, track } from '@/lib/analytics';

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-night">
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
        className="absolute inset-0 -z-10 bg-gradient-to-t from-night via-night/55 to-night/25"
        aria-hidden="true"
      />

      {/* pb mobile = hauteur de la barre d'action fixe + respiration */}
      <Container className="pb-[calc(58px+2.5rem)] pt-32 lg:pb-20">
        <p className="hero-in hero-d1 t-label text-cream/60">Entreprise de rénovation · Belgique</p>

        <h1 className="hero-in hero-d2 t-display mt-7 max-w-[15ch] text-cream">
          Rénover, <span className="italic text-gold">vraiment</span>.
        </h1>

        <p className="hero-in hero-d3 t-body mt-8 max-w-[46ch] text-cream/70">
          Cuisines, salles de bain et rénovations complètes. Un seul interlocuteur, du devis à la remise des clés —
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

        {/* Les preuves restent hors du hero sur mobile : elles se liraient
            sous la barre d'action fixe. Voir <ProofBand /> juste en dessous. */}
        <dl className="hero-in hero-d5 mt-14 hidden max-w-3xl grid-cols-3 gap-8 border-t border-cream/15 pt-8 lg:grid">
          {PROOF.map((p) => (
            <div key={p.label}>
              <dt className="t-label text-cream/40">{p.label}</dt>
              <dd className="t-h3 mt-2 text-cream">{p.value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

/** Bandeau de preuves affiché sous le hero sur mobile et tablette. */
export function ProofBand() {
  return (
    <section className="border-b border-ink/10 bg-cream py-8 lg:hidden">
      <Container>
        <dl className="grid gap-5 sm:grid-cols-3">
          {PROOF.map((p) => (
            <div key={p.label} className="border-t border-ink/12 pt-4">
              <dt className="t-label text-ink/40">{p.label}</dt>
              <dd className="t-h3 mt-1.5">{p.value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
