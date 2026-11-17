import type { ReactNode } from 'react';
import Rings from '@/features/site/components/Rings';

/** Centered page opener for public inner pages, matching the home hero: one h1, one muted line, rings behind. */
export default function PageHero({ title, lede, children }: { title: string; lede: string; children?: ReactNode }) {
  return (
    <section className="relative isolate">
      <Rings/>
      <div className="container-page pt-14 pb-10 text-center md:pt-24 md:pb-14">
        <h1 className="mx-auto max-w-3xl text-4xl leading-[1.05] md:text-6xl">{title}</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted md:text-xl">{lede}</p>
        {children && <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>}
      </div>
    </section>
  );
}
