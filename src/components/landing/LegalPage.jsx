import { ArrowLeft, ShieldCheck, FileText, Mail, Phone, CalendarDays, Eye, Database, Cookie, Building2, MapPin, Scale, Sparkles } from 'lucide-react';
import { BRAND, LOGO } from '@/lib/content';

function Section({ icon: Icon, title, children }) {
  return (
    <section className="group rounded-[2rem] border border-brand-gold/12 bg-white/75 backdrop-blur-sm p-6 sm:p-8 shadow-[0_18px_60px_rgba(17,17,17,0.05)] hover:border-brand-gold/20 transition-colors">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-3xl bg-brand-gold/10 border border-brand-gold/15 flex items-center justify-center text-brand-gold flex-shrink-0">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h2 className="font-display text-2xl sm:text-3xl font-light text-brand-ink leading-tight mb-3">{title}</h2>
          <div className="space-y-4 text-[15px] leading-[1.85] text-brand-ink/75 font-light">{children}</div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-3xl border border-brand-gold/12 bg-white/75 backdrop-blur-sm p-4 sm:p-5 flex items-start gap-3">
      <div className="h-10 w-10 rounded-2xl bg-brand-gold/10 border border-brand-gold/15 flex items-center justify-center text-brand-gold flex-shrink-0">
        <Icon className="h-4.5 w-4.5" aria-hidden="true" />
      </div>
      <div>
        <p className="text-[10px] tracking-[0.2em] uppercase text-brand-gold font-semibold mb-1">{title}</p>
        <p className="text-sm sm:text-[15px] text-brand-ink/80 font-light leading-relaxed">{value}</p>
      </div>
    </div>
  );
}

export default function LegalPage({
  title,
  eyebrow,
  summary,
  lastUpdated,
  path,
  sections,
  info,
}) {
  return (
    <main className="min-h-screen bg-brand-cream text-brand-ink">
      <div className="relative overflow-hidden border-b border-brand-gold/10 bg-[radial-gradient(circle_at_top,_rgba(140,118,78,0.12),_transparent_45%),linear-gradient(to_bottom,rgba(255,255,255,0.82),rgba(247,245,242,1))]">
        <div className="absolute inset-0 opacity-[0.12]" aria-hidden="true">
          <div className="absolute -top-32 right-[-8rem] h-96 w-96 rounded-full bg-brand-gold blur-3xl" />
          <div className="absolute top-40 left-[-6rem] h-80 w-80 rounded-full bg-brand-goldLight blur-3xl" />
        </div>

        <header className="relative z-10 fixed top-0 left-0 right-0 bg-white/85 backdrop-blur-xl border-b border-brand-gold/15 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-10">
            <div className="flex items-center justify-between h-14 lg:h-[72px]">
              <a href="/" className="flex items-center gap-2.5 group">
                <div className="h-11 w-11 rounded-xl bg-white p-0.5 ring-1 ring-brand-gold/30 flex items-center justify-center">
                  <img src={LOGO} alt={`${BRAND.name} ${BRAND.tagline}`} className="h-full w-full object-contain" width="44" height="44" />
                </div>
                <span className="flex flex-col leading-none">
                  <span className="font-display text-lg lg:text-xl tracking-[0.1em] font-semibold text-brand-ink">{BRAND.name.toUpperCase()}</span>
                  <span className="text-[9px] tracking-[0.2em] uppercase text-brand-gold font-medium">{BRAND.tagline}</span>
                </span>
              </a>
              <div className="flex items-center gap-2">
                <a href="/" className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium tracking-wide text-brand-ink/70 hover:bg-brand-gold/10 hover:text-brand-gold transition-all duration-200">
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  Retour au site
                </a>
                <a href="#contact" className="px-5 py-2.5 bg-brand-gold text-white text-[12px] tracking-[0.12em] uppercase font-semibold rounded-full hover:bg-[#5E4F34] transition-all duration-300 shadow-lg shadow-brand-gold/20">
                  Consultation gratuite
                </a>
              </div>
            </div>
          </div>
        </header>

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-28 sm:pt-32 lg:pt-36 pb-14 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-10 items-end">
            <div>
              <p className="text-[11px] tracking-[0.25em] uppercase text-brand-gold font-semibold mb-4">{eyebrow}</p>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-brand-ink leading-[1.05] mb-5 max-w-2xl">
                {title}
              </h1>
              <p className="text-[15px] sm:text-base lg:text-lg text-brand-ink/70 font-light leading-[1.9] max-w-2xl">
                {summary}
              </p>
              <div className="flex flex-wrap gap-3 mt-7">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-brand-gold/12 text-[12px] text-brand-ink/70">
                  <ShieldCheck className="h-4 w-4 text-brand-gold" /> RGPD
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-brand-gold/12 text-[12px] text-brand-ink/70">
                  <Sparkles className="h-4 w-4 text-brand-gold" /> Design minimaliste
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-brand-gold/12 text-[12px] text-brand-ink/70">
                  <CalendarDays className="h-4 w-4 text-brand-gold" /> Mise à jour {lastUpdated}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {info.map((item) => (
                <InfoCard key={item.title} {...item} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-12 lg:py-16">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8 lg:gap-10 items-start">
          <div className="space-y-6 lg:space-y-8">
            {sections.map((section) => (
              <Section key={section.title} icon={section.icon} title={section.title}>
                {section.content}
              </Section>
            ))}
          </div>

          <aside className="sticky top-24 space-y-4">
            <div className="rounded-[2rem] border border-brand-gold/12 bg-[#0E0E0E] text-white p-6 shadow-[0_18px_60px_rgba(17,17,17,0.12)]">
              <p className="text-[10px] tracking-[0.22em] uppercase text-brand-goldLight font-semibold mb-3">Contact rapide</p>
              <h2 className="font-display text-3xl font-light leading-tight mb-4">Besoin d'un échange avant lecture ?</h2>
              <p className="text-white/55 text-sm leading-7 font-light mb-6">
                Utilise le bouton pour nous joindre directement. Le contenu exact de chaque page peut être remplacé à tout moment.
              </p>
              <a href="/#contact" className="inline-flex w-full items-center justify-center gap-2 px-5 py-3 bg-brand-gold text-white text-[12px] tracking-[0.12em] uppercase font-semibold rounded-full hover:bg-brand-goldLight transition-colors duration-200">
                <Mail className="h-4 w-4" /> Nous écrire
              </a>
            </div>
            <div className="rounded-[2rem] border border-brand-gold/12 bg-white/75 p-6">
              <p className="text-[10px] tracking-[0.22em] uppercase text-brand-gold font-semibold mb-3">Coordonnées</p>
              <div className="space-y-3 text-sm text-brand-ink/75 font-light">
                <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-brand-gold" /> {BRAND.email}</p>
                <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-brand-gold" /> {BRAND.phones[1].number}</p>
                <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brand-gold" /> {BRAND.zone}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export const legalIcons = {
  FileText,
  ShieldCheck,
  Eye,
  Database,
  Cookie,
  Building2,
  MapPin,
  Scale,
  Mail,
  Phone,
  CalendarDays,
  Sparkles,
};
