import { Link } from 'react-router';
import Panel from '../../components/Panel.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import ProgressBar from '../../components/ProgressBar.jsx';
import StatusPill from '../../components/StatusPill.jsx';
import TagList from '../../components/TagList.jsx';
import { assignments, enrollment, sessions, student } from '../../data/demo.js';
import { chapterCode, moduleLabel, modules } from '../../data/modules.js';
import { startHere } from '../../data/portal.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import { formatDateTime, formatDay } from '../../lib/format.js';
import { paths, portalModulePath } from '../../routes.js';

function ChapterChips({ labels, done, current }) {
  return (
    <ol className="chapter-chips">
      {labels.map((label, index) => {
        const state = index < done ? 'is-done' : index === current ? 'is-current' : '';
        return <li key={label} className={state}>{label}{state === 'is-done' && <span className="visually-hidden"> (done)</span>}</li>;
      })}
    </ol>
  );
}

function ContinueCard({ module, status }) {
  const chapter = module.chapters[status.current];
  return (
    <Panel label="Continue where you left off" className="continue-card">
      <div className="continue-body">
        <div>
          <h2 className="continue-title">{chapterCode(module, status.current)} {chapter.title}</h2>
          <p className="muted-line">{moduleLabel(module.slug)} · {module.title}</p>
        </div>
        <Link className="button button-dark button-compact" to={`${portalModulePath(module.slug)}#chapter-${status.current + 1}`}>Resume chapter</Link>
      </div>
      <ProgressBar value={status.done} max={module.chapters.length} label={`${module.title} progress`}/>
    </Panel>
  );
}

function ModuleCard({ module, status }) {
  const locked = status.status === 'available' || status.status === 'upcoming';
  return (
    <article className={`panel module-card ${locked ? 'is-dashed' : ''}`}>
      <div className="panel-head">
        <h3><Link className="card-link" to={portalModulePath(module.slug)}>{Number(module.number)} · {module.title}</Link></h3>
        <StatusPill status={status.status}/>
      </div>
      {status.done > 0 && <ProgressBar value={status.done} max={module.chapters.length} label={`${module.title} progress`}/>}
      <ChapterChips labels={module.chapters.map((chapter, index) => `${chapterCode(module, index)} ${chapter.title}`)} done={status.done} current={status.current}/>
      {status.note && <p className="muted-line">{status.note}</p>}
    </article>
  );
}

export default function StudentHome() {
  useDocumentTitle('Student portal');
  const inProgress = modules.find(module => enrollment[module.slug]?.status === 'in-progress');
  const toDo = assignments.filter(item => item.status === 'not-started' || item.status === 'revise');
  const upcoming = [...sessions].sort((a, b) => a.start.localeCompare(b.start)).slice(0, 3);

  return (
    <>
      <PageHeader eyebrow="STUDENT PORTAL" title="Welcome back," muted={`${student.firstName}.`}>
        <TagList tags={[`${student.track} track`, student.package, student.cycle]}/>
      </PageHeader>

      <div className="app-layout">
        <div className="stack">
          {inProgress && <ContinueCard module={inProgress} status={enrollment[inProgress.slug]}/>}

          <section className="stack" aria-labelledby="program-title">
            <div className="section-row">
              <h2 id="program-title" className="app-h2">Your program</h2>
              <span className="muted-line">{modules.length} modules plus orientation</span>
            </div>
            <article className="panel module-card">
              <div className="panel-head">
                <h3>0 · {startHere.title}</h3>
                <StatusPill status={student.startHereDone === startHere.chapters.length ? 'complete' : 'in-progress'}/>
              </div>
              <ChapterChips labels={startHere.chapters} done={student.startHereDone}/>
            </article>
            {modules.map(module => <ModuleCard key={module.slug} module={module} status={enrollment[module.slug] ?? { status: 'available', done: 0 }}/>)}
          </section>
        </div>

        <aside className="stack" aria-label="Coming up">
          <Panel title="Coming up" action={<Link className="panel-link" to={`${paths.student}/sessions`}>All sessions</Link>}>
            <ul className="item-list">
              {upcoming.map(session => <li key={session.id}><span>{session.title}</span><small>{formatDateTime(session.start)}</small></li>)}
            </ul>
          </Panel>
          <Panel title="To do" action={<Link className="panel-link" to={`${paths.student}/assignments`}>All assignments</Link>}>
            <ul className="item-list">
              {toDo.map(item => (
                <li key={item.id}>
                  <span>{item.title}<small className="block">{moduleLabel(item.module)}{item.status === 'not-started' ? ` · Due ${formatDay(item.date)}` : ''}</small></span>
                  <StatusPill status={item.status}/>
                </li>
              ))}
            </ul>
          </Panel>
        </aside>
      </div>
    </>
  );
}
