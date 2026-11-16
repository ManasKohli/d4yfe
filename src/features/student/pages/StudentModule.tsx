import { Link, useParams } from 'react-router';
import { paths, portalModulePath } from '@/app/paths';
import { enrollment, student } from '@/data/demo';
import { chapterCode, findModule, modules } from '@/data/modules';
import { chapterTemplate } from '@/data/portal';
import MaterialList from '@/features/student/components/MaterialList';
import ModulePagination from '@/shared/components/ModulePagination';
import NotFoundPage from '@/shared/components/NotFoundPage';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';
import { cn } from '@/shared/lib/cn';
import { plural } from '@/shared/lib/format';
import Badge from '@/shared/ui/Badge';
import Card from '@/shared/ui/Card';
import Icon from '@/shared/ui/Icon';
import PageHeader from '@/shared/ui/PageHeader';
import StatList from '@/shared/ui/StatList';
import type { Chapter as ChapterData, Material, ProgramModule, Video } from '@/types';

const WELCOME_MINUTES = 3;
const LETTERS = 'abcdefghij';

function VideoList({ code, videos }: { code: string; videos: Video[] }) {
  return (
    <ul className="mb-4 divide-y divide-line rounded-table bg-surface px-4">
      {videos.map((video, index) => (
        <li key={video.title} className="flex min-h-11 items-center gap-3 py-2">
          <span className="w-10 shrink-0 font-display text-sm font-bold text-subtle">{videos.length > 1 ? code + LETTERS[index] : code}</span>
          <span className="flex-1">{video.title}</span>
          <span className="text-sm text-muted">{video.minutes} min</span>
        </li>
      ))}
    </ul>
  );
}

function Chapter({ module, chapter, index }: { module: ProgramModule; chapter: ChapterData; index: number }) {
  const code = chapterCode(module, index);
  const otherTrack = chapter.track !== undefined && chapter.track !== student.track;
  const items: Material[] = [{ type: 'text', title: chapterTemplate.summary }, ...chapter.materials, { type: 'callout', title: chapterTemplate.callouts }];
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
        {chapter.videos.length ? plural(chapter.videos.length, 'video') : 'Written lesson'} · {plural(items.length, 'item')}
      </p>
      {chapter.videos.length > 0 && <VideoList code={code} videos={chapter.videos}/>}
      <MaterialList items={items}/>
    </section>
  );
}

export default function StudentModule() {
  const { slug } = useParams();
  const module = findModule(slug);
  useDocumentTitle(module ? module.title : 'Module not found');
  if (!module) return <NotFoundPage/>;

  const index = modules.indexOf(module);
  const status = enrollment[module.slug] ?? { status: 'available', done: 0 };
  const locked = status.status === 'available' || status.status === 'upcoming';
  const videoCount = module.chapters.reduce((sum, chapter) => sum + chapter.videos.length, 1);
  const minutes = module.chapters.reduce((sum, chapter) => sum + chapter.videos.reduce((total, video) => total + video.minutes, 0), WELCOME_MINUTES);
  const materialCount = module.chapters.reduce((sum, chapter) => sum + chapter.materials.length, module.moduleWide.length);
  const number = Number(module.number);

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
        { label: 'Videos', value: videoCount },
        { label: 'Minutes of video', value: minutes },
        { label: 'Materials', value: materialCount },
      ]}/>

      {locked && <p className="mt-6 rounded-card bg-warn-soft p-4 text-warn">This module is not in your package yet. You can see the full outline below.</p>}

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
          <VideoList code={`${number}.0`} videos={[{ title: 'Welcome and what you’ll walk away with', minutes: WELCOME_MINUTES }]}/>
          <p className="mb-2 font-medium">By the end of this module, you will be able to:</p>
          <ul className="grid gap-2">
            {module.outcomes.map(outcome => <li key={outcome} className="flex gap-3"><span className="mt-0.5 text-green"><Icon name="check"/></span>{outcome}</li>)}
          </ul>
        </section>

        {module.chapters.map((chapter, chapterIndex) => <Chapter key={chapter.title} module={module} chapter={chapter} index={chapterIndex}/>)}

        <Card title="Across the module" headingLevel={3} className="bg-tint">
          <MaterialList items={module.moduleWide}/>
        </Card>
      </div>

      <p className="mt-6 text-sm text-muted">Videos are added as they are recorded. Written summaries come first.</p>

      <ModulePagination previous={modules[index - 1]} next={modules[index + 1]} pathFor={portalModulePath}/>
    </>
  );
}
