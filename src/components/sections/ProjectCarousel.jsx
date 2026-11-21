import { Link } from 'react-router-dom';
import { Container, SectionHeading, TextLink } from '@/components/ui';
import { EVENTS, track } from '@/lib/analytics';
import { imageAttrs, SIZES } from '@/lib/image';
import { cn } from '@/lib/utils';

/**
 * Les chantiers, en cartes qui s'empilent au défilement.
 *
 * Chaque carte se colle en haut de l'écran (`position: sticky`) ; la
 * suivante monte et vient se poser dessus, et celle du dessous recule
 * légèrement. Le défilement reste natif : aucune cage, aucun bouton, et le
 * recul est une animation CSS liée à la `view-timeline` de la carte
 * suivante - jouée par la carte graphique, sans JavaScript. Sans prise en
 * charge, les cartes s'empilent sans reculer.
 *
 * Photo et texte alternent de côté d'une carte à l'autre.
 *
 * Le nom `ProjectCarousel` est conservé : c'est l'unique façon d'afficher
 * des chantiers (accueil, /realisations, pages métier).
 */
export default function ProjectCarousel({ projects = [], sectionLabel = 'Nos chantiers', title = '', text = '', link }) {
  if (!projects.length) return null;
  const names = projects.map((_, i) => `--stack-${i}`);

  return (
    <section aria-label={sectionLabel} className="bg-cream py-section">
      <Container>
        {title && (
          <div className="mb-block flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading title={title} text={text} />
            {link && (
              <TextLink to={link.to} className="flex-none">
                {link.label}
              </TextLink>
            )}
          </div>
        )}

        <ol className="stack" style={{ timelineScope: names.join(', ') }}>
          {projects.map((p, i) => (
            <li
              key={p.slug}
              className="stack-item"
              style={{ top: `calc(5.75rem + ${i * 14}px)`, viewTimelineName: names[i] }}
            >
              <ProjectCard
                project={p}
                index={i}
                total={projects.length}
                recedeOn={names[i + 1]}
                flip={i % 2 === 1}
              />
            </li>
          ))}
        </ol>

        {link && !title && (
          <div className="mt-12 text-center">
            <TextLink to={link.to}>{link.label}</TextLink>
          </div>
        )}
      </Container>
    </section>
  );
}

function ProjectCard({ project: p, index, total, recedeOn, flip }) {
  const to = `/realisations/${p.slug}`;
  const open = () => track(EVENTS.PROJECT_VIEW, { project: p.slug, source: 'stack' });

  return (
    <article
      className={cn(
        'stack-card relative grid overflow-hidden rounded-[32px] border border-ink/10 bg-shell shadow-lift lg:min-h-[min(74vh,640px)] lg:grid-cols-12',
        recedeOn && 'stack-recede'
      )}
      style={recedeOn ? { animationTimeline: recedeOn } : undefined}
    >
      <Link
        to={to}
        onClick={open}
        tabIndex={-1}
        aria-hidden="true"
        className={cn(
          'relative block aspect-[4/3] overflow-hidden bg-sand lg:col-span-7 lg:aspect-auto',
          flip && 'lg:order-last'
        )}
      >
        <img
          {...imageAttrs(p.cover.src, SIZES.stage)}
          alt=""
          width={p.cover.w}
          height={p.cover.h}
          loading="lazy"
          decoding="async"
          className="stack-photo absolute inset-0 h-full w-full object-cover"
        />
      </Link>

      <div className="flex flex-col justify-between gap-8 p-7 sm:p-10 lg:col-span-5 lg:p-12">
        <div>
          <p className="t-label flex items-center gap-3 text-gold-deep">
            <span>{p.type}</span>
            <span aria-hidden="true" className="h-px w-6 bg-gold/50" />
            <span className="tabular-nums text-ink/60">
              {index + 1} / {total}
            </span>
          </p>
          <h3 className="t-h2 mt-5 text-balance">
            <Link to={to} onClick={open} className="link-line">
              {p.title}
            </Link>
          </h3>
          {p.location && <p className="t-small mt-2 text-ink/70">{p.location}</p>}
          <p className="t-lead mt-5 text-ink/80">{p.summary}</p>
        </div>

        {p.works?.length > 0 && (
          <ul className="flex flex-wrap gap-2" aria-label="Travaux réalisés">
            {p.works.slice(0, 4).map((w) => (
              <li key={w} className="t-small rounded-full border border-ink/15 px-3.5 py-1.5 text-ink/80">
                {w}
              </li>
            ))}
          </ul>
        )}

        <TextLink to={to} onClick={open} className="w-fit">
          Voir le chantier
        </TextLink>
      </div>

      {recedeOn && (
        <span
          aria-hidden="true"
          className="stack-shade pointer-events-none absolute inset-0 bg-bark"
          style={{ animationTimeline: recedeOn }}
        />
      )}
    </article>
  );
}
