import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import MobileBar from '@/components/layout/MobileBar';
import Footer from '@/components/layout/Footer';
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
import Contact from '@/pages/Contact';
import Legal from '@/pages/Legal';
import NotFound from '@/pages/NotFound';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="min-h-screen bg-paper">
      <Seo />
      <ScrollToTop />
      <Navbar />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/realisations" element={<Projects />} />
          <Route path="/realisations/:slug" element={<Project />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<Service />} />
          <Route path="/methode" element={<Method />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/devis" element={<Quote />} />
          <Route path="/legal/politique-mentions" element={<Legal />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <MobileBar />
    </div>
  );
}
