import { materialTypes } from '@/data/portal';
import type { Material } from '@/types';

/** Chapter materials and module-wide items: title with its type. */
export default function MaterialList({ items }: { items: Material[] }) {
  return (
    <ul className="divide-y divide-line">
      {items.map(entry => (
        <li key={`${entry.type}-${entry.title}`} className="flex min-h-11 items-center justify-between gap-4 py-2">
          <span>{entry.title}</span>
          <span className="shrink-0 text-sm text-muted">{materialTypes[entry.type]}</span>
        </li>
      ))}
    </ul>
  );
}
