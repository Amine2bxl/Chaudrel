import { Star } from 'lucide-react';
import Reveal from '@/lib/reveal';

const TESTIMONIALS = [
  {
    name: 'Alexandre Vandenberghe',
    location: 'Uccle, Bruxelles',
    rating: 5,
    date: 'Mars 2025',
    project: 'Rénovation complète',
    quote:
      "Chaudrel a transformé notre villa de fond en comble. La qualité des matériaux, la précision des finitions et le sérieux de l'équipe sont sans égal. Alberto et Matteo ont su réaliser notre vision à la perfection.",
    initials: 'AV',
  },
  {
    name: 'Sophie & Laurent Dubois',
    location: 'Ixelles, Bruxelles',
    rating: 5,
    date: 'Fév. 2025',
    project: 'Cuisine & Salle de Bain',
    quote:
      "Notre cuisine est désormais le cœur de notre maison. Le marbre sélectionné par Chaudrel, les finitions en laiton brossé, tout respire le luxe. Délais respectés à la lettre. Expérience client irréprochable.",
    initials: 'SD',
  },
  {
    name: 'Marc Willems',
    location: 'Tervuren',
    rating: 5,
    date: 'Jan. 2025',
    project: 'Toiture & Jardin',
    quote:
      "Deux chantiers menés en parallèle avec une organisation impeccable. Le résultat dépasse toutes nos attentes. Notre propriété a pris une valeur considérable. Merci à toute l'équipe Chaudrel.",
    initials: 'MW',
  },
  {
    name: 'Catherine Lejeune',
    location: 'Woluwe-Saint-Pierre',
    rating: 5,
    date: 'Déc. 2024',
    project: 'Allée extérieure',
    quote:
      "La transformation de notre allée est spectaculaire. De la vieille dalle détériorée à l'asphalte premium — le changement est total. Propre, rapide, et un résultat magnifique. Toute notre rue nous fait des compliments !",
    initials: 'CL',
  },
  {
    name: 'Philippe Maes',
    location: 'Waterloo',
    rating: 5,
    date: 'Nov. 2024',
    project: 'Rénovation complète',
    quote:
      "Chaudrel a pris en charge la rénovation intégrale de notre maison. Un seul interlocuteur pour tout gérer, c'est un luxe en soi. Aucune surprise, aucune déception. Exactement ce que j'attendais.",
    initials: 'PM',
  },
  {
    name: 'Isabelle & Thomas Renard',
    location: 'Uccle, Bruxelles',
    rating: 5,
    date: 'Oct. 2024',
    project: 'Piscine & Terrasse',
    quote:
      "La création de notre piscine et la rénovation de notre terrasse ont été réalisées avec un soin exceptionnel. L'intégration paysagère est parfaite. Nous avons enfin l'espace extérieur dont nous rêvions.",
    initials: 'IR',
  },
];

function Stars({ count = 5 }) {
  return (
    <div className="flex gap-0.5" aria-label={`Note ${count} sur 5`}>
      {[...Array(count)].map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-brand-gold text-brand-gold" aria-hidden="true" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-10 md:py-14 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-6 lg:mb-14 gap-4 lg:gap-6">
          <Reveal>
            <p className="text-[11px] tracking-[0.25em] uppercase text-brand-gold font-semibold mb-3">
              Avis Clients
            </p>
            <h2 className="font-display text-4xl lg:text-5xl font-light text-brand-ink leading-tight">
              Ce Que Disent
              <br />
              <span className="italic text-brand-gold">Nos Clients</span>
            </h2>
          </Reveal>

          <Reveal from="fade">
            <div className="flex items-center gap-5 bg-brand-cream rounded-3xl px-6 py-5 border border-brand-gold/10">
              <div className="text-center">
                <p className="font-display text-4xl font-light text-brand-ink">5.0</p>
                <Stars />
                <p className="text-[10px] tracking-[0.12em] uppercase text-brand-ink/40 font-medium mt-1.5">
                  Note moyenne
                </p>
              </div>
              <div className="w-px h-14 bg-brand-gold/15" aria-hidden="true" />
              <div className="text-center">
                <p className="font-display text-4xl font-light text-brand-ink">150+</p>
                <p className="text-[10px] tracking-[0.12em] uppercase text-brand-ink/40 font-medium mt-1.5">
                  Projets réalisés
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          {TESTIMONIALS.map((t, i) => (
            <Reveal
              as="article"
              key={t.name}
              delay={i * 70}
              margin="-30px"
              className="bg-brand-cream hover:bg-white border border-brand-gold/0 hover:border-brand-gold/12 hover:shadow-lg rounded-3xl p-4 sm:p-6 transition-all duration-400"
            >
              <div className="flex items-center justify-between mb-4">
                <Stars count={t.rating} />
                <span className="text-[10px] tracking-[0.1em] uppercase text-brand-ink/30 font-medium">
                  {t.date}
                </span>
              </div>

              <blockquote className="text-[14px] text-brand-ink/65 font-light leading-[1.8] mb-6 italic">
                « {t.quote} »
              </blockquote>

              <footer className="flex items-center gap-3 pt-4 border-t border-brand-gold/8">
                <div
                  className="w-9 h-9 rounded-full bg-brand-gold flex items-center justify-center flex-shrink-0"
                  aria-hidden="true"
                >
                  <span className="text-white text-[11px] font-semibold">{t.initials}</span>
                </div>
                <div>
                  <p className="font-display text-[14px] font-light text-brand-ink leading-tight">{t.name}</p>
                  <p className="text-[11px] text-brand-gold font-medium mt-0.5">{t.location}</p>
                </div>
                <span className="ml-auto text-[10px] bg-brand-gold/8 text-brand-gold font-medium px-2.5 py-1 rounded-full">
                  {t.project}
                </span>
              </footer>
            </Reveal>
          ))}
        </div>

        <Reveal from="fade" className="mt-10 text-center">
          <p className="text-sm text-brand-ink/50 font-light mb-6">
            Vous hésitez encore ?{' '}
            <a href="#portfolio" className="text-brand-gold underline decoration-brand-gold/30 hover:decoration-brand-gold transition-colors">
              Parcourez d'abord nos réalisations
            </a>
            {' '}avant de nous contacter.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-ink text-white text-[13px] tracking-[0.1em] uppercase font-semibold rounded-full hover:bg-brand-gold transition-all duration-300"
          >
            Rejoignez nos clients satisfaits
          </a>
        </Reveal>
      </div>
    </section>
  );
}