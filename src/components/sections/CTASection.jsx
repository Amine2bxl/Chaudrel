import { Link } from 'react-router-dom';
import { Container } from '@/components/ui';
import Reveal from '@/lib/reveal';
import { EVENTS, track } from '@/lib/analytics';
import { BRAND, whatsappUrl } from '@/data/site';
import { ArrowIcon, FacadeIcon, HouseIcon, RoofIcon, WindowIcon } from '@/components/ui/Icons';

/* Les quatre portes d'entrée du devis. `projet` doit exister dans la liste
   PROJECT_TYPES du formulaire (src/pages/Quote.jsx), qui le présélectionne. */
const CHOICES = [
  { projet: 'Façade', sub: 'Enduit, ravalement, isolation', Icon: FacadeIcon },
  { projet: 'Toiture', sub: 'Couverture, zinguerie, charpente', Icon: RoofIcon },
  { projet: 'Châssis et portes', sub: 'Fenêtres, portes d’entrée, volets', Icon: WindowIcon },
  { projet: 'Rénovation complète', sub: 'Tout le chantier, un seul interlocuteur', Icon: HouseIcon },
];

/**
 * Fin de page : une question directe et quatre réponses. Chaque réponse ouvre
 * le devis déjà orienté (`/devis?projet=…`) ; les deux lignes directes et
 * WhatsApp restent en texte simple dessous. Pas de photo ni de verre : le
 * bloc se fond dans la page, c'est la question qui retient.
 */
export default function CTASection({
  title = 'Quel est votre projet ?',
  text = 'Choisissez, le devis s’ouvre déjà orienté. Visite et devis détaillé gratuits, réponse sous 48 h.',
  source = 'cta',
}) {
  const [alberto, matteo] = BRAND.phones;
  const link = 'link-line tabular-nums text-ink transition-colors hover:text-gold-deep';

  return (
    <section data-page-cta className="border-t border-ink/10 bg-cream py-section">
      <Container className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <h2 className="t-h2 max-w-[14ch] text-balance">{title}</h2>
          <p className="t-lead mt-5 max-w-[40ch] text-ink/75">{text}</p>
        </Reveal>

        <div className="lg:col-span-7">
          <ul className="grid gap-3 sm:grid-cols-2">
            {CHOICES.map(({ projet, sub, Icon }, i) => (
              <Reveal as="li" key={projet} delay={i * 70}>
                <Link
                  to={`/devis?projet=${encodeURIComponent(projet)}`}
                  onClick={() => track(EVENTS.QUOTE_CTA, { source, projet })}
                  className="group flex h-full items-center gap-4 rounded-[20px] border border-ink/12 bg-shell px-5 py-5 transition-[border-color,background-color,transform] duration-200 ease-soft hover:border-gold/70 active:scale-[0.98]"
                >
                  <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-gold/15 text-gold-deep transition-colors duration-200 group-hover:bg-gold group-hover:text-bark">
                    <Icon size={24} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-[1.25rem] leading-tight text-ink">{projet}</span>
                    <span className="t-small mt-1 block text-ink/70">{sub}</span>
                  </span>
                  <ArrowIcon
                    size={18}
                    className="flex-none text-ink/50 transition-transform duration-200 ease-soft group-hover:translate-x-1 group-hover:text-gold-deep"
                  />
                </Link>
              </Reveal>
            ))}
          </ul>

          <p className="t-small mt-6 text-ink/70">
            Ou appelez directement :{' '}
            <a href={`tel:${alberto.tel}`} onClick={() => track(EVENTS.PHONE_CLICK, { source })} className={link}>
              {alberto.name} {alberto.number}
            </a>{' '}
            ·{' '}
            <a href={`tel:${matteo.tel}`} onClick={() => track(EVENTS.PHONE_CLICK, { source })} className={link}>
              {matteo.name} {matteo.number}
            </a>{' '}
            ·{' '}
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track(EVENTS.WHATSAPP_CLICK, { source })}
              className={link}
            >
              WhatsApp
            </a>
          </p>
        </div>
      </Container>
    </section>
  );
}
