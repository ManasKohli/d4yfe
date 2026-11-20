import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { paths, portalModulePath } from '@/app/paths';
import { welcomeLesson } from '@/data/content';
import { enrollment, student } from '@/data/demo';
import { chapterCode, chapterSlug, findModule, modules } from '@/data/modules';
import { chapterTemplate, featureItemTypes, materialKinds, materialTypes, writtenOnlyNote } from '@/data/portal';
import LessonList from '@/features/student/components/LessonList';
import LessonPlayer from '@/features/student/components/LessonPlayer';
import MaterialAction from '@/features/student/components/MaterialAction';
import MaterialList, { type MaterialRow } from '@/features/student/components/MaterialList';
import { ApiError, getModuleContent } from '@/shared/api/mockApi';
import ModulePagination from '@/shared/components/ModulePagination';
import NotFoundPage from '@/shared/components/NotFoundPage';
import useAsync from '@/shared/hooks/useAsync';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';
import { cn } from '@/shared/lib/cn';
import { plural } from '@/shared/lib/format';
import Badge from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import Card from '@/shared/ui/Card';
import Icon from '@/shared/ui/Icon';
import PageHeader from '@/shared/ui/PageHeader';
import StatList from '@/shared/ui/StatList';
import type { Chapter as ChapterData, ChapterContent, ChapterItem, Lesson, Material, ModuleContent, ProgramModule, Video } from '@/types';

const isFeatureItem = (entry: ChapterItem) => (featureItemTypes as readonly string[]).includes(entry.type);
const outlineRow = (entry: ChapterItem, key: string): MaterialRow => ({ key, title: entry.title, label: materialTypes[entry.type] });

/**
 * The chapter's videos from the outline in modules.ts, shown when the API's content isn't available
 * (a module outside the package, or while loading). No player: only titles, codes and lengths.
 */
const outlineLessons = (code: string, videos: Video[]): Lesson[] => videos.map((video, index) => ({
  id: `outline-${code}-${index}`,
  moduleSlug: '',
  chapterSlug: null,
  code: videos.length > 1 ? `${code}${'abcdefghij'[index]}` : code,
  title: video.title,
  durationMin: video.minutes,
  videoProvider: null,
  videoRef: null,
  sortOrder: index,
  published: true,
}));

/** Material rows, with a player under a video material while it's open. */
function useMaterialRows(materials: Material[]): MaterialRow[] {
  const [playing, setPlaying] = useState<string | null>(null);
  return materials.map(material => ({
    key: material.id,
    title: material.title,
    label: materialKinds[material.kind],
    action: <MaterialAction material={material} playing={playing === material.id} onTogglePlay={() => setPlaying(current => (current === material.id ? null : material.id))}/>,
    detail: playing === material.id && material.videoProvider ? <LessonPlayer provider={material.videoProvider} title={material.title}/> : undefined,
  }));
}

function Chapter({ module, chapter, index, content }: { module: ProgramModule; chapter: ChapterData; index: number; content?: ChapterContent }) {
  const code = chapterCode(module, index);
  const otherTrack = chapter.track !== undefined && chapter.track !== student.track;
  const materialRows = useMaterialRows(content?.materials ?? []);
  const lessons = content ? content.lessons : outlineLessons(code, chapter.videos);
  const middle = content
    ? [...materialRows, ...chapter.materials.filter(isFeatureItem).map((entry, entryIndex) => outlineRow(entry, `feature-${entryIndex}`))]
    : chapter.materials.map((entry, entryIndex) => outlineRow(entry, `outline-${entryIndex}`));
  const rows: MaterialRow[] = [
    outlineRow({ type: 'text', title: chapterTemplate.summary }, 'summary'),
    ...middle,
    outlineRow({ type: 'callout', title: chapterTemplate.callouts }, 'callouts'),
  ];
  return (
    <section
      id={`chapter-${index + 1}`}
      aria-labelledby={`chapter-${index + 1}-title`}
      className={cn('scroll-mt-28 rounded-card border border-line bg-card p-5 md:p-6', otherTrack && 'opacity-70')}
    >
      <div className="mb-1 flex items-start justify-between gap-4">
        <h3 id={`chapter-${index + 1}-title`} className="text-lg"><span className="mr-2 text-subtle">{code}</span>{chapter.title}</h3>
        {chapter.track && <Badge label={`${chapter.track} only`} tone={otherTrack ? 'neutral' : 'active'}/>}
      </div>
      <p className="mb-4 text-sm text-muted">
        {lessons.length ? plural(lessons.length, 'video') : 'Written lesson'} · {plural(rows.length, 'item')}
      </p>
      {lessons.length > 0 && <LessonList lessons={lessons}/>}
      <MaterialList rows={rows}/>
    </section>
  );
}

function ModuleWide({ module, content }: { module: ProgramModule; content?: ModuleContent }) {
  const materialRows = useMaterialRows(content?.moduleWide ?? []);
  const rows = content
    ? [...materialRows, ...module.moduleWide.filter(isFeatureItem).map((entry, index) => outlineRow(entry, `feature-${index}`))]
    : module.moduleWide.map((entry, index) => outlineRow(entry, `outline-${index}`));
  return (
    <Card title="Across the module" headingLevel={3} className="bg-tint">
      <MaterialList rows={rows}/>
    </Card>
  );
}

