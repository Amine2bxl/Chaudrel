import { Link } from 'react-router-dom';
import { Container, Media, TextLink } from '@/components/ui';
import Reveal from '@/lib/reveal';
import { SERVICES } from '@/data/services';
import { PROJECTS } from '@/data/projects';
import { cn } from '@/lib/utils';

const pad2 = (n) => String(n).padStart(2, '0');

/**
 * Les métiers, un par un - la page /services.
 *
 * Pas de grille de cartes, pas d'icônes : chaque métier est une double page
 * de revue. Une grande photo d'un côté (cadre « feuille », l'arc changeant de
 * côté d'une ligne à l'autre), de l'autre son numéro, son nom, ce qu'il
 * couvre, et le détail des postes sous deux filets.
 *
 * Tout le texte vient de `src/data/services.js` : rien n'est ajouté ici.
 */
export default function ServicesEditorial() {
  return (
    <div>
      {SERVICES.map((s, i) => {
        const flip = i % 2 === 1;
        const related = PROJECTS.filter((p) => s.projectTags?.some((t) => p.categories.includes(t))).length;
        return (
          <section key={s.slug} id={s.slug} className={cn('py-section', i % 2 === 0 ? 'bg-cream' : 'bg-shell')}>
            <Container className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
              <Link
                to={`/services/${s.slug}`}
                className={cn('group block lg:col-span-6', flip && 'lg:order-2')}
                aria-label={`${s.title} - voir le détail`}
                tabIndex={-1}
              >
                <Media
                  src={s.image}
                  alt=""
                  ratio="aspect-[5/4]"
                  shape={flip ? 'leafLeft' : 'leaf'}
                  imgClassName="transition-transform duration-reveal ease-soft group-hover:scale-[1.03]"
                />
              </Link>

              <div className={cn('lg:col-span-6', flip ? 'lg:order-1 lg:pr-6' : 'lg:pl-6')}>
                <Reveal>
                  <p className="t-label flex items-center gap-3 text-ink/65">
                    <span className="t-num tracking-normal text-gold-deep">{pad2(i + 1)}</span>
                    <span aria-hidden="true" className="h-px w-8 bg-ink/30" />
                    {s.excerpt}
                  </p>
                  <h2 className="t-h1 mt-5">
                    <Link to={`/services/${s.slug}`} className="link-line">
                      {s.title}
                    </Link>
                  </h2>
                  <p className="t-lead mt-5 max-w-[52ch] text-ink/65">{s.intro}</p>
                </Reveal>

                <Reveal delay={120}>
                  <dl className="mt-8 grid gap-x-10 border-t border-ink/15 sm:grid-cols-2">
                    {s.groups.map((g) => (
                      <div key={g.title} className="border-b border-ink/15 py-5">
                        <dt className="t-label text-ink/65">{g.title}</dt>
                        <dd className="mt-3">
                          <ul className="space-y-1.5">
                            {g.items.map((it) => (
                              <li key={it} className="t-small text-ink/80">
                                {it}
                              </li>
                            ))}
                          </ul>
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3">
                    <TextLink to={`/services/${s.slug}`}>Découvrir ce métier</TextLink>
                    {related > 0 && (
                      <span className="t-small text-ink/65">
                        {related} chantier{related > 1 ? 's' : ''} à voir
                      </span>
                    )}
                  </div>
                </Reveal>
              </div>
            </Container>
          </section>
        );
      })}
    </div>
  );
}
