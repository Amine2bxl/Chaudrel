import { Link } from 'react-router-dom';
import Reveal from '@/lib/reveal';
import { cn } from '@/lib/utils';
import { EVENTS, track } from '@/lib/analytics';

/**
 * Portfolio éditorial, la photographie en tête.
 *
 * Pas une grille de cartes égales : le rythme varie. Le premier projet
 * s'étale en pleine largeur, les suivants alternent des paires décalées et des
 * plans larges, avec du vide entre eux. Chaque projet ne porte qu'un numéro,
 * un titre, sa nature et son lieu — l'image fait le reste.
 *
 * Le rythme est piloté par les données (nombre de projets), pas figé : ajouter
 * un chantier ne casse pas la composition.
 */

/** Un projet : image dominante, méta minimale dessous, numéro en regard. */
function ShowcaseItem({ project, index, ratio, priority = false, className, delay = 0 }) {
  return (
    <Reveal from="fade" delay={delay} className={className}>
      <Link
        to={`/realisations/${project.slug}`}
        onClick={() => track(EVENTS.PROJECT_VIEW, { project: project.slug })}
        className="group block"
      >
        <div className={cn('overflow-hidden rounded-lg bg-sand', ratio)}>
          <img
            src={project.cover.src}
            alt={project.cover.alt}
            width={project.cover.w}
            height={project.cover.h}
            loading={priority ? 'eager' : 'lazy'}
            decoding={priority ? 'sync' : 'async'}
            fetchpriority={priority ? 'high' : undefined}
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="h-full w-full object-cover transition-transform duration-[1600ms] ease-soft group-hover:scale-[1.035]"
          />
        </div>

        <div className="mt-5 flex items-baseline gap-4 sm:gap-6">
          <span className="t-num text-ink/40">{String(index + 1).padStart(2, '0')}</span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h3 className="font-display text-[1.5rem] leading-tight tracking-[-0.01em] transition-colors duration-300 group-hover:text-umber sm:text-[1.75rem]">
                {project.title}
              </h3>
              <span className="t-small text-ink/60">{project.type}</span>
            </div>
            <p className="t-small mt-1 text-ink/55">{project.location}</p>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

export default function ProjectShowcase({ projects, className }) {
  if (!projects.length) return null;

  const [lead, ...rest] = projects;
  // Les projets restants avancent par deux : une paire décalée, puis un plan
  // large seul, puis une paire, etc. Le décalage crée l'asymétrie sans la
  // scripter projet par projet.
  const rows = [];
  for (let i = 0; i < rest.length; i += 2) rows.push(rest.slice(i, i + 2));

  return (
    <div className={cn('space-y-20 lg:space-y-32', className)}>
      {/* Ouverture pleine largeur */}
      <ShowcaseItem
        project={lead}
        index={0}
        ratio="aspect-[4/3] sm:aspect-[16/9] lg:aspect-[2.2/1]"
        priority
      />

      {rows.map((pair, r) => {
        const base = 1 + r * 2;
        if (pair.length === 1) {
          // Projet seul : plan large, légèrement rentré, respiration autour.
          return (
            <ShowcaseItem
              key={pair[0].slug}
              project={pair[0]}
              index={base}
              ratio="aspect-[4/3] sm:aspect-[16/10]"
              className="lg:mx-auto lg:w-11/12"
            />
          );
        }
        // Paire décalée : la seconde image descend, ce qui casse l'alignement
        // et donne le rythme « magazine ».
        const flip = r % 2 === 1;
        return (
          <div key={pair[0].slug} className="grid gap-12 md:grid-cols-12 md:gap-10">
            <ShowcaseItem
              project={pair[0]}
              index={base}
              ratio="aspect-[4/5] md:aspect-[3/4]"
              className={cn('md:col-span-6', flip ? 'md:col-start-7 md:pt-24' : '')}
            />
            <ShowcaseItem
              project={pair[1]}
              index={base + 1}
              delay={120}
              ratio="aspect-[4/5] md:aspect-[4/5]"
              className={cn('md:col-span-6', flip ? 'md:col-start-1 md:row-start-1' : 'md:pt-24')}
            />
          </div>
        );
      })}
    </div>
  );
}
