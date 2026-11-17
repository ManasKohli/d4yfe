import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { modulePath, paths } from '@/app/paths';
import { modules } from '@/data/modules';
import {
  communityItems, hero, homeSection, howItWorks, mentorNetwork, mentorNetworkNotes, otherAccess, packages,
  pilotFocus, pilotNote, portalFeatures, pricingNote, programGoals, studentOutcomes, type HomeSectionId,
} from '@/data/program';
import HeroFunnel from '@/features/site/components/HeroFunnel';
import SchoolMarquee from '@/features/site/components/SchoolMarquee';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';
import { ButtonLink } from '@/shared/ui/Button';
import Icon from '@/shared/ui/Icon';
import Section from '@/shared/ui/Section';
import type { TitledItem } from '@/types';

function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate -mt-20 flex min-h-[44rem] flex-col justify-between pt-36 pb-10 md:min-h-[100svh] md:pt-44">
      <HeroFunnel/>
      <div className="container-page text-center">
        <h1 id="hero-title" className="animate-reveal mx-auto max-w-4xl text-hero leading-[1.02] tracking-[-0.045em] md:text-6xl lg:text-display">
          {hero.headline}<br/>
          <span className="bg-linear-to-b from-green to-sage bg-clip-text text-transparent">{hero.headlineMuted}</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl animate-reveal text-lg text-muted [animation-delay:120ms]">{hero.subline}</p>
        <div className="mt-9 flex animate-reveal flex-col justify-center gap-3 [animation-delay:240ms] md:flex-row">
          <ButtonLink to={paths.modulesSection} className="min-h-12 px-6">Explore the modules <Icon name="arrow" size={16}/></ButtonLink>
          <ButtonLink to={paths.howItWorksSection} variant="outline" className="min-h-12 px-6">How it works</ButtonLink>
        </div>
      </div>
      <div className="mt-16">
        <SchoolMarquee/>
      </div>
    </section>
  );
}

/** A landing-page section with the split heading, read from `homeSections` by id. */
function HomeSection({ id, band = false, children }: { id: HomeSectionId; band?: boolean; children: ReactNode }) {
  const { title, titleMuted, lede } = homeSection(id);
  return (
    <Section id={id} title={title} titleMuted={titleMuted} lede={lede} layout="split" className={band ? 'bg-band' : undefined}>
      {children}
    </Section>
  );
}

function CheckList({ items, columns = 1 }: { items: readonly string[]; columns?: 1 | 2 }) {
  return (
    <ul className={columns === 2 ? 'grid gap-x-10 gap-y-4 md:grid-cols-2' : 'grid gap-4'}>
      {items.map(item => (
        <li key={item} className="flex gap-3">
          <span className="mt-0.5 text-green"><Icon name="check" size={20}/></span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Title and description in columns, separated by a hairline above each. */
function Columns({ items, label }: { items: TitledItem[]; label?: (index: number) => string }) {
  const cols = items.length === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3';
  return (
    <ul className={`grid gap-8 ${cols}`}>
      {items.map((item, index) => (
        <li key={item.title} className="border-t-2 border-green/20 pt-5">
          {label && <p className="mb-3 font-display text-sm font-bold text-accent">{label(index)}</p>}
          <h3 className="text-lg">{item.title}</h3>
          <p className="mt-2 text-muted">{item.description}</p>
        </li>
      ))}
    </ul>
  );
}

function Modules() {
  return (
    <ol className="grid gap-2 md:grid-cols-2 md:gap-3 lg:grid-cols-4">
      {modules.map(module => (
        <li key={module.slug}>
          <Link
            to={modulePath(module.slug)}
            className="group flex h-full min-h-14 items-center gap-4 rounded-card border border-line bg-card px-4 py-3 no-underline shadow-soft transition-[border-color,box-shadow] hover:border-green/40 hover:shadow-lift md:min-h-40 md:flex-col md:items-start md:justify-between md:p-5"
          >
            <span className="font-display text-sm font-bold text-accent">{module.number}</span>
            <span className="flex-1 font-display text-lg leading-snug font-bold tracking-[-0.01em] text-balance text-ink md:flex-none">{module.title}</span>
            <span className="text-green transition-transform group-hover:translate-x-0.5 md:self-end"><Icon name="arrow" size={18}/></span>
          </Link>
        </li>
      ))}
    </ol>
  );
}

/** Package cards in the pricing-card shape: name, a ruled price band (no prices yet, so it carries the note), what it includes. */
function Packages() {
  return (
    <>
      <ul className="grid gap-4 lg:grid-cols-3">
        {packages.map(item => (
          <li key={item.name} className="flex flex-col gap-7 rounded-card border border-line bg-card p-7 shadow-soft">
            <div>
              <p className="text-sm font-semibold tracking-wider text-accent uppercase">Package</p>
              <h3 className="mt-1.5 text-2xl tracking-[-0.03em]">{item.name}</h3>
            </div>
            <p className="border-y border-line py-5 text-sm text-muted">{pricingNote}</p>
            <CheckList items={item.includes}/>
          </li>
        ))}
      </ul>
      <div className="mt-10"><Columns items={otherAccess}/></div>
    </>
  );
}

function Mentors() {
  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div>
        <h3 className="mb-5 text-lg">Who is in the network</h3>
        <CheckList items={mentorNetwork}/>
      </div>
      <div>
        <h3 className="mb-5 text-lg">How it works</h3>
        <ul className="grid gap-4 text-muted">{mentorNetworkNotes.map(note => <li key={note}>{note}</li>)}</ul>
      </div>
    </div>
  );
}

function Pilot() {
  return (
    <div className="rounded-card bg-green p-6 text-white shadow-lift md:p-10">
      <h3 className="mb-5 text-lg text-white">The pilot will evaluate</h3>
      <ul className="flex flex-wrap gap-2">
        {pilotFocus.map(item => (
          <li key={item} className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-ui">{item}</li>
        ))}
      </ul>
      <div className="mt-10 flex flex-col gap-5 border-t border-white/20 pt-6 md:flex-row md:items-center md:justify-between">
        <p className="text-on-green">{pilotNote}</p>
        <ButtonLink to={paths.modulesSection} variant="light">Explore the modules</ButtonLink>
      </div>
    </div>
  );
}

export default function HomePage() {
  useDocumentTitle();
  return (
    <>
      <Hero/>
      <HomeSection id="about"><CheckList items={programGoals} columns={2}/></HomeSection>
      <HomeSection id="modules" band><Modules/></HomeSection>
      <HomeSection id="how-it-works"><Columns items={howItWorks} label={index => `0${index + 1} · ${howItWorks[index]?.step ?? ''}`}/></HomeSection>
      <HomeSection id="portal" band><Columns items={portalFeatures}/></HomeSection>
      <HomeSection id="options"><Packages/></HomeSection>
      <HomeSection id="mentors" band><Mentors/></HomeSection>
      <HomeSection id="community"><Columns items={communityItems}/></HomeSection>
      <HomeSection id="outcomes" band><CheckList items={studentOutcomes} columns={2}/></HomeSection>
      <HomeSection id="pilot"><Pilot/></HomeSection>
    </>
  );
}
