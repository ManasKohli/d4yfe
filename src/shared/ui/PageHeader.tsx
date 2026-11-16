import Eyebrow from '@/shared/ui/Eyebrow';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  muted?: string;
  lede?: ReactNode;
  children?: ReactNode;
}

/** The page's single h1, with an optional muted second line, lede and actions. */
export default function PageHeader({ eyebrow, title, muted, lede, children }: PageHeaderProps) {
  return (
    <header className="mb-8 max-w-3xl">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h1 className="text-3xl md:text-4xl">
        {title}
        {muted && <><br/><span className="text-heading-muted">{muted}</span></>}
      </h1>
      {lede && <p className="mt-3 text-lg text-muted">{lede}</p>}
      {children && <div className="mt-5 flex flex-wrap gap-3">{children}</div>}
    </header>
  );
}
