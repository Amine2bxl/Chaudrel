import { Link, useLocation } from 'react-router-dom';
import { BRAND, EMAIL_DISPLAY, NAV } from '@/data/site';
import { STORY, stepForPath } from '@/data/story';
import { EVENTS, track } from '@/lib/analytics';
import { useContactDialog } from '@/lib/contactDialog';
import SocialLinks from '@/components/layout/SocialLinks';
import { cn } from '@/lib/utils';

/**
 * Pied de page - la dernière scène.
 *
 * Il referme le site comme l'accueil l'ouvre : le même mot-symbole
 * monumental, posé cette fois sur le vert de la marque. Au-dessus, le fil de
 * l'histoire (six verbes, celui de la page courante allumé), puis ce qu'on
 * vient chercher en bas d'un site : où aller, comment joindre, qui édite.
 *
 * Il prolonge la bande de conversion (même fond) : les deux forment un seul
 * bloc sombre, pas deux pieds de page empilés.
 *
 * pb mobile = hauteur de la barre d'action fixe, sinon elle recouvre la
 * dernière ligne.
 */
export default function Footer() {
  const year = new Date().getFullYear();
  const { openDialog } = useContactDialog();
  const { pathname } = useLocation();
  const here = stepForPath(pathname);

  const link = 'link-line tap t-small text-cream/75 transition-colors duration-fast hover:text-cream';
  const head = 't-label text-cream/65';

  return (
    <footer className="site-footer on-dark overflow-hidden bg-bark text-cream">
      <div className="mx-auto w-full max-w-page px-5 pb-[calc(66px+1.25rem)] pt-14 sm:px-8 lg:px-12 lg:pb-8 lg:pt-20">
        {/* ---------- Le fil de l'histoire ---------- */}
        <ol className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-cream/15 pb-6" aria-label="Le fil du site">
          {STORY.map((s) => {
            const on = pathname === '/' || here?.id === s.id;
            return (
              <li key={s.id} className={cn('t-label flex items-center gap-2.5 transition-colors', on ? 'text-cream' : 'text-cream/60')} aria-current={here?.id === s.id ? 'step' : undefined}>
                <span className={cn('t-num tracking-normal', on ? 'text-gold-light' : 'text-cream/60')}>{s.n}</span>
                {s.verb}
              </li>
            );
          })}
        </ol>

        {/* ---------- Colonnes ---------- */}
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:py-16">
          <div className="lg:col-span-5">
            <p className="max-w-[16ch] font-display text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.15] text-cream">{BRAND.tagline}</p>
            <p className="t-small mt-4 max-w-[38ch] text-cream/70">
              {BRAND.legalName}, entreprise de rénovation et de construction. {BRAND.zoneLong}.
            </p>
          </div>

          <nav className="lg:col-span-2" aria-label="Pied de page">
            <p className={head}>Le site</p>
            <ul className="mt-4 space-y-2.5">
              {NAV.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className={link}>
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/faq" className={link}>
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/devis" className={link} onClick={() => track(EVENTS.QUOTE_CTA, { source: 'footer' })}>
                  Demander un devis
                </Link>
              </li>
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <p className={head}>Nous joindre</p>
            <ul className="mt-4 space-y-2.5">
              {BRAND.phones.map((p) => (
                <li key={p.tel}>
                  <a href={`tel:${p.tel}`} className={cn(link, 'tabular-nums')} onClick={() => track(EVENTS.PHONE_CLICK, { source: 'footer' })}>
                    {p.number} <span className="text-cream/65">· {p.name}</span>
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${BRAND.email}`} className={link} onClick={() => track(EVENTS.EMAIL_CLICK, { source: 'footer' })}>
                  {EMAIL_DISPLAY}
                </a>
              </li>
              <li>
                <button type="button" onClick={() => openDialog('footer')} className={link}>
                  Toutes les coordonnées
                </button>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className={head}>Adresse</p>
            <address className="t-small mt-4 not-italic leading-relaxed text-cream/75">
              {BRAND.address.street}
              <br />
              {BRAND.address.postalCode} {BRAND.address.city}
              <br />
              TVA {BRAND.vat}
            </address>
          </div>
        </div>

        {/* ---------- Mot-symbole ---------- */}
        <p className="footer-wordmark" aria-hidden="true">
          Chaudrel<span>.</span>
        </p>

        {/* ---------- Ligne légale ---------- */}
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-cream/15 pt-6">
          <p className="t-small text-cream/65">
            © {year} {BRAND.legalName}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link to="/liens" className={link}>
              Tous nos liens
            </Link>
            <Link to="/legal/politique-mentions" className={link}>
              Mentions légales
            </Link>
          </div>
          <SocialLinks tone="light" source="footer" />
        </div>
      </div>
    </footer>
  );
}
