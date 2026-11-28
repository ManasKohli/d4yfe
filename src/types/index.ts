// Data shapes shared by src/data and the features.
// These are the contract the Express API will implement when it replaces the demo data.

import type { libraryCategories, materialKinds, materialTypes, statuses, uploadRules } from '@/data/portal';

// ---- Program content --------------------------------------------------------

export type MaterialType = keyof typeof materialTypes;
export type StatusKey = keyof typeof statuses;
export type Tone = 'neutral' | 'active' | 'done' | 'warn';
export type Track = 'Canada' | 'US';

export interface Video { title: string; minutes: number }
/** One entry in a chapter's outline: a file to seed, or a link to another feature (assignment, booking, live, survey). */
export interface ChapterItem { type: MaterialType; title: string }

export interface Chapter {
  title: string;
  track?: Track;
  videos: Video[];
  materials: ChapterItem[];
}

export interface LessonSection {
  heading: string;
  intro?: string;
  body?: string;
  bullets?: string[];
  chips?: string[];
  note?: string;
}

export interface ModulePart {
  label: string;
  title: string;
  sections: LessonSection[];
}

export interface ProgramModule {
  slug: string;
  number: string;
  title: string;
  tag: string;
  track: string;
  summary: string;
  tags: string[];
  outcomes: string[];
  parts: ModulePart[];
  chapters: Chapter[];
  moduleWide: ChapterItem[];
}

export interface TitledItem { title: string; description: string }

/** One section of the landing page. `id` is its URL anchor; `label` names it in the nav. */
export interface HomeSection {
  id: 'about' | 'modules' | 'how-it-works' | 'portal' | 'options' | 'mentors' | 'community' | 'outcomes' | 'pilot';
  label: string;
  title: string;
  titleMuted?: string;
  lede?: string;
}

/** A school in the hero carousel. `shape` sets its display height: crests sit taller than wordmarks. */
export interface SchoolLogo { name: string; logo: string; shape: 'crest' | 'wordmark' }

/** A bundled package. Deliberately has no price field until pricing is set. */
export interface Package { name: string; includes: string[] }

export interface NavItem { label: string; to: string; end?: boolean }
export interface Area { label: string; nav: NavItem[] }

// ---- People and records (demo data today, API later) -------------------------

export interface Student {
  name: string;
  firstName: string;
  initials: string;
  track: Track;
  package: string;
  cycle: string;
  startHereDone: number;
  reviewRounds: { used: number; total: number };
  oneOnOnes: { left: number; total: number };
  mentorTurnaroundDays: number;
}

export interface Enrollment {
  status: StatusKey;
  done: number;
  current?: number;
  note?: string;
}

/** What one answer in a submission is: an uploaded file, a link to a video the student hosts, or typed text (plan D29, D36). */
export type AnswerKind = 'file' | 'video_link' | 'text';

export interface Assignment {
  id: string;
  title: string;
  module: string;
  status: StatusKey;
  date: string;
  dateLabel: string;
  instructions?: string;
  feedbackId?: string;
  /** The answers this assignment expects, in order. `['file']` for a single document. */
  answerSpec: AnswerKind[];
}

/** One answer in a submission. Exactly one of `fileName` (+ confirmed `path`), `videoUrl` or `body` is set, matching `kind`. */
export interface SubmissionItem {
  kind: AnswerKind;
  label: string;
  path?: string;
  fileName?: string;
  videoUrl?: string;
  body?: string;
}

export interface Feedback {
  id: string;
  assignmentId: string;
  module: string;
  reviewer: string;
  reviewerRole: string;
  date: string;
  scores: Record<string, number>;
  strengths: string;
  priorities: string[];
  followUp: string;
  /** The mentor's commented document, if they attached one (plan D28). Opened through the API, never a direct path. */
  feedbackFileName: string | null;
}

export interface Session {
  id: string;
  title: string;
  kind: string;
  /** ISO timestamp in UTC. */
  start: string;
  status: StatusKey;
}

export interface Bookable { id: string; title: string; minutes: number; module: string; opens?: string }


export interface School {
  id: string;
  name: string;
  place: string;
  degree: string;
  country: Track;
  casper: boolean;
  interview: string | null;
  verified: string;
  url: string;
  /** Campus location in degrees, for the globe on the requirements page. */
  coordinates: { lat: number; lon: number };
  facts: [string, string][];
}

