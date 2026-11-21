import { Container } from '@/components/ui';
import { Monogram } from '@/components/ui/Logo';
import Reveal from '@/lib/reveal';
import usePointerGlow from '@/lib/usePointerGlow';
import { BRAND } from '@/data/site';

const SCREWS = ['left-4 top-4', 'right-4 top-4', 'left-4 bottom-4', 'right-4 bottom-4'];

/**
 * Plaque de l'entreprise : les quatre faits gravés sur une plaque de verre
 * fumé tenue par un cadre et quatre vis de laiton, comme la plaque d'une
 * porte d'entrée. Derrière, la porte bronze du logo luit doucement : le verre
 * a quelque chose à flouter. Faits vérifiables uniquement
 * (docs/VERIFICATION.md), aucun compteur inventé.
 */
export default function FactsBand() {
  const glow = usePointerGlow();
  const years = new Date().getFullYear() - BRAND.founded;
  const facts = [
    { label: 'Fondée', title: `Depuis ${BRAND.founded}`, text: `${years} ans de chantiers en Belgique` },
    {
      label: 'Interlocuteur',
      title: 'Un seul',
      text: `${BRAND.founders[0].name} ou ${BRAND.founders[1].name}, du devis aux clés`,
    },
    { label: 'Devis', title: 'Gratuit', text: 'Visite et devis détaillé, sans engagement' },
    { label: 'Réponse', title: 'Sous 48\u00a0h', text: 'Par téléphone, WhatsApp ou e\u2011mail' },
  ];

  return (
    <section aria-label="Chaudrel en quatre faits" className="relative isolate overflow-hidden bg-cream py-16 lg:py-20">
      {/* Ce que le verre laisse voir : une lueur bronze et la porte du logo. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[26rem] w-[60rem] max-w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(var(--c-gold-rgb)/0.32),transparent)]" />
        <svg viewBox="0 0 67 165" className="absolute left-[58%] top-1/2 h-[120%] -translate-y-1/2 opacity-30">
          <path d="M0 38 L67 0 L67 165 L0 142 Z" fill="var(--c-gold)" />
        </svg>
      </div>

      <Container>
        <Reveal
          {...glow}
          className="glass-dark plate-frame on-dark relative mx-auto max-w-5xl rounded-[18px] bg-bark/40 px-8 py-10 text-cream sm:px-14 sm:py-12"
        >
          {SCREWS.map((pos) => (
            <span key={pos} aria-hidden="true" className={`plate-screw absolute ${pos}`} />
          ))}
          <div className="flex flex-col items-center gap-9 lg:flex-row lg:gap-12">
            <Monogram tone="cream" className="h-14 w-auto flex-none" />
            <dl className="grid w-full grid-cols-2 gap-x-8 gap-y-9 lg:grid-cols-4 lg:gap-0">
              {facts.map((f, i) => (
                <div key={f.label} className={i > 0 ? 'lg:border-l lg:border-gold/30 lg:pl-8' : ''}>
                  <dt className="t-label text-gold-light">{f.label}</dt>
                  <dd className="plate-etch mt-2.5 font-display text-[1.25rem] leading-none sm:text-[1.75rem]">
                    {f.title}
                  </dd>
                  <dd className="t-small mt-2.5 text-cream/75">{f.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
