import { Link } from 'react-router';
import Eyebrow from '../components/Eyebrow.jsx';
import Icon from '../components/Icon.jsx';
import Reveal from '../components/Reveal.jsx';
import { accessOptions, communityItems, mentorNetwork, pilotFocus, portalFeatures } from '../data/program.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { paths } from '../routes.js';

const pad = (number) => String(number).padStart(2, '0');

function PortalSection() {
  return (
    <section className="portal-section" id="portal">
      <div className="section-wrap portal-wrap">
        <Reveal className="portal-heading">
          <Eyebrow>STUDENT PORTAL</Eyebrow>
          <h2>Your program,<br/><em>in one place.</em></h2>
          <p>The website works as a student portal, so registration, payment, module access, assignments, resources, workshops, and feedback are managed from one location.</p>
        </Reveal>
        <div className="portal-grid">
          {portalFeatures.map((feature, index) => (
            <Reveal key={feature.label} delay={index * 90}>
              <article className="portal-card"><span className="portal-number">{feature.label.toUpperCase()}</span><div className="portal-icon"><Icon name={feature.icon}/></div><h3>{feature.title}</h3><p>{feature.description}</p></article>
            </Reveal>
          ))}
        </div>
        <Reveal className="access-options" id="options">
          <div className="access-head"><span>PROGRAM OPTIONS</span><p>Purchase only what you need, or choose a bundled package.</p></div>
          <div className="access-list">
            {accessOptions.map((option, index) => (
              <div key={option.title}><b>{pad(index + 1)}</b><span><strong>{option.title}</strong><small>{option.description}</small></span></div>
            ))}
          </div>
          <p className="pricing-note">Pricing will be announced before registration opens.</p>
        </Reveal>
      </div>
    </section>
  );
}

function MentorSection() {
  return (
    <section className="goals-section section-wrap" id="mentors">
      <Reveal className="goals-heading">
        <div><Eyebrow>MENTORS &amp; REVIEWERS</Eyebrow><h2>Feedback from people<br/><em>who have been there.</em></h2></div>
        <p>Individual reviews and check-ins come from a network of people who have successfully navigated the dental school application process.</p>
      </Reveal>
      <div className="goals-layout">
        <Reveal className="outcomes-card">
          <div className="outcomes-label">THE REVIEWER NETWORK</div>
          <div className="outcomes-big">More than<br/><em>one perspective.</em></div>
          <ul className="outcomes-list">{mentorNetwork.map(item => <li key={item}>{item}</li>)}</ul>
        </Reveal>
        <div className="goals-list">
          <Reveal><div className="goal-row"><span>01</span><p>Reviewers are compensated per review or session.</p></div></Reveal>
          <Reveal delay={35}><div className="goal-row"><span>02</span><p>Students can choose the type of feedback they want.</p></div></Reveal>
          <Reveal delay={70}><div className="goal-row"><span>03</span><p>A network, rather than a single reviewer, lets the program support more students.</p></div></Reveal>
          <Reveal delay={105}><div className="goal-row"><span>04</span><p>Over time, the network becomes a formal D4Y Dental Mentor Network.</p></div></Reveal>
        </div>
      </div>
    </section>
  );
}

function CommunitySection() {
  return (
    <section className="community-section" id="community">
      <div className="section-wrap community-wrap">
        <Reveal className="community-copy">
          <Eyebrow tone="light">COMMUNITY</Eyebrow>
          <h2>Go through it<br/>with <em>others.</em></h2>
          <p>The program is primarily digital, but applicants should not have to navigate the process alone. Community activities connect students with each other and with mentors throughout the application cycle.</p>
          <Link className="button button-light" to={paths.pilotSection}>About the pilot cohort <Icon name="arrow" size={17}/></Link>
        </Reveal>
        <Reveal delay={120}>
          <div className="community-panel">
            <div className="community-panel-head"><span>COMMUNITY ACTIVITIES</span></div>
            <p className="community-quote">Going through the process with a community, not on your own.</p>
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

function PilotSection() {
  return (
    <section className="pilot-section" id="pilot">
      <div className="section-wrap pilot-wrap">
        <Reveal><Eyebrow tone="dark">PILOT COHORT</Eyebrow><h2>Starting small,<br/><em>built to improve.</em></h2></Reveal>
        <Reveal delay={100}>
          <div className="pilot-content">
            <p>Before a full launch, D4Y will run the program with a small pilot cohort. Feedback from pilot students will be used to improve the workshops, reviews, and platform before the official launch.</p>
            <p>The pilot will evaluate:</p>
            <div className="pilot-points">{pilotFocus.map(item => <span key={item}>{item}</span>)}</div>
            <div className="pilot-note"><p><strong>Interested in the pilot?</strong> Dates, pricing, and registration details will be announced.</p></div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function ProgramDetailsPage() {
  useDocumentTitle('How it works');
  return (
    <>
      <section className="support-page-intro program-page-intro section-wrap">
        <Eyebrow>HOW THE PROGRAM WORKS</Eyebrow>
        <h1>Platform, options,<br/><em>and people.</em></h1>
        <p>How the student portal, program options, mentor network, community, and pilot cohort fit together.</p>
        <Link to={paths.modulesSection} className="breadcrumb-link">← Program modules</Link>
      </section>
      <PortalSection/>
      <MentorSection/>
      <CommunitySection/>
      <PilotSection/>
    </>
  );
}
