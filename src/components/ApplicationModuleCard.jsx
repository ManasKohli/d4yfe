import Icon from './Icon.jsx';

/** Application-support module with a native <details> disclosure for its topic list. */
export default function ApplicationModuleCard({ module }) {
  return (
    <article className="module-card">
      <div className="module-number">{module.number}</div>
      <div className="module-icon"><Icon name={module.icon} size={23}/></div>
      <div className="module-main">
        <span className="module-tag">{module.tag}</span>
        <h3>{module.title}</h3>
        <p>{module.description}</p>
      </div>
      <details className="module-details">
        <summary aria-label={`More about ${module.title}`}><span>Explore topics</span><b>+</b></summary>
        <div className="details-content">
          <p>Topics may include:</p>
          <ul>{module.topics.map(topic => <li key={topic}>{topic}</li>)}</ul>
        </div>
      </details>
    </article>
  );
}
