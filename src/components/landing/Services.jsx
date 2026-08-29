import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { IMAGES } from '@/lib/content';
import Reveal from '@/lib/reveal';

const SERVICES = IMAGES.services;

export default function Services() {
  const [active, setActive] = useState(0);

  return (
    <section id="services" className="py-10 md:py-14 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <Reveal className="mb-6 lg:mb-24">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-px bg-brand-gold" aria-hidden="true" />
            <p className="text-[11px] tracking-[0.25em] uppercase text-brand-gold font-medium">
              Nos Prestations
            </p>
          </div>
          <h2 className="font-display text-3xl lg:text-5xl font-light text-brand-ink leading-tight max-w-2xl">
            Rénovation Haut de Gamme
            <br />
            <span className="italic text-brand-gold">à Bruxelles & Périphérie</span>
          </h2>
        </Reveal>

        {/* Desktop : liste à gauche, image à droite */}
        <div className="hidden lg:grid grid-cols-12 gap-8">
          <div className="col-span-5 space-y-1">
            {SERVICES.map((service, i) => (
              <Reveal
                key={service.id}
                from="left"
                delay={i * 80}
                as="button"
                onClick={() => setActive(i)}
                className={`w-full text-left p-6 transition-all duration-500 group border-l-2 ${
                  active === i
                    ? 'border-brand-gold bg-white/80'
                    : 'border-brand-gold/20 bg-white/30 hover:border-brand-gold/50 hover:bg-white/60'
                }`}
                aria-pressed={active === i}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3
                    className={`font-display text-2xl font-light transition-colors duration-300 ${
                      active === i ? 'text-brand-ink' : 'text-brand-ink/70 group-hover:text-brand-ink'
                    }`}
                  >
                    {service.title}
                  </h3>
                  <ArrowRight
                    className={`w-4 h-4 text-brand-gold transition-transform duration-300 ${
                      active === i ? 'translate-x-0' : 'opacity-60 group-hover:translate-x-0.5'
                    }`}
                    aria-hidden="true"
                  />
                </div>
                <p
                  className={`text-[11px] tracking-[0.2em] uppercase font-medium transition-colors duration-300 ${
                    active === i ? 'text-brand-gold' : 'text-brand-gold/50 group-hover:text-brand-gold'
                  }`}
                >
                  {service.subtitle}
                </p>
              </Reveal>
            ))}
          </div>

          <div className="col-span-7 relative">
            <div key={active} className="svc-slide sticky top-28">
              <div className="aspect-[4/3] overflow-hidden mb-8 bg-brand-cream">
                <img
                  src={SERVICES[active].image}
                  alt={SERVICES[active].title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <p className="text-base text-brand-ink/70 font-light leading-relaxed max-w-lg">
                {SERVICES[active].description}
              </p>
            </div>
          </div>
        </div>

        {/* Mobile : cartes empilées. Le titre est un libellé de carte (pas un
            titre de section, déjà couvert par le h2 ci-dessus), donc en <p>. */}
        <div className="lg:hidden space-y-8" aria-hidden="true">
          {SERVICES.map((service, i) => (
            <Reveal key={service.id} delay={i * 100}>
              <article>
                <div className="aspect-[4/3] overflow-hidden mb-5 bg-brand-cream">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-brand-gold font-medium mb-2">
                  {service.subtitle}
                </p>
                <p className="font-display text-2xl font-light text-brand-ink mb-3">{service.title}</p>
                <p className="text-sm text-brand-ink/60 font-light leading-relaxed">{service.shortDescription}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}