export interface Mentor {
  name: string;
  initials: string;
  role: string;
  monthlyReviewLimit: number;
  monthlySessionLimit: number;
  reviewsThisMonth: number;
}

export interface QueueItem {
  id: string;
  student: string;
  track: Track;
  title: string;
  module: string;
  submitted: string;
  due: string;
  status: StatusKey;
  /** The submitted answers: one file for most assignments, several links and typed answers for practice sets. */
  answers: SubmissionItem[];
  note: string;
}

export interface AvailabilitySlot { id: string; day: string; start: string; end: string }

export interface VolunteerEntry { id: string; date: string; activity: string; student: string | null; hours: number }

export interface RosterEntry { id: string; name: string; track: Track; package: string; mentor: string; modules: number; done: number }

export interface MentorSummary {
  id: string;
  name: string;
  role: string;
  students: number;
  reviewsThisMonth: number;
  limit: number;
  hours: number;
  status: StatusKey;
}

export interface OpenReview { id: string; student: string; title: string; mentor: string; submitted: string }

export interface HardshipApplication {
  id: string;
  submitted: string;
  reviewsDone: number;
  reviewsNeeded: number;
  status: StatusKey;
  outcome: string | null;
}

export interface EscalationStep { day: number; action: string }

// ---- Content (plan D25–D38; mock API today, generated src/types/api.ts later) ----

export type MaterialKind = keyof typeof materialKinds;
export type LibraryCategory = keyof typeof libraryCategories;
export type VideoProvider = 'vimeo' | 'youtube' | 'mux';
export type UploadBucket = keyof typeof uploadRules;

/** A lesson video. `code` is worked out by the API from position (D37): 2.0 welcome, 2.4, or 2.5a/2.5b. */
export interface Lesson {
  id: string;
  moduleSlug: string;
  /** null for the module's welcome lesson. */
  chapterSlug: string | null;
  code: string;
  title: string;
  durationMin: number;
  /** Both null until the video is recorded and its link pasted in. */
  videoProvider: VideoProvider | null;
  videoRef: string | null;
  sortOrder: number;
  published: boolean;
}

/** A chapter or module-wide material. Files are opened through the API; `url` is set only for links. */
export interface Material {
  id: string;
  moduleSlug: string;
  /** null for module-wide items. */
  chapterSlug: string | null;
  kind: MaterialKind;
  title: string;
  fileName: string | null;
  sizeBytes: number | null;
  url: string | null;
  /** Set only for kind `video` (workshop recordings, D38). */
  videoProvider: VideoProvider | null;
  videoRef: string | null;
  track: Track | 'Both';
  /** Set when the item also appears in the Resources library (D27). */
  libraryCategory: LibraryCategory | null;
  sortOrder: number;
  published: boolean;
}

export interface ChapterContent { slug: string; lessons: Lesson[]; materials: Material[] }

/** GET /student/modules/:slug and one module of GET /admin/content. */
export interface ModuleContent {
  moduleSlug: string;
  welcome: Lesson[];
  chapters: ChapterContent[];
  moduleWide: Material[];
}

/** POST …/upload-url: where the browser sends the file. The API made the path (plan section 6). */
export interface UploadTarget { bucket: UploadBucket; path: string; signedUrl: string }

/** A file that reached Storage and can now be confirmed with its owning record. */
export interface UploadedFile { path: string; fileName: string; sizeBytes: number }


// ---- Signed-in user (Supabase Auth + GET /me) --------------------------------

export type Role = 'student' | 'mentor' | 'admin';

/**
 * GET /me, as the API returns it (d4ybe src/modules/me/me.schemas.ts).
 * Hand-copied until the generated API types replace it (backend plan D13, task T7).
 */
export interface Me {
  id: string;
  email: string;
  fullName: string | null;
  role: Role;
  student: {
    track: Track | null;
    cycle: string | null;
    cohortId: string | null;
    hasSeat: boolean;
    primaryMentorId: string | null;
    enrolledModules: string[];
    credits: { review: number; oneOnOne: number };
  } | null;
  mentor: { title: string | null; status: 'onboarding' | 'active' | 'paused'; schedulingUrl: string | null } | null;
}
