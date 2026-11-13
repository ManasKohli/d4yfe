/** Renders labelled [title, text] pairs used by several lesson layouts. */
function PairGrid({ className, items }) {
  return <div className={className}>{items.map(([title, text]) => <div key={title}><strong>{title}</strong><p>{text}</p></div>)}</div>;
}

/**
 * A single lesson section. Each optional field in the curriculum data maps to one layout:
 * intro/body/note (text), bullets (list), chips (pills), threeCols/fourCs/comparison (grids).
 */
export default function LessonCard({ section }) {
  return (
    <article className="lesson-card">
      <h5>{section.heading}</h5>
      {section.intro && <p>{section.intro}</p>}
      {section.body && <p>{section.body}</p>}
      {section.bullets && <ul>{section.bullets.map(item => <li key={item}>{item}</li>)}</ul>}
      {section.chips && <div className="lesson-chips">{section.chips.map(item => <span key={item}>{item}</span>)}</div>}
      {section.threeCols && <PairGrid className="concept-grid" items={section.threeCols}/>}
      {section.fourCs && <PairGrid className="framework-grid" items={section.fourCs}/>}
      {section.comparison && <PairGrid className="comparison-grid" items={section.comparison}/>}
      {section.note && <p className="lesson-note">{section.note}</p>}
    </article>
  );
}
