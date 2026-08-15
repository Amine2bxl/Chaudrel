import { useMemo, useState } from 'react';
import PageHero from '@/components/sections/PageHero';
import ProjectCard from '@/components/sections/ProjectCard';
import CtaBand from '@/components/sections/CtaBand';
import { Container, Section } from '@/components/ui';
import Reveal from '@/lib/reveal';
import { PROJECTS, activeCategories, projectsByCategory } from '@/data/projects';
import { cn } from '@/lib/utils';

export default function Projects() {
  const [filter, setFilter] = useState('all');
  const categories = useMemo(() => activeCategories(), []);
  const items = useMemo(() => projectsByCategory(filter), [filter]);

  return (
    <>
      <PageHero
        eyebrow="Réalisations"
        title="Nos chantiers livrés"
        intro="Rénovations complètes, cuisines, salles de bain et extérieurs réalisés à Bruxelles et en périphérie."
        image={PROJECTS[0]?.cover}
        breadcrumb={[{ label: 'Accueil', to: '/' }, { label: 'Réalisations' }]}
      />

      <Section tone="cream">
        <Container>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer les réalisations">
            {[{ id: 'all', label: 'Tout' }, ...categories].map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={filter === c.id}
                onClick={() => setFilter(c.id)}
                className={cn(
                  'rounded-full border px-5 py-2.5 text-[12px] font-medium tracking-wide transition-colors',
                  filter === c.id
                    ? 'border-brand-ink bg-brand-ink text-white'
                    : 'border-brand-ink/15 text-brand-ink/60 hover:border-brand-ink/40 hover:text-brand-ink'
                )}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((p, i) => (
              <Reveal key={p.slug} delay={i * 60}>
                <ProjectCard project={p} aspect="aspect-[4/5]" priority={i < 2} className="h-full" />
              </Reveal>
            ))}
          </div>

          {items.length === 0 && (
            <p className="mt-10 text-[15px] font-light text-brand-ink/55">
              Aucune réalisation publiée dans cette catégorie pour le moment.
            </p>
          )}
        </Container>
      </Section>

      <CtaBand
        title="Votre projet ressemble à l'un des nôtres ?"
        text="Décrivez-le nous : nous organisons une visite et vous remettons un devis détaillé, gratuitement."
        source="projects"
      />
    </>
  );
}
