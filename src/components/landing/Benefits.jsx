import { Shield, Clock, Gem, Users, Ruler, Leaf } from 'lucide-react';
import Reveal from '@/lib/reveal';

const BENEFITS = [
  {
    icon: Gem,
    title: 'Matériaux Premium',
    desc: 'Marbre, ardoise naturelle, bois massif — nous sélectionnons exclusivement les matières les plus nobles.',
  },
  {
    icon: Clock,
    title: 'Respect des Délais',
    desc: 'Planning précis dès le départ. Nous nous engageons sur un calendrier et nous le tenons, toujours.',
  },
  {
    icon: Ruler,
    title: '100% Sur Mesure',
    desc: 'Aucun projet prédéfini. Chaque rénovation est conçue selon vos goûts, vos besoins, votre mode de vie.',
  },
  {
    icon: Users,
    title: 'Accompagnement Complet',
    desc: 'Un interlocuteur dédié du début à la fin. Nous gérons tout pour vous garantir une tranquillité totale.',
  },
  {
    icon: Shield,
    title: 'Garantie de Résultat',
    desc: "Nous ne livrons qu'un chantier parfait. Notre réputation repose sur l'excellence, sans compromis.",
  },
  {
    icon: Leaf,
    title: 'Éco-Responsable',
    desc: (
      <>
        Matériaux durables, techniques respectueuses de l&apos;environnement pour des rénovations qui durent. Découvrez les <a href="https://energie.wallonie.be/fr/primes-et-aides-financieres.html" target="_blank" rel="noopener noreferrer" class="text-white/70 underline decoration-brand-gold/40 hover:decoration-brand-gold hover:text-white transition-colors">aides financières pour la rénovation énergétique en Wallonie</a>.
      </>
    ),
  },
];

export default function Benefits() {
  return (
    <section id="benefits" className="py-10 md:py-14 lg:py-32 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <Reveal className="text-center mb-6 lg:mb-20">
          <p className="text-[11px] tracking-[0.25em] uppercase text-brand-gold font-semibold mb-4">
            Pourquoi Chaudrel
          </p>
          <h2 className="font-display text-4xl lg:text-5xl font-light text-white leading-tight">
            L'Excellence au Service
            <br />
            <span className="italic text-brand-goldLight">de Votre Vision</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BENEFITS.map((b, i) => (
            <Reveal
              as="article"
              key={b.title}
              delay={i * 80}
              className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-gold/30 rounded-3xl p-5 sm:p-7 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-2xl bg-brand-gold/15 flex items-center justify-center mb-5 group-hover:bg-brand-gold/25 transition-colors duration-300">
                <b.icon className="w-5 h-5 text-brand-gold" strokeWidth={1.5} aria-hidden="true" />
              </div>
              <h3 className="font-display text-lg font-light text-white mb-2">{b.title}</h3>
              <p className="text-[13px] text-white/40 font-light leading-relaxed">{b.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}