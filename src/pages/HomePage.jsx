import { Link } from 'react-router';
import Eyebrow from '../components/Eyebrow.jsx';
import Icon from '../components/Icon.jsx';
import ModulePreviewCard from '../components/ModulePreviewCard.jsx';
import Reveal from '../components/Reveal.jsx';
import { modules } from '../data/modules.js';
import { howItWorks, programGoals, studentOutcomes } from '../data/program.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { modulePath, paths } from '../routes.js';

const valueProps = [
  { title: 'Modular', description: 'Take only the modules you need' },
  { title: 'Practical', description: 'Workshops, assignments, and timed practice' },
  { title: 'Personal', description: 'Feedback from dental students and dentists' },
];

const pad = (number) => String(number).padStart(2, '0');

function Hero() {
  return (
    <section className="hero section-wrap" id="home">
      <div className="hero-copy">
        <Eyebrow>DENTISTRY FOR YOUTH <span className="eyebrow-rule"/> DENTAL PATHWAY PROGRAM</Eyebrow>
        <h1>A clear path to<br/><em>dental school.</em></h1>
        <p className="hero-lede">Structured, modular support for the dental school application: practical guidance, workshops, practice, and individual feedback from people who have been through the process.</p>
        <div className="hero-actions">
          <Link className="button button-dark" to={paths.modulesSection}>Explore the modules <Icon name="arrow" size={17}/></Link>
          <Link className="text-link" to={paths.howItWorksSection}>How it works <span>↓</span></Link>
        </div>
        <div className="hero-note"><span className="note-line"/> Five modules. Choose the ones you need.</div>
      </div>
      <div className="hero-art">
        <div className="art-wash"/>
        <div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/>
        <div className="art-card main-card">
          <div className="card-top"><div className="mini-mark"><Icon name="tooth" size={17}/></div><span>PROGRAM MODULES</span></div>
          <ol className="card-modules">
            {modules.map(module => (
              <li key={module.slug}><Link to={modulePath(module.slug)}><span>{module.number}</span>{module.title}</Link></li>
            ))}
          </ol>
          <div className="card-bottom"><span>Workshops · Practice · Individual review · Check-in</span></div>
        </div>
      </div>
    </section>
  );
}

function IntroSection() {
  return (
    <section className="intro-section section-wrap">
      <Reveal className="intro-kicker"><span className="section-index">01</span><span>THE PROGRAM</span></Reveal>
      <div className="intro-content">
        <Reveal><h2>Guidance for every<br/><em>part of the process.</em></h2></Reveal>
        <Reveal delay={100}>
          <div className="intro-text">
            <p>The Dental Pathway Program is a structured, digital program that supports aspiring dental students throughout the dental school application process. It brings practical guidance, workshops, application resources, practice opportunities, and individualized feedback into one place.</p>
            <p>Rather than one general program every student must complete, it is modular: students access and pay for the specific areas where they need support.</p>
            <Link to={paths.modulesSection} className="under-link">See the five modules <Icon name="arrow" size={16}/></Link>
          </div>
        </Reveal>
      </div>
      <div className="value-strip">
        {valueProps.map((item, index) => (
          <div key={item.title}><span className="value-number">{pad(index + 1)}</span><strong>{item.title}</strong><small>{item.description}</small></div>
        ))}
      </div>
    </section>
  );
}

function ModulesSection() {
  return (
    <section className="pathway-section" id="modules">
      <div className="section-wrap pathway-wrap">
        <Reveal className="section-heading">
          <div><Eyebrow tone="dark">MODULES</Eyebrow><h2>Independent modules,<br/><em>one application.</em></h2></div>
          <p>Each module stands alone. Together they cover the full application, from strategy to a final check-in.</p>
        </Reveal>
        <div className="module-preview-grid">{modules.map(module => <ModulePreviewCard key={module.slug} module={module}/>)}</div>
        <Link to={paths.programDetails} className="support-inline-link">Individual reviews and mentor sessions are included in selected packages. <span>Program options <Icon name="arrow" size={15}/></span></Link>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const visuals = [
    <div className="approach-visual visual-plan" key="plan"><div className="plan-sheet"><i/><i/><i/><b>WORKSHOP</b><span>✓</span></div><div className="plan-orb">01</div></div>,
    <div className="approach-visual visual-practice" key="practice"><div className="practice-bubble">What would you do?</div><div className="practice-lines"><i/><i/><i/></div></div>,
    <div className="approach-visual visual-refine" key="refine"><div className="refine-paper"><b>REVIEWER NOTES</b><i/><i/><i/><span>clear &amp; specific</span></div></div>,
  ];
  return (
    <section className="approach-section section-wrap" id="how-it-works">
      <Reveal className="approach-heading">
        <Eyebrow>HOW IT WORKS</Eyebrow>
        <h2>Learn, practice,<br/><em>then get feedback.</em></h2>
        <p>Every module follows the same pattern. Workshops teach the material, assignments and mock scenarios put it into practice, and reviewers respond to your actual work.</p>
      </Reveal>
      <div className="approach-grid">
        {howItWorks.map((step, index) => (
          <Reveal key={step.index} delay={index * 100}>
            <div className="approach-card">
              <span className="approach-index">{step.index.toUpperCase()}</span>
              {visuals[index]}
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function GoalsSection() {
  return (
    <section className="goals-section section-wrap" id="goals">
      <Reveal className="goals-heading">
        <div><Eyebrow>PROGRAM GOALS</Eyebrow><h2>What the program<br/><em>is built to do.</em></h2></div>
        <p>Reliable dental school application guidance, made more accessible, organized, and personal.</p>
      </Reveal>
      <div className="goals-layout">
        <Reveal className="outcomes-card">
          <div className="outcomes-label">STUDENTS LEAVE WITH</div>
          <div className="outcomes-big">A clearer<br/><em>application.</em></div>
          <ul className="outcomes-list">{studentOutcomes.map(outcome => <li key={outcome}>{outcome}</li>)}</ul>
        </Reveal>
        <div className="goals-list">
          {programGoals.map((goal, index) => (
            <Reveal key={goal} delay={index * 35}><div className="goal-row"><span>{pad(index + 1)}</span><p>{goal}</p></div></Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  useDocumentTitle();
  return (
    <>
      <Hero/>
      <IntroSection/>
      <ModulesSection/>
      <HowItWorksSection/>
      <GoalsSection/>
    </>
  );
}
