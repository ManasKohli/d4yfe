import type { ReactNode } from 'react';

/** Small uppercase label above a heading. */
export default function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="mb-3 text-sm font-semibold tracking-wider text-accent uppercase">{children}</p>;
}
