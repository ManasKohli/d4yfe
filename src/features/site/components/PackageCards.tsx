import Icon from '@/shared/ui/Icon';
import type { PackageFeature, ProgramPackage } from '@/types';

interface PackageCardsProps {
  packages: ProgramPackage[];
  features: PackageFeature[];
  labels: { included: string; notIncluded: string };
}

/** One card per package, each listing every feature as included (check), included with a qualifier, or not included (dash). */
export default function PackageCards({ packages, features, labels }: PackageCardsProps) {
  return (
    <ul className="grid gap-4 lg:grid-cols-3">
      {packages.map((pkg, column) => (
        <li key={pkg.name} className="flex flex-col rounded-panel border border-line bg-card p-6 shadow-soft md:p-8">
          <h3 className="text-2xl">{pkg.name}</h3>
          <p className="mt-2 text-muted">{pkg.summary}</p>
          <ul className="mt-6 grid gap-3 border-t border-line pt-6" aria-label={`${pkg.name} includes`}>
            {features.map(feature => {
              const value = feature.values[column] ?? false;
              const included = value !== false;
              return (
                <li key={feature.label} className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className={included
                      ? 'inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-green-soft text-green'
                      : 'inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-surface text-subtle'}
                  >
                    {included ? <Icon name="check" size={16}/> : '–'}
                  </span>
                  <span className="pt-0.5">
                    <span className={included ? 'text-ink' : 'text-subtle'}>{feature.label}</span>
                    <span className="sr-only">: {included ? labels.included : labels.notIncluded}</span>
                    {typeof value === 'string' && <span className="block text-sm text-muted">{value}</span>}
                  </span>
                </li>
              );
            })}
          </ul>
        </li>
      ))}
    </ul>
  );
}
