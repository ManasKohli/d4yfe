import { Link } from 'react-router';
import { modulePath } from '@/app/paths.js';
import Icon from '@/shared/components/Icon.jsx';
import TagList from '@/shared/components/TagList.jsx';

export default function ModulePreviewCard({ module }) {
  return (
    <article className="module-preview">
      <div className="preview-meta"><span>MODULE {module.number}</span><span>{module.tag.toUpperCase()}</span></div>
      <h3>{module.title}</h3>
      <p>{module.summary}</p>
      <TagList tags={module.tags}/>
      <Link className="preview-link" to={modulePath(module.slug)}>View module <Icon name="arrow" size={16}/></Link>
    </article>
  );
}
