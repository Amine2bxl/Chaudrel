import { useMemo, useRef, useState } from 'react';
import PageHero from '@/components/sections/PageHero';
import { Button, Container, Section } from '@/components/ui';
import Reveal from '@/lib/reveal';
import { BRAND, whatsappUrl } from '@/data/site';
import { PROVINCES } from '@/data/belgium';
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

/* Chaudrel intervient dans toute la Belgique : l'étape du lieu commence par la
   province. Les noms viennent de src/data/belgium.js (mêmes données que la
   carte de couverture). */
const PROVINCE_NAMES = PROVINCES.map((p) => p.name);

const STEPS = ['Projet', 'Description', 'Lieu', 'Calendrier & budget', 'Coordonnées'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+0-9][0-9\s./-]{7,}$/;
const POSTAL_RE = /^\d{4}$/;

/* Limites des pièces jointes - à garder dans l'enveloppe de l'endpoint Vercel
   (4,5 Mo max sur le corps) : 5 photos/plans, une vidéo courte, 3 Mo au total. */
const ATTACH = {
  maxFiles: 5, // images + documents
  maxVideo: 1,
  perFile: 1 * 1024 * 1024, // image/PDF
  perVideo: 1.5 * 1024 * 1024,
  total: 3 * 1024 * 1024,
};
/* Le corps voyage en base64 (+33 %) : on garde donc une marge sous la limite
   de l'endpoint en comparant les chaînes encodées. */
const ATTACH_TOTAL_B64 = Math.ceil(ATTACH.total * 1.4);

const EMPTY = {
  projectType: '',
  propertyType: '',
  surface: '',
  description: '',
  occupied: '',
  province: '',
  postalCode: '',
  commune: '',
  timeline: '',
  budget: '',
  ownerStatus: '',
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  consent: false,
  company: '',
  files: [],
};

