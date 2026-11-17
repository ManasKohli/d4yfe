import { Link } from 'react-router';
import { paths, portalFeedbackPath, portalModulePath } from '@/app/paths';
import { assignments, enrollment, sessions, student } from '@/data/demo';
import { chapterCode, moduleLabel, modules } from '@/data/modules';
import { startHere } from '@/data/portal';
import { upNext } from '@/features/student/upNext';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';
import { formatDateTime, formatDay } from '@/shared/lib/format';
import Badge from '@/shared/ui/Badge';
import { ButtonLink } from '@/shared/ui/Button';
import Card from '@/shared/ui/Card';
import PageHeader from '@/shared/ui/PageHeader';
import ProgressBar from '@/shared/ui/ProgressBar';
import type { Enrollment, ProgramModule } from '@/types';

const panelLink = 'text-sm font-medium text-green hover:underline';

/** Where the student picks up: the in-progress module's current chapter. */
function findResume() {
  for (const module of modules) {
    const status = enrollment[module.slug];
    if (status?.status === 'in-progress' && status.current !== undefined) {
      const chapter = module.chapters[status.current];
      if (chapter) return { module, status, chapter, index: status.current };
    }
  }
  return null;
}

function UpNext({ resumeLink }: { resumeLink: string | null }) {
  const items = upNext(assignments);
  return (
    <Card title="Up next" action={<Link className={panelLink} to={`${paths.student}/assignments`}>All assignments</Link>}>
      {items.length === 0 ? (
        <p className="text-muted">
          Nothing due right now.{' '}
          {resumeLink && <Link to={resumeLink} className="font-medium text-green hover:underline">Continue your next chapter</Link>}
        </p>
      ) : (
        <ul className="divide-y divide-line">
          {items.map(item => (
            <li key={item.id} className="flex min-h-14 items-center justify-between gap-4 py-3">
              <div className="min-w-0">
                {item.status === 'feedback-ready' && item.feedbackId
                  ? <Link to={portalFeedbackPath(item.feedbackId)} className="font-medium text-ink hover:underline">{item.title}</Link>
                  : <p className="font-medium">{item.title}</p>}
                <p className="text-sm text-muted">{moduleLabel(item.module)} · {item.dateLabel} {formatDay(item.date)}</p>
              </div>
              <Badge status={item.status}/>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function ModuleRow({ module, status }: { module: ProgramModule; status: Enrollment }) {
  return (
    <li className="py-4">
      <div className="flex items-start justify-between gap-4">
        <Link to={portalModulePath(module.slug)} className="font-medium text-ink hover:underline">
          <span className="mr-2 font-display text-sm font-bold text-subtle">{module.number}</span>{module.title}
        </Link>
        <Badge status={status.status}/>
      </div>
      {status.done > 0 && (
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1"><ProgressBar value={status.done} max={module.chapters.length} label={`${module.title} progress`}/></div>
          <span className="text-sm text-muted">{status.done} of {module.chapters.length}</span>
        </div>
      )}
      {status.note && <p className="mt-2 text-sm text-muted">{status.note}</p>}
    </li>
  );
}

export default function StudentHome() {
  useDocumentTitle('Student portal');
  const resume = findResume();
  const resumeLink = resume ? `${portalModulePath(resume.module.slug)}#chapter-${resume.index + 1}` : null;
  const upcoming = [...sessions].sort((a, b) => a.start.localeCompare(b.start)).slice(0, 3);
  const orientationDone = student.startHereDone === startHere.chapters.length;

  return (
    <>
      <PageHeader title={`Welcome back, ${student.firstName}`} lede={`${student.package} · ${student.track} track · ${student.cycle}`}/>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="grid content-start gap-6">
          <UpNext resumeLink={resumeLink}/>

          {resume && resumeLink && (
            <Card label="Continue where you left off" title={`${chapterCode(resume.module, resume.index)} ${resume.chapter.title}`}>
              <p className="-mt-2 mb-4 text-sm text-muted">{moduleLabel(resume.module.slug)} · {resume.module.title}</p>
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex-1"><ProgressBar value={resume.status.done} max={resume.module.chapters.length} label={`${resume.module.title} progress`}/></div>
                <ButtonLink to={resumeLink}>Resume chapter</ButtonLink>
              </div>
            </Card>
          )}

          <Card title="Your program" action={<span className="text-sm text-muted">{modules.length} modules plus orientation</span>}>
            <ul className="divide-y divide-line">
              <li className="flex items-start justify-between gap-4 py-4">
                <span className="font-medium"><span className="mr-2 font-display text-sm font-bold text-subtle">00</span>{startHere.title}</span>
                <Badge status={orientationDone ? 'complete' : 'in-progress'}/>
              </li>
              {modules.map(module => (
                <ModuleRow key={module.slug} module={module} status={enrollment[module.slug] ?? { status: 'available', done: 0 }}/>
              ))}
            </ul>
          </Card>
        </div>

        <Card title="Coming up" className="content-start self-start" action={<Link className={panelLink} to={`${paths.student}/sessions`}>All sessions</Link>}>
          {upcoming.length === 0 ? <p className="text-muted">No sessions booked.</p> : (
            <ul className="divide-y divide-line">
              {upcoming.map(session => (
                <li key={session.id} className="py-3">
                  <p className="font-medium">{session.title}</p>
                  <p className="text-sm text-muted">{formatDateTime(session.start)}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
