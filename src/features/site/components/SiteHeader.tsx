import { paths } from '@/app/paths';
import Brand from '@/shared/components/Brand';
import { ButtonLink } from '@/shared/ui/Button';
import PillNav, { type PillNavLink } from '@/shared/ui/PillNav';

const links: PillNavLink[] = [
  { label: 'Modules', to: paths.modulesSection },
  { label: 'How it works', to: paths.howItWorks },
  { label: 'Packages', to: paths.packages },
  { label: 'Mentors', to: paths.mentors },
];

export default function SiteHeader() {
  return (
    <PillNav
      label="Main"
      brand={<Brand aria-label="D4Y Dental Pathway, home"/>}
      links={links}
      actions={(
        <>
          <ButtonLink to={paths.login} variant="ghost">Sign in</ButtonLink>
          <ButtonLink to={paths.packages}>See packages</ButtonLink>
        </>
      )}
    />
  );
}
