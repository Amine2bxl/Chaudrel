import { useEffect, useRef } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import PageHero from '@/components/sections/PageHero';
import ProjectCarousel from '@/components/sections/ProjectCarousel';
import CTASection from '@/components/sections/CTASection';
import { Button, Container, Panel, Section, SectionHeading } from '@/components/ui';
import { Chip } from '@/components/layout/ContactList';
import House3D from '@/components/sections/House3D';
import { CheckIcon, HouseIcon, SERVICE_ICONS } from '@/components/ui/Icons';
import { EVENTS, track } from '@/lib/analytics';
import Reveal from '@/lib/reveal';
import { SERVICES, getService } from '@/data/services';
import { BRAND } from '@/data/site';
import { imageAttrs } from '@/lib/image';
import { projectsForTags } from '@/data/projects';
import { cn } from '@/lib/utils';

/**
 * Anciens métiers de la V1 vers les métiers réels.
 *
 * La V1 découpait l'offre par pièce et par corps de métier (cuisine, salle de
 * bain, électricité…) ; le site historique la découpe par métier de chantier.
 * Ces URL ont pu être indexées ou partagées : elles pointent vers le métier qui
 * couvre réellement ces travaux, plutôt que de renvoyer tout le monde sur
 * l'index.
 */
const LEGACY_SLUGS = {
  cuisine: 'finitions-interieures',
  'salle-de-bain': 'finitions-interieures',
  peinture: 'finitions-interieures',
  'sols-et-revetements': 'finitions-interieures',
  menuiserie: 'finitions-interieures',
  'amenagement-interieur': 'finitions-interieures',
  electricite: 'renovation-complete',
  plomberie: 'renovation-complete',
  jardin: 'amenagement-exterieur',
  nettoyage: 'renovation-complete',
};

/* Métier → parties de la maquette qu'il touche, et point de vue un peu penché,
   vu d'en haut : [rx, ry, x, y, z] (cadrage mesuré pour remplir la case). */
const SERVICE_PARTS = {
  'renovation-complete': ['toit', 'facade', 'chassis', 'porte', 'volume', 'garage', 'abords'],
  'finitions-interieures': ['interieur'],
  'amenagement-exterieur': ['abords', 'garage'],
  toiture: ['toit'],
  facade: ['facade'],
  piscine: ['piscine'],
};
const SERVICE_VIEWS = {
  'renovation-complete': [-32, -34, -0.1, -1.3, 6.3],
  'finitions-interieures': [-50, -24, 0.2, -1.9, 7.3],
  'amenagement-exterieur': [-40, -42, -0.4, -1.8, 5.2],
  toiture: [-46, 32, 0, -2.2, 7.1],
  facade: [-26, -18, 0.7, -0.7, 10.9],
  piscine: [-38, 122, -0.2, -2.3, 7.2],
};

