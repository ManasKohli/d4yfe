import { paths } from '@/app/paths';
import GreenPanel from '@/features/site/components/GreenPanel';
import NumberCircle from '@/features/site/components/NumberCircle';
import PageHero from '@/features/site/components/PageHero';
import { communityItems, mentorNetwork, mentorNetworkNotes, mentorsPage } from '@/data/program';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';
import { ButtonLink } from '@/shared/ui/Button';
import Section from '@/shared/ui/Section';

export default function MentorsPage() {
  useDocumentTitle('Mentors');
  const { intro, network, howItWorks, community, cta } = mentorsPage;

  return (
    <>
      <PageHero title={intro.title} lede={intro.lede}/>

      <Section title={network.title} align="center" className="pt-4 md:pt-6">
        <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {mentorNetwork.map(role => (
            <li key={role} className="flex min-h-28 items-end rounded-panel border border-line bg-card p-6 font-display text-xl font-bold tracking-[-0.01em] text-ink shadow-soft md:min-h-36 md:text-2xl">
              {role}
            </li>
          ))}
        </ul>
      </Section>

      <Section title={howItWorks.title} align="center">
        <ol className="grid gap-4 md:grid-cols-3">
          {mentorNetworkNotes.map((note, index) => (
            <li key={note} className="rounded-panel bg-tint p-6 md:p-8">
              <NumberCircle n={index + 1} size="sm"/>
              <p className="mt-5 text-lg text-ink">{note}</p>
            </li>
          ))}
        </ol>
      </Section>

      <div className="container-page py-12 md:py-16">
        <GreenPanel id="community" title={community.title} lede={community.lede}>
          <ul className="mt-10 grid gap-3 md:grid-cols-2">
            {communityItems.map(item => (
              <li key={item.title} className="rounded-card bg-brand-raised p-5 md:p-6">
                <h3 className="text-lg">{item.title}</h3>
                <p className="mt-1 text-on-brand-muted">{item.description}</p>
              </li>
            ))}
          </ul>
          <ButtonLink to={paths[cta.to]} variant="inverse" className="mt-10">{cta.label}</ButtonLink>
        </GreenPanel>
      </div>
    </>
  );
}
