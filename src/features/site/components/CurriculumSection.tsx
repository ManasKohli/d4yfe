import { chapterCode } from '@/data/modules';
import LessonCard from '@/features/site/components/LessonCard';
import Eyebrow from '@/shared/ui/Eyebrow';
import Icon from '@/shared/ui/Icon';
import type { ProgramModule } from '@/types';

/** Full content of one module: outcomes, each part (workshop, practice, review…), then the portal chapter outline. */
export default function CurriculumSection({ module }: { module: ProgramModule }) {
  return (
    <div className="mt-10 grid gap-12">
      <section aria-labelledby="outcomes-title" className="rounded-card border border-line bg-card p-6">
        <h2 id="outcomes-title" className="mb-4 text-lg">By the end of this module, you will be able to</h2>
        <ul className="grid gap-3 md:grid-cols-2">
          {module.outcomes.map(item => (
            <li key={item} className="flex gap-3"><span className="mt-0.5 text-green"><Icon name="check"/></span>{item}</li>
          ))}
        </ul>
      </section>

      {module.parts.map(part => (
        <section key={part.label} aria-label={`${part.label}: ${part.title}`}>
          <Eyebrow>{part.label}</Eyebrow>
          <h2 className="mb-5 text-2xl">{part.title}</h2>
          <div className="grid gap-8 md:grid-cols-2 md:gap-10">{part.sections.map(section => <LessonCard key={section.heading} section={section}/>)}</div>
        </section>
      ))}

      <section aria-labelledby="chapters-title">
        <Eyebrow>Chapters</Eyebrow>
        <h2 id="chapters-title" className="mb-5 text-2xl">In the student portal</h2>
        <ol className="border-t border-line">
          {module.chapters.map((chapter, index) => (
            <li key={chapter.title} className="flex min-h-12 items-baseline gap-4 border-b border-line py-3">
              <span className="w-10 shrink-0 font-display text-sm font-bold text-subtle">{chapterCode(module, index)}</span>
              <span className="flex-1">{chapter.title}</span>
              {chapter.track && <span className="text-sm text-muted">{chapter.track} only</span>}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
