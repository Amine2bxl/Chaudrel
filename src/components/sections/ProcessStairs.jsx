import { METHOD } from '@/data/method';
import Reveal from '@/lib/reveal';
import { Container, Panel, Scene, SectionHeading, TextLink } from '@/components/ui';
import { Chip } from '@/components/layout/ContactList';
import { KeyIcon, QuoteDocIcon, TapeIcon, TrowelIcon } from '@/components/ui/Icons';

/* Une icône Chaudrel par étape : on mesure, on chiffre, on bâtit, on rend la clé. */
const ICONS = [TapeIcon, QuoteDocIcon, TrowelIcon, KeyIcon];

/**
 * Les quatre étapes, sur une photo de chantier voilée : quatre plaques de
 * verre identiques, de gauche à droite, un numéro, un titre, une phrase.
 * Elles entrent l'une après l'autre (transform et opacity, en CSS).
 */
export default function ProcessStairs({ steps = METHOD, title = 'Quatre étapes, zéro surprise.', link = true }) {
  return (
    <Scene image="/photos/facade-garages.webp" veil="bg-[#110F0D]/80">
      <Container>
        <SectionHeading title={title}>
          {link && (
            <TextLink to="/methode" className="flex-none">
              Notre méthode
            </TextLink>
          )}
        </SectionHeading>
        <ol className="mt-block grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 100}>
              <Panel glass pad="p-6" className="flex h-full flex-col gap-6">
                <div className="flex items-center justify-between">
                  <Chip icon={ICONS[i] ?? TapeIcon} accent />
                  <span className="font-display text-[2rem] leading-none text-ink/30 tabular-nums">{s.n}</span>
                </div>
                <div>
                  <h3 className="text-[1.125rem] font-semibold leading-snug text-ink">{s.title}</h3>
                  <p className="t-small mt-2 text-ink/75">{s.text}</p>
                </div>
              </Panel>
            </Reveal>
          ))}
        </ol>
      </Container>
    </Scene>
  );
}
