import { Link } from 'react-router-dom';
import { BRAND, EMAIL_DISPLAY, LOGO, whatsappUrl } from '@/data/site';
import { EVENTS, track } from '@/lib/analytics';
import Reveal from '@/lib/reveal';
import { cn } from '@/lib/utils';
import {
  FacebookIcon,
  GalleryIcon,
  InstagramIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  QuoteIcon,
  TiktokIcon,
  WhatsappIcon,
  YoutubeIcon,
} from '@/components/ui/BrandIcons';

/**
 * Page de liens — la destination des bios Instagram, TikTok et Facebook.
 *
 * Elle est pensée pour un pouce, sur un téléphone, en trois secondes : une
 * colonne étroite, des rangées hautes, aucune décision à prendre au-delà du
 * choix de la ligne. Elle garde la barre de navigation pour que le visiteur
 * puisse basculer vers le site, mais rien d'autre ne la parasite.
 *
 * L'ordre suit l'intention : d'abord ce qui rapporte un chantier (devis,
 * appel, WhatsApp), ensuite ce qui rassure (réalisations, services), enfin les
 * réseaux. Un lien de bio n'a pas à être exhaustif, il a à être trié.
 *
 * Aucune donnée nouvelle : tout vient de `BRAND`.
 */

/* Les réseaux, dans l'ordre où Chaudrel les alimente. Une clé absente de
   BRAND.socials disparaît de la barre au lieu d'y laisser un trou. */
const SOCIALS = [
  { key: 'instagram', label: 'Instagram', icon: InstagramIcon },
  { key: 'tiktok', label: 'TikTok', icon: TiktokIcon },
  { key: 'facebook', label: 'Facebook', icon: FacebookIcon },
  { key: 'youtube', label: 'YouTube', icon: YoutubeIcon },
];

/* Une rangée : icône dans sa pastille, libellé, description, chevron. */
function Row({ to, href, icon: Icon, label, hint, onClick, primary = false }) {
  const inner = (
    <>
      <span
        aria-hidden="true"
        className={cn(
          'grid h-11 w-11 flex-none place-items-center rounded-full transition-colors duration-fast',
          primary ? 'bg-cream/20 text-cream' : 'bg-ink/[0.06] text-ink group-hover:bg-ink/10'
        )}
      >
        <Icon width="17" height="17" />
      </span>

      <span className="min-w-0 flex-1">
        <span className={cn('block t-label', primary ? 'text-cream' : 'text-ink')}>{label}</span>
        {hint && (
          <span className={cn('mt-1 block t-small', primary ? 'text-cream/90' : 'text-ink/55')}>{hint}</span>
        )}
      </span>

      <svg
        width="13"
        height="13"
        viewBox="0 0 16 16"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className={cn(
          'flex-none transition-transform duration-fast ease-soft group-hover:translate-x-0.5',
          primary ? 'text-cream/70' : 'text-ink/35'
        )}
      >
        <path d="m6 2 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </>
  );

  const classes = cn(
    'group flex w-full items-center gap-4 rounded-lg px-4 py-4 text-left transition-all duration-fast ease-soft active:translate-y-px sm:px-5',
    primary
      ? 'bg-gold-deep text-cream shadow-soft hover:bg-gold-hover hover:shadow-lift'
      : 'border border-ink/[0.09] bg-shell hover:border-ink/20 hover:shadow-soft'
  );

  if (to) {
    return (
      <Link to={to} onClick={onClick} className={classes}>
        {inner}
      </Link>
    );
  }
  return (
    <a
      href={href}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      onClick={onClick}
      className={classes}
    >
      {inner}
    </a>
  );
}

/** Intertitre de groupe : un mot, un filet. */
function GroupLabel({ children }) {
  return (
    <div className="mb-4 mt-9 flex items-center gap-4 first:mt-0">
      <span className="t-label flex-none text-ink/65">{children}</span>
      <span aria-hidden="true" className="h-px flex-1 bg-ink/10" />
    </div>
  );
}

