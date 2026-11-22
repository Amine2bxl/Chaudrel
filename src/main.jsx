import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import '@fontsource/prata/latin-400.css';
import '@fontsource/marcellus/latin-400.css';
import '@fontsource-variable/albert-sans';
import './index.css';
import '@/lib/pwa';

// Chaque chargement (F5 compris) repart du haut : l'accueil s'ouvre toujours sur
// sa porte, et l'on défile soi-même. Entre les pages, App remonte déjà en haut.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

const rootEl = document.getElementById('root');

const tree = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Chaque route est pré-rendue en HTML statique (scripts/prerender.js).
// On vide le conteneur avant le rendu client : les composants dépendants du
// viewport (Reveal, Navbar au scroll) produiraient sinon un mismatch d'hydratation.
if (rootEl.hasAttribute('data-ssr')) {
  rootEl.innerHTML = '';
}

createRoot(rootEl).render(tree);
