import { useState } from 'react';
import LessonPlayer from '@/features/student/components/LessonPlayer';
import type { Lesson } from '@/types';

/** A chapter's published lesson videos: code, title and length, with the player under the one being watched. */
export default function LessonList({ lessons }: { lessons: Lesson[] }) {
  const [playing, setPlaying] = useState<string | null>(null);
  return (
    <ul className="mb-4 divide-y divide-line rounded-table bg-surface px-4">
      {lessons.map(lesson => (
        <li key={lesson.id} className="py-2">
          <div className="flex min-h-11 items-center gap-3">
            <span className="w-10 shrink-0 font-display text-sm font-bold text-subtle">{lesson.code}</span>
            <span className="flex-1">{lesson.title}</span>
            <span className="text-sm text-muted">{lesson.durationMin} min</span>
            {lesson.videoProvider && (
              <button
                type="button"
                aria-expanded={playing === lesson.id}
                aria-label={`${playing === lesson.id ? 'Close' : 'Watch'} ${lesson.code} ${lesson.title}`}
                onClick={() => setPlaying(current => (current === lesson.id ? null : lesson.id))}
                className="min-h-11 text-sm font-medium text-green hover:underline"
              >
                {playing === lesson.id ? 'Close' : 'Watch'}
              </button>
            )}
          </div>
          {playing === lesson.id && lesson.videoProvider && <LessonPlayer provider={lesson.videoProvider} title={lesson.title} code={lesson.code}/>}
        </li>
      ))}
    </ul>
  );
}
