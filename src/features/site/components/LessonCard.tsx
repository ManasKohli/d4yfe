import type { LessonSection } from '@/types';

/** One lesson section. Each optional field in the module data maps to one block. */
export default function LessonCard({ section }: { section: LessonSection }) {
  return (
    <article className="rounded-card border border-line bg-card p-5">
      <h3 className="mb-2 text-lg">{section.heading}</h3>
      <div className="grid gap-3 text-muted">
        {section.intro && <p>{section.intro}</p>}
        {section.body && <p>{section.body}</p>}
        {section.bullets && (
          <ul className="grid list-disc gap-1.5 pl-5 marker:text-line-strong">
            {section.bullets.map(item => <li key={item}>{item}</li>)}
          </ul>
        )}
        {section.chips && (
          <ul className="flex flex-wrap gap-2">
            {section.chips.map(item => <li key={item} className="rounded-full bg-tint px-3 py-1 text-sm text-ink-2">{item}</li>)}
          </ul>
        )}
        {section.note &&<p className="rounded-field bg-surface p-3 text-sm text-ink-2">{section.note}</p>}
      </div>
    </article>
  );
}
