import Reveal from '@/lib/reveal';
import { METHOD } from '@/data/method';
import { cn } from '@/lib/utils';

export default function MethodSteps({ tone = 'light', className }) {
  const dark = tone === 'dark';

  return (
    <ol className={cn('grid gap-px overflow-hidden md:grid-cols-2 lg:grid-cols-5', dark ? 'bg-white/10' : 'bg-brand-ink/10', className)}>
      {METHOD.map((s, i) => (
        <Reveal
          as="li"
          key={s.n}
          delay={i * 80}
          className={cn('flex flex-col p-7 lg:p-8', dark ? 'bg-brand-dark' : 'bg-brand-cream')}
        >
          <span className={cn('font-display text-3xl font-light', dark ? 'text-brand-goldLight' : 'text-brand-gold')}>
            {s.n}
          </span>
          <h3 className={cn('mt-4 font-display text-xl font-light', dark ? 'text-white' : 'text-brand-ink')}>
            {s.title}
          </h3>
          <p className={cn('mt-2 text-[14px] font-light leading-[1.75]', dark ? 'text-white/50' : 'text-brand-ink/60')}>
            {s.text}
          </p>
        </Reveal>
      ))}
    </ol>
  );
}
