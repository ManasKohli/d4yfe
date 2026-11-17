import { paths } from '@/app/paths';
import {
  accessOptions, communityItems, detailSections, detailsHeader, howItWorks, mentorNetwork, mentorNetworkNotes, overview,
  pilotFocus, portalFeatures, programGoals, studentOutcomes, type DetailSectionId,
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

/** Heading props for one section, read from `detailSections` so the jump list and headings never drift apart. */
function sectionHeading(id: DetailSectionId) {
  const section = detailSections.find(item => item.id === id);
  if (!section) throw new Error(`Unknown program details section: ${id}`);
  return { id, eyebrow: section.label, title: section.title, lede: 'lede' in section ? section.lede : undefined };
}

/** Jump list under the page heading: one link per section, in page order. */
function OnThisPage() {
  return (
    <nav aria-label="On this page" className="mt-10 border-t border-line pt-5">
      <p className="mb-2 text-sm font-medium text-subtle">On this page</p>
      <ul className="flex flex-wrap gap-x-6">
        {detailSections.map(section => (
          <li key={section.id}>
            <a href={`#${section.id}`} className="inline-flex min-h-11 items-center text-ui text-ink-2 no-underline hover:text-green hover:underline">
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function ProgramDetailsPage() {
  useDocumentTitle('Program details');
  return (
    <>
      <div className="container-page pt-16 md:pt-20">
        <PageHeader eyebrow={detailsHeader.eyebrow} title={detailsHeader.title} lede={overview[0]}>
          <ButtonLink to={paths.modulesSection} variant="outline">See the seven modules</ButtonLink>
        </PageHeader>
        <p className="max-w-3xl text-muted">{overview[1]}</p>
        <OnThisPage/>
      </div>

      <Section {...sectionHeading('how-it-works')}>
        <DefinitionRows items={howItWorks} label={index => howItWorks[index]?.step ?? ''}/>
      </Section>

      <Section {...sectionHeading('goals')} className="bg-tint">
        <CheckList items={programGoals} columns={2}/>
      </Section>

      <Section {...sectionHeading('outcomes')}>
        <CheckList items={studentOutcomes} columns={2}/>
      </Section>

      <Section {...sectionHeading('portal')} className="bg-tint">
        <DefinitionRows items={portalFeatures}/>
      </Section>

      <Section {...sectionHeading('options')}>
        <DefinitionRows items={accessOptions}/>
        <p className="mt-6 text-sm text-subtle">Pricing will be announced before registration opens.</p>
      </Section>

      <Section {...sectionHeading('mentors')} className="bg-tint">
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

      <Section {...sectionHeading('community')}>
        <DefinitionRows items={communityItems}/>
      </Section>

      <Section {...sectionHeading('pilot')} className="bg-tint">
        <h3 className="mb-4 text-lg">The pilot will evaluate</h3>
        <CheckList items={pilotFocus} columns={2}/>
        <p className="mt-8 rounded-card border border-line bg-card p-5">
          <strong>Interested in the pilot?</strong> Dates, pricing, and registration details will be announced.
        </p>
      </Section>
    </>
  );
}