export default function Quote() {
  const { openDialog } = useContactDialog();
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
    if (s === 1) {
      if (!data.projectType) e.projectType = 'Sélectionnez un type de projet.';
      if (!data.propertyType) e.propertyType = 'Indiquez de quel type de bien il s’agit.';
      if (!data.surface) e.surface = 'Précisez l’ordre de grandeur de la surface.';
    }
    if (s === 2) {
      if (data.description.trim().length < 10) e.description = 'Décrivez le projet en quelques mots : pièces concernées et état actuel.';
      if (!data.occupied) e.occupied = 'Le logement sera-t-il occupé pendant les travaux ?';
    }
    if (s === 3) {
      if (!data.province) e.province = 'Indiquez la province du chantier.';
      if (!POSTAL_RE.test(data.postalCode.trim())) e.postalCode = 'Code postal à 4 chiffres. Exemple : 1030.';
    }
    if (s === 4) {
      if (!data.budget) e.budget = 'Sélectionnez une fourchette pour avancer.';
      if (!data.timeline) e.timeline = 'Indiquez l’échéance souhaitée.';
      if (!data.ownerStatus) e.ownerStatus = 'Précisez votre situation - c’est elle qui détermine les autorisations.';
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
    track(EVENTS.QUOTE_SUBMIT, { projectType: data.projectType, files: data.files.length });

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          files: data.files.map((f) => ({ name: f.name, type: f.type, data: f.data })),
          sentAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'L’envoi a échoué.');
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
          intro="Votre demande et ses fichiers viennent de partir. Vous recevez un e-mail de confirmation, puis nous convenons d’une visite et préparons votre devis."
          breadcrumb={[{ label: 'Accueil', to: '/' }, { label: 'Devis gratuit' }]}
        />
        <Section tone="cream" className="pt-0 md:pt-0 lg:pt-0">
          <Container className="max-w-[46rem]">
            <ol>
              <span className="t-label text-ink/65">La suite</span>
              {[
                { n: '01', title: 'Analyse', text: "Nous prenons connaissance de votre demande et de vos photos." },
                { n: '02', title: 'Visite', text: 'Nous convenons d’un rendez-vous sur place, gratuit et sans engagement.' },
                { n: '03', title: 'Devis', text: 'Un devis détaillé, poste par poste, dans un délai court.' },
              ].map((s) => (
                <li key={s.n} className="flex gap-8 border-b border-ink/12 py-6 first:border-t first:mt-5">
                  <span className="t-num text-2xl text-ink/40">{s.n}</span>
                  <div>
                    <h2 className="t-h3">{s.title}</h2>
                    <p className="t-small mt-1.5 text-ink/65">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
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
          </Container>
        </Section>
      </>
    );
  }

  return (
    <>
      <PageHero
        title="Cinq questions, deux minutes."
        intro="Gratuit et sans engagement. Photos, plan ou vidéo ? Joignez-les : elles nous font gagner une visite et un aller-retour."
        breadcrumb={[{ label: 'Accueil', to: '/' }, { label: 'Devis gratuit' }]}
      />

      <Section tone="cream" className="pt-0 pb-16 md:pt-0 lg:pt-0">
        <Container className="max-w-[46rem]">
          {/* Progression */}
          <div>
            <div className="flex items-baseline justify-between">
              <span className="t-label text-ink/65">
                {String(step).padStart(2, '0')} - {STEPS[step - 1]}
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

          <form onSubmit={submit} noValidate className="mt-10">
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
                  rows={5}
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

                {/* Pièces jointes : photos, plan ou une courte vidéo. Elles
                    partent dans le même e-mail que la demande. */}
                <FileUpload files={data.files} onChange={set('files')} />
              </Fieldset>
            )}

            {step === 3 && (
              <Fieldset legend="Où se situe le projet ?" error={errors.province}>
                <label htmlFor="province" className="t-label text-ink/55">
                  Province
                </label>
                <select
                  id="province"
                  name="province"
                  value={data.province}
                  onChange={(e) => set('province')(e.target.value)}
                  aria-invalid={Boolean(errors.province)}
                  className="field mt-2"
                >
                  <option value="">Choisir une province…</option>
                  {PROVINCE_NAMES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>

                <div className="mt-8 grid gap-8 sm:grid-cols-[1fr_2fr]">
                  <Field
                    id="postalCode"
                    label="Code postal"
                    value={data.postalCode}
                    onChange={set('postalCode')}
                    error={errors.postalCode}
                    autoComplete="postal-code"
                    inputMode="numeric"
                  />
                  <Field
                    id="commune"
                    label="Commune"
                    value={data.commune}
                    onChange={set('commune')}
                    hint="Facultatif - le code postal suffit parfois."
                    autoComplete="address-level2"
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

          {/* Réassurance compacte : une ligne de traite après le formulaire, au
              lieu de la colonne latérale qui doublonnait la page. */}
          <div className="mt-14 border-t border-ink/12 pt-8">
            <ul className="grid gap-x-10 gap-y-2.5 sm:grid-cols-2">
              {[
                `${BRAND.promises.quote}.`,
                `${BRAND.promises.responseTime} à votre demande.`,
                'Photos, plans et vidéo partent dans le même e-mail.',
                'Vos données servent uniquement à répondre.',
              ].map((t) => (
                <li key={t} className="t-small flex items-start gap-2.5 text-ink/65">
                  <span aria-hidden="true" className="mt-[7px] h-1 w-1 flex-none rounded-full bg-gold" />
                  {t}
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <span className="t-small text-ink/65">Vous préférez parler ?</span>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track(EVENTS.WHATSAPP_CLICK, { source: 'quote_footer' })}
                className="link-line t-label inline-block pb-1 text-ink"
              >
                WhatsApp
              </a>
              <button type="button" onClick={() => openDialog('quote_footer')} className="link-line t-label inline-block pb-1 text-ink">
                Toutes nos coordonnées
              </button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

/* ---------- Pièces jointes ---------- */

const fmtBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
};

/** Lit un fichier en base64 (sans préfixe data URL). */
function readAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      resolve({ dataUrl, base64: dataUrl.slice(dataUrl.indexOf(',') + 1) });
    };
    reader.onerror = () => reject(new Error(`Impossible de lire ${file.name}.`));
    reader.readAsDataURL(file);
  });
}

/** Réduit une image (canvas) pour qu'elle reste légère dans l'e-mail. */
function shrinkImage(dataUrl, max = 1600, quality = 0.82) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      if (scale >= 1 && dataUrl.length < 400 * 1024) {
        resolve(dataUrl.slice(dataUrl.indexOf(',') + 1));
        return;
      }
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      const out = canvas.toDataURL('image/jpeg', quality);
      resolve(out.slice(out.indexOf(',') + 1));
    };
    img.onerror = () => resolve(dataUrl.slice(dataUrl.indexOf(',') + 1));
    img.src = dataUrl;
  });
}