const contentStats = (module: ProgramModule, content?: ModuleContent) => {
  if (!content) {
    // The outline's own counts, as the page showed before content came from the API.
    const videos = module.chapters.flatMap(chapter => chapter.videos);
    return {
      videos: videos.length + 1,
      minutes: videos.reduce((sum, video) => sum + video.minutes, welcomeLesson.minutes),
      materials: module.chapters.reduce((sum, chapter) => sum + chapter.materials.length, module.moduleWide.length),
    };
  }
  const lessons = [...content.welcome, ...content.chapters.flatMap(chapter => chapter.lessons)];
  const features = [...module.chapters.flatMap(chapter => chapter.materials), ...module.moduleWide].filter(isFeatureItem).length;
  return {
    videos: lessons.length,
    minutes: lessons.reduce((sum, lesson) => sum + lesson.durationMin, 0),
    materials: content.chapters.reduce((sum, chapter) => sum + chapter.materials.length, content.moduleWide.length) + features,
  };
};

export default function StudentModule() {
  const { slug = '' } = useParams();
  const module = findModule(slug);
  useDocumentTitle(module ? module.title : 'Module not found');
  const { data: content, error, loading, reload } = useAsync(`module:${slug}`, () => getModuleContent(slug));
  if (!module) return <NotFoundPage/>;

  const index = modules.indexOf(module);
  const status = enrollment[module.slug] ?? { status: 'available', done: 0 };
  const locked = status.status === 'available' || status.status === 'upcoming' || (error instanceof ApiError && error.code === 'not-enrolled');
  const failed = Boolean(error) && !locked;
  const stats = contentStats(module, content);
  const number = Number(module.number);
  const chapterContent = (chapter: ChapterData) => content?.chapters.find(item => item.slug === chapterSlug(chapter));

  return (
    <>
      <Link className="mb-6 inline-flex min-h-11 items-center gap-2 text-muted hover:text-ink" to={paths.student}>
        <span className="rotate-180"><Icon name="arrow" size={16}/></span> Your program
      </Link>
      <PageHeader eyebrow={`Module ${number} · ${module.track}`} title={module.title} lede={module.summary}>
        <Badge status={status.status}/>
        {status.note && <span className="text-sm text-muted">{status.note}</span>}
      </PageHeader>

      <StatList label="Module contents" stats={[
        { label: 'Chapters', value: module.chapters.length },
        { label: 'Videos', value: stats.videos },
        { label: 'Minutes of video', value: stats.minutes },
        { label: 'Materials', value: stats.materials },
      ]}/>

      {locked && <p className="mt-6 rounded-card bg-warn-soft p-4 text-warn">This module is not in your package yet. You can see the full outline below.</p>}
      {loading && !locked && <p className="mt-6 text-sm text-muted" role="status">Loading videos and materials…</p>}
      {failed && (
        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-card bg-warn-soft p-4 text-warn" role="alert">
          Videos and materials didn’t load. <Button variant="outline" onClick={reload}>Try again</Button>
        </div>
      )}

      <nav aria-label="Chapters" className="-mx-4 mt-8 overflow-x-auto px-4 md:mx-0 md:px-0">
        <ul className="flex w-max gap-2 md:w-auto md:flex-wrap">
          {module.chapters.map((chapter, chapterIndex) => (
            <li key={chapter.title}>
              <a href={`#chapter-${chapterIndex + 1}`} className="inline-flex min-h-11 items-center rounded-full border border-line bg-card px-4 text-ui whitespace-nowrap text-ink no-underline hover:border-line-strong">
                {chapterCode(module, chapterIndex)} {chapter.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-6 grid gap-4">
        <section aria-labelledby="chapter-0-title" className="rounded-card border border-line bg-card p-5 md:p-6">
          <h3 id="chapter-0-title" className="mb-4 text-lg"><span className="mr-2 text-subtle">{number}.0</span>Welcome</h3>
          {content
            ? content.welcome.length > 0 && <LessonList lessons={content.welcome}/>
            : <LessonList lessons={outlineLessons(`${number}.0`, [welcomeLesson])}/>}
          <p className="mb-2 font-medium">By the end of this module, you will be able to:</p>
          <ul className="grid gap-2">
            {module.outcomes.map(outcome => <li key={outcome} className="flex gap-3"><span className="mt-0.5 text-blue"><Icon name="check"/></span>{outcome}</li>)}
          </ul>
        </section>

        {module.chapters.map((chapter, chapterIndex) => (
          <Chapter key={chapter.title} module={module} chapter={chapter} index={chapterIndex} content={chapterContent(chapter)}/>
        ))}

        <ModuleWide module={module} content={content}/>
      </div>

      <p className="mt-6 text-sm text-muted">{writtenOnlyNote}</p>

      <ModulePagination previous={modules[index - 1]} next={modules[index + 1]} pathFor={portalModulePath}/>
    </>
  );
}
