import { Link } from 'react-router';
import { paths } from '@/app/paths.js';
import Eyebrow from '@/shared/components/Eyebrow.jsx';
import Icon from '@/shared/components/Icon.jsx';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle.js';

export default function NotFoundPage() {
  useDocumentTitle('Page not found');
  return (
    <section className="support-page-intro section-wrap">
      <Eyebrow>PAGE NOT FOUND</Eyebrow>
      <h1>We couldn’t find<br/><em>that page.</em></h1>
      <p>The link may be out of date. Head back to the program overview or browse the modules.</p>
      <div className="hero-actions">
        <Link className="button button-dark" to={paths.modulesSection}>Explore the modules <Icon name="arrow" size={17}/></Link>
        <Link className="text-link" to={paths.home}>Back to overview</Link>
      </div>
    </section>
  );
}
