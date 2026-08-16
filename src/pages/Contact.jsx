import { useState } from 'react';
import PageHero from '@/components/sections/PageHero';
import { Button, Container, Section } from '@/components/ui';
import Reveal from '@/lib/reveal';
import { BRAND, whatsappUrl } from '@/data/site';
import { EVENTS, track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const EMPTY = { name: '', phone: '', email: '', message: '', consent: false, company: '' };

/**
 * Contact direct : quatre champs, pas un de plus.
 * Le parcours détaillé reste sur /devis pour les demandes de chiffrage.
 */
export default function Contact() {
  const [data, setData] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const set = (key) => (value) => {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();

    const next = {};
    if (data.name.trim().length < 2) next.name = 'Indiquez votre nom.';
    if (data.phone.trim().length < 8) next.phone = 'Indiquez un numéro de téléphone.';
    if (!EMAIL_RE.test(data.email.trim())) next.email = 'Indiquez une adresse e-mail valide.';
    if (data.message.trim().length < 10) next.message = 'Décrivez votre demande en quelques mots.';
    if (!data.consent) next.consent = 'Votre accord est nécessaire pour vous répondre.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          projectType: 'Contact',
          description: data.message,
          city: '—',
          budget: 'non précisé',
          sentAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error('failed');
      setStatus('success');
      track(EVENTS.QUOTE_SUCCESS, { source: 'contact' });
    } catch {
      setStatus('error');
      track(EVENTS.QUOTE_ERROR, { source: 'contact' });
    }
  };

  return (
    <>
      <PageHero
        title="Parlons de votre projet."
        intro="Un message, un appel ou WhatsApp. Nous répondons à chaque demande, même celles qui ne débouchent pas sur un chantier."
        breadcrumb={[{ label: 'Accueil', to: '/' }, { label: 'Contact' }]}
      />

      <Section tone="paper" className="pt-0 md:pt-0 lg:pt-0">
        <Container className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          {/* Canaux directs */}
          <div className="lg:col-span-5">
            <span className="t-label text-ink/65">Directement</span>

            <ul className="mt-6 border-t border-ink/12">
              {BRAND.phones.map((p) => (
                <li key={p.tel} className="border-b border-ink/12">
                  <a
                    href={`tel:${p.tel}`}
                    onClick={() => track(EVENTS.PHONE_CLICK, { source: 'contact' })}
                    className="group flex items-baseline justify-between gap-4 py-5"
                  >
                    <span className="t-h3 transition-colors group-hover:text-signal">{p.number}</span>
                    <span className="t-label text-ink/65">{p.name}</span>
                  </a>
                </li>
              ))}
              <li className="border-b border-ink/12">
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track(EVENTS.WHATSAPP_CLICK, { source: 'contact' })}
                  className="group flex items-baseline justify-between gap-4 py-5"
                >
                  <span className="t-h3 transition-colors group-hover:text-signal">WhatsApp</span>
                  <span className="t-label text-ink/65">Réponse rapide</span>
                </a>
              </li>
              <li className="border-b border-ink/12">
                <a
                  href={`mailto:${BRAND.email}`}
                  onClick={() => track(EVENTS.EMAIL_CLICK, { source: 'contact' })}
                  className="group flex items-baseline justify-between gap-4 py-5"
                >
                  <span className="t-h3 break-all transition-colors group-hover:text-signal">{BRAND.email}</span>
                </a>
              </li>
            </ul>

            <div className="mt-10">
              <span className="t-label text-ink/65">Adresse</span>
              <address className="t-body mt-3 not-italic text-ink/65">
                {BRAND.address.street}
                <br />
                {BRAND.address.postalCode} {BRAND.address.city}
              </address>
              <p className="t-small mt-4 text-ink/65">Chantiers partout en Belgique.</p>
            </div>

            <div className="mt-10 border-t border-ink/12 pt-6">
              <p className="t-body text-ink/65">
                Vous voulez un chiffrage ? Le formulaire de devis pose les bonnes questions dès le départ.
              </p>
              <Button to="/devis" variant="outline" className="mt-5">
                Demander un devis
              </Button>
            </div>
          </div>

          {/* Formulaire court */}
          <div className="lg:col-span-6 lg:col-start-7">
            {status === 'success' ? (
              <Reveal className="border-t border-ink/12 pt-8">
                <h2 className="t-h2">Message envoyé.</h2>
                <p className="t-body measure mt-5 text-ink/65">
                  Merci. Nous revenons vers vous rapidement. Si votre demande est urgente, appelez-nous —{' '}
                  <a href={`tel:${BRAND.phones[0].tel}`} className="link-line text-ink">
                    {BRAND.phones[0].number}
                  </a>
                  .
                </p>
              </Reveal>
            ) : (
              <form onSubmit={submit} noValidate>
                <span className="t-label text-ink/65">Écrivez-nous</span>

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

                <div className="mt-6 space-y-6">
                  <Field id="name" label="Nom" value={data.name} onChange={set('name')} error={errors.name} autoComplete="name" />
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field
                      id="phone"
                      label="Téléphone"
                      type="tel"
                      value={data.phone}
                      onChange={set('phone')}
                      error={errors.phone}
                      autoComplete="tel"
                    />
                    <Field
                      id="email"
                      label="E-mail"
                      type="email"
                      value={data.email}
                      onChange={set('email')}
                      error={errors.email}
                      autoComplete="email"
                    />
                  </div>
                  <Field
                    id="message"
                    label="Votre projet"
                    textarea
                    value={data.message}
                    onChange={set('message')}
                    error={errors.message}
                  />
                </div>

                <label className="t-small mt-7 flex cursor-pointer items-start gap-3 text-ink/65">
                  <input
                    type="checkbox"
                    checked={data.consent}
                    onChange={(e) => set('consent')(e.target.checked)}
                    className="mt-1 h-4 w-4 flex-shrink-0 accent-[#CC3A14]"
                  />
                  <span>
                    J’accepte d’être recontacté au sujet de ma demande.{' '}
                    <a href="/legal/politique-mentions" className="link-line text-ink">
                      Politique de confidentialité
                    </a>
                  </span>
                </label>
                {errors.consent && (
                  <p role="alert" className="t-small mt-2 text-[#9B2C2C]">
                    {errors.consent}
                  </p>
                )}

                <Button
                  type="submit"
                  variant="solid"
                  size="lg"
                  className="mt-8"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Envoi…' : 'Envoyer'}
                </Button>

                {status === 'error' && (
                  <p role="alert" className="t-small mt-6 border-l-2 border-[#9B2C2C] pl-4 text-ink/70">
                    L’envoi a échoué. Appelez-nous au{' '}
                    <a href={`tel:${BRAND.phones[0].tel}`} className="link-line text-ink">
                      {BRAND.phones[0].number}
                    </a>{' '}
                    ou écrivez sur{' '}
                    <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="link-line text-ink">
                      WhatsApp
                    </a>
                    .
                  </p>
                )}
              </form>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}

function Field({ id, label, value, onChange, error, type = 'text', textarea = false, ...rest }) {
  const base = cn(
    'mt-2 w-full border-0 border-b bg-transparent px-0 py-3 text-[16px] text-ink outline-none transition-colors placeholder:text-ink/55 focus:border-signal',
    error ? 'border-[#9B2C2C]' : 'border-ink/20'
  );

  return (
    <div>
      <label htmlFor={id} className="t-label text-ink/65">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          rows={5}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          className={cn(base, 'resize-y')}
          {...rest}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          className={base}
          {...rest}
        />
      )}
      {error && (
        <p role="alert" className="t-small mt-2 text-[#9B2C2C]">
          {error}
        </p>
      )}
    </div>
  );
}
