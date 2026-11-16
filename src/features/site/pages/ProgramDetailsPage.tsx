import { paths } from '@/app/paths';
import {
  accessOptions, communityItems, howItWorks, mentorNetwork, mentorNetworkNotes, overview, pilotFocus,
  portalFeatures, programGoals, studentOutcomes,
} from '@/data/program';
import type { TitledItem } from '@/types';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';
import { ButtonLink } from '@/shared/ui/Button';
import Icon from '@/shared/ui/Icon';
import PageHeader from '@/shared/ui/PageHeader';
import Section from '@/shared/ui/Section';

/** A hairline-separated list of title + description rows. */
function DefinitionRows({ items, label }: { items: TitledItem[]; label?: (index: number) => string }) {
  return (
    <dl className="border-t border-line">
      {items.map((item, index) => (
        <div key={item.title} className="grid gap-1 border-b border-line py-5 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-10">
          <dt className="font-display text-lg font-bold">
            {label && <span className="mb-1 block text-sm font-semibold tracking-wider text-accent uppercase">{label(index)}</span>}
            {item.title}
          </dt>
          <dd className="text-muted">{item.description}</dd>
        </div>
      ))}
    </dl>
  );
}

/** A simple checked list for short statements. */
function CheckList({ items, columns = 1 }: { items: string[]; columns?: 1 | 2 }) {
  return (
    <ul className={columns === 2 ? 'grid gap-x-10 gap-y-3 md:grid-cols-2' : 'grid gap-3'}>
      {items.map(item => (
        <li key={item} className="flex gap-3">
          <span className="mt-0.5 text-green"><Icon name="check" size={20}/></span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ProgramDetailsPage() {
  useDocumentTitle('Program details');
  return (
    <>
      <div className="container-page pt-16 md:pt-20">
        <PageHeader eyebrow="Program details" title="How the program" muted="fits together." lede={overview[0]}>
          <ButtonLink to={paths.modulesSection} variant="outline">See the seven modules</ButtonLink>
        </PageHeader>
        <p className="max-w-3xl text-muted">{overview[1]}</p>
      </div>

      <Section id="how-it-works" eyebrow="How it works" title="Learn, practice," muted="then get feedback.">
        <DefinitionRows items={howItWorks} label={index => howItWorks[index]?.step ?? ''}/>
      </Section>

      <Section id="goals" eyebrow="Program goals" title="What the program" muted="is built to do." className="bg-tint">
        <CheckList items={programGoals} columns={2}/>
      </Section>

      <Section id="outcomes" eyebrow="Outcomes" title="What students" muted="leave with.">
        <CheckList items={studentOutcomes} columns={2}/>
      </Section>

      <Section
        id="portal"
        eyebrow="Student portal"
        title="Your program," muted="in one place."
        lede="The website works as a student portal, so registration, payment, module access, assignments, resources, workshops, and feedback are managed from one location."
        className="bg-tint"
      >
        <DefinitionRows items={portalFeatures}/>
      </Section>

      <Section id="options" eyebrow="Program options" title="Pay only for" muted="what you need." lede="Purchase individual modules, or choose a bundled package.">
        <DefinitionRows items={accessOptions}/>
        <p className="mt-6 text-sm text-subtle">Pricing will be announced before registration opens.</p>
      </Section>

      <Section
        id="mentors"
        eyebrow="Mentors and reviewers"
        title="Feedback from people" muted="who have been there."
        lede="Individual reviews and check-ins come from a network of people who have successfully navigated the dental school application process."
        className="bg-tint"
      >
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-lg">Who is in the network</h3>
            <CheckList items={mentorNetwork}/>
          </div>
          <div>
            <h3 className="mb-4 text-lg">How it works</h3>
            <ul className="grid gap-3 text-muted">{mentorNetworkNotes.map(note => <li key={note}>{note}</li>)}</ul>
          </div>
        </div>
      </Section>

      <Section
        id="community"
        eyebrow="Community"
        title="Go through it" muted="with others."
        lede="The program is primarily digital, but applicants should not have to navigate the process alone. Community activities connect students with each other and with mentors throughout the application cycle."
      >
        <DefinitionRows items={communityItems}/>
      </Section>

      <Section
        id="pilot"
        eyebrow="Pilot cohort"
        title="Starting small," muted="built to improve."
        lede="Before a full launch, D4Y will run the program with a small pilot cohort. Feedback from pilot students will be used to improve the workshops, reviews, and platform before the official launch."
        className="bg-tint"
      >
        <h3 className="mb-4 text-lg">The pilot will evaluate</h3>
        <CheckList items={pilotFocus} columns={2}/>
        <p className="mt-8 rounded-card border border-line bg-card p-5">
          <strong>Interested in the pilot?</strong> Dates, pricing, and registration details will be announced.
        </p>
      </Section>
    </>
  );
}
