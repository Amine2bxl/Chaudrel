import { ArrowRight, Star } from 'lucide-react';
import { IMAGES } from '@/lib/content';

const STATS = [
  { n: '150+', l: 'Projets réalisés' },
  { n: '98%', l: 'Clients satisfaits' },
  { n: '5★', l: 'Note moyenne Google' },
  { n: '2009', l: 'Fondé à Bruxelles' },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
      <div className="absolute inset-0 hero-kenburns">
        <img
          src={IMAGES.hero}
          alt="Rénovation haut de gamme à Bruxelles par Chaudrel — cuisine, salle de bain, toiture, jardin, piscine"
          className="w-full h-full object-cover"
          width="1920"
          height="1080"
          fetchpriority="high"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D]/90 via-[#0D0D0D]/40 to-[#0D0D0D]/10" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-10 pb-10 lg:pb-24 pt-20 sm:pt-24 lg:pt-28 w-full">
        <div className="max-w-3xl">
          <div className="hero-fade hero-d1 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 rounded-full px-4 py-2 mb-8">
            <div className="flex gap-0.5" aria-label="Note 5 étoiles">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-brand-gold text-brand-gold" aria-hidden="true" />
              ))}
            </div>
            <span className="text-white/80 text-[12px] font-medium">
              150+ projets réalisés · 98% clients satisfaits
            </span>
          </div>

          <h1 className="hero-fade hero-d2 font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light text-white leading-[1.1] sm:leading-[1.05] mb-6">
            La Passion de Rénover.
            <br />
            <span className="italic text-brand-goldLight">Le Plaisir d'Habiter.</span>
          </h1>

          <p className="hero-fade hero-d3 text-sm sm:text-base lg:text-lg text-white/60 font-light leading-relaxed max-w-lg mb-6 sm:mb-8 lg:mb-10">
            Chaudrel transforme votre maison en chef-d'œuvre. Cuisine, salle de bain,
            <a href="#services">jardin</a>, <a href="#services">toiture</a> — chaque détail, chaque matériau, chaque finition reflète
            l'excellence bruxelloise.{' '}
            <a href="#story" className="text-white/85 underline decoration-white/20 hover:decoration-white/60 transition-colors">
              Découvrez notre histoire
            </a>.
          </p>

          <div className="hero-fade hero-d4 flex flex-col sm:flex-row gap-3">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 bg-brand-gold text-white text-[13px] tracking-[0.1em] uppercase font-semibold rounded-full hover:bg-brand-goldLight transition-all duration-300 shadow-xl shadow-brand-gold/30"
            >
              Devis gratuit
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#portfolio"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-[13px] tracking-[0.1em] uppercase font-medium rounded-full hover:bg-white/20 transition-all duration-300"
            >
              Voir nos réalisations
            </a>
          </div>
        </div>
      </div>

      <div className="hero-fade hero-d5 relative z-10 mx-4 sm:mx-5 lg:mx-10 mb-6 sm:mb-8 lg:mb-10">
        <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl px-4 sm:px-6 lg:px-10 py-4 sm:py-5 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
          {STATS.map((s) => (
            <div key={s.l} className="flex flex-col items-center text-center">
              <p className="font-display text-2xl lg:text-3xl font-light text-white">{s.n}</p>
              <p className="text-[11px] tracking-[0.12em] uppercase text-white/45 mt-1">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}