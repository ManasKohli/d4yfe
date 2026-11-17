import ClosingCta from '@/features/site/components/ClosingCta';
import GreenPanel, { PanelChips } from '@/features/site/components/GreenPanel';
import NumberCircle from '@/features/site/components/NumberCircle';
import PageHero from '@/features/site/components/PageHero';
import { howItWorks, howItWorksPage, portalDashboardItems, programGoals, studentOutcomes, submissionTypes } from '@/data/program';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';
import Icon from '@/shared/ui/Icon';
import Section from '@/shared/ui/Section';

const { intro, steps, portal, outcomes, goals, close } = howItWorksPage;

/** Every module runs Learn, Practice, Feedback; the three step cards are the page's anchor. */
export default function HowItWorksPage() {
  useDocumentTitle('How it works');
  return (
    <>
      <PageHero title={intro.title} lede={intro.lede}/>

      <Section title={steps.title} align="center" className="pt-4 md:pt-6">
        <ol className="grid gap-4 md:grid-cols-3">
          {howItWorks.map((step, index) => (
            <li key={step.step} className="rounded-panel border border-line bg-card p-6 shadow-soft md:p-8">
              <NumberCircle n={index + 1}/>
              <h3 className="mt-8 text-3xl">{step.step}</h3>
              <p className="mt-2 font-medium text-ink">{step.title}</p>
              <p className="mt-2 text-muted">{step.description}</p>
            </li>
          ))}
        </ol>
      </Section>

      <div className="container-page py-12 md:py-16">
        <GreenPanel title={portal.title} lede={portal.lede}>
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="mb-4 text-lg">{portal.dashboardTitle}</h3>
              <PanelChips items={portalDashboardItems}/>
            </div>
            <div>
              <h3 className="mb-4 text-lg">{portal.submitTitle}</h3>
              <PanelChips items={submissionTypes}/>
            </div>
          </div>
        </GreenPanel>
      </div>

      <Section title={outcomes.title} align="center">
        <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {studentOutcomes.map(outcome => (
            <li key={outcome} className="flex items-start gap-3 rounded-card border border-line bg-card p-5">
              <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-green-soft text-green"><Icon name="check" size={18}/></span>
              <span className="pt-1 font-medium text-ink">{outcome}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={goals.title} align="center">
        <ol className="grid gap-x-8 gap-y-5 rounded-panel bg-tint p-6 md:grid-cols-2 md:p-10 lg:grid-cols-3">
          {programGoals.map((goal, index) => (
            <li key={goal} className="flex items-start gap-3 text-ink">
              <NumberCircle n={index + 1} size="sm"/>
              <span className="pt-1">{goal}</span>
            </li>
          ))}
        </ol>
      </Section>

      <ClosingCta close={close}/>
    </>
  );
}
