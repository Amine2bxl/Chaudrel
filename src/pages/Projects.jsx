import { useMemo, useState } from 'react';
import PageHero from '@/components/sections/PageHero';
import ProjectIndex from '@/components/sections/ProjectIndex';
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
            <ProjectIndex projects={items} className="mt-12 lg:mt-16" />
          ) : (
            <p className="t-body mt-14 text-ink/65">Aucune réalisation publiée dans cette catégorie pour le moment.</p>
          )}
        </Container>
      </Section>

      <CTASection
        title="Votre projet ressemble à l’un des nôtres ?"
        text="Envoyez-nous quelques lignes et deux photos. Nous vous répondons avec une visite ou une première estimation."
        source="projects"
      />
    </>
  );
}
