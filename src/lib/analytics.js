/**
 * Tracking des actions commerciales.
 * Sans outil configuré, `track` est un no-op silencieux : aucun script tiers,
 * aucun cookie, rien à consentir. Brancher GA4 / Plausible plus tard revient à
 * charger le script - les événements ci-dessous partiront automatiquement.
 */

export const EVENTS = {
  QUOTE_CTA: 'quote_cta_click',
  QUOTE_START: 'quote_form_start',
  QUOTE_STEP: 'quote_form_step',
  QUOTE_SUBMIT: 'quote_form_submit',
  QUOTE_SUCCESS: 'quote_form_success',
  QUOTE_ERROR: 'quote_form_error',
  PHONE_CLICK: 'phone_click',
  WHATSAPP_CLICK: 'whatsapp_click',
  EMAIL_CLICK: 'email_click',
  SOCIAL_CLICK: 'social_click',
  PROJECT_VIEW: 'project_view',
  SERVICE_VIEW: 'service_view',
};

export function track(event, params = {}) {
  if (typeof window === 'undefined') return;
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', event, params);
    }
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event, ...params });
    }
    if (typeof window.plausible === 'function') {
      window.plausible(event, { props: params });
    }
  } catch {
    /* le tracking ne doit jamais casser une interaction */
  }
}
