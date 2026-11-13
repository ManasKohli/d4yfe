import { Link, useParams } from 'react-router';
import { paths, portalModulePath } from '@/app/paths.js';
import { enrollment, student } from '@/data/demo.js';
import { chapterCode, findModule, modules } from '@/data/modules.js';
import { chapterTemplate } from '@/data/portal.js';
import MaterialList from '@/features/student/components/MaterialList.jsx';
import ModulePagination from '@/shared/components/ModulePagination.jsx';
import NotFoundPage from '@/shared/components/NotFoundPage.jsx';
import PageHeader from '@/shared/components/PageHeader.jsx';
import Panel from '@/shared/components/Panel.jsx';
import StatList from '@/shared/components/StatList.jsx';
import StatusPill from '@/shared/components/StatusPill.jsx';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle.js';
import { plural } from '@/shared/lib/format.js';

const WELCOME_MINUTES = 3;
const LETTERS = 'abcdefghij';

function VideoList({ code, videos }) {
  return (
    <ul className="video-list">
      {videos.map((video, index) => (
        <li key={video.title}>
          <span className="video-code">{videos.length > 1 ? code + LETTERS[index] : code}</span>
          <span>{video.title}</span>
          <small>{video.minutes} min</small>
        </li>
      ))}
    </ul>
  );
}

function Chapter({ module, chapter, index }) {
  const code = chapterCode(module, index);
  const otherTrack = chapter.track && chapter.track !== student.track;
  return (
    <section className={`panel chapter ${otherTrack ? 'is-other-track' : ''}`} id={`chapter-${index + 1}`} aria-labelledby={`chapter-${index + 1}-title`}>
      <div className="panel-head">
        <h3 id={`chapter-${index + 1}-title`}><span className="chapter-code">{code}</span> {chapter.title}</h3>
        {chapter.track && <StatusPill label={`${chapter.track} only`} tone={otherTrack ? 'neutral' : 'active'}/>}
      </div>
      <p className="muted-line">{chapter.videos.length ? plural(chapter.videos.length, 'video') : 'Written lesson'} · {plural(chapter.materials.length + 2, 'item')}</p>
      {chapter.videos.length > 0 && <VideoList code={code} videos={chapter.videos}/>}
      <MaterialList
        items={[{ type: 'text', title: chapterTemplate.summary }, ...chapter.materials]}
        extra={[{ type: 'callout', title: chapterTemplate.callouts }]}
      />
    </section>
  );
}

export default function StudentModule() {
  const { slug } = useParams();
  const module = findModule(slug);
  useDocumentTitle(module ? module.title : 'Module not found');
  if (!module) return <NotFoundPage/>;

  const index = modules.indexOf(module);
  const status = enrollment[slug] ?? { status: 'available' };
  const locked = status.status === 'available' || status.status === 'upcoming';
  const videoCount = module.chapters.reduce((sum, chapter) => sum + chapter.videos.length, 1);
  const minutes = module.chapters.reduce((sum, chapter) => sum + chapter.videos.reduce((total, video) => total + video.minutes, 0), WELCOME_MINUTES);
  const materialCount = module.chapters.reduce((sum, chapter) => sum + chapter.materials.length, module.moduleWide.length);
  const number = Number(module.number);

  return (
    <>
      <Link className="breadcrumb-link" to={paths.student}>← Your program</Link>
      <PageHeader eyebrow={`MODULE ${number} · ${module.track.toUpperCase()}`} title={module.title} lede={module.summary}>
        <div className="head-meta"><StatusPill status={status.status}/>{status.note && <span className="muted-line">{status.note}</span>}</div>
      </PageHeader>

      <StatList label="Module contents" stats={[
        { label: 'Chapters', value: module.chapters.length },
        { label: 'Videos', value: videoCount },
        { label: 'Minutes of video', value: minutes },
        { label: 'Materials', value: materialCount },
      ]}/>

      {locked && (
        <p className="callout">This module is not in your package yet. You can see the full outline below.</p>
      )}

      <nav className="chapter-nav" aria-label="Chapters">
        {module.chapters.map((chapter, chapterIndex) => (
          <a key={chapter.title} href={`#chapter-${chapterIndex + 1}`}>{chapterCode(module, chapterIndex)} {chapter.title}</a>
        ))}
      </nav>

      <div className="stack">
        <section className="panel chapter" aria-labelledby="chapter-0-title">
          <div className="panel-head"><h3 id="chapter-0-title"><span className="chapter-code">{number}.0</span> Welcome</h3></div>
          <VideoList code={`${number}.0`} videos={[{ title: 'Welcome and what you’ll walk away with', minutes: WELCOME_MINUTES }]}/>
          <div className="outcomes-box">
            <strong>By the end of this module, you will be able to:</strong>
            <ul>{module.outcomes.map(outcome => <li key={outcome}>{outcome}</li>)}</ul>
          </div>
        </section>

        {module.chapters.map((chapter, chapterIndex) => <Chapter key={chapter.title} module={module} chapter={chapter} index={chapterIndex}/>)}

        <Panel title="Across the module" className="is-accent">
          <MaterialList items={module.moduleWide}/>
        </Panel>
      </div>

      <p className="muted-line page-note">Videos are added as they are recorded. Written summaries come first.</p>

      <ModulePagination previous={modules[index - 1]} next={modules[index + 1]} pathFor={portalModulePath}/>
    </>
  );
}
