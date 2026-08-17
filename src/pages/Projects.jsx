import { useMemo, useState } from 'react';
import PageHero from '@/components/sections/PageHero';
import ProjectShowcase from '@/components/sections/ProjectShowcase';
import CTASection from '@/components/sections/CTASection';
import { Container, Section } from '@/components/ui';
import { PROJECTS, activeCategories, projectsByCategory } from '@/data/projects';
import { cn } from '@/lib/utils';

export default function Projects() {
  const [filter, setFilter] = useState('all');
  const categories = useMemo(() => activeCategories(), []);
  const items = useMemo(() => projectsByCategory(filter), [filter]);

  return (
    <>
      <PageHero
        title="Nos chantiers, tels qu’ils ont été livrés."
        intro="Les photos sont les nôtres, prises sur nos chantiers. Aucune image d’illustration."
        breadcrumb={[{ label: 'Accueil', to: '/' }, { label: 'Réalisations' }]}
      />

      <Section tone="cream" className="pt-0 md:pt-0 lg:pt-0">
        <Container>
          {/* Bascules éditoriales, pas des pastilles : même langage d'état actif
              que la navigation — le texte s'assombrit, un point brun l'ancre. */}
          <div
            className="flex flex-wrap items-center gap-x-7 gap-y-3 border-b border-ink/[0.09] pb-6"
            role="group"
            aria-label="Filtrer les réalisations"
          >
            {[{ id: 'all', label: 'Tout' }, ...categories].map((c) => {
              const on = filter === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFilter(c.id)}
                  className={cn(
                    'relative t-label pb-1 transition-colors duration-fast',
                    on ? 'text-ink' : 'text-ink/50 hover:text-ink'
                  )}
                >
                  {c.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute inset-x-0 -bottom-0.5 mx-auto h-1 w-1 rounded-full bg-umber transition-opacity duration-fast',
                      on ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </button>
              );
            })}
            <span className="t-label ml-auto tabular-nums text-ink/50">
              {String(items.length).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')}
            </span>
          </div>

          {items.length > 0 ? (
            <ProjectShowcase projects={items} className="mt-16 lg:mt-24" />
          ) : (
            /* Un état vide dit ce qui se passe et propose la sortie : ici,
               revenir à la sélection complète plutôt que rester bloqué. */
            <div className="mt-16">
              <p className="t-lead text-ink/60">
                Aucun chantier publié dans cette catégorie pour le moment.
              </p>
              <button
                type="button"
                onClick={() => setFilter('all')}
                className="link-line t-label mt-5 inline-block pb-1 text-ink"
              >
                Voir tous les chantiers
              </button>
            </div>
          )}
        </Container>
      </Section>

      <CTASection
        title="Votre projet ressemble à l’un des nôtres ?"
        text="Répondez à cinq questions. Nous organisons une visite et vous remettons un devis détaillé, gratuitement."
        source="projects"
      />
    </>
  );
}
