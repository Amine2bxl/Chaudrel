/**
 * Source unique de vérité pour le SEO.
 * Utilisé à la fois par <Seo> (runtime, navigation SPA) et par
 * scripts/prerender.js (génération des fichiers HTML statiques par route).
 */

import { BRAND, SITE_URL } from '@/data/site';
import { PROJECTS, getProject } from '@/data/projects';
import { SERVICES, getService } from '@/data/services';
import { FAQS } from '@/data/faqs';

const DEFAULT_OG = `${SITE_URL}/og-image.jpg`;
const abs = (p) => (p?.startsWith('http') ? p : `${SITE_URL}${p || ''}`);

/* ---------------- JSON-LD réutilisables ---------------- */

export const localBusinessLd = () => ({
  '@context': 'https://schema.org',
  '@type': ['GeneralContractor', 'HomeAndConstructionBusiness'],
  '@id': `${SITE_URL}/#business`,
  name: BRAND.legalName,
  alternateName: BRAND.name,
  description:
    "Entreprise de rénovation basée à Bruxelles, active dans toute la Belgique. Rénovation complète, cuisine, salle de bain, peinture, électricité, plomberie, sols, menuiserie et aménagement intérieur.",
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/chaudrel-logo.jpg`,
  image: DEFAULT_OG,
  telephone: BRAND.phones.map((p) => `+${p.tel.replace(/\D/g, '')}`),
  email: BRAND.email,
  vatID: BRAND.vat,
  foundingDate: String(BRAND.founded),
  address: {
    '@type': 'PostalAddress',
    streetAddress: BRAND.address.street,
    postalCode: BRAND.address.postalCode,
    addressLocality: BRAND.address.city,
    addressRegion: BRAND.address.region,
    addressCountry: BRAND.address.country,
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: BRAND.address.geo.lat,
    longitude: BRAND.address.geo.lng,
  },
  areaServed: [
    { '@type': 'Country', name: 'Belgique' },
    ...BRAND.areaServed.map((name) => ({ '@type': 'City', name })),
  ],
  sameAs: Object.values(BRAND.socials),
  // TODO_VALIDATION : horaires provisoires (voir BRAND.hours). Les publier tels
  // quels enverrait de fausses heures à Google - à confirmer avant mise en ligne.
  openingHours: BRAND.hours.map((h) => `${h.days} ${h.time}`),
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Services de rénovation',
    itemListElement: SERVICES.map((s) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s.title, url: `${SITE_URL}/services/${s.slug}` },
    })),
  },
  founder: BRAND.founders.map((f) => ({ '@type': 'Person', name: f.name, jobTitle: f.role })),
});

const breadcrumbLd = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: abs(it.path),
  })),
});

const faqLd = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

/* ---------------- Métadonnées par route ---------------- */

const STATIC = {
  '/': {
    title: 'Chaudrel - Entreprise de rénovation en Belgique | Devis gratuit',
    description:
      "Rénovation complète, cuisine, salle de bain et aménagement intérieur. Un seul interlocuteur du devis à la livraison, partout en Belgique. Devis gratuit et sans engagement.",
    ld: () => [
      localBusinessLd(),
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        url: `${SITE_URL}/`,
        name: BRAND.legalName,
        inLanguage: 'fr-BE',
      },
    ],
  },
  '/realisations': {
    title: 'Réalisations - Nos chantiers de rénovation | Chaudrel',
    description:
      "Rénovations complètes, cuisines, salles de bain et extérieurs livrés par Chaudrel. Photos de chantiers et comparaisons avant / après.",
    ld: () => [
      breadcrumbLd([
        { name: 'Accueil', path: '/' },
        { name: 'Réalisations', path: '/realisations' },
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: PROJECTS.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${SITE_URL}/realisations/${p.slug}`,
          name: p.title,
        })),
      },
    ],
  },
  '/services': {
    title: 'Services de rénovation en Belgique | Chaudrel',
    description:
      "Rénovation complète, cuisine, salle de bain, peinture, électricité, plomberie, sols, menuiserie et aménagement intérieur. Un interlocuteur unique, devis gratuit.",
    ld: () => [
      breadcrumbLd([
        { name: 'Accueil', path: '/' },
        { name: 'Services', path: '/services' },
      ]),
    ],
  },
  '/methode': {
    title: 'Notre méthode - Quatre étapes, zéro surprise | Chaudrel',
    description:
      "Du premier contact à la livraison : les quatre étapes d'un chantier Chaudrel.",
    ld: () => [
      breadcrumbLd([
        { name: 'Accueil', path: '/' },
        { name: 'Notre méthode', path: '/methode' },
      ]),
    ],
  },
  '/a-propos': {
    title: 'À propos - Chaudrel, entreprise de rénovation belge',
    description:
      "Fondée en 2009 à Bruxelles par Alberto et Matteo, Chaudrel rénove appartements, maisons et commerces partout en Belgique.",
    ld: () => [
      localBusinessLd(),
      breadcrumbLd([
        { name: 'Accueil', path: '/' },
        { name: 'À propos', path: '/a-propos' },
      ]),
    ],
  },
  '/faq': {
    title: 'FAQ - Vos questions sur la rénovation | Chaudrel',
    description:
      "Budget, délais, zone d'intervention, matériaux, déroulement du chantier : les réponses aux questions qu'on nous pose le plus souvent.",
    ld: () => [
      faqLd(FAQS.filter((f) => !f.pending)),
      breadcrumbLd([
        { name: 'Accueil', path: '/' },
        { name: 'FAQ', path: '/faq' },
      ]),
    ],
  },
  '/devis': {
    title: 'Demander un devis gratuit | Chaudrel Rénovation',
    description:
      "Décrivez votre projet en quatre questions. Visite sur place puis devis détaillé, gratuit et sans engagement, partout en Belgique.",
    robots: 'index, follow',
    ld: () => [
      breadcrumbLd([
        { name: 'Accueil', path: '/' },
        { name: 'Devis gratuit', path: '/devis' },
      ]),
    ],
  },
  '/liens': {
    title: 'Tous nos liens | Chaudrel Rénovation',
    description:
      'Devis gratuit, WhatsApp, téléphone, réalisations et réseaux sociaux de Chaudrel Rénovation, réunis sur une page.',
    // `noindex` : c'est une page de redirection depuis les bios réseaux, pas
    // une page de contenu. Indexée, elle concurrencerait l'accueil sur le nom
    // de la marque. `follow` pour que les liens internes gardent leur valeur.
    robots: 'noindex, follow',
    ld: () => [],
  },
  '/legal/politique-mentions': {
    title: 'Mentions légales & politique de confidentialité | Chaudrel',
    description: 'Mentions légales, politique de confidentialité et gestion des données personnelles de Chaudrel Rénovation.',
    robots: 'index, follow',
    ld: () => [],
  },
};

