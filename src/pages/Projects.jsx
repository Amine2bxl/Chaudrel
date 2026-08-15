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
        label="Réalisations"
        title="Nos chantiers, tels qu’ils ont été livrés."
        intro="Les photos sont les nôtres, prises sur nos chantiers. Aucune image d’illustration."
        breadcrumb={[{ label: 'Accueil', to: '/' }, { label: 'Réalisations' }]}
      />

      <Section tone="cream" className="pt-0 md:pt-0 lg:pt-0">
        <Container>
          <div
            className="flex flex-wrap items-baseline gap-x-8 gap-y-3 border-y border-ink/12 py-5"
            role="group"
            aria-label="Filtrer les réalisations"
          >
            {[{ id: 'all', label: 'Tout' }, ...categories].map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={filter === c.id}
                onClick={() => setFilter(c.id)}
                className={cn(
                  't-label transition-colors duration-300',
                  filter === c.id ? 'text-gold' : 'text-ink/45 hover:text-ink'
                )}
              >
                {c.label}
              </button>
            ))}
            <span className="t-label ml-auto text-ink/30">
              {String(items.length).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')}
            </span>
          </div>

          {items.length > 0 ? (
            <ProjectIndex projects={items} className="mt-12 lg:mt-16" />
          ) : (
            <p className="t-body mt-14 text-ink/55">Aucune réalisation publiée dans cette catégorie pour le moment.</p>
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