export default function Links() {
  const t = (event, extra) => () => track(event, { source: 'links', ...extra });

  return (
    <div className="relative isolate overflow-hidden bg-cream">
      {/* Halo derrière l'en-tête : sans lui, une colonne de cartes blanches sur
          un aplat crème n'a aucun point de départ — le regard entre par le
          milieu. Un seul dégradé, très bas en opacité ; il ne se voit pas, il
          se sent. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[26rem]"
        style={{
          background:
            'radial-gradient(60% 100% at 50% 0%, rgb(var(--c-gold-rgb) / 0.10) 0%, rgb(var(--c-gold-rgb) / 0) 70%)',
        }}
      />
      {/* pt = hauteur de la barre flottante ; pb = barre d'action mobile. */}
      <div className="mx-auto w-full max-w-lg px-5 pb-[calc(66px+3rem)] pt-28 sm:px-6 lg:pb-24 lg:pt-36">
        <Reveal className="text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center overflow-hidden rounded-logo bg-shell shadow-lift ring-1 ring-ink/[0.06]">
            <img src={LOGO} alt="" aria-hidden="true" width="64" height="64" className="h-full w-full object-cover" />
          </span>
          <h1 className="mt-5 font-wordmark text-[22px] uppercase leading-none tracking-[0.2em] text-ink">
            {BRAND.name}
          </h1>
          <p className="t-small mt-3 text-ink/60">
            Entreprise de rénovation · {BRAND.zoneLong}
          </p>
        </Reveal>

        <Reveal delay={100} className="mt-10">
          <GroupLabel>Votre projet</GroupLabel>
          <div className="space-y-2.5">
            <Row
              to="/devis"
              icon={QuoteIcon}
              label="Devis gratuit"
              hint={`Sans engagement · ${BRAND.promises.responseTime}`}
              onClick={t(EVENTS.QUOTE_CTA)}
              primary
            />
            <Row
              href={whatsappUrl()}
              icon={WhatsappIcon}
              label="WhatsApp"
              hint="Écrivez-nous, photos bienvenues"
              onClick={t(EVENTS.WHATSAPP_CLICK)}
            />
            <Row
              href={`tel:${BRAND.phones[0].tel}`}
              icon={PhoneIcon}
              label={`Appeler ${BRAND.phones[0].name}`}
              hint={BRAND.phones[0].number}
              onClick={t(EVENTS.PHONE_CLICK)}
            />
            <Row
              href={`mailto:${BRAND.email}`}
              icon={MailIcon}
              label="Nous écrire"
              hint={EMAIL_DISPLAY}
              onClick={t(EVENTS.EMAIL_CLICK)}
            />
          </div>

          <GroupLabel>Le travail</GroupLabel>
          <div className="space-y-2.5">
            <Row to="/realisations" icon={GalleryIcon} label="Nos réalisations" hint="Chantiers livrés, photos réelles" />
            <Row to="/services" icon={PinIcon} label="Nos métiers" hint="Intérieur, extérieur, toiture, façade, piscine" />
          </div>

          <GroupLabel>Nous suivre</GroupLabel>
          {/* Une barre d'icônes, pas quatre rangées. Une rangée pleine largeur
              promet une phrase ; « Instagram » n'en est pas une, et quatre
              d'affilée diluaient les six lignes qui, elles, amènent un
              chantier. Le nom reste dans le libellé accessible. */}
          <ul className="flex flex-wrap justify-center gap-2.5">
            {SOCIALS.map(({ key, label, icon: Icon }) =>
              BRAND.socials[key] ? (
                <li key={key}>
                  <a
                    href={BRAND.socials[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    onClick={t(EVENTS.SOCIAL_CLICK, { network: key })}
                    className="grid h-[3.25rem] w-[3.25rem] place-items-center rounded-md border border-ink/[0.09] bg-shell text-ink/70 transition-all duration-fast ease-soft hover:border-ink/20 hover:text-ink hover:shadow-soft active:translate-y-px"
                  >
                    <Icon width="19" height="19" />
                  </a>
                </li>
              ) : null
            )}
          </ul>
        </Reveal>

        <Reveal delay={200} className="mt-10 text-center">
          <address className="t-small not-italic text-ink/65">
            {BRAND.address.street}, {BRAND.address.postalCode} {BRAND.address.city}
            <br />
            TVA {BRAND.vat}
          </address>
          {/* Cible de 44 px : sur une page qui ne sert qu'à toucher des liens,
              un lien texte de 15 px de haut est le seul endroit où le pouce
              rate. Le trait reste collé au mot, la zone déborde autour. */}
          <Link
            to="/"
            className="link-line t-label mt-3 inline-flex min-h-[44px] items-center px-2 text-ink"
          >
            Voir le site
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
