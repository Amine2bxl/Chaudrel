/**
 * Marques et gestes, dessinés une fois.
 *
 * Les logos de réseaux ne sont pas dans notre bibliothèque d'icônes : ils sont
 * tracés ici, tous sur une grille de 16, tous en `currentColor`, pour qu'ils
 * prennent la couleur du contexte au lieu d'importer leurs teintes de marque —
 * un mur de logos multicolores casserait la palette de la page.
 */

const box = { viewBox: '0 0 16 16', 'aria-hidden': 'true', focusable: 'false' };

export function InstagramIcon(props) {
  return (
    <svg {...box} {...props} fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="1.8" y="1.8" width="12.4" height="12.4" rx="3.6" />
      <circle cx="8" cy="8" r="3.1" />
      <circle cx="11.9" cy="4.1" r="0.85" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon(props) {
  return (
    <svg {...box} {...props} fill="currentColor">
      <path d="M16 8a8 8 0 1 0-9.25 7.9V10.3H4.72V8h2.03V6.24c0-2 1.19-3.11 3.02-3.11.87 0 1.79.16 1.79.16v1.97h-1.01c-.99 0-1.3.62-1.3 1.25V8h2.22l-.36 2.3H9.25v5.6A8 8 0 0 0 16 8Z" />
    </svg>
  );
}

export function TiktokIcon(props) {
  return (
    <svg {...box} {...props} fill="currentColor">
      <path d="M11.3 1.3h-2.2v9.2a1.9 1.9 0 1 1-1.4-1.83V6.4a4.1 4.1 0 1 0 3.6 4.07V5.86a4.6 4.6 0 0 0 2.7.87V4.5a2.5 2.5 0 0 1-2.7-2.5v-.7Z" />
    </svg>
  );
}

export function YoutubeIcon(props) {
  return (
    <svg {...box} {...props} fill="currentColor">
      <path d="M15.4 4.9a1.96 1.96 0 0 0-1.38-1.39C12.8 3.18 8 3.18 8 3.18s-4.8 0-6.02.33A1.96 1.96 0 0 0 .6 4.9C.27 6.12.27 8 .27 8s0 1.88.33 3.1a1.96 1.96 0 0 0 1.38 1.39c1.22.33 6.02.33 6.02.33s4.8 0 6.02-.33a1.96 1.96 0 0 0 1.38-1.39C15.73 9.88 15.73 8 15.73 8s0-1.88-.33-3.1ZM6.55 10.4V5.6L10.4 8l-3.85 2.4Z" />
    </svg>
  );
}

export function WhatsappIcon(props) {
  return (
    <svg {...box} {...props} fill="currentColor">
      <path d="M8 0a8 8 0 0 0-6.9 12L0 16l4.1-1.1A8 8 0 1 0 8 0Zm0 14.6a6.6 6.6 0 0 1-3.4-.9l-.2-.2-2.5.7.7-2.4-.2-.3A6.6 6.6 0 1 1 8 14.6Zm3.6-4.9c-.2-.1-1.2-.6-1.3-.6-.2-.1-.3-.1-.4.1l-.6.7c-.1.1-.2.1-.4 0a5.4 5.4 0 0 1-2.6-2.3c-.2-.3.2-.3.5-1 0-.1 0-.2 0-.3l-.6-1.3c-.1-.4-.3-.3-.4-.3h-.4a.7.7 0 0 0-.5.3c-.2.2-.7.7-.7 1.7s.7 2 .8 2.1a7.6 7.6 0 0 0 3 2.6c1.1.4 1.5.5 2 .4.4 0 1.2-.5 1.3-.9.2-.5.2-.9.1-1 0-.1-.1-.1-.3-.2Z" />
    </svg>
  );
}

export function PhoneIcon(props) {
  return (
    <svg {...box} {...props} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path
        d="M5.2 2.5 6.6 5.4 5.1 6.9a8 8 0 0 0 4 4l1.5-1.5 2.9 1.4v2.3c0 .6-.5 1-1.1.9A12.6 12.6 0 0 1 2 3.6c-.1-.6.3-1.1.9-1.1h2.3Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MailIcon(props) {
  return (
    <svg {...box} {...props} fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="1.6" y="3.2" width="12.8" height="9.6" rx="1.8" />
      <path d="m2.4 4.6 5.6 4 5.6-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function QuoteIcon(props) {
  return (
    <svg {...box} {...props} fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M4 1.8h5.2L13 5.6v8.6H4Z" strokeLinejoin="round" />
      <path d="M9 1.8v4h4M6.3 8.6h4.2M6.3 11.2h4.2" strokeLinecap="round" />
    </svg>
  );
}

export function GalleryIcon(props) {
  return (
    <svg {...box} {...props} fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="1.8" y="2.8" width="12.4" height="10.4" rx="1.8" />
      <path d="m2.6 11 3.2-3.2 2.4 2.4 2.2-2.2 3 3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="5.9" cy="6.1" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function PinIcon(props) {
  return (
    <svg {...box} {...props} fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M8 14.4s4.7-4.3 4.7-8A4.7 4.7 0 0 0 3.3 6.4c0 3.7 4.7 8 4.7 8Z" strokeLinejoin="round" />
      <circle cx="8" cy="6.4" r="1.7" />
    </svg>
  );
}

export function ToolsIcon(props) {
  return (
    <svg {...box} {...props} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.2 2.4a3.1 3.1 0 0 0 3.9 4l-6 6a1.7 1.7 0 0 1-2.4-2.4l6-6Z" />
      <path d="M4.6 2.3 6.9 4.6 5.5 6 3.2 3.7a1.6 1.6 0 0 1 1.4-1.4Z" />
      <path d="m11.4 9.8 2.5 2.5a1.5 1.5 0 0 1-2.1 2.1L9.3 12" />
    </svg>
  );
}

export function CheckIcon(props) {
  return (
    <svg {...box} {...props} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3.2 8.4 3.3 3.3 6.3-7.4" />
    </svg>
  );
}

/** Table des symboles utilisables par clé — voir `icon` dans src/data/method.js. */
export const ICONS = {
  pin: PinIcon,
  quote: QuoteIcon,
  tools: ToolsIcon,
  check: CheckIcon,
  gallery: GalleryIcon,
  phone: PhoneIcon,
  mail: MailIcon,
  whatsapp: WhatsappIcon,
};
