import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/ui';
import Reveal from '@/lib/reveal';
import { BRAND, whatsappUrl } from '@/data/site';
import { EVENTS, track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

/**
 * Demande de devis courte, posée directement dans la page.
 *
 * Le formulaire long (/devis) reste la référence : il qualifie mieux. Mais
 * obliger un visiteur à changer de page pour donner son numéro fait perdre des
 * demandes. Ici, cinq champs, le minimum que l'API accepte pour produire un
 * lead exploitable, et un lien vers le formulaire détaillé pour ceux qui
 * veulent tout expliquer.
 *
 * Les garanties listées à gauche ne sont pas des promesses inventées : elles
 * reprennent les étapes 3 et 4 de la méthode (visite sur place, devis poste par
 * poste). Aucun délai de réponse n'est annoncé tant que Chaudrel n'en a pas
 * confirmé un (voir docs/VERIFICATION.md).
 */

const TYPES = ['Rénovation complète', 'Cuisine', 'Salle de bain', 'Appartement', 'Maison', 'Autre'];

const PROMISES = [
  'Visite sur place avant chiffrage',
  'Devis détaillé, poste par poste',
  'Gratuit et sans engagement',
  'Un seul interlocuteur du début à la fin',
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+0-9][0-9\s./-]{7,}$/;

const EMPTY = {
  projectType: '',
  description: '',
  city: '',
  name: '',
  phone: '',
  email: '',
  consent: false,
  company: '',
};

function Field({ id, label, type = 'text', value, onChange, error, ...rest }) {
  return (
    <div>
      <label htmlFor={id} className="t-label block text-cream/65">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          'field field-dark mt-2',
          error && 'field-error'
        )}
        {...rest}
      />
      {error && (
        <p id={`${id}-error`} className="t-small mt-2 text-umber-light">
          {error}
        </p>
      )}
    </div>
  );
}

