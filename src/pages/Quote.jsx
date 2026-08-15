import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Loader2, MessageCircle, Phone } from 'lucide-react';
import PageHero from '@/components/sections/PageHero';
import { Button, Container, Section } from '@/components/ui';
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
 * Aucune fourchette de prix n'est affichée tant que Chaudrel ne les a pas
 * validées (voir VERIFICATION.md). Le visiteur indique seulement s'il a déjà
 * un budget en tête.
 */
const BUDGET_OPTIONS = [
  { id: 'defined', label: "J'ai un budget en tête", hint: 'Vous pourrez le préciser ci-dessous' },
  { id: 'range', label: "J'ai une idée approximative", hint: 'À affiner ensemble lors de la visite' },
  { id: 'unknown', label: 'Je ne sais pas encore', hint: 'Nous vous orientons lors de la visite' },
];

const STEPS = [
  { id: 1, label: 'Projet' },
  { id: 2, label: 'Description' },
  { id: 3, label: 'Budget' },
  { id: 4, label: 'Localisation' },
  { id: 5, label: 'Coordonnées' },
];

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
  company: '', // honeypot
};

export default function Quote() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
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
    if (s === 2 && data.description.trim().length < 10)
      e.description = 'Décrivez votre projet en quelques mots (10 caractères minimum).';
    if (s === 3 && !data.budget) e.budget = 'Sélectionnez une option.';
    if (s === 4 && !data.city.trim()) e.city = 'Indiquez la commune du chantier.';
    if (s === 5) {
      if (data.name.trim().length < 2) e.name = 'Indiquez votre nom.';
      if (!PHONE_RE.test(data.phone.trim())) e.phone = 'Indiquez un numéro de téléphone valide.';
      if (!EMAIL_RE.test(data.email.trim())) e.email = 'Indiquez une adresse e-mail valide.';
      if (!data.consent) e.consent = 'Votre accord est nécessaire pour vous recontacter.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validate(step)) return;
    track(EVENTS.QUOTE_STEP, { step });
    setStep((s) => Math.min(5, s + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const back = () => {
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate(5)) return;

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

  const progress = useMemo(() => Math.round(((step - 1) / (STEPS.length - 1)) * 100), [step]);

  if (status === 'success') {
    return (
      <>
        <PageHero
          eyebrow="Demande envoyée"
          title="Merci, votre demande est bien arrivée"
          intro="Nous revenons vers vous pour convenir d'une visite et préparer votre devis."
          breadcrumb={[{ label: 'Accueil', to: '/' }, { label: 'Demander un devis' }]}
        />
        <Section tone="cream">
          <Container className="max-w-2xl">
            <ol className="divide-y divide-brand-ink/10 border-y border-brand-ink/10">
              {METHOD.slice(1, 4).map((s) => (
                <li key={s.n} className="flex gap-6 py-6">
                  <span className="font-display text-2xl font-light text-brand-gold">{s.n}</span>
                  <div>
                    <h2 className="font-display text-lg font-light text-brand-ink">{s.title}</h2>
                    <p className="mt-1 text-[14px] font-light text-brand-ink/60">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button to="/realisations" variant="primary">
                Voir nos réalisations
              </Button>
              <Button
                href={whatsappUrl('Bonjour Chaudrel, je viens de vous envoyer une demande de devis.')}
                variant="outline"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track(EVENTS.WHATSAPP_CLICK, { source: 'quote_success' })}
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                WhatsApp
              </Button>
            </div>
          </Container>
        </Section>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Demander un devis"
        title="Parlez-nous de votre projet"
        intro="Cinq questions, deux minutes. Votre demande est gratuite et sans engagement."
        breadcrumb={[{ label: 'Accueil', to: '/' }, { label: 'Demander un devis' }]}
      />

      <Section tone="cream">
        <Container className="grid gap-12 lg:grid-cols-3 lg:gap-16">
          <div className="lg:col-span-2">
            {/* Progression */}
            <div className="mb-10">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-brand-ink/40">
                <span>
                  Étape {step} sur {STEPS.length} — {STEPS[step - 1].label}
                </span>
                <span>{progress}%</span>
              </div>
              <div
                className="mt-3 h-px w-full bg-brand-ink/10"
                role="progressbar"
                aria-valuenow={step}
                aria-valuemin={1}
                aria-valuemax={STEPS.length}
                aria-label="Progression du formulaire"
              >
                <div
                  className="h-px bg-brand-gold transition-all duration-500"
                  style={{ width: `${Math.max(progress, 4)}%` }}
                />
              </div>
            </div>

            <form onSubmit={submit} noValidate>
              {/* Honeypot anti-spam — invisible pour les humains */}
              <div className="absolute left-[-9999px]" aria-hidden="true">
                <label htmlFor="company">Ne pas remplir</label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={data.company}
                  onChange={(e) => setData((d) => ({ ...d, company: e.target.value }))}
                />
              </div>

              {step === 1 && (
                <Fieldset legend="Quel type de projet ?" error={errors.projectType}>
                  <div className="grid gap-3 sm:grid-cols-2">
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
                <Fieldset legend="Parlez-nous de votre projet" error={errors.description}>
                  <label htmlFor="description" className="text-[14px] text-brand-ink/60">
                    Surface, pièces concernées, état actuel, délais souhaités — tout ce qui nous aide à comprendre.
                  </label>
                  <textarea
                    id="description"
                    rows={7}
                    value={data.description}
                    onChange={(e) => set('description')(e.target.value)}
                    aria-invalid={Boolean(errors.description)}
                    className="mt-3 w-full border border-brand-ink/15 bg-white p-4 text-[15px] text-brand-ink outline-none transition-colors focus:border-brand-gold"
                    placeholder="Ex. : rénovation complète d'un appartement de 90 m² à Ixelles, cuisine et salle de bain comprises."
                  />
                </Fieldset>
              )}

              {step === 3 && (
                <Fieldset legend="Budget approximatif" error={errors.budget}>
                  <div className="grid gap-3">
                    {BUDGET_OPTIONS.map((b) => (
                      <Choice
                        key={b.id}
                        name="budget"
                        label={b.label}
                        hint={b.hint}
                        checked={data.budget === b.id}
                        onChange={() => set('budget')(b.id)}
                      />
                    ))}
                  </div>
                  {(data.budget === 'defined' || data.budget === 'range') && (
                    <div className="mt-5">
                      <label htmlFor="budgetDetail" className="text-[14px] text-brand-ink/60">
                        Budget envisagé (facultatif)
                      </label>
                      <input
                        id="budgetDetail"
                        type="text"
                        value={data.budgetDetail}
                        onChange={(e) => set('budgetDetail')(e.target.value)}
                        className="mt-2 w-full border border-brand-ink/15 bg-white p-4 text-[15px] outline-none transition-colors focus:border-brand-gold"
                        placeholder="Ex. : environ 25 000 €"
                      />
                    </div>
                  )}
                </Fieldset>
              )}

              {step === 4 && (
                <Fieldset legend="Où se situe le chantier ?" error={errors.city}>
                  <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                    <Field
                      id="city"
                      label="Commune"
                      value={data.city}
                      onChange={set('city')}
                      error={errors.city}
                      autoComplete="address-level2"
                      placeholder="Ex. : Ixelles"
                    />
                    <Field
                      id="postalCode"
                      label="Code postal (facultatif)"
                      value={data.postalCode}
                      onChange={set('postalCode')}
                      autoComplete="postal-code"
                      inputMode="numeric"
                      placeholder="1050"
                    />
                  </div>
                  <p className="mt-4 text-[13px] font-light text-brand-ink/50">
                    Nous intervenons à {BRAND.zone}. Hors zone, nous vous le disons dès la réponse.
                  </p>
                </Fieldset>
              )}

              {step === 5 && (
                <Fieldset legend="Vos coordonnées">
                  <div className="grid gap-4">
                    <Field
                      id="name"
                      label="Nom"
                      value={data.name}
                      onChange={set('name')}
                      error={errors.name}
                      autoComplete="name"
                      required
                    />
                    <Field
                      id="phone"
                      label="Téléphone"
                      type="tel"
                      value={data.phone}
                      onChange={set('phone')}
                      error={errors.phone}
                      autoComplete="tel"
                      inputMode="tel"
                      required
                    />
                    <Field
                      id="email"
                      label="E-mail"
                      type="email"
                      value={data.email}
                      onChange={set('email')}
                      error={errors.email}
                      autoComplete="email"
                      inputMode="email"
                      required
                    />
                  </div>

                  <label className="mt-6 flex cursor-pointer items-start gap-3 text-[13px] font-light leading-[1.7] text-brand-ink/60">
                    <input
                      type="checkbox"
                      checked={data.consent}
                      onChange={(e) => set('consent')(e.target.checked)}
                      aria-invalid={Boolean(errors.consent)}
                      className="mt-0.5 h-4 w-4 flex-shrink-0 accent-[#8C764E]"
                    />
                    <span>
                      J'accepte que Chaudrel utilise ces informations pour me recontacter au sujet de ma demande de devis.{' '}
                      <a href="/legal/politique-mentions" className="link-underline text-brand-gold">
                        Politique de confidentialité
                      </a>
                      .
                    </span>
                  </label>
                  {errors.consent && <FieldError>{errors.consent}</FieldError>}
                </Fieldset>
              )}

              {/* Navigation */}
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                {step > 1 && (
                  <Button variant="outline" onClick={back} disabled={status === 'loading'}>
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Retour
                  </Button>
                )}

                {step < 5 ? (
                  <Button variant="primary" onClick={next}>
                    Continuer
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                ) : (
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.1em] text-white transition-colors duration-300 hover:bg-brand-ink disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        Envoi en cours…
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" aria-hidden="true" />
                        Recevoir ma demande de devis
                      </>
                    )}
                  </button>
                )}
              </div>

              <p aria-live="polite" className="sr-only">
                {status === 'loading' ? 'Envoi de votre demande en cours' : ''}
              </p>

              {status === 'error' && (
                <div role="alert" className="mt-6 border border-red-200 bg-red-50 p-5 text-[14px] text-red-800">
                  <p className="font-medium">Votre demande n'a pas pu être envoyée.</p>
                  {serverError && <p className="mt-1 text-red-700/80">{serverError}</p>}
                  <p className="mt-3">
                    Réessayez, ou contactez-nous directement au{' '}
                    <a href={`tel:${BRAND.phones[0].tel}`} className="underline">
                      {BRAND.phones[0].number}
                    </a>{' '}
                    ou sur{' '}
                    <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="underline">
                      WhatsApp
                    </a>
                    .
                  </p>
                </div>
              )}
            </form>
          </div>

          {/* Colonne latérale — réassurance + canaux alternatifs */}
          <aside className="lg:col-span-1">
            <div className="border border-brand-ink/10 bg-white p-7">
              <h2 className="font-display text-xl font-light text-brand-ink">Vous préférez parler ?</h2>
              <p className="mt-3 text-[14px] font-light leading-[1.8] text-brand-ink/60">
                Le formulaire nous permet de préparer la visite. Mais vous pouvez aussi nous joindre directement.
              </p>

              <div className="mt-6 space-y-3">
                {BRAND.phones.map((p) => (
                  <a
                    key={p.tel}
                    href={`tel:${p.tel}`}
                    onClick={() => track(EVENTS.PHONE_CLICK, { source: 'quote_sidebar' })}
                    className="flex items-center gap-3 border border-brand-ink/10 p-4 text-[14px] text-brand-ink/75 transition-colors hover:border-brand-gold hover:text-brand-ink"
                  >
                    <Phone className="h-4 w-4 text-brand-gold" aria-hidden="true" />
                    <span>
                      {p.number}
                      <span className="ml-2 text-brand-ink/40">{p.name}</span>
                    </span>
                  </a>
                ))}
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track(EVENTS.WHATSAPP_CLICK, { source: 'quote_sidebar' })}
                  className="flex items-center gap-3 border border-brand-ink/10 p-4 text-[14px] text-brand-ink/75 transition-colors hover:border-brand-gold hover:text-brand-ink"
                >
                  <MessageCircle className="h-4 w-4 text-brand-gold" aria-hidden="true" />
                  Demander un devis sur WhatsApp
                </a>
              </div>

              <ul className="mt-7 space-y-2 border-t border-brand-ink/10 pt-6 text-[13px] font-light text-brand-ink/55">
                <li>Devis gratuit et sans engagement</li>
                <li>Visite sur place avant toute proposition</li>
                <li>Vos données ne sont utilisées que pour votre demande</li>
              </ul>
            </div>
          </aside>
        </Container>
      </Section>
    </>
  );
}

/* ---------------- Sous-composants de formulaire ---------------- */

function Fieldset({ legend, error, children }) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="h-display mb-6 text-[1.6rem] text-brand-ink sm:text-3xl">{legend}</legend>
      {children}
      {error && <FieldError>{error}</FieldError>}
    </fieldset>
  );
}

function FieldError({ children }) {
  return (
    <p role="alert" className="mt-3 text-[13px] text-red-700">
      {children}
    </p>
  );
}

function Choice({ name, label, hint, checked, onChange }) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-start gap-3 border p-4 transition-colors',
        checked ? 'border-brand-gold bg-white' : 'border-brand-ink/15 bg-white/60 hover:border-brand-ink/35'
      )}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} className="mt-1 h-4 w-4 accent-[#8C764E]" />
      <span>
        <span className="block text-[15px] text-brand-ink">{label}</span>
        {hint && <span className="mt-0.5 block text-[13px] font-light text-brand-ink/45">{hint}</span>}
      </span>
    </label>
  );
}

function Field({ id, label, value, onChange, error, type = 'text', required, ...rest }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-medium text-brand-ink/70">
        {label}
        {required && <span className="text-brand-gold"> *</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'mt-2 w-full border bg-white p-4 text-[15px] text-brand-ink outline-none transition-colors focus:border-brand-gold',
          error ? 'border-red-400' : 'border-brand-ink/15'
        )}
        {...rest}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-[13px] text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
