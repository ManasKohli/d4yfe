import { useState, type FormEvent, type ReactNode } from 'react';
import { chapterCode, chapterSlug, findModule, moduleLabel, modules } from '@/data/modules';
import { libraryCategories, linkKinds, materialKinds } from '@/data/portal';
import {
  ApiError, createLesson, createMaterial, deleteLesson, deleteMaterial, getAdminContent, requestMaterialUploadUrl, updateLesson, updateMaterial,
  type LessonInput, type MaterialInput,
} from '@/shared/api/mockApi';
import FileUpload from '@/shared/components/FileUpload';
import useAsync from '@/shared/hooks/useAsync';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';
import { providerLabels, videoLinkFor } from '@/shared/lib/videoLinks';
import Badge from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import Card from '@/shared/ui/Card';
import { Field, Input, Select } from '@/shared/ui/Field';
import PageHeader from '@/shared/ui/PageHeader';
import StatList from '@/shared/ui/StatList';
import Table from '@/shared/ui/Table';
import type { Lesson, LibraryCategory, Material, MaterialKind, ModuleContent, Track, UploadedFile } from '@/types';

const moduleOptions = [...modules.map(module => ({ slug: module.slug, label: `${moduleLabel(module.slug)}: ${module.title}` })), { slug: 'start-here', label: 'Start here' }];
const tracks: (Track | 'Both')[] = ['Both', 'Canada', 'US'];
const isLinkKind = (kind: MaterialKind) => (linkKinds as readonly string[]).includes(kind);
const small = 'min-h-11 px-3';

/** Runs one change, shows its error, and reloads the module's content when it works. */
function useChange(onSaved: () => void) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const run = async (change: () => Promise<void>) => {
    setBusy(true);
    setError('');
    try {
      await change();
      onSaved();
      return true;
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : 'That didn’t save. Try again.');
      return false;
    } finally {
      setBusy(false);
    }
  };
  return { error, busy, run, setError };
}

function FormActions({ busy, onCancel, label }: { busy: boolean; onCancel: () => void; label: string }) {
  return (
    <div className="flex flex-wrap gap-3">
      <Button type="submit" disabled={busy}>{busy ? 'Saving…' : label}</Button>
      <Button variant="outline" onClick={onCancel}>Cancel</Button>
    </div>
  );
}

function Panel({ title, children, headingLevel = 4 }: { title: string; children: ReactNode; headingLevel?: 3 | 4 }) {
  const Heading = headingLevel === 3 ? 'h3' : 'h4';
  return (
    <div className="mt-4 grid gap-4 rounded-table border border-line bg-surface p-4">
      <Heading className="font-medium">{title}</Heading>
      {children}
    </div>
  );
}

function LessonForm({ lesson, onSave, onCancel, busy }: { lesson?: Lesson; onSave: (input: LessonInput) => void; onCancel: () => void; busy: boolean }) {
  const [title, setTitle] = useState(lesson?.title ?? '');
  const [minutes, setMinutes] = useState(lesson ? String(lesson.durationMin) : '');
  const [link, setLink] = useState(lesson?.videoProvider && lesson.videoRef ? videoLinkFor(lesson.videoProvider, lesson.videoRef) : '');
  const id = lesson?.id ?? 'new-lesson';
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave({ title, durationMin: Number(minutes), videoLink: link, published: lesson?.published ?? false });
  };
  return (
    <Panel title={lesson ? `Edit ${lesson.code} ${lesson.title}` : 'Add a lesson'}>
      <form className="grid gap-4" onSubmit={submit} noValidate>
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_10rem]">
          <Field label="Title" htmlFor={`${id}-title`}><Input id={`${id}-title`} value={title} onChange={event => setTitle(event.target.value)}/></Field>
          <Field label="Length (minutes)" htmlFor={`${id}-minutes`}><Input id={`${id}-minutes`} type="number" min={1} inputMode="numeric" value={minutes} onChange={event => setMinutes(event.target.value)}/></Field>
        </div>
        <Field label="Video link" htmlFor={`${id}-link`} hint="Paste the Vimeo, YouTube or Mux link. Leave it empty until the video is recorded; the lesson stays a draft.">
          <Input id={`${id}-link`} type="url" inputMode="url" placeholder="https://vimeo.com/…" value={link} onChange={event => setLink(event.target.value)}/>
        </Field>
        <FormActions busy={busy} onCancel={onCancel} label={lesson ? 'Save lesson' : 'Add lesson'}/>
      </form>
    </Panel>
  );
}

