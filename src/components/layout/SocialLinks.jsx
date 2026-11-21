import { BRAND } from '@/data/site';
import { EVENTS, track } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { FacebookIcon, InstagramIcon, TiktokIcon, YoutubeIcon } from '@/components/ui/BrandIcons';

/**
 * Lien vers un compte Chaudrel. Les glyphes viennent de `BrandIcons` - tracés
 * dans la charte, en `currentColor`, pour qu'ils prennent la teinte du contexte
 * au lieu d'importer leurs couleurs de marque.
 *
 * Emplacement voulu : pied de page et fenêtre de contact - là où on les
 * cherche. Pas dans la navigation : la barre garde une seule action (« Devis
 * gratuit ») et la fenêtre de contact porte toutes les coordonnées. Le rail
 * latéral qui les portait avant est supprimé.
 */
const NETWORKS = [
  { id: 'instagram', label: 'Instagram', url: BRAND.socials.instagram, Icon: InstagramIcon },
  { id: 'tiktok', label: 'TikTok', url: BRAND.socials.tiktok, Icon: TiktokIcon },
  { id: 'facebook', label: 'Facebook', url: BRAND.socials.facebook, Icon: FacebookIcon },
  { id: 'youtube', label: 'YouTube', url: BRAND.socials.youtube, Icon: YoutubeIcon },
];

export default function SocialLinks({ tone = 'dark', source = 'footer', size = 'md', className }) {
  const light = tone === 'light';
  const circle = cn(
    'grid place-items-center rounded-full transition-all duration-fast ease-soft',
    size === 'sm' ? 'h-9 w-9' : 'h-10 w-10',
    light
      ? 'border border-cream/20 text-cream/70 hover:border-cream/45 hover:bg-cream/10 hover:text-cream'
      : 'border border-ink/15 text-ink/60 hover:border-ink/30 hover:bg-ink/5 hover:text-ink',
    className
  );

  return (
    <ul className="flex items-center gap-2.5">
      {NETWORKS.map(({ id, label, url, Icon }) => (
        <li key={id}>
          {url && (
            <a
              href={url}
              aria-label={label}
              title={label}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track(EVENTS.SOCIAL_CLICK, { network: id, source })}
              className={circle}
            >
              <Icon width={17} height={17} />
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}