export function metaFor(pathname = '/') {
  const path = pathname !== '/' ? pathname.replace(/\/+$/, '') : '/';

  if (STATIC[path]) {
    const m = STATIC[path];
    return build({ ...m, path, ld: m.ld() });
  }

  const projectMatch = path.match(/^\/realisations\/([^/]+)$/);
  if (projectMatch) {
    const p = getProject(projectMatch[1]);
    if (p) {
      return build({
        path,
        title: `${p.title} - ${p.type} à ${p.location} | Chaudrel`,
        description: p.summary,
        image: abs(p.cover.src),
        ld: [
          breadcrumbLd([
            { name: 'Accueil', path: '/' },
            { name: 'Réalisations', path: '/realisations' },
            { name: p.title, path },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: p.title,
            description: p.description,
            image: p.images.map((im) => abs(im.src)),
            about: p.type,
            locationCreated: { '@type': 'Place', name: p.location },
            ...(p.year ? { dateCreated: String(p.year) } : {}),
            creator: { '@id': `${SITE_URL}/#business` },
          },
        ],
      });
    }
  }

  const serviceMatch = path.match(/^\/services\/([^/]+)$/);
  if (serviceMatch) {
    const s = getService(serviceMatch[1]);
    if (s) {
      return build({
        path,
        title: `${s.title} - ${BRAND.name} Rénovation en Belgique`,
        description: `${s.excerpt} ${s.intro.slice(0, 110)}…`,
        image: abs(s.image),
        ld: [
          breadcrumbLd([
            { name: 'Accueil', path: '/' },
            { name: 'Services', path: '/services' },
            { name: s.title, path },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: s.title,
            serviceType: s.title,
            description: s.intro,
            provider: { '@id': `${SITE_URL}/#business` },
            areaServed: [
              { '@type': 'Country', name: 'Belgique' },
              ...BRAND.areaServed.map((name) => ({ '@type': 'City', name })),
            ],
            url: abs(path),
          },
          ...(s.faqs?.length ? [faqLd(s.faqs)] : []),
        ],
      });
    }
  }

  return build({
    path,
    title: 'Page introuvable | Chaudrel',
    description: "Cette page n'existe pas ou a été déplacée.",
    robots: 'noindex, follow',
    ld: [],
  });
}

function build({ path, title, description, image, robots, ld = [] }) {
  return {
    path,
    title,
    description,
    canonical: `${SITE_URL}${path === '/' ? '/' : path}`,
    image: image || DEFAULT_OG,
    robots: robots || 'index, follow, max-image-preview:large',
    jsonLd: ld,
  };
}

/** Toutes les routes à pré-rendre (build statique + sitemap). */
export function allRoutes() {
  return [
    ...Object.keys(STATIC),
    ...PROJECTS.map((p) => `/realisations/${p.slug}`),
    ...SERVICES.map((s) => `/services/${s.slug}`),
  ];
}