function MaterialForm({ moduleSlug, material, onSave, onCancel, busy }: { moduleSlug: string; material?: Material; onSave: (input: MaterialInput) => void; onCancel: () => void; busy: boolean }) {
  const [title, setTitle] = useState(material?.title ?? '');
  const [kind, setKind] = useState<MaterialKind>(material?.kind ?? 'pdf');
  const [track, setTrack] = useState<Track | 'Both'>(material?.track ?? 'Both');
  const [library, setLibrary] = useState<LibraryCategory | ''>(material?.libraryCategory ?? '');
  const [link, setLink] = useState(material?.kind === 'video' && material.videoProvider && material.videoRef ? videoLinkFor(material.videoProvider, material.videoRef) : material?.url ?? '');
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const id = material?.id ?? 'new-material';
  const keepsFile = Boolean(material?.fileName) && material?.kind === kind;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave({
      title,
      kind,
      track,
      libraryCategory: library || null,
      published: material?.published ?? false,
      file,
      ...((isLinkKind(kind) || kind === 'video') && { link }),
    });
  };

  return (
    <Panel title={material ? `Edit ${material.title}` : 'Add a material'}>
      <form className="grid gap-4" onSubmit={submit} noValidate>
        <Field label="Title" htmlFor={`${id}-title`}><Input id={`${id}-title`} value={title} onChange={event => setTitle(event.target.value)}/></Field>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Type" htmlFor={`${id}-kind`}>
            <Select id={`${id}-kind`} value={kind} onChange={event => setKind(event.target.value as MaterialKind)}>
              {Object.entries(materialKinds).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </Select>
          </Field>
          <Field label="Track" htmlFor={`${id}-track`}>
            <Select id={`${id}-track`} value={track} onChange={event => setTrack(event.target.value as Track | 'Both')}>
              {tracks.map(value => <option key={value} value={value}>{value === 'Both' ? 'Canada and US' : value}</option>)}
            </Select>
          </Field>
          <Field label="Resources library" htmlFor={`${id}-library`}>
            <Select id={`${id}-library`} value={library} onChange={event => setLibrary(event.target.value as LibraryCategory | '')}>
              <option value="">Not in the library</option>
              {Object.entries(libraryCategories).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </Select>
          </Field>
        </div>
        {kind === 'video' && (
          <Field label="Video link" htmlFor={`${id}-link`} hint="Paste the Vimeo, YouTube or Mux link.">
            <Input id={`${id}-link`} type="url" inputMode="url" value={link} onChange={event => setLink(event.target.value)}/>
          </Field>
        )}
        {isLinkKind(kind) && (
          <Field label="Link" htmlFor={`${id}-link`} hint="Starts with https://, or a portal path such as /portal/schools.">
            <Input id={`${id}-link`} type="url" inputMode="url" value={link} onChange={event => setLink(event.target.value)}/>
          </Field>
        )}
        {!isLinkKind(kind) && kind !== 'video' && (
          <FileUpload
            key={kind}
            id={`${id}-file`}
            label={keepsFile ? 'Replace file (optional)' : 'File'}
            bucket="materials"
            requestUrl={name => requestMaterialUploadUrl(moduleSlug, name)}
            onChange={setFile}
            onBusyChange={setUploading}
            hint={keepsFile ? `Current file: ${material?.fileName}. A new file replaces it for every student.` : undefined}
          />
        )}
        <FormActions busy={busy || uploading} onCancel={onCancel} label={material ? 'Save material' : 'Add material'}/>
      </form>
    </Panel>
  );
}

function ConfirmDelete({ title, busy, onConfirm, onCancel }: { title: string; busy: boolean; onConfirm: () => void; onCancel: () => void }) {
  return (
    <Panel title={`Delete “${title}”?`} headingLevel={3}>
      <p className="text-muted">Students lose access straight away. This can’t be undone.</p>
      <div className="flex flex-wrap gap-3">
        <Button onClick={onConfirm} disabled={busy}>{busy ? 'Deleting…' : 'Delete'}</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </Panel>
  );
}

type Editing = { type: 'lesson' | 'material'; id: string | 'new'; deleting?: boolean } | null;

interface GroupProps {
  moduleSlug: string;
  chapter: string | null;
  title: string;
  lessons?: Lesson[];
  materials?: Material[];
  onChanged: () => void;
}

/** One chapter (or the welcome, or module-wide items): its lessons and materials, with add, edit, publish and delete. */
function ContentGroup({ moduleSlug, chapter, title, lessons, materials, onChanged }: GroupProps) {
  const [editing, setEditing] = useState<Editing>(null);
  const { error, busy, run } = useChange(onChanged);
  const close = () => setEditing(null);
  const save = async (change: () => Promise<void>) => { if (await run(change)) close(); };
  const editingLesson = editing?.type === 'lesson' && !editing.deleting ? editing : null;
  const editingMaterial = editing?.type === 'material' && !editing.deleting ? editing : null;
  const deleting = editing?.deleting ? editing : null;
  const deletingTitle = deleting && (deleting.type === 'lesson' ? lessons?.find(item => item.id === deleting.id)?.title : materials?.find(item => item.id === deleting.id)?.title);

  const rowActions = (type: 'lesson' | 'material', item: Lesson | Material, togglePublish: () => Promise<void>) => (
    <div className="flex flex-wrap gap-1">
      <Button variant="ghost" className={small} aria-label={`Edit ${item.title}`} onClick={() => setEditing({ type, id: item.id })}>Edit</Button>
      <Button variant="ghost" className={small} aria-label={`${item.published ? 'Unpublish' : 'Publish'} ${item.title}`} disabled={busy} onClick={() => run(togglePublish)}>
        {item.published ? 'Unpublish' : 'Publish'}
      </Button>
      <Button variant="ghost" className={small} aria-label={`Delete ${item.title}`} onClick={() => setEditing({ type, id: item.id, deleting: true })}>Delete</Button>
    </div>
  );

  return (
    <Card title={title} headingLevel={2}>
      {error && <p className="mb-4 rounded-field bg-warn-soft p-3 text-warn" role="alert">{error}</p>}

      {lessons && (
        <section aria-label={`${title}: lessons`} className="grid gap-3">
          <h3 className="text-sm font-semibold tracking-wider text-accent uppercase">Lessons</h3>
          <Table
            caption={`${title}: lessons`}
            rows={lessons}
            rowKey={lesson => lesson.id}
            empty="No lessons yet. This chapter shows its written summary only."
            columns={[
              { header: 'Code', cell: lesson => <span className="font-display text-sm font-bold text-subtle">{lesson.code}</span> },
              { header: 'Title', cell: lesson => <span className="font-medium">{lesson.title}</span> },
              { header: 'Length', cell: lesson => `${lesson.durationMin} min`, hideOnPhone: true },
              { header: 'Video', cell: lesson => (lesson.videoProvider ? providerLabels[lesson.videoProvider] : <span className="text-muted">Not recorded</span>), hideOnPhone: true },
              { header: 'Status', cell: lesson => <Badge status={lesson.published ? 'published' : 'draft'}/> },
              { header: 'Actions', cell: lesson => rowActions('lesson', lesson, () => updateLesson(lesson.id, { published: !lesson.published })) },
            ]}
          />
          {editingLesson ? (
            <LessonForm
              key={editingLesson.id}
              lesson={lessons.find(item => item.id === editingLesson.id)}
              busy={busy}
              onCancel={close}
              onSave={input => save(() => (editingLesson.id === 'new' ? createLesson(moduleSlug, chapter, input) : updateLesson(editingLesson.id, input)))}
            />
          ) : (
            <div><Button variant="outline" onClick={() => setEditing({ type: 'lesson', id: 'new' })}>Add lesson</Button></div>
          )}
        </section>
      )}

      {materials && (
        <section aria-label={`${title}: materials`} className={lessons ? 'mt-6 grid gap-3' : 'grid gap-3'}>
          <h3 className="text-sm font-semibold tracking-wider text-accent uppercase">Materials</h3>
          <Table
            caption={`${title}: materials`}
            rows={materials}
            rowKey={material => material.id}
            empty="No materials yet."
            columns={[
              { header: 'Title', cell: material => <span className="font-medium">{material.title}</span> },
              { header: 'Type', cell: material => materialKinds[material.kind] },
              { header: 'Track', cell: material => (material.track === 'Both' ? 'Canada and US' : material.track), hideOnPhone: true },
              { header: 'Library', cell: material => (material.libraryCategory ? libraryCategories[material.libraryCategory] : '—'), hideOnPhone: true },
              { header: 'Status', cell: material => <Badge status={material.published ? 'published' : 'draft'}/> },
              { header: 'Actions', cell: material => rowActions('material', material, () => updateMaterial(material.id, { published: !material.published })) },
            ]}
          />
          {editingMaterial ? (
            <MaterialForm
              key={editingMaterial.id}
              moduleSlug={moduleSlug}
              material={materials.find(item => item.id === editingMaterial.id)}
              busy={busy}
              onCancel={close}
              onSave={input => save(() => (editingMaterial.id === 'new' ? createMaterial(moduleSlug, chapter, input) : updateMaterial(editingMaterial.id, input)))}
            />
          ) : (
            <div><Button variant="outline" onClick={() => setEditing({ type: 'material', id: 'new' })}>Add material</Button></div>
          )}
        </section>
      )}

      {deleting && (
        <ConfirmDelete
          title={deletingTitle ?? 'this item'}
          busy={busy}
          onCancel={close}
          onConfirm={() => save(() => (deleting.type === 'lesson' ? deleteLesson(deleting.id) : deleteMaterial(deleting.id)))}
        />
      )}
    </Card>
  );
}

function countStats(content: ModuleContent) {
  const lessons = [...content.welcome, ...content.chapters.flatMap(chapter => chapter.lessons)];
  const materials = [...content.moduleWide, ...content.chapters.flatMap(chapter => chapter.materials)];
  return [
    { label: 'Lessons published', value: `${lessons.filter(item => item.published).length} of ${lessons.length}` },
    { label: 'Not recorded yet', value: lessons.filter(item => !item.videoRef).length },
    { label: 'Materials published', value: `${materials.filter(item => item.published).length} of ${materials.length}` },
    { label: 'In the library', value: materials.filter(item => item.libraryCategory).length },
  ];
}

export default function AdminContent() {
  useDocumentTitle('Content');
  const [slug, setSlug] = useState(modules[0]?.slug ?? 'start-here');
  const { data: content, error, loading, reload } = useAsync(`content:${slug}`, () => getAdminContent(slug));
  const module = findModule(slug);

  return (
    <>
      <PageHeader title="Content" lede="Add lesson videos and materials, replace files, and choose what students see. Changes reach the portal straight away."/>
      <div className="mb-6 max-w-md">
        <Field label="Module" htmlFor="content-module">
          <Select id="content-module" value={slug} onChange={event => setSlug(event.target.value)}>
            {moduleOptions.map(option => <option key={option.slug} value={option.slug}>{option.label}</option>)}
          </Select>
        </Field>
      </div>

      {loading && <p className="text-muted" role="status">Loading content…</p>}
      {Boolean(error) && (
        <div className="flex flex-wrap items-center gap-3 rounded-card bg-warn-soft p-4 text-warn" role="alert">
          Content didn’t load. <Button variant="outline" onClick={reload}>Try again</Button>
        </div>
      )}

      {content && (
        <div className="grid gap-6">
          <StatList label={`${moduleOptions.find(option => option.slug === slug)?.label ?? ''} content`} stats={countStats(content)}/>
          {module && (
            <ContentGroup moduleSlug={slug} chapter={null} title={`${Number(module.number)}.0 Welcome`} lessons={content.welcome} onChanged={reload}/>
          )}
          {module?.chapters.map((chapter, index) => {
            const chapterContent = content.chapters.find(item => item.slug === chapterSlug(chapter));
            return (
              <ContentGroup
                key={chapter.title}
                moduleSlug={slug}
                chapter={chapterSlug(chapter)}
                title={`${chapterCode(module, index)} ${chapter.title}${chapter.track ? ` (${chapter.track} only)` : ''}`}
                lessons={chapterContent?.lessons ?? []}
                materials={chapterContent?.materials ?? []}
                onChanged={reload}
              />
            );
          })}
          <ContentGroup moduleSlug={slug} chapter={null} title={module ? 'Across the module' : 'Start here: for every student with a seat'} materials={content.moduleWide} onChanged={reload}/>
        </div>
      )}
    </>
  );
}
