import { Link } from 'react-router';
import { paths } from '@/app/paths';
import { howItWorks, howItWorksPage, portalDashboardItems, programGoals, studentOutcomes, submissionTypes } from '@/data/program';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';
import { ButtonLink } from '@/shared/ui/Button';
import Icon from '@/shared/ui/Icon';
import PageHeader from '@/shared/ui/PageHeader';
import Section from '@/shared/ui/Section';

const { intro, steps, portal, outcomes, goals, cta, modulesLink } = howItWorksPage;

/** A titled plain list for the portal section: no icons, hairlines between rows. */
function PortalList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-xl">{title}</h3>
      <ul className="mt-4 divide-y divide-line border-y border-line">
        {items.map(item => <li key={item} className="py-3">{item}</li>)}
      </ul>
    </div>
  );
}

/** Every module runs Learn, Practice, Feedback; the numbered steps are the page's anchor. */
export default function HowItWorksPage() {
  useDocumentTitle('How it works');
  return (
    <>
      <div className="container-page pt-16 pb-4 md:pt-24 md:pb-8">
        <PageHeader size="display" title={intro.title} lede={intro.lede}/>
      </div>

      <Section title={steps.title}>
        <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
          {howItWorks.map((step, index) => (
            <li key={step.step} className="border-t-2 border-green pt-6">
              <span aria-hidden className="font-display text-5xl font-bold text-green">{index + 1}</span>
              <h3 className="mt-6 text-2xl">{step.step}</h3>
              <p className="mt-2 font-medium text-ink">{step.title}</p>
              <p className="mt-2 text-muted">{step.description}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section layout="split" rule title={portal.title} lede={portal.lede}>
        <div className="grid gap-10 md:grid-cols-2">
          <PortalList title={portal.dashboardTitle} items={portalDashboardItems}/>
          <PortalList title={portal.submitTitle} items={submissionTypes}/>
        </div>
      </Section>

      <Section layout="split" rule title={outcomes.title}>
        <ul className="grid border-t border-line md:grid-cols-2 md:gap-x-10">
          {studentOutcomes.map(outcome => (
            <li key={outcome} className="border-b border-line py-4 font-display text-xl font-bold tracking-[-0.01em]">{outcome}</li>
          ))}
        </ul>
      </Section>

      <Section title={goals.title} className="bg-tint">
        <ol className="grid gap-x-10 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
          {programGoals.map((goal, index) => (
            <li key={goal} className="text-ink">
              {/* text-muted, not text-subtle: subtle falls below AA on the tint band. */}
              <span aria-hidden className="mr-2 font-medium text-muted tabular-nums">{String(index + 1).padStart(2, '0')}</span>
              {goal}
            </li>
          ))}
        </ol>
        <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3">
          <ButtonLink to={paths[cta.to]}>{cta.label}</ButtonLink>
          <Link to={paths.modulesSection} className="inline-flex min-h-11 items-center gap-1.5 font-medium text-green hover:underline">
            {modulesLink} <Icon name="arrow" size={16}/>
          </Link>
        </div>
      </Section>
    </>
  );
}
