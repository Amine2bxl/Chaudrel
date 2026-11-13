import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import '@/lib/pwa';

const rootEl = document.getElementById('root');

const tree = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Chaque route est pré-rendue en HTML statique (scripts/prerender.js). On
// hydrate ce HTML plutôt que de le remplacer : le texte et la photo d'ouverture
// restent affichés pendant le chargement du script, sans second rendu.
// Le premier rendu client est donc identique au rendu serveur - les états qui
// dépendent de la fenêtre (défilement, apparition) ne changent qu'en effet.
// Le HTML n'est repris que s'il a été rendu pour CETTE adresse : une route
// inconnue servie avec le HTML de l'accueil (repli SPA) est rendue à neuf.
const trim = (p) => (p.length > 1 ? p.replace(/\/+$/, '') : p);
const ssrPath = rootEl.getAttribute('data-ssr');
if (ssrPath && trim(ssrPath) === trim(window.location.pathname)) {
  hydrateRoot(rootEl, tree);
} else {
  if (ssrPath !== null) rootEl.innerHTML = '';
  createRoot(rootEl).render(tree);
}
