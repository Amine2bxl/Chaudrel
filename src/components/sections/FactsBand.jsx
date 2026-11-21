import { Container, Panel } from '@/components/ui';
import { Monogram } from '@/components/ui/Logo';
import Reveal from '@/lib/reveal';
import { Chip } from '@/components/layout/ContactList';
import { HouseIcon, PersonIcon, QuoteDocIcon } from '@/components/ui/Icons';
import { PhoneIcon } from '@/components/ui/BrandIcons';
import { BRAND } from '@/data/site';

/**
 * Les quatre faits, sur la carte de verre du site : le monogramme, puis un
 * fait par pastille. Faits vérifiables uniquement (docs/VERIFICATION.md),
 * aucun compteur inventé ; le délai vient de BRAND, jamais écrit en dur.
 */
export default function FactsBand() {
  const years = new Date().getFullYear() - BRAND.founded;
  const facts = [
    { icon: HouseIcon, title: `Depuis ${BRAND.founded}`, text: `${years} ans de chantiers en Belgique` },
    {
      icon: PersonIcon,
      title: 'Un seul interlocuteur',
      text: `${BRAND.founders[0].name} ou ${BRAND.founders[1].name}, du devis aux clés`,
    },
    { icon: QuoteDocIcon, title: 'Devis gratuit', text: 'Visite et devis détaillé, sans engagement' },
    { icon: PhoneIcon, title: BRAND.promises.responseTime, text: 'Par téléphone, WhatsApp ou e‑mail' },
  ];

  return (
    <section aria-label="Chaudrel en quatre faits" className="relative isolate pt-section">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-full bg-[radial-gradient(45%_60%_at_50%_60%,rgb(var(--c-gold-rgb)/0.14),transparent)]"
      />
      <Container>
        <Reveal>
          <Panel className="flex flex-col items-center gap-8 lg:flex-row lg:gap-10">
            {/* `ink` : à la racine sombre, l'encre est la couleur claire du texte. */}
            <Monogram className="h-12 w-auto flex-none" />
            <dl className="grid w-full gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
              {facts.map((f) => (
                <div key={f.title} className="flex items-start gap-3.5">
                  <Chip icon={f.icon} accent />
                  <div className="min-w-0">
                    <dt className="text-[15px] font-medium leading-snug text-ink">{f.title}</dt>
                    <dd className="t-small mt-0.5 text-ink/70">{f.text}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </Panel>
        </Reveal>
      </Container>
    </section>
  );
}
