import { motion } from 'motion/react';
import { Container } from '@/components/ui';
import { BRAND } from '@/data/site';
import { EASE } from '@/lib/motion';

/** La porte du logo, en repère : un trapèze bronze. */
function DoorMark() {
  return (
    <svg viewBox="0 0 67 165" aria-hidden="true" className="h-6 w-auto flex-none">
      <path d="M0 38 L67 0 L67 165 L0 142 Z" fill="var(--c-gold)" />
    </svg>
  );
}

/**
 * Quatre faits vérifiables, juste sous la porte. Pas de compteur : chaque
 * ligne est confirmée par Chaudrel (voir docs/VERIFICATION.md).
 */
export default function FactsBand() {
  const years = new Date().getFullYear() - BRAND.founded;
  const facts = [
    { title: `Depuis ${BRAND.founded}`, text: `${years} ans de chantiers en Belgique` },
    {
      title: 'Un seul interlocuteur',
      text: `${BRAND.founders[0].name} ou ${BRAND.founders[1].name}, du devis aux clés`,
    },
    { title: 'Devis gratuit', text: 'Visite et devis détaillé, sans engagement' },
    { title: BRAND.promises.responseTime, text: 'Par téléphone, WhatsApp ou e-mail' },
  ];

  return (
    <section aria-label="Chaudrel en quatre faits" className="border-b border-ink/10 bg-cream py-14 lg:py-16">
      <Container>
        <motion.dl
          className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        >
          {facts.map((f) => (
            <motion.div
              key={f.title}
              className="flex gap-4"
              variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <DoorMark />
              <div>
                <dt className="font-display text-[1.375rem] leading-tight text-ink">{f.title}</dt>
                <dd className="t-small mt-1.5 text-ink/70">{f.text}</dd>
              </div>
            </motion.div>
          ))}
        </motion.dl>
      </Container>
    </section>
  );
}
