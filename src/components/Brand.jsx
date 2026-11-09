import { Link } from 'react-router';
import Icon from './Icon.jsx';
import { paths } from '../routes.js';

export default function Brand({ className = 'brand', ...linkProps }) {
  return (
    <Link className={className} to={paths.home} {...linkProps}>
      <span className="brand-mark"><Icon name="tooth" size={22}/></span>
      <span className="brand-copy"><strong>D4Y</strong><small>DENTISTRY FOR YOUTH</small></span>
    </Link>
  );
}
