import { materialTypes } from '../data/portal.js';

/** Chapter materials and module-wide items: title with its type. */
export default function MaterialList({ items, extra = [] }) {
  return (
    <ul className="item-list">
      {[...items, ...extra].map(entry => (
        <li key={`${entry.type}-${entry.title}`}>
          <span>{entry.title}</span>
          <small>{materialTypes[entry.type] ?? entry.type}</small>
        </li>
      ))}
    </ul>
  );
}
