import { Link } from 'react-router';
import { paths } from '@/app/paths';
import Brand from '@/shared/components/Brand';

const footerLinks = [
  { label: 'Modules', to: paths.modulesSection },
  { label: 'How it works', to: paths.howItWorks },
  { label: 'Packages', to: paths.packages },
  { label: 'Mentors', to: paths.mentors },
  { label: 'Pilot cohort', to: paths.pilotSection },
  { label: 'Sign in', to: paths.login },
];

export default function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-line">
      <div className="container-page flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Brand/>
          <p className="mt-4 text-muted">Supporting students on the path to dentistry.</p>
        </div>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-10 gap-y-1">
            {footerLinks.map(link => (
              <li key={link.label}><Link to={link.to} className="inline-flex min-h-11 items-center text-ink-2 no-underline hover:underline">{link.label}</Link></li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="container-page">
        <p className="border-t border-line py-6 text-sm text-subtle">
          © {new Date().getFullYear()} Dentistry for Youth · Dental Pathway Program
        </p>
      </div>
    </footer>
  );
}
