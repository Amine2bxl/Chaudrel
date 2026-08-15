import { useMemo, useState } from 'react';
import PageHero from '@/components/sections/PageHero';
import ProjectGrid from '@/components/sections/ProjectGrid';
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
        intro="Rénovations complètes, cuisines, salles de bain et extérieurs. Les photos sont les nôtres, prises sur nos chantiers."
        breadcrumb={[{ label: 'Accueil', to: '/' }, { label: 'Réalisations' }]}
      />

      <Section tone="cream" className="pt-0 md:pt-0 lg:pt-0">
        <Container>
          <div className="flex flex-wrap gap-x-8 gap-y-3 border-y border-ink/12 py-5" role="group" aria-label="Filtrer les réalisations">
            {[{ id: 'all', label: 'Tout' }, ...categories].map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={filter === c.id}
                onClick={() => setFilter(c.id)}
                className={cn(
                  't-label pb-1 transition-colors duration-300',
                  filter === c.id ? 'text-gold' : 'text-ink/45 hover:text-ink'
                )}
              >
                {c.label}
              </button>
            ))}
            <span className="t-label ml-auto text-ink/30">
              {items.length} / {PROJECTS.length}
            </span>
          </div>

          <ProjectGrid projects={items} className="mt-14 lg:mt-20" />

          {items.length === 0 && (
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
