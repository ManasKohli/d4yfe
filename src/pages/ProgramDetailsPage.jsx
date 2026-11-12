import { Link } from 'react-router';
import Eyebrow from '../components/Eyebrow.jsx';
import Icon from '../components/Icon.jsx';
import Reveal from '../components/Reveal.jsx';
import { accessOptions, communityItems, goals, pilotFocus, portalFeatures, studentOutcomes } from '../data/programDetails.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { paths } from '../routes.js';

const pad = (number) => String(number).padStart(2, '0');

function PortalSection() {
  return (
    <section className="portal-section">
      <div className="section-wrap portal-wrap">
        <Reveal className="portal-heading">
          <Eyebrow>YOUR PROGRAM, IN ONE PLACE</Eyebrow>
          <h2>Keep your next steps<br/><em>close at hand.</em></h2>
          <p>A student portal brings your modules, workshops, assignments, and feedback together in one place.</p>
        </Reveal>
        <div className="portal-grid">
          {portalFeatures.map((feature, index) => (
            <Reveal key={feature.label} delay={index * 90}>
              <article className="portal-card"><span className="portal-number">{feature.label}</span><div className="portal-icon"><Icon name={feature.icon}/></div><h3>{feature.title}</h3><p>{feature.description}</p></article>
            </Reveal>
          ))}
        </div>
        <Reveal className="access-options">
          <div className="access-head"><span>WAYS TO TAKE PART</span><p>Take only the modules you need, or choose a package.</p></div>
          <div className="access-list">
            {accessOptions.map((option, index) => (
              <div key={option.title}><b>{pad(index + 1)}</b><span><strong>{option.title}</strong><small>{option.description}</small></span></div>
            ))}
          </div>
          <p className="pricing-note">Pricing will be announced ahead of registration.</p>
        </Reveal>
      </div>
    </section>
  );
}

function CommunitySection() {
  return (
    <section className="community-section" id="community">
      <div className="section-wrap community-wrap">
        <Reveal className="community-copy">
          <Eyebrow tone="light">PEOPLE MAKE THE DIFFERENCE</Eyebrow>
          <h2>You don’t have to<br/>figure it out <em>alone.</em></h2>
          <p>Applications are personal, but you don’t have to work on them in isolation. Learn alongside other applicants and hear directly from people with dental school experience.</p>
          <Link className="button button-light" to={paths.goalsSection}>What the program is working toward <Icon name="arrow" size={17}/></Link>
        </Reveal>
        <Reveal delay={120}>
          <div className="community-panel">
            <div className="community-panel-head"><span>LEARNING TOGETHER</span></div>
            <div className="community-quote">“Going through the process with a community, not on your own.”</div>
            <div className="community-list">
              {communityItems.map(item => (
                <div key={item.title}><span><strong>{item.title}</strong><small>{item.description}</small></span></div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function GoalsSection() {
  return (
    <section className="goals-section section-wrap" id="goals">
      <Reveal className="goals-heading">
        <div><Eyebrow>WHAT WE’RE WORKING TOWARD</Eyebrow><h2>A stronger start<br/>to <em>what comes next.</em></h2></div>
        <p>The Dental Pathway Program makes reliable application guidance more accessible, organized, and personal.</p>
      </Reveal>
      <div className="goals-layout">
        <Reveal className="outcomes-card">
          <div className="outcomes-label">STUDENTS LEAVE WITH</div>
          <div className="outcomes-big">Clearer<br/><em>next steps.</em></div>
          <ul className="outcomes-list">{studentOutcomes.map(outcome => <li key={outcome}>{outcome}</li>)}</ul>
        </Reveal>
        <div className="goals-list">
          {goals.map((goal, index) => (
            <Reveal key={goal} delay={index * 35}><div className="goal-row"><span>{pad(index + 1)}</span><p>{goal}</p></div></Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function PilotSection() {
  return (
    <section className="pilot-section">
      <div className="section-wrap pilot-wrap">
        <Reveal><Eyebrow tone="dark">PILOT COHORT</Eyebrow><h2>Starting small,<br/><em>built to improve.</em></h2></Reveal>
        <Reveal delay={100}>
          <div className="pilot-content">
            <p>The program launches with a small pilot cohort. Feedback from pilot students will shape the workshops, reviews, and platform before the full launch.</p>
            <div className="pilot-points">{pilotFocus.map(item => <span key={item}>{item}</span>)}</div>
            <div className="pilot-note"><p><strong>Interested in the pilot?</strong> Dates and registration details will be shared soon.</p></div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function ProgramDetailsPage() {
  useDocumentTitle('Program Details');
  return (
    <>
      <section className="support-page-intro program-page-intro section-wrap">
        <Eyebrow>HOW THE PROGRAM WORKS</Eyebrow>
        <h1>Resources, feedback,<br/><em>and people in one place.</em></h1>
        <p>How the student portal, program options, community, and pilot cohort fit together.</p>
        <Link to={paths.applicationSupport} className="breadcrumb-link">← Application support modules</Link>
      </section>
      <PortalSection/>
      <CommunitySection/>
      <GoalsSection/>
      <PilotSection/>
    </>
  );
}
