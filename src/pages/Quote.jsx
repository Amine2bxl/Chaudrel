import { useMemo, useState } from 'react';
import PageHero from '@/components/sections/PageHero';
import { Button, Container, Disclosure, Section } from '@/components/ui';
import Reveal from '@/lib/reveal';
import { METHOD } from '@/data/method';
import { BRAND, whatsappUrl } from '@/data/site';
import { EVENTS, track } from '@/lib/analytics';
import { useContactDialog } from '@/lib/contactDialog';
import { cn } from '@/lib/utils';

const PROJECT_TYPES = [
  'Rénovation complète',
  'Finitions intérieures',
  'Aménagement extérieur',
  'Toiture',
  'Façade',
  'Piscine',
  'Autre',
];

/* Le type de bien conditionne l'organisation du chantier bien plus que le
   budget : il remplace l'étape budget, qui allongeait le parcours sans
   qualifier la demande. */
const PROPERTY_TYPES = ['Maison', 'Appartement', 'Commerce', 'Autre'];

/* Les questions de qualification (docs/RESEAUX-SOCIAUX.md) : la surface donne
   un ordre de grandeur, l'occupation conditionne le planning, l'échéance et le
   budget permettent de préparer une visite et une réponse utiles. Chaque
   question offre une issue « je ne sais pas » : personne n'est bloqué. */
const SURFACE_OPTIONS = ['Moins de 50 m²', '50 à 100 m²', '100 à 150 m²', 'Plus de 150 m²', 'Je ne sais pas encore'];
const OCCUPIED_OPTIONS = ['Oui, entièrement', 'Partiellement', 'Non, le logement sera vide'];
const TIMELINE_OPTIONS = ['Dès que possible', 'Dans le mois', 'Dans 1 à 3 mois', 'Plus tard dans l’année', 'Pas encore de date'];
const BUDGET_OPTIONS = [
  'Moins de 10 000 €',
  '10 000 à 30 000 €',
  '30 000 à 80 000 €',
  'Plus de 80 000 €',
  'Je préfère en discuter',
];
const OWNER_STATUS_OPTIONS = ['Je suis propriétaire', 'Je suis locataire'];

const STEPS = ['Projet', 'Description', 'Lieu', 'Calendrier & budget', 'Coordonnées'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+0-9][0-9\s./-]{7,}$/;

const EMPTY = {
  projectType: '',
  propertyType: '',
  surface: '',
  description: '',
  occupied: '',
  city: '',
  postalCode: '',
  timeline: '',
  budget: '',
  ownerStatus: '',
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  consent: false,
  company: '',
};

