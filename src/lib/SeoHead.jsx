import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { metaFor } from '@/lib/seo';

function setMeta(selector, attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * Met à jour le <head> lors des navigations SPA.
 * Le HTML statique de chaque route est déjà généré par scripts/prerender.js :
 * ce composant sert aux navigations client, pas aux bots.
 */
export default function Seo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const m = metaFor(pathname);

    document.title = m.title;
    setMeta('meta[name="description"]', 'name', 'description', m.description);
    setMeta('meta[name="robots"]', 'name', 'robots', m.robots);
    setMeta('meta[property="og:title"]', 'property', 'og:title', m.title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', m.description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', m.canonical);
    setMeta('meta[property="og:image"]', 'property', 'og:image', m.image);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', m.title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', m.description);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', m.image);

    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', m.canonical);

    // JSON-LD dynamique (les scripts pré-rendus sont remplacés)
    document.head.querySelectorAll('script[data-seo-ld]').forEach((s) => s.remove());
    m.jsonLd.forEach((obj) => {
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-seo-ld', '');
      s.textContent = JSON.stringify(obj);
      document.head.appendChild(s);
    });
  }, [pathname]);

  return null;
}
