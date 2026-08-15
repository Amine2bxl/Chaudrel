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
    "Entreprise de rénovation à Bruxelles et en périphérie. Rénovation complète, cuisine, salle de bain, peinture, électricité, plomberie, sols, menuiserie et aménagement intérieur.",
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
  areaServed: BRAND.areaServed.map((name) => ({ '@type': 'City', name })),
  sameAs: Object.values(BRAND.socials),
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
    title: 'Chaudrel — Rénovation à Bruxelles | Devis gratuit',
    description:
      "Chaudrel transforme vos espaces à Bruxelles et en périphérie : rénovation complète, cuisine, salle de bain, aménagement intérieur. Devis gratuit et sans engagement.",
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
    title: 'Réalisations — Rénovations à Bruxelles | Chaudrel',
    description:
      "Découvrez les réalisations de Chaudrel à Bruxelles et en périphérie : rénovations complètes, cuisines, salles de bain, extérieurs. Photos avant/après.",
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
    title: 'Services de rénovation à Bruxelles | Chaudrel',
    description:
      "Rénovation complète, cuisine, salle de bain, peinture, électricité, plomberie, sols, menuiserie et aménagement intérieur à Bruxelles. Devis gratuit.",
    ld: () => [
      breadcrumbLd([
        { name: 'Accueil', path: '/' },
        { name: 'Services', path: '/services' },
      ]),
    ],
  },
  '/methode': {
    title: 'Notre méthode — 5 étapes claires | Chaudrel',
    description:
      "De votre premier contact à la livraison du chantier : découvrez les 5 étapes d'un projet de rénovation avec Chaudrel à Bruxelles.",
    ld: () => [
      breadcrumbLd([
        { name: 'Accueil', path: '/' },
        { name: 'Notre méthode', path: '/methode' },
      ]),
    ],
  },
  '/a-propos': {
    title: 'À propos de Chaudrel — Entreprise de rénovation à Bruxelles',
    description:
      "Chaudrel, entreprise de rénovation fondée en 2009 à Bruxelles par Alberto et Matteo. Notre équipe, nos valeurs, notre manière de travailler.",
    ld: () => [
      localBusinessLd(),
      breadcrumbLd([
        { name: 'Accueil', path: '/' },
        { name: 'À propos', path: '/a-propos' },
      ]),
    ],
  },
  '/faq': {
    title: 'FAQ — Questions fréquentes sur la rénovation | Chaudrel',
    description:
      "Budget, délais, zone d'intervention, devis gratuit, matériaux : les réponses aux questions les plus fréquentes sur une rénovation avec Chaudrel.",
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
      "Décrivez votre projet de rénovation en 5 étapes et recevez un devis gratuit et sans engagement. Bruxelles et périphérie.",
    robots: 'index, follow',
    ld: () => [
      breadcrumbLd([
        { name: 'Accueil', path: '/' },
        { name: 'Demander un devis', path: '/devis' },
      ]),
    ],
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
        title: `${p.title} — ${p.type} à ${p.location} | Chaudrel`,
        description: p.summary,
        image: abs(p.cover),
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
            image: p.images.map(abs),
            locationCreated: { '@type': 'Place', name: p.location },
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
        title: `${s.title} à Bruxelles — ${BRAND.name} Rénovation`,
        description: s.excerpt,
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
            areaServed: BRAND.areaServed.map((name) => ({ '@type': 'City', name })),
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
