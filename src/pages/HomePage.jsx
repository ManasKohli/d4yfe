import { Link } from 'react-router';
import Eyebrow from '../components/Eyebrow.jsx';
import Icon from '../components/Icon.jsx';
import ModulePreviewCard from '../components/ModulePreviewCard.jsx';
import Reveal from '../components/Reveal.jsx';
import { curriculum } from '../data/curriculum.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { paths } from '../routes.js';

const valueProps = [
  { title: 'Read critically', description: 'Understand papers and evidence types' },
  { title: 'Ask focused questions', description: 'Use PCC to shape a research question' },
  { title: 'Plan the review', description: 'Build aligned, feasible objectives' },
];

function Hero() {
  return (
    <section className="hero section-wrap" id="home">
      <div className="hero-copy">
        <Eyebrow>DENTISTRY FOR YOUTH <span className="eyebrow-rule"/> DENTAL RESEARCH PROGRAM</Eyebrow>
        <h1>Learn to read,<br/>question &amp; <em>plan research.</em></h1>
        <p className="hero-lede">Build research foundations step by step: understand scientific literature, develop a focused research question, and write clear objectives.</p>
        <div className="hero-actions">
          <Link className="button button-dark" to={paths.modulesSection}>Explore the modules <Icon name="arrow" size={17}/></Link>
          <Link className="text-link" to={paths.approachSection}>Learning approach <span>↓</span></Link>
        </div>
        <div className="hero-note"><span className="note-line"/> Three modules for the foundations of research</div>
      </div>
      <div className="hero-art" aria-label="Illustration of a student's dental research learning journey">
        <div className="art-wash"/>
        <div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/>
        <div className="art-label label-top"><span className="label-dot coral"/>YOUR RESEARCH JOURNEY</div>
        <div className="art-card main-card">
          <div className="card-top"><div className="mini-mark"><Icon name="tooth" size={17}/></div><span>RESEARCH, IN FOCUS</span></div>
          <div className="card-title">A question<br/><em>worth exploring.</em></div>
          <div className="progress-label"><span>LEARNING JOURNEY</span><span>01 / 03</span></div>
          <div className="progress-track"><span/></div>
          <div className="card-steps"><span className="step-active">Read</span><i/><span>Question</span><i/><span>Plan</span></div>
          <div className="card-bottom"><span>Three modules</span></div>
        </div>
        <div className="floating-note"><span className="floating-icon"><Icon name="spark" size={17}/></span><span><strong>Learn by doing</strong><small>Questions, practice, reflection.</small></span></div>
        <div className="art-caption">A clear structure for learning research</div>
      </div>
    </section>
  );
}

function IntroSection() {
  return (
    <section className="intro-section section-wrap">
      <Reveal className="intro-kicker"><span className="section-index">01</span><span>THE PROGRAM</span></Reveal>
      <div className="intro-content">
        <Reveal><h2>Research begins<br/><em>with good questions.</em></h2></Reveal>
        <Reveal delay={100}>
          <div className="intro-text">
            <p>This learning pathway builds core research skills in a clear sequence: read scientific literature, develop a research question, then set objectives that can guide a scoping review.</p>
            <p>Each module pairs key concepts with examples, discussion, peer review, and practice activities.</p>
            <Link to={paths.modulesSection} className="under-link">Explore the learning modules <Icon name="arrow" size={16}/></Link>
          </div>
        </Reveal>
      </div>
      <div className="value-strip">
        {valueProps.map((item, index) => (
          <div key={item.title}><span className="value-number">{String(index + 1).padStart(2, '0')}</span><strong>{item.title}</strong><small>{item.description}</small></div>
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
          <div><Eyebrow tone="dark">LEARNING MODULES</Eyebrow><h2>Build your research<br/><em>skills step by step.</em></h2></div>
          <p>Explore each module on its own page. Lessons, examples, and activities are arranged by day.</p>
        </Reveal>
        <div className="module-preview-grid">{curriculum.map(module => <ModulePreviewCard key={module.number} module={module}/>)}</div>
        <Link to={paths.applicationSupport} className="support-inline-link">Looking for dental school application guidance? <span>Explore application support <Icon name="arrow" size={15}/></span></Link>
      </div>
    </section>
  );
}

function ApproachSection() {
  return (
    <section className="approach-section section-wrap" id="approach">
      <Reveal className="approach-heading">
        <Eyebrow>LEARN BY DOING</Eyebrow>
        <h2>Read closely.<br/><em>Think it through.</em></h2>
        <p>Activities move from identifying evidence in real papers to refining research questions and reviewing objectives with peers. The emphasis is on understanding how research decisions fit together.</p>
      </Reveal>
      <div className="approach-grid">
        <Reveal><div className="approach-card"><span className="approach-index">01 / READ</span><div className="approach-visual visual-plan"><div className="plan-sheet"><i/><i/><i/><b>RESEARCH PAPER</b><span>✓</span></div><div className="plan-orb">01</div></div><h3>Understand the evidence.</h3><p>Identify literature types, examine paper sections, and consider how articles cite and build on previous research.</p></div></Reveal>
        <Reveal delay={100}><div className="approach-card"><span className="approach-index">02 / QUESTION</span><div className="approach-visual visual-practice"><div className="practice-bubble">Who? What? Where?</div><div className="practice-lines"><i/><i/><i/></div><span className="practice-spark">✳</span></div><h3>Shape a research question.</h3><p>Move from a topic to a researchable question, then use Population, Concept, and Context to check its focus.</p></div></Reveal>
        <Reveal delay={200}><div className="approach-card"><span className="approach-index">03 / OBJECTIVES</span><div className="approach-visual visual-refine"><div className="refine-paper"><b>REVIEW OBJECTIVES</b><i/><i/><i/><span>clear &amp; aligned ↗</span></div><div className="refine-pen">✎</div></div><h3>Plan a feasible review.</h3><p>Write primary and secondary objectives, align them to PCC, and refine them using SMART criteria and PRISMA-ScR.</p></div></Reveal>
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
      <ApproachSection/>
    </>
  );
}
