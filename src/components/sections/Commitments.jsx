import { BRAND, PROOF } from '@/data/site';
import Reveal from '@/lib/reveal';

/**
 * 07 · Expérience client - ce que Chaudrel s'engage à faire, en quatre
 * points tous confirmés (data/site.js : `promises`, `PROOF`, méthode).
 *
 * Pas d'avis clients ici : ceux de data/testimonials.js ne sont pas encore
 * validés (TESTIMONIALS_VALIDATED = false). Ils prendront cette place quand
 * ils le seront - jamais avant, et jamais avec une note inventée.
 */
export const COMMITMENTS = [
  {
    title: PROOF[1].value,
    text: 'La même personne suit votre dossier du premier appel à la fin du chantier.',
  },
  {
    title: 'Une visite avant tout chiffrage',
    text: 'Nous venons voir, mesurer et écouter. Le devis part de ce que nous avons vu sur place.',
  },
  {
    title: BRAND.promises.quote,
    text: 'Un devis poste par poste : ce qui est inclus, ce qui ne l’est pas, la fourniture et la pose.',
  },
  {
    title: BRAND.promises.responseTime,
    text: 'Chaque demande reçoit une réponse sous 48 heures, par écrit ou par téléphone.',
  },
];

export default function Commitments({ headingLevel = 'h3' }) {
  const H = headingLevel;
  return (
    <ul className="grid gap-px overflow-hidden rounded-lg border border-ink/[0.08] bg-ink/[0.08] sm:grid-cols-2 lg:grid-cols-4">
      {COMMITMENTS.map((c, i) => (
        <Reveal as="li" key={c.title} delay={i * 70} className="bg-paper p-6 sm:p-8">
          <span className="t-num text-[15px] text-gold-ink">{String(i + 1).padStart(2, '0')}</span>
          <H className="t-h3 mt-8">{c.title}</H>
          <p className="t-small mt-3 text-ink/70">{c.text}</p>
        </Reveal>
      ))}
    </ul>
  );
}