export default function QuickQuote({ source = 'home' }) {
  const [data, setData] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [serverError, setServerError] = useState('');
  const [started, setStarted] = useState(false);

  const set = (key) => (value) => {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    if (!started) {
      setStarted(true);
      track(EVENTS.QUOTE_START, { source });
    }
  };

  const validate = () => {
    const e = {};
    if (!data.projectType) e.projectType = 'Sélectionnez un type de projet.';
    if (data.description.trim().length < 10) e.description = 'Décrivez le projet en quelques mots.';
    if (data.name.trim().length < 2) e.name = 'Indiquez votre nom.';
    if (!PHONE_RE.test(data.phone.trim())) e.phone = 'Numéro de téléphone invalide.';
    if (!EMAIL_RE.test(data.email.trim())) e.email = 'Adresse e-mail invalide.';
    if (!data.consent) e.consent = 'Votre accord est nécessaire pour vous recontacter.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setStatus('loading');
    setServerError('');
    track(EVENTS.QUOTE_SUBMIT, { projectType: data.projectType, source });

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, budget: 'Non précisé', sentAt: new Date().toISOString() }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Envoi impossible');
      }
      setStatus('success');
      track(EVENTS.QUOTE_SUCCESS, { projectType: data.projectType, source });
    } catch (err) {
      setStatus('error');
      setServerError(err.message);
      track(EVENTS.QUOTE_ERROR, { message: err.message, source });
    }
  };

  return (
    <section id="devis-rapide" className="bg-bark py-section text-cream">
      <Container className="lg:grid lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <h2 className="t-h2 max-w-[16ch] text-balance">Dites-nous ce que vous voulez rénover.</h2>
          <p className="t-body measure mt-5 text-cream/65">
            Cinq champs suffisent pour lancer la discussion. Nous revenons vers vous, puis nous convenons d’une visite.
          </p>

          <ul className="mt-10 space-y-3 border-t border-cream/15 pt-8">
            {PROMISES.map((p) => (
              <li key={p} className="t-small flex gap-3 text-cream/70">
                <span className="mt-[9px] h-px w-4 flex-none bg-umber-light" aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>

          <p className="t-small mt-8 text-cream/65">
            Vous préférez parler ?{' '}
            <a
              href={`tel:${BRAND.phones[0].tel}`}
              onClick={() => track(EVENTS.PHONE_CLICK, { source: 'quick_quote' })}
              className="link-line text-cream"
            >
              {BRAND.phones[0].number}
            </a>{' '}
            ou{' '}
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track(EVENTS.WHATSAPP_CLICK, { source: 'quick_quote' })}
              className="link-line text-cream"
            >
              WhatsApp
            </a>
            .
          </p>
        </Reveal>

        <Reveal delay={120} className="mt-12 lg:col-span-7 lg:mt-0">
          {status === 'success' ? (
            <div className="rounded-lg border border-cream/15 bg-cream/[0.04] p-8 lg:p-10">
              <h3 className="t-h3">Demande reçue.</h3>
              <p className="t-body measure mt-4 text-cream/70">
                Nous revenons vers vous pour convenir d’une visite. Si votre projet est urgent, appelez-nous
                directement au {BRAND.phones[0].number}.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="space-y-8">
              <fieldset>
                <legend className="t-label text-cream/65">Type de projet</legend>
                <div className="mt-4 flex flex-wrap gap-2">
                  {TYPES.map((t) => {
                    const active = data.projectType === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        aria-pressed={active}
                        onClick={() => set('projectType')(t)}
                        className={cn(
                          't-label rounded-full border px-4 py-3 transition-all duration-200 ease-soft active:translate-y-px',
                          active
                            ? 'border-cream bg-cream text-ink shadow-soft'
                            : 'border-cream/25 text-cream/70 hover:border-cream/60 hover:bg-cream/10 hover:text-cream'
                        )}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
                {errors.projectType && (
                  <p className="t-small mt-3 text-umber-light">{errors.projectType}</p>
                )}
              </fieldset>

              <div>
                <label htmlFor="qq-description" className="t-label block text-cream/65">
                  Votre projet
                </label>
                <textarea
                  id="qq-description"
                  rows={3}
                  value={data.description}
                  onChange={(e) => set('description')(e.target.value)}
                  aria-invalid={errors.description ? 'true' : undefined}
                  placeholder="Ex. : refaire la salle de bain d’un appartement des années 60."
                  className={cn(
                    'field field-dark mt-2 resize-y',
                    errors.description && 'field-error'
                  )}
                />
                {errors.description && <p className="t-small mt-2 text-umber-light">{errors.description}</p>}
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                <Field id="qq-name" label="Nom" value={data.name} onChange={set('name')} error={errors.name} autoComplete="name" />
                <Field
                  id="qq-phone"
                  label="Téléphone"
                  type="tel"
                  value={data.phone}
                  onChange={set('phone')}
                  error={errors.phone}
                  autoComplete="tel"
                />
                <Field
                  id="qq-email"
                  label="E-mail"
                  type="email"
                  value={data.email}
                  onChange={set('email')}
                  error={errors.email}
                  autoComplete="email"
                />
                <Field
                  id="qq-city"
                  label="Commune (facultatif)"
                  value={data.city}
                  onChange={set('city')}
                  autoComplete="address-level2"
                />
              </div>

              {/* Piège à robots : invisible, jamais rempli par un humain. */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="qq-company">Société</label>
                <input id="qq-company" tabIndex={-1} autoComplete="off" value={data.company} onChange={(e) => set('company')(e.target.value)} />
              </div>

              <div>
                <label htmlFor="qq-consent" className="t-small flex gap-3 text-cream/70">
                  <input
                    id="qq-consent"
                    type="checkbox"
                    checked={data.consent}
                    onChange={(e) => set('consent')(e.target.checked)}
                    className="mt-1 h-4 w-4 flex-shrink-0 rounded-xs accent-umber"
                  />
                  <span>
                    J’accepte d’être recontacté au sujet de ma demande.{' '}
                    <Link to="/legal/politique-mentions" className="link-line text-cream">
                      Confidentialité
                    </Link>
                  </span>
                </label>
                {errors.consent && <p className="t-small mt-2 text-umber-light">{errors.consent}</p>}
              </div>

              {status === 'error' && (
                <p className="t-small rounded-md bg-error-light/[0.12] px-4 py-3 text-error-light" role="alert">
                  {serverError} Appelez-nous au {BRAND.phones[0].number} ou écrivez sur WhatsApp.
                </p>
              )}

              <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="t-label inline-flex items-center justify-center rounded-full bg-cream px-9 py-[1.15rem] font-semibold text-ink shadow-soft transition-all duration-300 ease-soft hover:bg-shell hover:shadow-lift active:translate-y-px disabled:opacity-60"
                >
                  {status === 'loading' ? 'Envoi…' : 'Envoyer la demande'}
                </button>
                <Link to="/devis" className="link-line t-small text-cream/70">
                  Formulaire détaillé
                </Link>
              </div>
            </form>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
