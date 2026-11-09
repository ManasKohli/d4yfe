import { Link } from 'react-router';
import Eyebrow from '../components/Eyebrow.jsx';
import Icon from '../components/Icon.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { paths } from '../routes.js';

export default function NotFoundPage() {
  useDocumentTitle('Page not found');
  return (
    <section className="support-page-intro section-wrap">
      <Eyebrow>PAGE NOT FOUND</Eyebrow>
      <h1>We couldn’t find<br/><em>that page.</em></h1>
      <p>The link may be out of date. Head back to the program overview or browse the learning modules.</p>
      <div className="hero-actions">
        <Link className="button button-dark" to={paths.modulesSection}>Explore the modules <Icon name="arrow" size={17}/></Link>
        <Link className="text-link" to={paths.home}>Back to overview</Link>
      </div>
    </section>
  );
}
