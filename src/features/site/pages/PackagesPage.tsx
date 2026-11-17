import { useId } from 'react';
import { modulePath, paths } from '@/app/paths';
import PackageComparison from '@/features/site/components/PackageComparison';
import { modules } from '@/data/modules';
import { packageFeatures, packagesPage, pilotFocus, programPackages } from '@/data/program';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';
import { ButtonLink } from '@/shared/ui/Button';
import Icon from '@/shared/ui/Icon';
import { List, ListRow } from '@/shared/ui/List';
import PageHeader from '@/shared/ui/PageHeader';
import Section from '@/shared/ui/Section';

/** Packages: pay only for what you need. Anchored by the package comparison table. */
export default function PackagesPage() {
  useDocumentTitle('Packages');
  const compareId = useId();
  const { intro, compare, hardship, pilot, cta } = packagesPage;

  return (
    <>
      <div className="container-page pt-16 pb-4 md:pt-24 md:pb-8">
        <PageHeader
          size="display"
          title={intro.title}
          lede={<><p>{intro.lede}</p><p className="mt-4 text-sm text-subtle">{packagesPage.pricingNote}</p></>}
        />
      </div>

      <Section headingId={compareId} title={compare.title}>
        <PackageComparison packages={programPackages} features={packageFeatures} labels={packagesPage.table} labelledBy={compareId}/>
      </Section>

      <Section layout="split" rule title={packagesPage.modules.title} lede={packagesPage.modules.lede}>
        <List>
          {modules.map(m => (
            <ListRow
              key={m.slug}
              to={modulePath(m.slug)}
              title={<><span className="mr-3 font-display text-subtle">{m.number}</span>{m.title}</>}
              trailing={<Icon name="arrow" size={18}/>}
            />
          ))}
        </List>
      </Section>

      <Section layout="split" rule title={hardship.title}>
        <p className="max-w-2xl text-xl text-ink">{hardship.lede}</p>
      </Section>

      <Section id="pilot" layout="split" className="bg-tint" title={pilot.title} lede={pilot.lede}>
        <h3 className="text-xl">{packagesPage.pilotFocusTitle}</h3>
        <ul className="mt-4 grid border-t border-line md:grid-cols-2 md:gap-x-10">
          {pilotFocus.map(item => <li key={item} className="border-b border-line py-3">{item}</li>)}
        </ul>
        <p className="mt-8 text-muted">{packagesPage.pilotCta}</p>
        <ButtonLink to={paths[cta.to]} className="mt-6">{cta.label}</ButtonLink>
      </Section>
    </>
  );
}
