import { Link } from 'react-router';
import Icon from './Icon.jsx';
import TagList from './TagList.jsx';
import { modulePath } from '../routes.js';

const hasOptionalDay = (module) => module.days.some(day => day.title.toLowerCase().includes('optional'));

export default function ModulePreviewCard({ module }) {
  return (
    <article className="module-preview">
      <div className="preview-meta"><span>MODULE {module.number}</span><span>{module.days.length} DAYS{hasOptionalDay(module) ? ' + OPTIONAL' : ''}</span></div>
      <h3>{module.title}</h3>
      <p>{module.summary}</p>
      <TagList tags={module.tags}/>
      <Link className="preview-link" to={modulePath(module.number)}>Open module <Icon name="arrow" size={16}/></Link>
    </article>
  );
}