function FileUpload({ files, onChange }) {
  const inputRef = useRef(null);
  const [error, setError] = useState('');

  const addFiles = async (list) => {
    setError('');
    const incoming = Array.from(list);
    let images = files.filter((f) => f.type !== 'video/mp4' && f.type !== 'video/webm' && f.type !== 'video/quicktime').length;
    let videos = files.filter((f) => f.type.startsWith('video/')).length;

    for (const file of incoming) {
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf';

      if (!isVideo && !isImage && !isPdf) {
        setError('Formats acceptés : JPG, PNG, WebP, PDF et une vidéo (MP4/WebM/MOV).');
        return;
      }
      if (isVideo) {
        if (videos >= ATTACH.maxVideo) {
          setError('Une seule vidéo par demande.');
          return;
        }
        if (file.size > ATTACH.perVideo) {
          setError(`La vidéo dépasse ${fmtBytes(ATTACH.perVideo)}.`);
          return;
        }
        videos += 1;
      } else {
        if (images >= ATTACH.maxFiles) {
          setError(`Jusqu’à ${ATTACH.maxFiles} photos ou plans.`);
          return;
        }
        if (file.size > ATTACH.perFile && isPdf) {
          setError(`Le PDF dépasse ${fmtBytes(ATTACH.perFile)}.`);
          return;
        }
        images += 1;
      }
    }

    const processed = [];
    for (const file of incoming) {
      const isImage = file.type.startsWith('image/');
      const raw = await readAsBase64(file);
      const data = isImage ? await shrinkImage(raw.dataUrl) : raw.base64;

      const sized = {
        name: isImage && file.type !== 'image/jpeg' ? `${file.name.replace(/\.[^.]+$/, '')}.jpg` : file.name,
        type: isImage ? 'image/jpeg' : file.type,
        data,
        size: Math.round((data.length * 3) / 4), // volume approximatif en octets
        kind: file.type.startsWith('video/') ? 'video' : 'image',
      };

      // Total : on garde sous le plafond pour que l'envoi tienne dans l'endpoint.
      const total = [...files, ...processed].reduce((acc, f) => f.data.length, 0);
      if (total + sized.data.length > ATTACH_TOTAL_B64) {
        setError(`L’ensemble des fichiers dépasse ${fmtBytes(ATTACH.total)}.`);
        return;
      }
      processed.push(sized);
    }

    if (processed.length) onChange([...files, ...processed]);
  };

  const remove = (index) => onChange(files.filter((_, i) => i !== index));

  return (
    <div className="mt-10">
      <span className="t-label text-ink/55">Photos, plan ou vidéo</span>
      <span className="t-small mt-1 block text-ink/50">
        Facultatif - jusqu’à {ATTACH.maxFiles} photos ou PDF et une courte vidéo ({fmtBytes(ATTACH.total)} au total).
      </span>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-4 flex w-full flex-col items-center justify-center gap-1.5 rounded-md border border-dashed border-ink/20 bg-shell px-6 py-7 text-ink/55 transition-colors duration-fast hover:border-gold hover:text-ink"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
        </svg>
        <span className="t-small">Choisir des fichiers, ou déposer ici</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,application/pdf,video/mp4,video/webm,video/quicktime"
        onChange={(e) => {
          if (e.target.files?.length) addFiles(e.target.files);
          e.target.value = '';
        }}
        className="sr-only"
      />

      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="flex items-center gap-3 rounded-md border border-ink/10 bg-shell px-3 py-2">
              {f.kind === 'image' && (
                <img src={`data:${f.type};base64,${f.data}`} alt="" className="h-10 w-10 flex-none rounded-xs object-cover" />
              )}
              {f.kind === 'video' && (
                <span className="grid h-10 w-10 flex-none place-items-center rounded-xs bg-gold/[0.09] text-gold">
                  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                    <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                  </svg>
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate t-small text-ink">{f.name}</span>
                <span className="t-small text-ink/50">{fmtBytes(f.size)}</span>
              </span>
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label={`Retirer ${f.name}`}
                className="grid h-8 w-8 flex-none place-items-center rounded-full text-ink/50 transition-colors duration-fast hover:bg-error/[0.08] hover:text-error"
              >
                <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M1 1l12 12M13 1L1 13" strokeLinecap="round" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && <FieldError>{error}</FieldError>}
    </div>
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

function Field({ id, label, value, onChange, error, hint, type = 'text', className, ...rest }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="t-label text-ink/55">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={cn('field mt-2', error && 'field-error')}
        {...rest}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="t-small mt-2 text-ink/50">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="t-small mt-2 text-error">
          {error}
        </p>
      )}
    </div>
  );
}