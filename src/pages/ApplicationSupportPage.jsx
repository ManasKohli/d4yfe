import { Link } from 'react-router';
import ApplicationModuleCard from '../components/ApplicationModuleCard.jsx';
import Eyebrow from '../components/Eyebrow.jsx';
import Icon from '../components/Icon.jsx';
import Reveal from '../components/Reveal.jsx';
import { applicationModules } from '../data/applicationSupport.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { paths } from '../routes.js';

export default function ApplicationSupportPage() {
  useDocumentTitle('Application Support');
  return (
    <>
      <section className="support-page-intro section-wrap">
        <Eyebrow>DENTAL SCHOOL APPLICATION SUPPORT</Eyebrow>
        <h1>Guidance for each<br/><em>part of the process.</em></h1>
        <p>Choose individual modules or a package that fits your needs. The program is designed to bring resources, workshops, practice, and feedback together.</p>
      </section>
      <section className="pathway-section">
        <div className="section-wrap pathway-wrap">
          <Reveal className="section-heading">
            <div><Eyebrow tone="dark">APPLICATION SUPPORT MODULES</Eyebrow><h2>Explore the areas<br/><em>where you need help.</em></h2></div>
            <p>Each module can stand alone or connect with the rest of your application plan.</p>
          </Reveal>
          <div className="application-support">
            <div className="module-list">{applicationModules.map(module => <ApplicationModuleCard key={module.number} module={module}/>)}</div>
            <div className="modules-footnote"><span>*</span> Individualized reviews and mentorship may be available as selected options. Final application check-ins are guidance, not admissions evaluations.</div>
            <div className="reviewer-network">
              <div><span>MENTOR &amp; REVIEWER NETWORK</span><p>A future network could include current dental students, recent graduates, dentists, D4Y alumni, former board members, and other qualified application mentors.</p></div>
              <p>Reviewers could be compensated per review or session, allowing individualized feedback to scale beyond the executive team.</p>
            </div>
          </div>
          <Link to={paths.programDetails} className="program-details-link">Explore the digital platform, packages, community, goals, and pilot plan <Icon name="arrow" size={16}/></Link>
        </div>
      </section>
    </>
  );
}
