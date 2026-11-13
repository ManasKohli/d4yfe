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
        <p>Choose individual modules or a package that fits your needs. Each one brings together workshops, resources, practice, and feedback.</p>
      </section>
      <section className="pathway-section">
        <div className="section-wrap pathway-wrap">
          <Reveal className="section-heading">
            <div><Eyebrow tone="dark">APPLICATION SUPPORT MODULES</Eyebrow><h2>Explore the areas<br/><em>where you need help.</em></h2></div>
            <p>Each module can stand alone or connect with the rest of your application plan.</p>
          </Reveal>
          <div className="application-support">
            <div className="module-list">{applicationModules.map(module => <ApplicationModuleCard key={module.number} module={module}/>)}</div>
            <div className="modules-footnote"><span>*</span> Individual reviews and mentor sessions are available in selected packages. Final application check-ins offer guidance, not an admissions evaluation.</div>
            <div className="reviewer-network">
              <div><span>MENTORS &amp; REVIEWERS</span><p>Feedback comes from people who have been through the process: current dental students, recent graduates, dentists, and D4Y alumni.</p></div>
              <p>Working with more than one reviewer means you can get the perspective that fits your application.</p>
            </div>
          </div>
          <Link to={paths.programDetails} className="program-details-link">See how the program works: packages, the student portal, and community <Icon name="arrow" size={16}/></Link>
        </div>
      </section>
    </>
  );
}
