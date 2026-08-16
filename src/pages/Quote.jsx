import { useMemo, useState } from 'react';
import PageHero from '@/components/sections/PageHero';
import { Button, Container, Section } from '@/components/ui';
import Reveal from '@/lib/reveal';
import { METHOD } from '@/data/method';
import { BRAND, whatsappUrl } from '@/data/site';
import { EVENTS, track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

const PROJECT_TYPES = [
  'Rénovation complète',
  'Cuisine',
  'Salle de bain',
  'Appartement',
  'Maison',
  'Commerce',
  'Autre',
];

/**
 * Aucune fourchette de prix n'est proposée tant que Chaudrel ne les a pas
 * validées (voir docs/VERIFICATION.md). Le visiteur indique seulement s'il a
 * déjà un budget en tête.
 */
const BUDGET_OPTIONS = [
  { id: 'defined', label: 'J’ai un budget défini' },
  { id: 'range', label: 'J’ai un ordre d’idée' },
  { id: 'unknown', label: 'Je ne sais pas encore' },
];

const STEPS = ['Projet', 'Description', 'Budget', 'Lieu', 'Coordonnées'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+0-9][0-9\s./-]{7,}$/;

const EMPTY = {
  projectType: '',
  description: '',
  budget: '',
  budgetDetail: '',
  city: '',
  postalCode: '',
  name: '',
  phone: '',
  email: '',
  consent: false,
  company: '',
};

export default function Quote() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [started, setStarted] = useState(false);
  const [serverError, setServerError] = useState('');

  const set = (key) => (value) => {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    if (!started) {
      setStarted(true);
      track(EVENTS.QUOTE_START);
    }
  };

  const validate = (s) => {
    const e = {};
    if (s === 1 && !data.projectType) e.projectType = 'Sélectionnez un type de projet.';
    if (s === 2 && data.description.trim().length < 10) e.description = 'Quelques mots suffisent, mais il en faut quelques-uns.';
    if (s === 3 && !data.budget) e.budget = 'Sélectionnez une option.';
    if (s === 4 && !data.city.trim()) e.city = 'Indiquez la commune du chantier.';
    if (s === 5) {
      if (data.name.trim().length < 2) e.name = 'Indiquez votre nom.';
      if (!PHONE_RE.test(data.phone.trim())) e.phone = 'Numéro de téléphone invalide.';
      if (!EMAIL_RE.test(data.email.trim())) e.email = 'Adresse e-mail invalide.';
      if (!data.consent) e.consent = 'Votre accord est nécessaire pour vous recontacter.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validate(step)) return;
    track(EVENTS.QUOTE_STEP, { step });
    setStep((s) => Math.min(STEPS.length, s + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const back = () => {
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate(STEPS.length)) return;

    setStatus('loading');
    setServerError('');
    track(EVENTS.QUOTE_SUBMIT, { projectType: data.projectType });

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, sentAt: new Date().toISOString() }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Envoi impossible');
      }
      setStatus('success');
      track(EVENTS.QUOTE_SUCCESS, { projectType: data.projectType });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setStatus('error');
      setServerError(err.message);
      track(EVENTS.QUOTE_ERROR, { message: err.message });
    }
  };

  const progress = useMemo(() => step / STEPS.length, [step]);

  if (status === 'success') {
    return (
      <>
        <PageHero
          title="C’est noté. Merci."
          intro="Nous revenons vers vous pour convenir d’une visite et préparer votre devis."
          breadcrumb={[{ label: 'Accueil', to: '/' }, { label: 'Demander un devis' }]}
        />
        <Section tone="cream" className="pt-0 md:pt-0 lg:pt-0">
          <Container>
            <div className="grid gap-12 lg:grid-cols-12">
              <ol className="lg:col-span-7">
                <span className="t-label text-ink/65">La suite</span>
                {METHOD.slice(2, 5).map((s) => (
                  <li key={s.n} className="flex gap-8 border-b border-ink/12 py-6 first:border-t first:mt-5">
                    <span className="t-num text-2xl text-ink/40">{s.n}</span>
                    <div>
                      <h2 className="t-h3">{s.title}</h2>
                      <p className="t-small mt-1.5 text-ink/65">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="lg:col-span-4 lg:col-start-9">
                <p className="t-body text-ink/65">
                  En attendant, vous pouvez parcourir nos chantiers récents, ou nous écrire directement.
                </p>
                <div className="mt-7 flex flex-col gap-3">
                  <Button to="/realisations" variant="solid">
                    Voir les réalisations
                  </Button>
                  <Button
                    href={whatsappUrl('Bonjour Chaudrel, je viens de vous envoyer une demande de devis.')}
                    variant="outline"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track(EVENTS.WHATSAPP_CLICK, { source: 'quote_success' })}
                  >
                    WhatsApp
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      </>
    );
  }

  return (
    <>
      <PageHero
        title="Cinq questions, deux minutes."
        intro="Gratuit et sans engagement. Plus votre description est précise, plus notre réponse le sera."
        breadcrumb={[{ label: 'Accueil', to: '/' }, { label: 'Demander un devis' }]}
      />

      <Section tone="cream" className="pt-0 md:pt-0 lg:pt-0">
        <Container className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-7">
            {/* Progression */}
            <div>
              <div className="flex items-baseline justify-between">
                <span className="t-label text-ink/65">
                  {String(step).padStart(2, '0')} — {STEPS[step - 1]}
                </span>
                <span className="t-label text-ink/65">
                  {step} / {STEPS.length}
                </span>
              </div>
              <div
                className="mt-4 h-1 w-full overflow-hidden rounded-full bg-ink/[0.09]"
                role="progressbar"
                aria-valuenow={step}
                aria-valuemin={1}
                aria-valuemax={STEPS.length}
                aria-label="Progression du formulaire"
              >
                <div
                  className="h-full origin-left rounded-full bg-umber transition-transform duration-700 ease-soft"
                  style={{ transform: `scaleX(${progress})` }}
                />
              </div>
            </div>

            <form onSubmit={submit} noValidate className="mt-12">
              <div className="absolute left-[-9999px]" aria-hidden="true">
                <label htmlFor="company">Ne pas remplir</label>
                <input
                  id="company"
                  tabIndex={-1}
                  autoComplete="off"
                  value={data.company}
                  onChange={(e) => set('company')(e.target.value)}
                />
              </div>

              {step === 1 && (
                <Fieldset legend="Quel type de projet ?" error={errors.projectType}>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {PROJECT_TYPES.map((t) => (
                      <Choice
                        key={t}
                        name="projectType"
                        label={t}
                        checked={data.projectType === t}
                        onChange={() => set('projectType')(t)}
                      />
                    ))}
                  </div>
                </Fieldset>
              )}

              {step === 2 && (
                <Fieldset legend="Racontez-nous." error={errors.description}>
                  <label htmlFor="description" className="t-small block text-ink/65">
                    Surface, pièces concernées, état actuel, échéance souhaitée.
                  </label>
                  <textarea
                    id="description"
                    rows={7}
                    value={data.description}
                    onChange={(e) => set('description')(e.target.value)}
                    aria-invalid={Boolean(errors.description)}
                    placeholder="Ex. : appartement de 90 m² à Ixelles, cuisine et salle de bain à refaire, disponible à partir de septembre."
                    className="field mt-4"
                  />
                </Fieldset>
              )}

              {step === 3 && (
                <Fieldset legend="Avez-vous un budget en tête ?" error={errors.budget}>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {BUDGET_OPTIONS.map((b) => (
                      <Choice
                        key={b.id}
                        name="budget"
                        label={b.label}
                        checked={data.budget === b.id}
                        onChange={() => set('budget')(b.id)}
                      />
                    ))}
                  </div>
                  {(data.budget === 'defined' || data.budget === 'range') && (
                    <Field
                      id="budgetDetail"
                      label="Montant envisagé (facultatif)"
                      value={data.budgetDetail}
                      onChange={set('budgetDetail')}
                      className="mt-8"
                    />
                  )}
                </Fieldset>
              )}

              {step === 4 && (
                <Fieldset legend="Où se situe le chantier ?" error={errors.city}>
                  <div className="grid gap-8 sm:grid-cols-[2fr_1fr]">
                    <Field id="city" label="Commune" value={data.city} onChange={set('city')} error={errors.city} autoComplete="address-level2" />
                    <Field
                      id="postalCode"
                      label="Code postal"
                      value={data.postalCode}
                      onChange={set('postalCode')}
                      autoComplete="postal-code"
                      inputMode="numeric"
                    />
                  </div>
                  <p className="t-small mt-6 text-ink/65">Nous intervenons partout en Belgique.</p>
                </Fieldset>
              )}

              {step === 5 && (
                <Fieldset legend="Comment vous joindre ?">
                  <div className="space-y-8">
                    <Field id="name" label="Nom" value={data.name} onChange={set('name')} error={errors.name} autoComplete="name" />
                    <Field id="phone" label="Téléphone" type="tel" value={data.phone} onChange={set('phone')} error={errors.phone} autoComplete="tel" />
                    <Field id="email" label="E-mail" type="email" value={data.email} onChange={set('email')} error={errors.email} autoComplete="email" />
                  </div>

                  <label className="t-small mt-8 flex cursor-pointer items-start gap-3 text-ink/65">
                    <input
                      type="checkbox"
                      checked={data.consent}
                      onChange={(e) => set('consent')(e.target.checked)}
                      aria-invalid={Boolean(errors.consent)}
                      className="mt-1 h-4 w-4 flex-shrink-0 rounded-xs accent-umber"
                    />
                    <span>
                      J’accepte que Chaudrel utilise ces informations pour me recontacter.{' '}
                      <a href="/legal/politique-mentions" className="link-line text-ink">
                        Politique de confidentialité
                      </a>
                    </span>
                  </label>
                  {errors.consent && <FieldError>{errors.consent}</FieldError>}
                </Fieldset>
              )}

              <div className="mt-12 flex flex-wrap items-center gap-4">
                {step > 1 && (
                  <Button variant="outline" onClick={back} disabled={status === 'loading'}>
                    Retour
                  </Button>
                )}

                {step < STEPS.length ? (
                  <Button variant="solid" onClick={next}>
                    Continuer
                  </Button>
                ) : (
                  <Button type="submit" variant="solid" size="lg" disabled={status === 'loading'}>
                    {status === 'loading' ? 'Envoi…' : 'Envoyer ma demande'}
                  </Button>
                )}
              </div>

              <p aria-live="polite" className="sr-only">
                {status === 'loading' ? 'Envoi de votre demande en cours' : ''}
              </p>

              {status === 'error' && (
                <div role="alert" className="mt-8 rounded-md bg-error/[0.07] px-5 py-4">
                  <p className="t-body text-ink">Votre demande n’a pas pu être envoyée.</p>
                  {serverError && <p className="t-small mt-1 text-ink/65">{serverError}</p>}
                  <p className="t-small mt-3 text-ink/65">
                    Appelez-nous au{' '}
                    <a href={`tel:${BRAND.phones[0].tel}`} className="link-line text-ink">
                      {BRAND.phones[0].number}
                    </a>{' '}
                    ou écrivez sur{' '}
                    <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="link-line text-ink">
                      WhatsApp
                    </a>
                    .
                  </p>
                </div>
              )}
            </form>
          </div>

          {/* Réassurance */}
          <aside className="lg:col-span-4 lg:col-start-9">
            <span className="t-label text-ink/65">Pourquoi ces questions</span>
            <ul className="mt-6 space-y-5 border-t border-ink/12 pt-6">
              {[
                'Elles nous évitent trois allers-retours avant la visite.',
                'Le devis est gratuit et sans engagement.',
                'Vos données servent uniquement à répondre à votre demande.',
              ].map((t) => (
                <li key={t} className="t-small text-ink/65">
                  {t}
                </li>
              ))}
            </ul>

            <div className="mt-10 border-t border-ink/12 pt-6">
              <p className="t-small text-ink/65">Vous préférez parler ?</p>
              <ul className="mt-3 space-y-2">
                {BRAND.phones.map((p) => (
                  <li key={p.tel}>
                    <a
                      href={`tel:${p.tel}`}
                      onClick={() => track(EVENTS.PHONE_CLICK, { source: 'quote_sidebar' })}
                      className="link-line t-body text-ink"
                    >
                      {p.number}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={whatsappUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track(EVENTS.WHATSAPP_CLICK, { source: 'quote_sidebar' })}
                    className="link-line t-body text-ink"
                  >
                    WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </aside>
        </Container>
      </Section>
    </>
  );
}

/* ---------- Champs ---------- */

function Fieldset({ legend, error, children }) {
  return (
    <Reveal as="fieldset" from="fade" className="border-0 p-0">
      <legend className="t-h2 mb-8">{legend}</legend>
      {children}
      {error && <FieldError>{error}</FieldError>}
    </Reveal>
  );
}

function FieldError({ children }) {
  return (
    <p role="alert" className="t-small mt-4 text-error">
      {children}
    </p>
  );
}

function Choice({ name, label, checked, onChange }) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-4 rounded-md border px-5 py-4 transition-all duration-300 ease-soft',
        checked
          ? 'border-umber bg-umber/[0.06] text-ink shadow-soft'
          : 'border-ink/[0.12] bg-shell text-ink/70 hover:border-ink/25 hover:text-ink'
      )}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
      <span
        aria-hidden="true"
        className={cn(
          'grid h-[18px] w-[18px] flex-shrink-0 place-items-center rounded-full border transition-colors duration-300',
          checked ? 'border-umber bg-umber' : 'border-ink/25 bg-shell'
        )}
      >
        {checked && <span className="block h-1.5 w-1.5 rounded-full bg-cream" />}
      </span>
      <span className="t-body">{label}</span>
    </label>
  );
}

function Field({ id, label, value, onChange, error, type = 'text', className, ...rest }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="t-label text-ink/65">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'field mt-2',
          error && 'field-error'
        )}
        {...rest}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="t-small mt-2 text-error">
          {error}
        </p>
      )}
    </div>
  );
}
