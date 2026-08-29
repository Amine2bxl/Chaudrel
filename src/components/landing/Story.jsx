import { ArrowRight } from 'lucide-react';
import { IMAGES, BRAND } from '@/lib/content';
import Reveal from '@/lib/reveal';

const TIMELINE = [
  { year: '2009', event: 'Fondation à Bruxelles par Alberto & Matteo' },
  { year: '2018', event: '100 projets réalisés, équipe élargie' },
  { year: '2025', event: '150+ projets, référence du luxe en Belgique' },
];

export default function Story() {
  return (
    <section id="story" className="py-10 md:py-14 lg:py-32 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center">
          <Reveal from="left" className="relative order-2 lg:order-1">
            <div className="rounded-[2rem] overflow-hidden aspect-[4/5] bg-white">
              <img
                src={IMAGES.story}
                alt={`Intérieur rénové par ${BRAND.name}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <Reveal delay={400} className="absolute -bottom-6 -right-4 lg:-right-8 bg-white rounded-3xl p-5 shadow-xl border border-brand-gold/10">
              <p className="font-display text-4xl font-light text-brand-gold">100%</p>
              <p className="text-[11px] tracking-[0.15em] uppercase text-brand-ink/50 font-medium mt-1">
                Engagement Qualité
              </p>
            </Reveal>
          </Reveal>

          <Reveal from="right" className="order-1 lg:order-2">
            <p className="text-[11px] tracking-[0.25em] uppercase text-brand-gold font-semibold mb-4">
              Notre Histoire
            </p>
            <h2 className="font-display text-4xl lg:text-5xl font-light text-brand-ink leading-tight mb-6">
              Bâtir avec
              <br />
              <span className="italic text-brand-gold">Passion & Rigueur</span>
            </h2>
            <p className="text-[15px] text-brand-ink/60 font-light leading-[1.85] mb-6">
              Chaudrel Rénovation est née d'une conviction profonde : aménager une cuisine, une salle de bain ou une toiture avec soin et expertise.
            </p>
            <p className="text-[15px] text-brand-ink/60 font-light leading-[1.85] mb-6">
              Fondée par <strong className="text-brand-ink/80 font-medium">Alberto et Matteo</strong>, deux artisans passionnés, notre entreprise s'est forgée une réputation d'excellence reconnue par nos <a href="#testimonials" className="text-brand-gold underline decoration-brand-gold/30 hover:decoration-brand-gold transition-colors">clients à Bruxelles et en Belgique</a>. Chaque projet est un engagement personnel.
            </p>

            <p className="text-[15px] text-brand-ink/60 font-light leading-[1.85] mb-6">
              Du premier croquis à la livraison, nous mettons le même <a href="#services" className="text-brand-gold underline decoration-brand-gold/30 hover:decoration-brand-gold transition-colors">savoir-faire sur chacun de nos chantiers</a> qu'à <a href="#portfolio" className="text-brand-gold underline decoration-brand-gold/30 hover:decoration-brand-gold transition-colors">révéler le potentiel de chaque espace</a>.
            </p>

            <div className="space-y-3 mb-8">
              {TIMELINE.map((t, i) => (
                <Reveal
                  key={t.year}
                  from="right"
                  delay={i * 100}
                  className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-brand-gold/8"
                >
                  <span className="font-display text-lg font-semibold text-brand-gold w-12 flex-shrink-0">{t.year}</span>
                  <span className="text-[13px] text-brand-ink/65 font-light">{t.event}</span>
                </Reveal>
              ))}
            </div>

            <a href="#contact" className="inline-flex items-center gap-2 text-[13px] font-semibold text-brand-gold tracking-wide hover:gap-4 transition-all duration-300">
              Discutons de votre projet
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}