import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
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

// Chaque route est pré-rendue en HTML statique (scripts/prerender.js).
// On vide le conteneur avant le rendu client : les composants dépendants du
// viewport (Reveal, Navbar au scroll) produiraient sinon un mismatch d'hydratation.
if (rootEl.hasAttribute('data-ssr')) {
  rootEl.innerHTML = '';
}

createRoot(rootEl).render(tree);
