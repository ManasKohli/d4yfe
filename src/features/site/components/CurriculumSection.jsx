import { chapterCode } from '@/data/modules.js';
import LessonCard from '@/features/site/components/LessonCard.jsx';
import TagList from '@/shared/components/TagList.jsx';

/** Full content of one module: overview and outcomes, each part (workshop, practice, review…) with its lesson cards, then the chapter outline. */
export default function CurriculumSection({ module }) {
  return (
    <section className="curriculum-panel" aria-labelledby={`module-${module.slug}-title`}>
      <div className="curriculum-overview">
        <div className="curriculum-module-label">MODULE {module.number}</div>
        <h2 id={`module-${module.slug}-title`}>{module.title}</h2>
        <p>{module.summary}</p>
        <TagList tags={module.tags}/>
        {module.outcomes && (
          <div className="outcomes-box">
            <strong>By the end of this module, you will be able to:</strong>
            <ul>{module.outcomes.map(item => <li key={item}>{item}</li>)}</ul>
          </div>
        )}
      </div>
      <div className="curriculum-days">
        {module.parts.map(part => (
          <section className="curriculum-day" key={part.label} aria-label={`${part.label}: ${part.title}`}>
            <div className="day-heading"><span>{part.label.toUpperCase()}</span><h3>{part.title}</h3></div>
            <div className="lesson-grid">{part.sections.map(section => <LessonCard key={section.heading} section={section}/>)}</div>
          </section>
        ))}
        {module.chapters && (
          <section className="curriculum-day" aria-label="Chapters in the student portal">
            <div className="day-heading"><span>CHAPTERS</span><h3>In the student portal</h3></div>
            <ol className="chapter-outline">
              {module.chapters.map((chapter, index) => (
                <li key={chapter.title}>
                  <span className="chapter-code">{chapterCode(module, index)}</span>
                  <strong>{chapter.title}</strong>
                  {chapter.track && <small>{chapter.track} only</small>}
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </section>
  );
}
