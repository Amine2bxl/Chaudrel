import { ArrowRight } from 'lucide-react';
import { Button, Container } from '@/components/ui';
import { EVENTS, track } from '@/lib/analytics';

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] w-full overflow-hidden bg-brand-dark">
      <img
        src="/photos/hero.webp"
        alt="Intérieur rénové par Chaudrel à Bruxelles"
        width="1920"
        height="1280"
        fetchpriority="high"
        decoding="sync"
        className="hero-kenburns absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-brand-ink/70 via-brand-ink/40 to-brand-ink/80"
        aria-hidden="true"
      />

      <Container className="relative flex min-h-[92vh] flex-col justify-end pb-20 pt-32 lg:pb-28">
        <p className="hero-fade hero-d1 eyebrow text-brand-goldLight">Chaudrel — Bruxelles</p>

        <h1 className="hero-fade hero-d2 h-display max-w-4xl text-[2.6rem] text-white sm:text-6xl lg:text-[5rem]">
          Rénovation.
          <br />
          Transformation.
          <br />
          <span className="italic text-brand-goldLight">Excellence.</span>
        </h1>

        <p className="hero-fade hero-d3 mt-7 max-w-xl text-[16px] font-light leading-[1.8] text-white/70 lg:text-[17px]">
          Nous transformons vos espaces à Bruxelles et dans ses environs.
        </p>

        <div className="hero-fade hero-d4 mt-9 flex flex-col gap-3 sm:flex-row">
          <Button to="/devis" variant="gold" size="lg" onClick={() => track(EVENTS.QUOTE_CTA, { source: 'hero' })}>
            Demander un devis
          </Button>
          <Button to="/realisations" variant="ghostLight" size="lg">
            Voir nos réalisations
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </Container>
    </section>
  );
}