export default function Service() {
  const { slug } = useParams();
  const service = getService(slug);
  const tabs = useRef(null);

  // Sur mobile, la barre des métiers défile : on y amène le métier en cours.
  useEffect(() => {
    const ul = tabs.current;
    const on = ul?.querySelector('[aria-current="page"]')?.parentElement;
    if (on) ul.scrollLeft = on.offsetLeft - (ul.clientWidth - on.offsetWidth) / 2;
  }, [slug]);

  if (!service) {
    const moved = LEGACY_SLUGS[slug];
    return <Navigate to={moved ? `/services/${moved}` : '/services'} replace />;
  }

  const related = projectsForTags(service.projectTags || [], 3);

  return (
    <>
      <PageHero title={service.title} />

      {/* Les six métiers, toujours visibles : on passe de l'un à l'autre en un geste. */}
      <nav aria-label="Nos métiers" className="border-b border-ink/10">
        <Container>
          <ul ref={tabs} className="-mx-5 flex gap-2 overflow-x-auto px-5 py-4 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0">
            {SERVICES.map((s) => {
              const on = s.slug === service.slug;
              const Icon = SERVICE_ICONS[s.slug] || HouseIcon;
              return (
                <li key={s.slug} className="flex-none">
                  <Link
                    to={`/services/${s.slug}`}
                    aria-current={on ? 'page' : undefined}
                    className={cn(
                      't-small flex items-center gap-2 rounded-full border px-4 py-2 transition-colors duration-fast',
                      on ? 'border-gold/60 bg-gold/[0.12] text-ink' : 'border-ink/10 text-ink/70 hover:border-ink/25 hover:text-ink'
                    )}
                  >
                    <Icon size={16} className={on ? 'text-gold-light' : 'text-ink/50'} />
                    {s.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </nav>

      {/* La photo du métier, claire et en grand ; à côté, ce qu'on y gagne en une phrase. */}
      <Section className="pb-0 md:pb-0 lg:pb-0">
        <Container className="grid gap-5 lg:grid-cols-12 lg:items-stretch">
          <Reveal from="veil" className="overflow-hidden rounded-[28px] bg-sand lg:col-span-7">
            <img
              {...imageAttrs(service.image, '(min-width: 1024px) 56vw, 100vw')}
              alt=""
              width="1200"
              height="900"
              fetchpriority="high"
              decoding="async"
              className="aspect-[4/3] h-full w-full object-cover"
            />
          </Reveal>
          <Reveal delay={100} className="lg:col-span-5">
            <Panel pad="p-7 sm:p-10" className="flex h-full flex-col">
              <Chip icon={SERVICE_ICONS[service.slug] || HouseIcon} accent />
              <p className="mt-6 font-display text-[1.9rem] leading-[1.15] text-ink sm:text-[2.25rem]">{service.excerpt}</p>
              <p className="t-body mt-5 text-ink/75">{service.intro}</p>
              <div className="mt-auto pt-8">
                <Button
                  to="/devis"
                  size="lg"
                  arrow
                  onClick={() => track(EVENTS.QUOTE_CTA, { source: `service_${service.slug}` })}
                >
                  Demander un devis gratuit
                </Button>
                <p className="t-small mt-4 text-ink/60">
                  {BRAND.promises.quote} · {BRAND.promises.responseTime}
                </p>
              </div>
            </Panel>
          </Reveal>
        </Container>
      </Section>

      {/* Ce que le métier couvre : la maquette montre où, la liste dit quoi. */}
      <Section>
        <Container>
          <SectionHeading title="Ce que nous prenons en charge." />
          <div className="mt-block grid gap-5 lg:grid-cols-12">
            <Reveal className="self-start lg:sticky lg:top-28 lg:col-span-6">
              <House3D
                lit={new Set(SERVICE_PARTS[service.slug] ?? [])}
                camera={SERVICE_VIEWS[service.slug] ?? SERVICE_VIEWS['renovation-complete']}
                className="w-full"
              />
            </Reveal>
            <div className="grid content-start gap-5 lg:col-span-6">
              {service.groups?.map((g, i) => (
                <Reveal key={g.title} delay={i * 80}>
                  <Panel pad="p-6 sm:p-8">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-display text-[1.5rem] leading-tight text-ink">{g.title}</h3>
                      <span className="t-label flex-none tabular-nums text-gold-light">
                        {g.items.length} {g.items.length > 1 ? 'postes' : 'poste'}
                      </span>
                    </div>
                    <ul className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                      {g.items.map((item) => (
                        <li key={item} className="t-body flex items-start gap-3 text-ink/80">
                          <CheckIcon size={18} className="mt-[3px] flex-none text-gold-light" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Panel>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {related.length > 0 && (
        <ProjectCarousel
          projects={related}
          sectionLabel="Sur le chantier"
          title="Des chantiers de ce type."
        />
      )}

      <CTASection source={`service_${service.slug}`} />
    </>
  );
}
