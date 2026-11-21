import { useState } from 'react';
import Reveal from '@/lib/reveal';
import { Panel } from '@/components/ui';
import { GroupLabel } from '@/components/layout/ContactList';
import { BELGIUM_VIEWBOX, PROVINCES } from '@/data/belgium';
import { cn } from '@/lib/utils';

/**
 * Zone d'intervention, sur la carte de verre du site : la carte à gauche, les
 * provinces en rangées à droite, groupées par région.
 *
 * À l'apparition, les provinces s'allument une à une en partant de Bruxelles
 * (une seule fois, CSS). Survoler ou parcourir au clavier une province du
 * tableau l'allume en bronze sur la carte. La carte reste une illustration
 * (`aria-hidden`) : ce sont les noms qui portent l'interaction.
 */
const ID_TO_PROVINCE = Object.fromEntries(PROVINCES.map((p) => [p.id, p]));
const BXL = ID_TO_PROVINCE.BE10;
/* Rang d'allumage : la distance au siège, de la plus proche à la plus lointaine. */
const ORDER = Object.fromEntries(
  [...PROVINCES]
    .sort((a, b) => Math.hypot(a.cx - BXL.cx, a.cy - BXL.cy) - Math.hypot(b.cx - BXL.cx, b.cy - BXL.cy))
    .map((p, i) => [p.id, i])
);

const REGIONS = [
  { name: 'Région flamande', ids: ['BE25', 'BE23', 'BE21', 'BE22', 'BE24'] },
  { name: 'Région wallonne', ids: ['BE31', 'BE32', 'BE33', 'BE34', 'BE35'] },
  { name: 'Bruxelles-Capitale', ids: ['BE10'] },
];

export default function BelgiumCoverage({ className }) {
  const [active, setActive] = useState(null);

  return (
    <Reveal className={className}>
      <Panel className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12" pad="p-6 sm:p-10">
        <Reveal from="fade" className="mx-auto w-full max-w-[24rem] lg:col-span-5 lg:max-w-none">
          <svg viewBox={BELGIUM_VIEWBOX} aria-hidden="true" focusable="false" className="be-map w-full">
            {PROVINCES.map((p) => (
              <path
                key={p.id}
                d={p.d}
                strokeWidth="1.2"
                vectorEffect="non-scaling-stroke"
                style={{ '--d': `${ORDER[p.id] * 110}ms` }}
                className={cn(active === p.id && 'is-on')}
              />
            ))}
            {/* Le siège, seul repère : il s'allume après la vague. */}
            <g className="be-pin">
              <circle cx={BXL.cx} cy={BXL.cy} r="8" />
              <circle cx={BXL.cx} cy={BXL.cy} r="17" fill="none" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
            </g>
          </svg>
        </Reveal>

        <div className="grid gap-x-6 gap-y-7 sm:grid-cols-2 lg:col-span-7">
          {REGIONS.map((r) => (
            <div key={r.name} className={cn(r.ids.length === 1 && 'sm:col-span-2')}>
              <GroupLabel>{r.name}</GroupLabel>
              <ul className="grid gap-2">
                {r.ids.map((id) => {
                  const on = active === id;
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        aria-pressed={on}
                        onMouseEnter={() => setActive(id)}
                        onMouseLeave={() => setActive(null)}
                        onFocus={() => setActive(id)}
                        onBlur={() => setActive(null)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-[14px] border px-4 py-2.5 text-left transition-[border-color,background-color] duration-fast ease-soft',
                          on ? 'border-gold/60 bg-gold/[0.12]' : 'border-ink/[0.09] bg-shell hover:border-ink/20'
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            'h-1.5 w-1.5 flex-none rounded-full transition-colors duration-fast',
                            on ? 'bg-gold-light' : 'bg-ink/25'
                          )}
                        />
                        <span className={cn('t-small', on ? 'text-ink' : 'text-ink/75')}>{ID_TO_PROVINCE[id].name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </Panel>
    </Reveal>
  );
}
