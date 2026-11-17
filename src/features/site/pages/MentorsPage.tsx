import { paths } from '@/app/paths';
import { communityItems, mentorNetwork, mentorNetworkNotes, mentorsPage } from '@/data/program';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';
import { ButtonLink } from '@/shared/ui/Button';
import PageHeader from '@/shared/ui/PageHeader';
import Section from '@/shared/ui/Section';

export default function MentorsPage() {
  useDocumentTitle('Mentors');
  const { intro, network, howItWorks, community, cta } = mentorsPage;

  return (
    <>
      <div className="container-page pt-16 pb-4 md:pt-24 md:pb-8">
        <PageHeader size="display" title={intro.title} lede={intro.lede}/>
      </div>

      <Section title={network.title}>
        <ul className="grid border-t border-line md:grid-cols-2 md:gap-x-10 lg:grid-cols-3">
          {mentorNetwork.map((role) => (
            <li key={role} className="border-b border-line py-6 font-display text-2xl font-bold tracking-[-0.02em] text-ink md:py-8 md:text-3xl">
              {role}
            </li>
          ))}
        </ul>
      </Section>

      <Section title={howItWorks.title} layout="split" rule>
        <ul className="divide-y divide-line border-y border-line">
          {mentorNetworkNotes.map((note) => (
            <li key={note} className="py-5 text-lg text-ink md:text-xl">{note}</li>
          ))}
        </ul>
      </Section>

      <Section id="community" title={community.title} lede={community.lede} layout="split" className="bg-tint">
        <ul className="grid gap-8 md:grid-cols-2">
          {communityItems.map((item) => (
            <li key={item.title} className="border-t border-line-strong pt-4">
              <h3 className="text-lg">{item.title}</h3>
              <p className="mt-1 text-muted">{item.description}</p>
            </li>
          ))}
        </ul>
        <ButtonLink to={paths[cta.to]} className="mt-12">{cta.label}</ButtonLink>
      </Section>
    </>
  );
}
