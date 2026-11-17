import { useId } from 'react';
import { paths } from '@/app/paths';
import { ButtonLink } from '@/shared/ui/Button';
import type { PageClose } from '@/types';

/** The last block on a public page: one heading, one line, up to two buttons. */
export default function ClosingCta({ close }: { close: PageClose }) {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} className="py-12 md:py-16">
      <div className="container-page">
        <div className="rounded-panel border border-line bg-card px-6 py-12 text-center shadow-soft md:py-16">
          <h2 id={headingId} className="mx-auto max-w-2xl text-3xl md:text-4xl">{close.title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted">{close.lede}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 md:flex-row">
            {close.actions.slice(0, 2).map((action, index) => (
              <ButtonLink key={action.label} to={paths[action.to]} variant={index === 0 ? 'solid' : 'outline'}>{action.label}</ButtonLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
