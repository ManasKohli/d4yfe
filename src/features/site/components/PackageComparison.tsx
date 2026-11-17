import type { PackageFeature, ProgramPackage } from '@/types';
import Icon from '@/shared/ui/Icon';

interface PackageComparisonProps {
  packages: ProgramPackage[];
  features: PackageFeature[];
  labels: { feature: string; included: string; notIncluded: string };
  /** Id of the heading that names the table. */
  labelledBy: string;
}

function Cell({ value, labels }: { value: boolean | string; labels: PackageComparisonProps['labels'] }) {
  if (value === true) {
    return (
      <span className="inline-flex align-middle text-green">
        <Icon name="check" size={20}/>
        <span className="sr-only">{labels.included}</span>
      </span>
    );
  }
  if (value === false) {
    return (
      <>
        <span aria-hidden className="text-subtle">–</span>
        <span className="sr-only">{labels.notIncluded}</span>
      </>
    );
  }
  return <span className="text-xs font-medium text-ink hyphens-auto md:text-sm">{value}</span>;
}

/** Feature-by-package matrix with row headers. Fits 390px without scrolling: fixed layout, narrow padding and centered columns on phones. */
export default function PackageComparison({ packages, features, labels, labelledBy }: PackageComparisonProps) {
  return (
    <>
      <dl className="mb-6 grid gap-3 md:hidden">
        {packages.map(pkg => (
          <div key={pkg.name}>
            <dt className="font-medium text-ink">{pkg.name}</dt>
            <dd className="text-muted">{pkg.summary}</dd>
          </div>
        ))}
      </dl>
      <div className="rounded-table border border-line bg-card">
        <table aria-labelledby={labelledBy} className="w-full table-fixed text-left">
          <colgroup>
            <col className="w-[27%] md:w-[34%]"/>
            {packages.map(pkg => <col key={pkg.name}/>)}
          </colgroup>
          <thead>
            <tr>
              <th scope="col" className="border-b border-line px-2 py-4 align-bottom text-sm font-medium text-muted md:px-5 md:py-5">
                {labels.feature}
              </th>
              {packages.map(pkg => (
                <th key={pkg.name} scope="col" className="border-b border-line px-1 py-4 text-center align-top md:px-5 md:py-5 md:text-left">
                  <span className="block font-display text-sm font-bold text-ink md:text-xl">{pkg.name}</span>
                  <span className="mt-1 hidden text-sm font-normal text-muted md:block">{pkg.summary}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {features.map(feature => (
              <tr key={feature.label}>
                <th scope="row" className="px-2 py-4 text-sm font-medium text-ink md:px-5 md:text-base">
                  {feature.label}
                </th>
                {feature.values.map((value, i) => (
                  <td key={packages[i]?.name ?? i} className="px-1 py-4 text-center md:px-5 md:text-left">
                    <Cell value={value} labels={labels}/>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
