import type { ReactNode } from 'react';

export interface MaterialRow {
  key: string;
  title: ReactNode;
  /** The item's type, e.g. "Template" or "Assignment". */
  label: string;
  /** Open, download or watch, for uploaded and linked materials. */
  action?: ReactNode;
  /** Shown under the row, e.g. a video player. */
  detail?: ReactNode;
}

/** Chapter materials and module-wide items: title with its type, and an action for files and links. */
export default function MaterialList({ rows }: { rows: MaterialRow[] }) {
  return (
    <ul className="divide-y divide-line">
      {rows.map(row => (
        <li key={row.key} className="py-2">
          <div className="flex min-h-11 items-center justify-between gap-4">
            <span>{row.title}</span>
            <span className="flex shrink-0 items-center gap-4">
              <span className="text-sm text-muted">{row.label}</span>
              {row.action}
            </span>
          </div>
          {row.detail}
        </li>
      ))}
    </ul>
  );
}
