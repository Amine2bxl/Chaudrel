import { Link } from 'react-router-dom';
import { SERVICES } from '@/data/services';

/**
 * 02 · Signature - un bandeau graphite où les métiers défilent lentement,
 * en serif italique, séparés d'un losange d'or. La liste est rendue deux
 * fois pour boucler sans couture ; la copie est masquée aux lecteurs d'écran.
 * Mouvement réduit : le bandeau reste immobile.
 */
export default function ServiceMarquee() {
  const row = (hidden) => (
    <ul className="flex flex-none items-center" aria-hidden={hidden || undefined}>
      {SERVICES.map((s) => (
        <li key={s.slug} className="flex items-center">
          <Link
            to={`/services/${s.slug}`}
            tabIndex={hidden ? -1 : undefined}
            className="px-6 font-display text-[clamp(1.75rem,1.3rem+1.6vw,2.75rem)] italic leading-none text-ivory/90 transition-colors duration-fast hover:text-gold-light sm:px-9"
          >
            {s.title}
          </Link>
          <span aria-hidden="true" className="block h-2 w-2 rotate-45 bg-gold" />
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-label="Nos métiers" className="on-dark marquee-wrap overflow-hidden bg-graphite py-7 sm:py-9">
      <div className="marquee">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
