import { Link } from 'react-router';
import Eyebrow from '../components/Eyebrow.jsx';
import Icon from '../components/Icon.jsx';
import Reveal from '../components/Reveal.jsx';
import { accessOptions, communityItems, goals, pilotMetrics, portalFeatures, studentOutcomes } from '../data/programDetails.js';
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
          <p>The digital platform is designed as a central student portal, bringing the resources and touchpoints of your pathway together.</p>
        </Reveal>
        <div className="portal-grid">
          {portalFeatures.map((feature, index) => (
            <Reveal key={feature.label} delay={index * 90}>
              <article className="portal-card"><span className="portal-number">{feature.label}</span><div className="portal-icon"><Icon name={feature.icon}/></div><h3>{feature.title}</h3><p>{feature.description}</p></article>
            </Reveal>
          ))}
        </div>
        <Reveal className="access-options">
          <div className="access-head"><span>WAYS TO TAKE PART</span><p>Modular access keeps the program responsive to what each applicant needs.</p></div>
          <div className="access-list">
            {accessOptions.map((option, index) => (
              <div key={option.title}><b>{pad(index + 1)}</b><span><strong>{option.title}</strong><small>{option.description}</small></span><i>↗</i></div>
            ))}
          </div>
          <p className="pricing-note">Pricing would be set after researching comparable services, reviewer compensation, platform costs, and D4Y’s reinvestment goals.</p>
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
          <p>Applications may be personal, but the journey can be shared. D4Y’s community is designed to help applicants learn from one another and hear directly from people with dental school experience.</p>
          <Link className="button button-light" to={paths.goalsSection}>What the program is working toward <Icon name="arrow" size={17}/></Link>
        </Reveal>
        <Reveal delay={120}>
          <div className="community-panel">
            <div className="community-panel-head"><span>ROOM TO LEARN TOGETHER</span><span className="panel-spark">✳</span></div>
            <div className="community-quote">“Going through the process with a community, not on your own.”</div>
            <div className="community-list">
              {communityItems.map(item => (
                <div key={item.title}><span className="community-icon">{item.icon}</span><span><strong>{item.title}</strong><small>{item.description}</small></span></div>
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
        <p>The Dental Pathway Program aims to make reliable application guidance more accessible, organized, and personal.</p>
      </Reveal>
      <div className="goals-layout">
        <Reveal className="outcomes-card">
          <div className="outcomes-label">STUDENTS LEAVE WITH</div>
          <div className="outcomes-big">Clearer<br/><em>next steps.</em></div>
          <ul className="outcomes-list">{studentOutcomes.map(outcome => <li key={outcome}>{outcome}</li>)}</ul>
          <div className="outcomes-bottom"><span>CONFIDENCE IS BUILT ALONG THE WAY</span><span>✳</span></div>
        </Reveal>
        <div className="goals-list">
          {goals.map((goal, index) => (
            <Reveal key={goal} delay={index * 35}><div className="goal-row"><span>{pad(index + 1)}</span><p>{goal}</p><b>↗</b></div></Reveal>
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
        <Reveal><Eyebrow tone="dark">BUILT TO KEEP GETTING BETTER</Eyebrow><h2>Start thoughtfully.<br/><em>Learn as we go.</em></h2></Reveal>
        <Reveal delay={100}>
          <div className="pilot-content">
            <p>A small pilot cohort can help D4Y understand what works best before a full launch. Student feedback would guide improvements to the platform, workshops, reviewer experience, and pricing.</p>
            <div className="pilot-points">{pilotMetrics.map(metric => <span key={metric}>{metric}</span>)}</div>
            <div className="pilot-note"><span>✳</span><p><strong>Suggested pilot reviewer group.</strong> Start with 1–2 dental student reviewers for personal statements and application entries, 1–2 CASPer facilitators for mock scenarios and feedback, and 1–2 dental student mentors for a final check-in or Q&amp;A.</p></div>
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
        <p>Explore the proposed student portal, flexible program options, community, and pilot plan.</p>
        <Link to={paths.applicationSupport} className="breadcrumb-link">← Application support modules</Link>
      </section>
      <PortalSection/>
      <CommunitySection/>
      <GoalsSection/>
      <PilotSection/>
    </>
  );
}
