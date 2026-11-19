// Mock of the content and upload endpoints in the backend plan (d4ybe/docs/architecture.md, sections 6 and 8).
// This is the one file to replace when the Express API is connected: every export matches a planned
// endpoint, takes the same inputs and returns the same shapes (src/types). Nothing here makes a network call.
// State lives in memory for the session, so an admin edit shows up on the student pages until a reload.

import { assignments, enrollment, feedback, reviewQueue, studentAccount } from '@/data/demo';
import { lessonSeed, materialSeed, type LessonRecord } from '@/data/content';
import { chapterSlug, findModule } from '@/data/modules';
import { linkKinds, uploadRules } from '@/data/portal';
import { isAllowedAnswerLink, parseVideoLink } from '@/shared/lib/videoLinks';
import type {
  AnswerKind, Lesson, LibraryCategory, Material, MaterialKind, ModuleContent, SubmissionItem, Track, UploadBucket, UploadedFile, UploadTarget,
} from '@/types';

export type ApiErrorCode = 'not-found' | 'not-enrolled' | 'forbidden' | 'invalid' | 'too-large' | 'wrong-type';

export class ApiError extends Error {
  constructor(readonly code: ApiErrorCode, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const latency = import.meta.env.MODE === 'test' ? 0 : 350;
const wait = (ms = latency) => new Promise<void>(resolve => setTimeout(resolve, ms));
const copy = <T>(value: T): T => structuredClone(value);

// ---- In-memory "database" and "Storage" --------------------------------------

let lessons: LessonRecord[] = [];
let materials: Material[] = [];
/** Storage path for each file material. Not part of the API response (files open through the API). */
let materialPaths = new Map<string, string>();
/** Objects that reached a bucket, keyed `bucket/path`. Confirm steps check this, like the API checks Storage. */
let stored = new Set<string>();
/** Objects already attached to a record. One upload can back one record only (review finding 7). */
let attached = new Set<string>();
/** Assignments submitted this session (the API keeps this in `submissions`). */
let submitted = new Set<string>();
/** Replaced or deleted objects left behind; the API logs these for manual cleanup (plan O12). */
let orphans: string[] = [];
let uploadCounter = 0;

/** Resets the mock to its seed data. Tests call this between cases. */
export function resetMockApi() {
  lessons = copy(lessonSeed);
  materials = copy(materialSeed);
  materialPaths = new Map(materials.filter(item => item.fileName).map(item => [item.id, `${item.moduleSlug}/${item.id}/${item.fileName}`]));
  stored = new Set([...materialPaths.values()].map(path => `materials/${path}`));
  for (const entry of feedback) if (entry.feedbackFileName) stored.add(`feedback/${entry.id}/seed/${entry.feedbackFileName}`);
  attached = new Set(stored);
  submitted = new Set();
  orphans = [];
  uploadCounter = 0;
}
resetMockApi();

/** Paths left behind by replacements and deletes (plan O12). */
export const orphanedPaths = () => [...orphans];

// ---- Access rules (plan D31, D34, D39) ----------------------------------------

const isEnrolled = (slug: string) => {
  const status = enrollment[slug]?.status;
  return status !== undefined && status !== 'available' && status !== 'upcoming';
};
const canSeeModule = (slug: string) => (slug === 'start-here' ? studentAccount.hasSeat : isEnrolled(slug));

// ---- Lesson codes (plan D37): worked out from position, never stored ------------

const LETTERS = 'abcdefghijklmnopqrstuvwxyz';
const bySortOrder = <T extends { sortOrder: number }>(items: T[]) => [...items].sort((a, b) => a.sortOrder - b.sortOrder);

/** Codes count every lesson in the chapter, drafts included, so admins and students see the same code. */
function withCodes(moduleSlug: string, chapter: string | null, records: LessonRecord[]): Lesson[] {
  const module = findModule(moduleSlug);
  const number = Number(module?.number ?? 0);
  const ordered = bySortOrder(records);
  if (chapter === null) return ordered.map(record => ({ ...record, code: `${number}.0` }));
  const position = (module?.chapters.findIndex(item => chapterSlug(item) === chapter) ?? -1) + 1;
  return ordered.map((record, index) => ({ ...record, code: ordered.length > 1 ? `${number}.${position}${LETTERS[index]}` : `${number}.${position}` }));
}

function buildContent(moduleSlug: string, includeDrafts: boolean): ModuleContent {
  const visible = <T extends { published: boolean }>(item: T) => includeDrafts || item.published;
  const lessonsIn = (chapter: string | null) => withCodes(moduleSlug, chapter, lessons.filter(item => item.moduleSlug === moduleSlug && item.chapterSlug === chapter)).filter(visible);
  const materialsIn = (chapter: string | null) => bySortOrder(materials.filter(item => item.moduleSlug === moduleSlug && item.chapterSlug === chapter)).filter(visible);
  const module = findModule(moduleSlug);
  return copy({
    moduleSlug,
    welcome: module ? lessonsIn(null) : [],
    chapters: (module?.chapters ?? []).map(chapter => ({ slug: chapterSlug(chapter), lessons: lessonsIn(chapterSlug(chapter)), materials: materialsIn(chapterSlug(chapter)) })),
    moduleWide: materialsIn(null),
  });
}

const assertModule = (slug: string) => {
  if (slug !== 'start-here' && !findModule(slug)) throw new ApiError('not-found', 'Module not found.');
};

/** Postgres can't foreign-key into chapter_slugs, so the content service checks it (plan section 4). */
const assertChapter = (moduleSlug: string, chapter: string | null) => {
  assertModule(moduleSlug);
  if (chapter !== null && !findModule(moduleSlug)?.chapters.some(item => chapterSlug(item) === chapter)) throw new ApiError('not-found', 'Chapter not found.');
};

// ---- Student --------------------------------------------------------------------

/** GET /student/modules/:slug: published lessons and materials, only for an enrolled module. */
export async function getModuleContent(slug: string): Promise<ModuleContent> {
  await wait();
  assertModule(slug);
  if (!canSeeModule(slug)) throw new ApiError('not-enrolled', 'This module is not in your package yet.');
  return buildContent(slug, false);
}

/** GET /student/resources: published library items from enrolled modules, plus Start here for students with a seat. */
export async function getLibrary(): Promise<Material[]> {
  await wait();
  return copy(materials.filter(item => item.published && item.libraryCategory && canSeeModule(item.moduleSlug)));
}

export interface OpenLink { url: string; fileName: string | null }

/** Stands in for a ~5 minute signed download URL from Storage. */
const sampleFileUrl = (fileName: string) =>
  typeof URL.createObjectURL === 'function'
    ? URL.createObjectURL(new Blob([`Sample file for the preview: ${fileName}`], { type: 'text/plain' }))
    : `about:blank#${fileName}`;

/** GET /student/materials/:id/download: a signed URL for files, the link itself for links. */
export async function getMaterialLink(id: string): Promise<OpenLink> {
  await wait();
  const item = materials.find(entry => entry.id === id && entry.published);
  if (!item) throw new ApiError('not-found', 'This material is no longer available.');
  if (!canSeeModule(item.moduleSlug)) throw new ApiError('not-enrolled', 'This module is not in your package yet.');
  if (item.fileName) return { url: sampleFileUrl(item.fileName), fileName: item.fileName };
  return { url: item.url ?? '', fileName: null };
}

/** GET /student/reviews/:id/feedback-file: the mentor's commented document for the student's own review. */
export async function getFeedbackFile(reviewId: string): Promise<OpenLink> {
  await wait();
  const entry = feedback.find(item => item.id === reviewId);
  if (!entry?.feedbackFileName) throw new ApiError('not-found', 'There is no commented document for this review.');
  return { url: sampleFileUrl(entry.feedbackFileName), fileName: entry.feedbackFileName };
}

/**
 * POST /student/assignments/:id/submissions with the answers and the optional note to the mentor.
 * The answers must match the assignment's answer spec (plan D36), which the API looks up itself.
 */
export async function submitAssignment(assignmentId: string, items: SubmissionItem[], _note: string): Promise<void> {
  await wait();
  const assignment = assignments.find(item => item.id === assignmentId);
  if (!assignment) throw new ApiError('not-found', 'Assignment not found.');
  const open = (assignment.status === 'not-started' || assignment.status === 'revise') && !submitted.has(assignmentId);
  if (!open) throw new ApiError('invalid', 'This assignment is already submitted.');
  const kinds: AnswerKind[] = items.map(item => item.kind);
  if (kinds.join() !== assignment.answerSpec.join()) throw new ApiError('invalid', 'Answers don’t match this assignment.');
  for (const item of items) {
    if (item.kind === 'file') checkUpload('submissions', studentAccount.id, item.path);
    if (item.kind === 'video_link' && !isAllowedAnswerLink(item.videoUrl ?? '')) throw new ApiError('invalid', `${item.label}: use a video link from an allowed host.`);
    if (item.kind === 'text' && !item.body?.trim()) throw new ApiError('invalid', `${item.label} is empty.`);
  }
  for (const item of items) if (item.kind === 'file' && item.path) attached.add(`submissions/${item.path}`);
  submitted.add(assignmentId);
}

// ---- Uploads (plan D28, D30, section 8) -------------------------------------------

const safeName = (name: string) => name.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^[-.]+|-+$/g, '') || 'file';

/** The API makes the path ({owner}/{uuid}/{name}) from the signed-in caller and returns a signed upload URL. */
function uploadTarget(bucket: UploadBucket, ownerId: string, fileName: string): UploadTarget {
  const path = `${ownerId}/upload-${++uploadCounter}/${safeName(fileName)}`;
  return { bucket, path, signedUrl: `https://storage.example.org/${bucket}/${path}?token=mock` };
}

/** POST /student/assignments/:id/upload-url. The owner folder is the signed-in student. */
export async function requestSubmissionUploadUrl(assignmentId: string, fileName: string): Promise<UploadTarget> {
  await wait();
  if (!assignments.some(item => item.id === assignmentId)) throw new ApiError('not-found', 'Assignment not found.');
  return uploadTarget('submissions', studentAccount.id, fileName);
}

/** POST /mentor/reviews/:id/feedback-upload-url. Only for a review assigned to this mentor (the demo mentor's queue). */
export async function requestFeedbackUploadUrl(reviewId: string, fileName: string): Promise<UploadTarget> {
  await wait();
  if (!reviewQueue.some(item => item.id === reviewId)) throw new ApiError('forbidden', 'You can only attach a document to your own review.');
  return uploadTarget('feedback', reviewId, fileName);
}

/** POST /admin/materials/upload-url. Admin only. */
export async function requestMaterialUploadUrl(moduleSlug: string, fileName: string): Promise<UploadTarget> {
  await wait();
  assertModule(moduleSlug);
  return uploadTarget('materials', moduleSlug, fileName);
}

/**
 * The browser's PUT to the signed URL. The bucket checks size and type, so this is where a file that's
 * too large or the wrong type fails. Calls `onProgress` with 0–100 as the upload goes.
 */
export async function uploadToSignedUrl(target: UploadTarget, file: File, onProgress: (percent: number) => void): Promise<UploadedFile> {
  const rules = uploadRules[target.bucket];
  onProgress(0);
  if (file.size > rules.maxBytes) throw new ApiError('too-large', `This file is too large. The limit is ${Math.round(rules.maxBytes / 1024 / 1024)} MB.`);
  if (!rules.mimeTypes.includes(file.type)) throw new ApiError('wrong-type', `This file type isn’t accepted. ${rules.hint}`);
  for (const percent of [20, 45, 70, 90, 100]) {
    await wait(latency / 2);
    onProgress(percent);
  }
  stored.add(`${target.bucket}/${target.path}`);
  return { path: target.path, fileName: file.name, sizeBytes: file.size };
}

/**
 * What the API does on confirm (plan O4): right path shape, the caller's own prefix, the object exists,
 * and it isn't already attached to another record.
 */
function checkUpload(bucket: UploadBucket, ownerId: string, path: string | undefined) {
  const shape = path?.split('/') ?? [];
  if (!path || shape.length !== 3 || shape[0] !== ownerId || !stored.has(`${bucket}/${path}`)) {
    throw new ApiError('invalid', 'That upload didn’t finish. Choose the file again.');
  }
  if (attached.has(`${bucket}/${path}`)) throw new ApiError('invalid', 'That file is already attached elsewhere. Upload it again.');
}

// ---- Mentor ---------------------------------------------------------------------

/**
 * POST /mentor/reviews/:id/complete with the optional confirmed `feedbackFilePath` (plan D28).
 * The rubric scores and written feedback join this body when the review form is wired to the API.
 */
export async function completeReview(reviewId: string, body: { feedbackFilePath: string | null }): Promise<void> {
  await wait();
  if (!reviewQueue.some(item => item.id === reviewId)) throw new ApiError('forbidden', 'This review isn’t assigned to you.');
  if (body.feedbackFilePath) {
    checkUpload('feedback', reviewId, body.feedbackFilePath);
    attached.add(`feedback/${body.feedbackFilePath}`);
  }
}

// ---- Admin content (plan D26–D28, D35) -----------------------------------------------

/** GET /admin/content for one module: every lesson and material, drafts included. */
export async function getAdminContent(slug: string): Promise<ModuleContent> {
  await wait();
  assertModule(slug);
  return buildContent(slug, true);
}

export interface LessonInput { title: string; durationMin: number; videoLink: string; published: boolean }

function videoFields(link: string) {
  if (!link.trim()) return { videoProvider: null, videoRef: null };
  const parsed = parseVideoLink(link);
  if (!parsed) throw new ApiError('invalid', 'Paste a Vimeo, YouTube or Mux link.');
  return { videoProvider: parsed.provider, videoRef: parsed.ref };
}

function checkLesson(record: LessonRecord) {
  if (!record.title.trim()) throw new ApiError('invalid', 'Add a title.');
  if (!(record.durationMin > 0)) throw new ApiError('invalid', 'Add the length in minutes.');
  if (record.published && !record.videoRef) throw new ApiError('invalid', 'Add a video link before publishing.');
}

/** POST /admin/lessons. New lessons go to the end of their chapter. */
export async function createLesson(moduleSlug: string, chapter: string | null, input: LessonInput): Promise<void> {
  await wait();
  assertChapter(moduleSlug, chapter);
  const siblings = lessons.filter(item => item.moduleSlug === moduleSlug && item.chapterSlug === chapter);
  const record: LessonRecord = {
    id: `lesson-new-${++uploadCounter}`,
    moduleSlug,
    chapterSlug: chapter,
    title: input.title.trim(),
    durationMin: input.durationMin,
    ...videoFields(input.videoLink),
    sortOrder: siblings.length ? Math.max(...siblings.map(item => item.sortOrder)) + 1 : 0,
    published: input.published,
  };
  checkLesson(record);
  lessons.push(record);
}

/** PATCH /admin/lessons/:id: video link, title, length and the publish toggle. */
export async function updateLesson(id: string, input: Partial<LessonInput>): Promise<void> {
  await wait();
  const index = lessons.findIndex(item => item.id === id);
  if (index === -1) throw new ApiError('not-found', 'Lesson not found.');
  const current = lessons[index]!;
  const next: LessonRecord = {
    ...current,
    ...(input.title !== undefined && { title: input.title.trim() }),
    ...(input.durationMin !== undefined && { durationMin: input.durationMin }),
    ...(input.videoLink !== undefined && videoFields(input.videoLink)),
    ...(input.published !== undefined && { published: input.published }),
  };
  checkLesson(next);
  lessons[index] = next;
}

/** DELETE /admin/lessons/:id. */
export async function deleteLesson(id: string): Promise<void> {
  await wait();
  if (!lessons.some(item => item.id === id)) throw new ApiError('not-found', 'Lesson not found.');
  lessons = lessons.filter(item => item.id !== id);
}

export interface MaterialInput {
  title: string;
  kind: MaterialKind;
  track: Track | 'Both';
  libraryCategory: LibraryCategory | null;
  published: boolean;
  /** A confirmed upload, for file kinds. */
  file?: UploadedFile | null;
  /** The address, for link kinds; a video link for kind `video`. */
  link?: string;
}

const isLinkKind = (kind: MaterialKind) => (linkKinds as readonly string[]).includes(kind);

function sourceFields(moduleSlug: string, input: MaterialInput, current?: Material) {
  if (input.kind === 'video') {
    const parsed = parseVideoLink(input.link ?? '');
    if (!parsed) throw new ApiError('invalid', 'Paste a Vimeo, YouTube or Mux link.');
    return { fileName: null, sizeBytes: null, url: null, videoProvider: parsed.provider, videoRef: parsed.ref };
  }
  if (isLinkKind(input.kind)) {
    const link = input.link?.trim() ?? '';
    // A portal path must be same-site: `//host` and `/\\host` would open another site (review finding 5).
    if (!/^https:\/\/\S+$/.test(link) && !/^\/(?![/\\])\S*$/.test(link)) throw new ApiError('invalid', 'Add a link that starts with https://, or a portal path such as /portal/schools.');
    return { fileName: null, sizeBytes: null, url: link, videoProvider: null, videoRef: null };
  }
  if (input.file) {
    checkUpload('materials', moduleSlug, input.file.path);
    return { fileName: input.file.fileName, sizeBytes: input.file.sizeBytes, url: null, videoProvider: null, videoRef: null, path: input.file.path };
  }
  if (current?.fileName) return {};
  throw new ApiError('invalid', 'Upload a file first.');
}

/** POST /admin/materials (after POST /admin/materials/upload-url for files). */
export async function createMaterial(moduleSlug: string, chapter: string | null, input: MaterialInput): Promise<void> {
  await wait();
  assertChapter(moduleSlug, chapter);
  if (!input.title.trim()) throw new ApiError('invalid', 'Add a title.');
  const { path, ...source } = sourceFields(moduleSlug, input);
  const siblings = materials.filter(item => item.moduleSlug === moduleSlug && item.chapterSlug === chapter);
  const id = `material-new-${++uploadCounter}`;
  materials.push({
    id,
    moduleSlug,
    chapterSlug: chapter,
    kind: input.kind,
    title: input.title.trim(),
    fileName: null,
    sizeBytes: null,
    url: null,
    videoProvider: null,
    videoRef: null,
    ...source,
    track: input.track,
    libraryCategory: input.libraryCategory,
    sortOrder: siblings.length ? Math.max(...siblings.map(item => item.sortOrder)) + 1 : 0,
    published: input.published,
  });
  if (path) {
    materialPaths.set(id, path);
    attached.add(`materials/${path}`);
  }
}

/** PATCH /admin/materials/:id: details, publish toggle, or a replacement file. The old object becomes an orphan. */
export async function updateMaterial(id: string, input: Partial<MaterialInput>): Promise<void> {
  await wait();
  const index = materials.findIndex(item => item.id === id);
  if (index === -1) throw new ApiError('not-found', 'Material not found.');
  const current = materials[index]!;
  const merged: MaterialInput = {
    title: input.title ?? current.title,
    kind: input.kind ?? current.kind,
    track: input.track ?? current.track,
    libraryCategory: input.libraryCategory !== undefined ? input.libraryCategory : current.libraryCategory,
    published: input.published ?? current.published,
    file: input.file,
    link: input.link ?? current.url ?? undefined,
  };
  if (!merged.title.trim()) throw new ApiError('invalid', 'Add a title.');
  const sourceChanged = input.file || input.link !== undefined || (input.kind && input.kind !== current.kind);
  const { path, ...source } = sourceChanged ? sourceFields(current.moduleSlug, merged, input.kind && input.kind !== current.kind ? undefined : current) : {};
  const old = materialPaths.get(id);
  if (sourceChanged && old && (path || ('fileName' in source && source.fileName === null))) {
    // Replaced by a new file, or the material became a link or video: the old object is left behind (plan O12).
    orphans.push(`materials/${old}`);
    materialPaths.delete(id);
  }
  if (path) {
    materialPaths.set(id, path);
    attached.add(`materials/${path}`);
  }
  materials[index] = { ...current, ...source, title: merged.title.trim(), kind: merged.kind, track: merged.track, libraryCategory: merged.libraryCategory, published: merged.published };
}

/** DELETE /admin/materials/:id: the row first, then the Storage object. */
export async function deleteMaterial(id: string): Promise<void> {
  await wait();
  if (!materials.some(item => item.id === id)) throw new ApiError('not-found', 'Material not found.');
  materials = materials.filter(item => item.id !== id);
  const path = materialPaths.get(id);
  if (path) {
    stored.delete(`materials/${path}`);
    materialPaths.delete(id);
  }
}
