import { useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '@/lib/reveal';
import { cn } from '@/lib/utils';
import { EVENTS, track } from '@/lib/analytics';

/**
 * Index des réalisations — la table des matières d'un portfolio d'architecte :
 * numéro, titre, nature, lieu. L'image n'apparaît qu'au survol, dans une colonne
 * fixe à droite. Sur mobile, où il n'y a pas de survol, l'image est posée sous
 * chaque ligne : la lecture reste la même, la mise en page change vraiment.
 */
export default function ProjectIndex({ projects, className }) {
  // Le premier projet est affiché par défaut : un panneau vide au chargement
  // serait un trou dans la mise en page, pas une invitation.
  const [active, setActive] = useState(null);
  const current = projects.find((p) => p.slug === active) || projects[0] || null;

  return (
    <div className={cn('lg:grid lg:grid-cols-12 lg:gap-16', className)}>
      <ol className="lg:col-span-7">
        {projects.map((p, i) => (
          <Reveal as="li" key={p.slug} delay={i * 60} className="border-t border-ink/12 last:border-b">
            <Link
              to={`/realisations/${p.slug}`}
              onClick={() => track(EVENTS.PROJECT_VIEW, { project: p.slug })}
              onMouseEnter={() => setActive(p.slug)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(p.slug)}
              onBlur={() => setActive(null)}
              className="group block py-7 lg:py-9"
            >
              <div className="flex items-baseline gap-5 sm:gap-8">
                <span className="t-num text-ink/65">{String(i + 1).padStart(2, '0')}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="t-h2 text-[1.5rem] transition-colors duration-300 group-hover:text-umber sm:text-[1.875rem]">
                    {p.title}
                  </h3>
                  <p className="t-small mt-2 text-ink/65">
                    {p.type} — {p.location}
                  </p>
                </div>
              </div>

              {/* L'image accompagne la ligne sur mobile, où le survol n'existe pas */}
              <div className="mt-5 aspect-[16/10] overflow-hidden rounded-lg bg-sand lg:hidden">
                <img
                  src={p.cover}
                  alt={`${p.type} — ${p.title}, ${p.location}`}
                  loading={i < 2 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
            </Link>
          </Reveal>
        ))}
      </ol>

      {/* Aperçu au survol — desktop uniquement */}
      <div className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-32">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-sand">
            {projects.map((p) => (
              <img
                key={p.slug}
                src={p.cover}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className={cn(
                  'absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-soft',
                  current?.slug === p.slug ? 'opacity-100' : 'opacity-0'
                )}
              />
            ))}
          </div>

          <p className="t-small mt-4 flex h-5 items-baseline justify-between text-ink/65">
            <span>{current ? `${current.type} — ${current.location}` : ''}</span>
            <span className="t-label text-ink/65">
              {current ? String(projects.indexOf(current) + 1).padStart(2, '0') : ''}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
