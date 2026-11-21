import { useRef } from 'react';
import { motion, useTransform } from 'motion/react';
import useSectionProgress from '@/lib/useSectionProgress';
import { Button, Container } from '@/components/ui';
import Reveal from '@/lib/reveal';
import usePointerGlow from '@/lib/usePointerGlow';
import { useContactDialog } from '@/lib/contactDialog';
import { EVENTS, track } from '@/lib/analytics';
import { imageAttrs, SIZES } from '@/lib/image';

/**
 * Bande de conversion en fin de page : une carte de verre devant un chantier
 * livré, qui défile plus lentement que la page. Centrée - c'est le point
 * d'arrêt de la lecture, l'endroit où l'on décide.
 */
export default function CTASection({
  title = 'Parlons de votre projet.',
  text = 'Une visite sur place, puis un devis détaillé poste par poste. Gratuit, sans engagement, réponse sous 48 h.',
  source = 'cta',
}) {
  const { openDialog } = useContactDialog();
  const ref = useRef(null);
  const glow = usePointerGlow();
  const scrollYProgress = useSectionProgress(ref);
  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  return (
    <section ref={ref} data-page-cta className="on-dark relative isolate overflow-hidden bg-bark py-section text-cream">
      <motion.img
        {...imageAttrs('/photos/facade-garages.webp', SIZES.full)}
        alt=""
        aria-hidden="true"
        width="1920"
        height="1080"
        loading="lazy"
        decoding="async"
        style={{ y, scale: 1.2 }}
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-bark/70" />

      <Container>
        <Reveal
          {...glow}
          className="glass-dark mx-auto max-w-3xl rounded-[32px] px-6 py-12 text-center sm:px-14 sm:py-16"
        >
          <h2 className="t-h1 mx-auto max-w-[16ch] text-balance">{title}</h2>
          <p className="t-lead mx-auto mt-6 max-w-[48ch] text-cream/80">{text}</p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              to="/devis"
              size="lg"
              arrow
              className="w-full sm:w-auto"
              onClick={() => track(EVENTS.QUOTE_CTA, { source })}
            >
              Demander un devis gratuit
            </Button>
            <Button variant="outlineLight" size="lg" className="w-full sm:w-auto" onClick={() => openDialog(source)}>
              Nous joindre
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
