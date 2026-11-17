import { cn } from '@/shared/lib/cn';
import Icon from '@/shared/ui/Icon';
import type { PackageInclude, PackageTier } from '@/types';

interface PackageTierCardsProps {
  tiers: PackageTier[];
  labels: { pricing: string; included: string; notIncluded: string };
}

function IncludeRow({ line, labels }: { line: PackageInclude; labels: PackageTierCardsProps['labels'] }) {
  const included = line.value !== false;
  return (
    <li className="flex items-start gap-3">
      <span
        aria-hidden
        className={cn(
          'inline-flex size-6 shrink-0 items-center justify-center rounded-full text-sm',
          included ? 'bg-green-soft text-green' : 'bg-surface text-subtle',
        )}
      >
        {included ? <Icon name="check" size={16}/> : '–'}
      </span>
      <span>
        <span className={included ? 'text-ink' : 'text-subtle'}>{line.label}</span>
        <span className="sr-only">: {included ? labels.included : labels.notIncluded}</span>
        {typeof line.value === 'string' && <span className="block text-sm text-muted">{line.value}</span>}
      </span>
    </li>
  );
}

/**
 * One card per package. From 900px the cards share grid rows (subgrid), so names, summaries,
 * the pricing line and the include lists start at the same height across all three.
 */
export default function PackageTierCards({ tiers, labels }: PackageTierCardsProps) {
  return (
    <ul className="grid gap-4 lg:grid-cols-3 lg:gap-y-0">
      {tiers.map(tier => (
        <li
          key={tier.name}
          className="flex flex-col rounded-card border border-line bg-card p-6 shadow-soft md:p-8 lg:row-span-4 lg:grid lg:grid-rows-subgrid"
        >
          <h3 className="text-2xl">{tier.name}</h3>
          <p className="mt-2 text-muted">{tier.summary}</p>
          <p className="mt-6 self-start justify-self-start rounded-full bg-surface px-3 py-1 text-sm text-muted">{labels.pricing}</p>
          <ul aria-label={`${tier.name} includes`} className="mt-6 grid content-start gap-3 border-t border-line pt-6">
            {tier.includes.map(line => <IncludeRow key={line.label} line={line} labels={labels}/>)}
          </ul>
        </li>
      ))}
    </ul>
  );
}