export default function Quote() {
  const { openDialog } = useContactDialog();
  const [step, setStep] = useState(1);
  const [data, setData] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [started, setStarted] = useState(false);
  /* Le détail technique part dans les mesures, jamais à l'écran : « Failed to
     fetch » ou le champ `error` de l'API sont écrits pour un journal, pas pour
     quelqu'un qui attend un devis. L'écran dit ce qui s'est passé et par où
     passer maintenant. */

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
    if (s === 1) {
      if (!data.projectType) e.projectType = 'Sélectionnez un type de projet.';
      if (!data.propertyType) e.propertyType = 'Indiquez de quel type de bien il s’agit.';
      if (!data.surface) e.surface = 'Précisez l’ordre de grandeur de la surface.';
    }
    if (s === 2) {
      if (data.description.trim().length < 10) e.description = 'Décrivez le projet en quelques mots : pièces concernées et état actuel.';
      if (!data.occupied) e.occupied = 'Le logement sera-t-il occupé pendant les travaux ?';
    }
    if (s === 3 && !data.city.trim()) e.city = 'Indiquez la commune du chantier.';
    if (s === 4) {
      if (!data.budget) e.budget = 'Sélectionnez une fourchette pour avancer.';
      if (!data.timeline) e.timeline = 'Indiquez l’échéance souhaitée.';
      if (!data.ownerStatus) e.ownerStatus = 'Précisez votre situation — c’est elle qui détermine les autorisations.';
    }
    if (s === 5) {
      if (data.firstName.trim().length < 2) e.firstName = 'Indiquez votre prénom.';
      if (data.lastName.trim().length < 2) e.lastName = 'Indiquez votre nom.';
      if (!PHONE_RE.test(data.phone.trim())) e.phone = 'Numéro incomplet. Exemple : 0477 27 31 18.';
      if (!EMAIL_RE.test(data.email.trim())) e.email = 'Adresse e-mail incomplète. Exemple : prenom@exemple.be';
      if (!data.consent) e.consent = 'Votre accord est nécessaire pour vous recontacter.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* `scroll-behavior: auto` en CSS ne bride pas un appel JS explicite : c'est
     l'appel qui gagne. La préférence se lit donc ici. */
  const scrollTop = () =>
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });

  const next = () => {
    if (!validate(step)) return;
    track(EVENTS.QUOTE_STEP, { step });
    setStep((s) => Math.min(STEPS.length, s + 1));
    scrollTop();
  };

  const back = () => {
    setStep((s) => Math.max(1, s - 1));
    scrollTop();
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate(STEPS.length)) return;

    setStatus('loading');
    track(EVENTS.QUOTE_SUBMIT, { projectType: data.projectType });

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, sentAt: new Date().toISOString() }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'L’envoi a échoué.');
      }
      setStatus('success');
      track(EVENTS.QUOTE_SUCCESS, { projectType: data.projectType });
      scrollTop();
    } catch (err) {
      setStatus('error');
      track(EVENTS.QUOTE_ERROR, { message: err.message });
    }
  };

  const progress = useMemo(() => step / STEPS.length, [step]);

  if (status === 'success') {
    return (
      <>
        <PageHero
          title="C’est noté. Merci."
          intro="Vous venez de recevoir un e-mail de confirmation. Nous revenons vers vous pour convenir d’une visite et préparer votre devis."
          breadcrumb={[{ label: 'Accueil', to: '/' }, { label: 'Devis gratuit' }]}
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
        breadcrumb={[{ label: 'Accueil', to: '/' }, { label: 'Devis gratuit' }]}
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
                  className="h-full origin-left rounded-full bg-gold transition-transform duration-700 ease-soft"
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
                <Fieldset legend="Votre projet, en bref.">
                  <ChoiceGroup
                    label="Type de travaux"
                    name="projectType"
                    options={PROJECT_TYPES}
                    value={data.projectType}
                    onChange={set('projectType')}
                    error={errors.projectType}
                  />
                  <ChoiceGroup
                    label="Type de bien"
                    name="propertyType"
                    options={PROPERTY_TYPES}
                    value={data.propertyType}
                    onChange={set('propertyType')}
                    error={errors.propertyType}
                  />
                  <ChoiceGroup
                    label="Surface approximative"
                    name="surface"
                    options={SURFACE_OPTIONS}
                    value={data.surface}
                    onChange={set('surface')}
                    hint="Un ordre de grandeur suffit : il donne le cadre au devis."
                    error={errors.surface}
                  />
                </Fieldset>
              )}

              {step === 2 && (
                <Fieldset legend="Décrivez votre projet." error={errors.description}>
                  <label htmlFor="description" className="t-small block text-ink/65">
                    Pièces concernées, état actuel, ce que vous imaginez.
                  </label>
                  <textarea
                    id="description"
                    rows={6}
                    value={data.description}
                    onChange={(e) => set('description')(e.target.value)}
                    aria-invalid={Boolean(errors.description)}
                    placeholder="Ex. : appartement de 90 m² à Ixelles, cuisine et salle de bain à refaire, disponible à partir de septembre."
                    className="field mt-4"
                  />

                  <ChoiceGroup
                    label="Le logement sera-t-il occupé pendant les travaux ?"
                    name="occupied"
                    options={OCCUPIED_OPTIONS}
                    value={data.occupied}
                    onChange={set('occupied')}
                    hint="Cela conditionne le planning : certains postes (peinture, poussière) sont plus simples logement vide."
                    error={errors.occupied}
                  />
                </Fieldset>
              )}

              {step === 3 && (
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
                  <p className="t-small mt-6 text-ink/65">{BRAND.zoneLong}.</p>
                </Fieldset>
              )}

              {step === 4 && (
                <Fieldset legend="Quand, et avec quel budget ?">
                  <ChoiceGroup
                    label="Échéance souhaitée"
                    name="timeline"
                    options={TIMELINE_OPTIONS}
                    value={data.timeline}
                    onChange={set('timeline')}
                    error={errors.timeline}
                  />
                  <ChoiceGroup
                    label="Budget prévisionnel"
                    name="budget"
                    options={BUDGET_OPTIONS}
                    value={data.budget}
                    onChange={set('budget')}
                    hint="Une fourchette large suffit. Si vous hésitez, dites-le : la visite nous aidera à cadrer."
                    error={errors.budget}
                  />
                  <ChoiceGroup
                    label="Vous êtes ?"
                    name="ownerStatus"
                    options={OWNER_STATUS_OPTIONS}
                    value={data.ownerStatus}
                    onChange={set('ownerStatus')}
                    hint="Si vous êtes locataire, certains travaux nécessitent l’accord du propriétaire."
                    error={errors.ownerStatus}
                  />
                </Fieldset>
              )}

              {step === 5 && (
                <Fieldset legend="Comment vous joindre ?">
                  <div className="space-y-8">
                    <div className="grid gap-8 sm:grid-cols-2">
                      <Field
                        id="firstName"
                        label="Prénom"
                        value={data.firstName}
                        onChange={set('firstName')}
                        error={errors.firstName}
                        autoComplete="given-name"
                      />
                      <Field
                        id="lastName"
                        label="Nom"
                        value={data.lastName}
                        onChange={set('lastName')}
                        error={errors.lastName}
                        autoComplete="family-name"
                      />
                    </div>
                    <Field id="phone" label="Téléphone" type="tel" value={data.phone} onChange={set('phone')} error={errors.phone} autoComplete="tel" />
                    <Field id="email" label="E-mail" type="email" value={data.email} onChange={set('email')} error={errors.email} autoComplete="email" />
                  </div>

                  <label className="t-small mt-8 flex cursor-pointer items-start gap-3 text-ink/65">
                    <input
                      type="checkbox"
                      checked={data.consent}
                      onChange={(e) => set('consent')(e.target.checked)}
                      aria-invalid={Boolean(errors.consent)}
                      className="mt-1 h-4 w-4 flex-shrink-0 rounded-xs accent-gold"
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
                    {status === 'loading' ? 'Envoi en cours…' : 'Envoyer ma demande'}
                  </Button>
                )}
              </div>

              <p aria-live="polite" className="sr-only">
                {status === 'loading' ? 'Envoi de votre demande en cours' : ''}
              </p>

              {status === 'error' && (
                <div role="alert" className="mt-8 rounded-md bg-error/[0.07] px-5 py-4">
                  <p className="t-body text-ink">Votre demande n’a pas pu être envoyée.</p>
                  {/* La première inquiétude est de devoir tout retaper : on y
                      répond avant de proposer autre chose. */}
                  <p className="t-small mt-2 text-ink/65">
                    Vos réponses sont toujours à l’écran. Réessayez dans un instant, ou joignez-nous directement.
                  </p>
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
                'Elles nous évitent plusieurs allers-retours avant la visite.',
                'Votre budget et vos dates nous permettent de préparer une réponse précise.',
                `${BRAND.promises.quote}.`,
                `${BRAND.promises.responseTime} à votre demande.`,
                'Vos données servent uniquement à répondre à votre demande.',
              ].map((t) => (
                <li key={t} className="t-small text-ink/65">
                  {t}
                </li>
              ))}
            </ul>

            {/* Ce qui se passe après l'envoi : replié, parce que c'est une
                question qu'on se pose seulement si on se la pose. */}
            <Disclosure title="Et après ?" className="mt-8">
              <ol className="space-y-4">
                {METHOD.slice(2, 6).map((m) => (
                  <li key={m.n} className="flex gap-3.5">
                    <span className="t-num mt-0.5 flex-none text-ink/40">{m.n}</span>
                    <div>
                      <p className="t-small font-semibold text-ink">{m.title}</p>
                      <p className="t-small mt-1 text-ink/65">{m.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Disclosure>

            {/* Deux issues, pas une liste de liens : écrire tout de suite sur
                WhatsApp, ou ouvrir la fiche complète (téléphones, e-mail,
                horaires, adresse). */}
            <div className="mt-10 border-t border-ink/12 pt-6">
              <p className="t-small text-ink/65">Vous préférez parler ?</p>
              <div className="mt-4 flex flex-col gap-2.5">
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track(EVENTS.WHATSAPP_CLICK, { source: 'quote_sidebar' })}
                  className="t-label inline-flex items-center justify-center gap-2.5 rounded-full border border-ink/15 bg-shell px-5 py-4 text-ink transition-all duration-fast ease-soft hover:border-ink/30 hover:shadow-soft active:translate-y-px"
                >
                  <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
                    <path d="M8 0a8 8 0 0 0-6.9 12L0 16l4.1-1.1A8 8 0 1 0 8 0Zm0 14.6a6.6 6.6 0 0 1-3.4-.9l-.2-.2-2.5.7.7-2.4-.2-.3A6.6 6.6 0 1 1 8 14.6Zm3.6-4.9c-.2-.1-1.2-.6-1.3-.6-.2-.1-.3-.1-.4.1l-.6.7c-.1.1-.2.1-.4 0a5.4 5.4 0 0 1-2.6-2.3c-.2-.3.2-.3.5-1 0-.1 0-.2 0-.3l-.6-1.3c-.1-.4-.3-.3-.4-.3h-.4a.7.7 0 0 0-.5.3c-.2.2-.7.7-.7 1.7s.7 2 .8 2.1a7.6 7.6 0 0 0 3 2.6c1.1.4 1.5.5 2 .4.4 0 1.2-.5 1.3-.9.2-.5.2-.9.1-1 0-.1-.1-.1-.3-.2Z" />
                  </svg>
                  WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => openDialog('quote_sidebar')}
                  className="t-label inline-flex items-center justify-center gap-2.5 rounded-full border border-ink/15 bg-shell px-5 py-4 text-ink transition-all duration-fast ease-soft hover:border-ink/30 hover:shadow-soft active:translate-y-px"
                >
                  Toutes nos coordonnées
                </button>
              </div>
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
          ? 'border-gold bg-gold/[0.06] text-ink shadow-soft'
          : 'border-ink/[0.12] bg-shell text-ink/70 hover:border-ink/25 hover:text-ink'
      )}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
      <span
        aria-hidden="true"
        className={cn(
          'grid h-[18px] w-[18px] flex-shrink-0 place-items-center rounded-full border transition-colors duration-300',
          checked ? 'border-gold bg-gold' : 'border-ink/25 bg-shell'
        )}
      >
        {checked && <span className="block h-1.5 w-1.5 rounded-full bg-cream" />}
      </span>
      <span className="t-body">{label}</span>
    </label>
  );
}

function ChoiceGroup({ label, name, options, value, onChange, error, hint }) {
  return (
    <div className={cn(label && 'mt-10')}>
      {label && <span className="t-label text-ink/55">{label}</span>}
      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {options.map((t) => (
          <Choice key={t} name={name} label={t} checked={value === t} onChange={() => onChange(t)} />
        ))}
      </div>
      {hint && <p className="t-small mt-3 text-ink/50">{hint}</p>}
      {error && <FieldError>{error}</FieldError>}
    </div>
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