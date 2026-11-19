// Sample lesson videos and materials, standing in for the `lessons` and `materials` tables (plan D26).
// Built from the chapter outlines in modules.ts rather than typed out again, so the two can't drift
// (plan note C1). When the API serves GET /student/modules/:slug, delete this file and the
// `videos` arrays and file entries in modules.ts.
//
// Video refs are made-up Vimeo ids and links point at example.org: they are placeholders, not real content.

import { featureItemTypes } from '@/data/portal';
import { chapterSlug, modules } from '@/data/modules';
import type { ChapterItem, LibraryCategory, Lesson, Material, MaterialKind, MaterialType, ProgramModule, Track } from '@/types';

/** A lesson as stored. Its code is worked out from position on read (plan D37). */
export type LessonRecord = Omit<Lesson, 'code'>;

export const welcomeLesson = { title: 'Welcome and what you’ll walk away with', minutes: 3 };

const kindFor: Partial<Record<MaterialType, MaterialKind>> = {
  download: 'pdf', visual: 'image', spreadsheet: 'sheet', template: 'template', link: 'link', quiz: 'quiz', practice: 'practice', tool: 'tool',
};
const extensionFor: Partial<Record<MaterialKind, string>> = { pdf: 'pdf', template: 'docx', sheet: 'xlsx', image: 'png' };

/** Lessons not recorded yet: no video link, so they can't be published. */
const notRecorded = new Set(['Reviewing full-lengths', 'Accomplishment essays']);
/** Recorded but not published yet. */
const draftLessons = new Set(['Mistakes to avoid']);
/** Modules whose videos are all still to come. */
const upcomingModules = new Set(['interview']);
const draftMaterials = new Set(['Two worked examples', 'Full 11-scenario timed mock']);
/** Chapter materials that also appear in the Resources library (plan D27). */
const libraryTags: Record<string, LibraryCategory> = {
  'School list worksheet': 'template',
  'Canadian application checklist': 'checklist',
  '8, 12, and 16-week plans': 'template',
  'Scenario bank by type': 'practice',
  'Brainstorm workbook': 'workbook',
  'Self-edit checklist': 'checklist',
};
const internalLinks: Record<string, string> = { 'School requirements hub': '/portal/schools', 'School-by-school pages': '/portal/schools' };

const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const isFeatureItem = (entry: ChapterItem) => (featureItemTypes as readonly string[]).includes(entry.type);

let videoNumber = 0;
const nextVideoRef = () => `9120${String(++videoNumber).padStart(5, '0')}`;

function lessonsFor(module: ProgramModule): LessonRecord[] {
  const upcoming = upcomingModules.has(module.slug);
  const lesson = (chapter: string | null, title: string, minutes: number, sortOrder: number): LessonRecord => {
    const recorded = !upcoming && !notRecorded.has(title);
    return {
      id: `lesson-${module.slug}-${chapter ?? 'welcome'}-${sortOrder}`,
      moduleSlug: module.slug,
      chapterSlug: chapter,
      title,
      durationMin: minutes,
      videoProvider: recorded ? 'vimeo' : null,
      videoRef: recorded ? nextVideoRef() : null,
      sortOrder,
      published: recorded && !draftLessons.has(title),
    };
  };
  return [
    lesson(null, welcomeLesson.title, welcomeLesson.minutes, 0),
    ...module.chapters.flatMap(chapter => chapter.videos.map((video, index) => lesson(chapterSlug(chapter), video.title, video.minutes, index))),
  ];
}

function material(moduleSlug: string, chapter: string | null, kind: MaterialKind, title: string, track: Track | 'Both', sortOrder: number, extra: Partial<Material> = {}): Material {
  const extension = extensionFor[kind];
  const id = `material-${moduleSlug}-${chapter ?? 'module'}-${slugify(title)}`;
  const isVideo = kind === 'video';
  return {
    id,
    moduleSlug,
    chapterSlug: chapter,
    kind,
    title,
    fileName: extension ? `${slugify(title)}.${extension}` : null,
    sizeBytes: extension ? 40_000 + title.length * 6_000 : null,
    url: extension || isVideo ? null : internalLinks[title] ?? `https://example.org/d4y/${slugify(title)}`,
    videoProvider: isVideo ? 'vimeo' : null,
    videoRef: isVideo ? nextVideoRef() : null,
    track,
    libraryCategory: libraryTags[title] ?? null,
    sortOrder,
    published: !draftMaterials.has(title),
    ...extra,
  };
}

function materialsFor(module: ProgramModule): Material[] {
  return module.chapters.flatMap(chapter => chapter.materials
    .filter(entry => !isFeatureItem(entry) && kindFor[entry.type])
    .map((entry, index) => material(module.slug, chapterSlug(chapter), kindFor[entry.type]!, entry.title, chapter.track ?? 'Both', index)));
}

/** Library items that don't belong to one chapter. Partner codes sit under Start here (plan D39). */
const libraryOnly: Material[] = [
  material('applicant-strategy', null, 'pdf', 'Application planning checklist', 'Both', 0, { libraryCategory: 'checklist' }),
  material('applicant-strategy', null, 'video', 'Workshop recording: AADSAS overview', 'US', 1, { libraryCategory: 'recording' }),
  material('start-here', null, 'link', 'Partner discount codes for DAT and CASPer prep', 'Both', 0, { libraryCategory: 'partner' }),
];

export const lessonSeed: LessonRecord[] = modules.flatMap(lessonsFor);
export const materialSeed: Material[] = [...modules.flatMap(materialsFor), ...libraryOnly];
