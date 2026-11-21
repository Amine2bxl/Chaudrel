import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import Navbar from '@/components/layout/Navbar';
import MobileBar from '@/components/layout/MobileBar';
import Footer from '@/components/layout/Footer';
import ContactDialog from '@/components/layout/ContactDialog';
import { ContactDialogProvider } from '@/lib/contactDialog';
import Seo from '@/lib/SeoHead';
import Home from '@/pages/Home';
import Projects from '@/pages/Projects';
import Project from '@/pages/Project';
import Services from '@/pages/Services';
import Service from '@/pages/Service';
import Method from '@/pages/Method';
import About from '@/pages/About';
import Faq from '@/pages/Faq';
import Quote from '@/pages/Quote';
import Links from '@/pages/Links';
import Legal from '@/pages/Legal';
import NotFound from '@/pages/NotFound';

/**
 * Changement de page en fondu natif (View Transitions) : la page affichée
 * reste celle d'avant jusqu'à ce que le navigateur l'ait photographiée, puis
 * la nouvelle prend sa place et remonte en haut. La transition elle-même est
 * jouée par le navigateur, sur la carte graphique (styles dans index.css).
 * Sans prise en charge ou avec moins de mouvement : changement immédiat.
 */
function useTransitionedLocation() {
  const location = useLocation();
  const [shown, setShown] = useState(location);

  useEffect(() => {
    if (location.key === shown.key) return;
    const swap = () => {
      flushSync(() => setShown(location));
      window.scrollTo(0, 0);
    };
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (document.startViewTransition && !reduce) document.startViewTransition(swap);
    else swap();
  }, [location, shown.key]);

  return shown;
}

export default function App() {
  const location = useTransitionedLocation();

  return (
    <MotionConfig reducedMotion="user">
      <ContactDialogProvider>
        <div className="min-h-screen bg-cream">
          <Seo />
          <Navbar />
          <main id="main">
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/realisations" element={<Projects />} />
              <Route path="/realisations/:slug" element={<Project />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:slug" element={<Service />} />
              <Route path="/methode" element={<Method />} />
              <Route path="/a-propos" element={<About />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/devis" element={<Quote />} />
              {/* Page de liens, destination des bios réseaux. `/link` est
                  l'adresse courte qu'on écrit dans un profil ; elle redirige vers
                  l'URL française du site, qui reste la seule canonique. */}
              <Route path="/liens" element={<Links />} />
              <Route path="/link" element={<Navigate to="/liens" replace />} />
              <Route path="/links" element={<Navigate to="/liens" replace />} />
              <Route path="/legal/politique-mentions" element={<Legal />} />
              {/* La page contact a été retirée : ses coordonnées vivent dans la
                  fenêtre de contact. On redirige plutôt que de renvoyer une 404
                  aux liens et favoris existants. */}
              <Route path="/contact" element={<Navigate to="/" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <MobileBar />
          <ContactDialog />
        </div>
      </ContactDialogProvider>
    </MotionConfig>
  );
}
