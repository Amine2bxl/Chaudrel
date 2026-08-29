import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Building, HardHat, Home, Layers, PaintRoller, Trees, Waves } from 'lucide-react';
import Reveal from '@/lib/reveal';
import { SERVICES } from '@/data/services';
import { EVENTS, track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

/* Une icône par métier : le geste d'entrée est visuel, le texte vient après,
   replié. Pas d'icône pour l'aménagement intérieur historique — les six métiers
   annoncés par Chaudrel portent chacun leur symbole. */
const METIER_ICONS = {
  'renovation-complete': Home,
  'finitions-interieures': PaintRoller,
  'amenagement-exterieur': Trees,
  toiture: HardHat,
  facade: Building,
  piscine: Waves,
};

/**
 * Les métiers, en menu dépliant — visuel avant tout.
 *
 * Replié, une ligne ne montre que son symbole et son nom : on sait d'où vient
 * chaque geste sans lire une phrase. Déplié, elle révèle une photo, une phrase,
 * les postes en vignettes et le chemin vers la page du métier. Un seul métier
 * reste ouvert à la fois : la page ne s'allonge pas, c'est le pouce qui choisit.
 */
export default function ServicesBoard({ services = SERVICES, tone = 'dark', className }) {
  const light = tone === 'light';
  const [openSlug, setOpenSlug] = useState(null);

  return (
    <div className={cn('', className)}>
      <ul>
        {services.map((s, i) => {
          const Icon = METIER_ICONS[s.slug] || Layers;
          const open = openSlug === s.slug;
          const contentId = `metier-${s.slug}`;

          return (
            <Reveal
              as="li"
              key={s.slug}
              delay={i * 55}
              className={cn('border-b last:border-b-0', light ? 'border-cream/12' : 'border-ink/[0.09]')}
            >
              {/* La ligne repliée : symbole, nom, chevron. */}
              <button
                type="button"
                aria-expanded={open}
                aria-controls={contentId}
                onClick={() => setOpenSlug(open ? null : s.slug)}
                className={cn(
                  'group flex w-full items-center gap-5 px-2 py-6 text-left transition-colors duration-300 ease-soft sm:px-4 sm:py-7',
                  light ? 'hover:bg-cream/[0.04]' : 'hover:bg-shell/80'
                )}
              >
                <span
                  className={cn(
                    'grid h-12 w-12 flex-none place-items-center rounded-lg border transition-colors duration-300 ease-soft',
                    light
                      ? 'border-cream/20 bg-cream/[0.04] text-cream/80 group-hover:text-gold-light'
                      : 'border-gold/[0.22] bg-gold/[0.06] text-gold group-hover:border-gold group-hover:bg-gold/[0.1]'
                  )}
                >
                  <Icon size={20} strokeWidth={1.6} aria-hidden="true" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className={cn('t-h3 block', light ? 'text-cream' : 'text-ink')}>{s.title}</span>
                  <span className={cn('mt-1 block t-small', light ? 'text-cream/55' : 'text-ink/55')}>
                    {s.excerpt}
                  </span>
                </span>

                {/* Chevron qui pivote : le seul indicateur de repli. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    'grid h-10 w-10 flex-none place-items-center rounded-full border transition-all duration-300 ease-soft',
                    light
                      ? 'border-cream/20 text-cream/60 group-hover:border-cream/50 group-hover:text-cream'
                      : 'border-ink/[0.15] text-ink/60 group-hover:border-gold group-hover:text-gold',
                    open && 'rotate-180'
                  )}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M2 5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>

              {/* Le panneau déplié : photo, phrase, postes, plus loin. */}
              <div
                id={contentId}
                role="region"
                aria-label={s.title}
                className={cn(
                  'grid transition-[grid-template-rows,opacity] duration-500 ease-soft',
                  open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                )}
              >
                <div className="overflow-hidden">
                  <div className={cn('grid gap-6 pb-8 pt-2 sm:grid-cols-[1fr_1.3fr] sm:gap-8', light ? 'text-cream' : 'text-ink')}>
                    <div
                      className={cn(
                        'overflow-hidden rounded-lg',
                        light ? 'bg-cream/[0.05]' : 'bg-sand'
                      )}
                    >
                      <img
                        src={s.image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="aspect-[4/3] h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex flex-col justify-between gap-6">
                      <div>
                        <p className={cn('t-body', light ? 'text-cream/75' : 'text-ink/70')}>{s.intro}</p>

                        <dl className="mt-6 space-y-4">
                          {(s.groups ?? []).map((g) => (
                            <div key={g.title}>
                              <dt className={cn('t-label', light ? 'text-cream/50' : 'text-ink/50')}>{g.title}</dt>
                              <dd className={cn('mt-2 flex flex-wrap gap-x-5 gap-y-2 t-small', light ? 'text-cream/70' : 'text-ink/70')}>
                                {g.items.map((item) => (
                                  <span key={item} className="flex items-baseline gap-2">
                                    <span aria-hidden="true" className={cn('h-1 w-1 flex-none rounded-full', light ? 'bg-gold-light' : 'bg-gold')} />
                                    {item}
                                  </span>
                                ))}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </div>

                      <Link
                        to={`/services/${s.slug}`}
                        onClick={() => track(EVENTS.SERVICE_VIEW, { service: s.slug })}
                        className={cn(
                          'link-line t-label inline-flex w-fit items-center gap-2 pb-0.5',
                          light ? 'text-cream' : 'text-ink'
                        )}
                      >
                        {s.title} — en détail
                        <ArrowUpRight size={14} strokeWidth={1.8} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </ul>
    </div>
  );
}