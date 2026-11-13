/**
 * A single lesson section. Each optional field in the module data maps to one layout:
 * intro/body/note (text), bullets (list), chips (pills).
 */
export default function LessonCard({ section }) {
  return (
    <article className="lesson-card">
      <h4>{section.heading}</h4>
      {section.intro && <p>{section.intro}</p>}
      {section.body && <p>{section.body}</p>}
      {section.bullets && <ul>{section.bullets.map(item => <li key={item}>{item}</li>)}</ul>}
      {section.chips && <div className="lesson-chips">{section.chips.map(item => <span key={item}>{item}</span>)}</div>}
      {section.note && <p className="lesson-note">{section.note}</p>}
    </article>
  );
}
