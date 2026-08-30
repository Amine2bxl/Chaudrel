import { Link, useNavigate } from 'react-router-dom';
import CoverFlowCarousel from '@/components/ui/3-d-coverflow-carousel';
import { EVENTS, track } from '@/lib/analytics';

/**
 * Les chantiers, en couverture 3D - un projet au centre, ses voisins pivotés
 * dans la profondeur.
 *
 * `ProjectCarousel` reste l'unique façon d'afficher des chantiers (accueil,
 * /realisations, pages service) mais la mécanique est celle du composant
 * `CoverFlowCarousel` de la bibliothèque : même géométrie, mêmes gestes, et la
 * carte entière mène à la fiche du chantier.
 *
 * Autoplay volontairement long (6 s) et coupé au survol : une galerie doit se
 * regarder, pas se subir - l'œil a le temps de s'y poser.
 */
export default function ProjectCarousel({
  projects = [],
  className = '',
  sectionLabel = 'Nos chantiers',
  title = '',
  text = '',
  link,
  autoplay = true,
  caption = true,
}) {
  const navigate = useNavigate();

  const items = projects.map((p) => ({
    key: p.slug,
    slug: p.slug,
    tag: p.type,
    titleLine1: p.title,
    titleLine2: p.location,
    desc: p.summary,
    img: p.cover.src,
    ctaText: 'Voir le chantier',
    ctaUrl: `/realisations/${p.slug}`,
  }));

  if (!items.length) return null;

  const openProject = (item) => {
    track(EVENTS.PROJECT_VIEW, { project: item.slug, source: 'coverflow' });
    navigate(item.ctaUrl);
  };

  return (
    <CoverFlowCarousel
      items={items}
      sectionLabel={sectionLabel}
      title={title}
      text={text}
      autoplay={autoplay}
      className={className}
      regionLabel="Galerie des chantiers"
      caption={caption}
      onCardClick={openProject}
      onCtaClick={openProject}
    >
      {link && (
        <div className="mt-10 text-center">
          <Link to={link.to} className="link-line t-label inline-block pb-1 text-cream">
            {link.label}
          </Link>
        </div>
      )}
    </CoverFlowCarousel>
  );
}