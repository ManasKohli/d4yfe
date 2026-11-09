import LessonCard from './LessonCard.jsx';
import TagList from './TagList.jsx';

/** Full content of one curriculum module: overview, outcomes, then lessons grouped by day. */
export default function CurriculumSection({ module }) {
  return (
    <section className="curriculum-panel" aria-label={`Module ${module.number}: ${module.title}`}>
      <div className="curriculum-overview">
        <div className="curriculum-module-label">MODULE {module.number}</div>
        <h3>{module.title}</h3>
        <p>{module.summary}</p>
        {module.frameworks && <p className="framework-note"><strong>Frameworks used:</strong> {module.frameworks}</p>}
        <TagList tags={module.tags}/>
        {module.outcomes && (
          <div className="outcomes-box">
            <strong>By the end of this module, students should be able to:</strong>
            <ul>{module.outcomes.map(item => <li key={item}>{item}</li>)}</ul>
          </div>
        )}
      </div>
      <div className="curriculum-days">
        {module.days.map((day, dayIndex) => (
          <section className="curriculum-day" key={day.title}>
            <div className="day-heading"><span>DAY {dayIndex + 1}</span><h4>{day.title}</h4></div>
            <div className="lesson-grid">{day.sections.map(section => <LessonCard key={section.heading} section={section}/>)}</div>
          </section>
        ))}
      </div>
    </section>
  );
}
