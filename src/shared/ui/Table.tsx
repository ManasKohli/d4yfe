import type { ReactNode } from 'react';

export interface Column<Row> {
  header: string;
  cell: (row: Row) => ReactNode;
  /** Hide this column under 680px; the first column always shows. */
  hideOnPhone?: boolean;
}

interface TableProps<Row> {
  caption: string;
  columns: Column<Row>[];
  rows: Row[];
  rowKey: (row: Row) => string;
  /** Shown in place of the table when `rows` is empty. */
  empty: ReactNode;
}

/** A data table that scrolls sideways inside its own frame on small screens, so the page never does. */
export default function Table<Row>({ caption, columns, rows, rowKey, empty }: TableProps<Row>) {
  if (rows.length === 0) return <p className="rounded-table border border-dashed border-line-strong p-6 text-muted">{empty}</p>;
  return (
    <div className="overflow-x-auto rounded-table border border-line bg-card">
      <table className="w-full text-left text-base">
        <caption className="sr-only">{caption}</caption>
        <thead className="border-b border-line bg-surface text-sm text-muted">
          <tr>
            {columns.map(column => (
              <th key={column.header} scope="col" className={column.hideOnPhone ? 'hidden px-4 py-3 font-medium md:table-cell' : 'px-4 py-3 font-medium'}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map(row => (
            <tr key={rowKey(row)}>
              {columns.map(column => (
                <td key={column.header} className={column.hideOnPhone ? 'hidden px-4 py-3 align-top md:table-cell' : 'px-4 py-3 align-top'}>{column.cell(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
