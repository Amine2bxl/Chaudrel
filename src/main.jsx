import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import '@/lib/pwa';

// Le SSR (prerender) injecte le HTML dans #root pour les bots qui n'exécutent pas JS.
// On le vide avant l'hydration pour éviter les mismatches d'attributs
// (notamment framer-motion qui pose initial={{opacity:0}}).
const rootEl = document.getElementById('root');
if (rootEl.hasAttribute('data-ssr')) {
  rootEl.innerHTML = '';
}

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>
);