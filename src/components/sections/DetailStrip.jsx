import Reveal from '@/lib/reveal';
import { SIZES } from '@/lib/image';
import { cn } from '@/lib/utils';
import { Media } from '@/components/ui';

/**
 * 05 · Savoir-faire - des gros plans recadrés dans les photos de chantier,
 * à leur définition d'origine (aucun agrandissement). Chaque légende décrit
 * ce que l'on voit, rien de plus.
 */
export const DETAILS = [
  {
    src: '/photos/detail-porte-brique.webp',
    alt: 'Gros plan : porte anthracite à jours carrés posée dans la brique rouge',
    title: 'La menuiserie dans la brique',
    text: 'Porte anthracite à jours carrés, ajustée dans la maçonnerie existante.',
  },
  {
    src: '/photos/detail-poignee.webp',
    alt: 'Gros plan : porte taupe, fentes vitrées et poignée droite en inox',
    title: 'Poignée et vitrages',
    text: 'Fentes vitrées alignées, poignée droite : une porte dessinée par ses lignes.',
  },
  {
    src: '/photos/detail-enduit.webp',
    alt: 'Gros plan : enduit gris clair contre la brique sombre et menuiserie vitrée',
    title: 'L’enduit contre la brique',
    text: 'Un volume enduit gris clair rencontre la brique sombre et la colonne vitrée.',
  },
  {
    src: '/photos/detail-linteau.webp',
    alt: 'Gros plan : arc de briques au-dessus d’un châssis anthracite',
    title: 'Sous l’arc de briques',
    text: 'Un châssis anthracite sous un arc de briques en façade.',
  },
  {
    src: '/photos/detail-volet.webp',
    alt: 'Gros plan : lames d’un volet roulant anthracite',
    title: 'Les lames d’un volet',
    text: 'Volet roulant anthracite, vu de près : des lames fines et régulières.',
  },
  {
    src: '/photos/detail-socle.webp',
    alt: 'Gros plan : porte vitrée blanche entre brique et socle en pierre',
    title: 'Pierre, brique et vitrage',
    text: 'Une porte vitrée blanche entre la brique et un socle de pierre.',
  },
];

export default function DetailStrip({ details = DETAILS.slice(0, 4), headingLevel = 'h3' }) {
  const H = headingLevel;
  return (
    <ul className="snap-row -mx-gutter flex gap-4 overflow-x-auto px-gutter pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 lg:grid-cols-4">
      {details.map((d, i) => (
        <li key={d.src} className={cn('w-[72vw] flex-none snap-start sm:w-auto', i % 2 === 1 && 'lg:mt-16')}>
          <Media
            src={d.src}
            alt={d.alt}
            width={480}
            height={600}
            ratio="aspect-[4/5]"
            sizes={SIZES.detail}
            zoom
          />
          <Reveal delay={80}>
            <H className="t-h4 mt-4">{d.title}</H>
            <p className="t-small mt-1.5 max-w-[34ch] text-ink/70">{d.text}</p>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
