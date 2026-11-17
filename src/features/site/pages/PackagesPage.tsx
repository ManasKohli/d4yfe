import { useId } from 'react';
import { Link } from 'react-router';
import { modulePath, paths } from '@/app/paths';
import GreenPanel, { PanelChips } from '@/features/site/components/GreenPanel';
import PackageCards from '@/features/site/components/PackageCards';
import PageHero from '@/features/site/components/PageHero';
import { modules } from '@/data/modules';
import { packageFeatures, packagesPage, pilotFocus, programPackages } from '@/data/program';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';
import { ButtonLink } from '@/shared/ui/Button';
import Icon from '@/shared/ui/Icon';
import Section from '@/shared/ui/Section';

/** Packages: pay only for what you need. Anchored by the three package cards. */
export default function PackagesPage() {
  useDocumentTitle('Packages');
  const { intro, compare, hardship, pilot, cta } = packagesPage;
  const hardshipId = useId();

  return (
    <>
      <PageHero title={intro.title} lede={intro.lede}>
        <p className="rounded-full border border-line bg-card px-4 py-2 text-sm text-muted">{packagesPage.pricingNote}</p>
      </PageHero>

      <Section title={compare.title} align="center" className="pt-4 md:pt-6">
        <PackageCards packages={programPackages} features={packageFeatures} labels={packagesPage.included}/>
        <section aria-labelledby={hardshipId} className="mt-4 grid gap-3 rounded-panel bg-tint p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-10 md:p-8">
          <h3 id={hardshipId} className="text-2xl">{hardship.title}</h3>
          <p className="text-lg text-ink">{hardship.lede}</p>
        </section>
      </Section>

      <Section title={packagesPage.modules.title} lede={packagesPage.modules.lede} align="center">
        <ul className="flex flex-wrap justify-center gap-2">
          {modules.map(m => (
            <li key={m.slug}>
              <Link
                to={modulePath(m.slug)}
                className="group inline-flex min-h-12 items-center gap-3 rounded-full border border-line bg-card py-1.5 pr-4 pl-1.5 text-ink no-underline shadow-soft transition-colors hover:border-line-strong"
              >
                <span className="inline-flex size-9 items-center justify-center rounded-full bg-green-soft font-display text-sm font-bold text-green">{m.number}</span>
                <span className="font-medium">{m.title}</span>
                <span className="text-muted transition-transform group-hover:translate-x-0.5"><Icon name="arrow" size={16}/></span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <div className="container-page py-12 md:py-16">
        <GreenPanel id="pilot" title={pilot.title} lede={pilot.lede}>
          <h3 className="mt-8 mb-4 text-lg">{packagesPage.pilotFocusTitle}</h3>
          <PanelChips items={pilotFocus}/>
          <p className="mt-8 text-on-brand-muted">{packagesPage.pilotCta}</p>
          <ButtonLink to={paths[cta.to]} variant="inverse" className="mt-6">{cta.label}</ButtonLink>
        </GreenPanel>
      </div>
    </>
  );
}
