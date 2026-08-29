import { CheckCircle2 } from 'lucide-react';

const BADGES = [
  'Matériaux haut de gamme',
  'Devis gratuit & sans engagement',
  'Respect des délais garanti',
  'Accompagnement de A à Z',
  'Toute la Belgique',
  'Fondé en 2009',
];

export default function SocialProof() {
  return (
    <section className="py-3 sm:py-5 bg-brand-cream border-b border-brand-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-10">
        <div className="grid grid-cols-3 lg:flex lg:items-center lg:justify-between gap-1.5 sm:gap-2">
          {BADGES.map((label) => (
            <div
              key={label}
              className="inline-flex items-center gap-1 sm:gap-1.5 bg-white border border-brand-gold/15 rounded-full px-2 sm:px-3 py-1.5 sm:py-2 shadow-sm justify-center"
            >
              <CheckCircle2 className="w-3 h-3 text-brand-gold flex-shrink-0" strokeWidth={2.5} />
              <span className="text-[9px] sm:text-[10px] lg:text-[11.5px] font-medium text-brand-ink whitespace-nowrap leading-tight">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}