// Data shapes shared by src/data and the features.
// These are the contract the Express API will implement when it replaces the demo data.

import type { materialTypes, statuses } from '@/data/portal';

// ---- Program content --------------------------------------------------------

export type MaterialType = keyof typeof materialTypes;
export type StatusKey = keyof typeof statuses;
export type Tone = 'neutral' | 'active' | 'done' | 'warn';
export type Track = 'Canada' | 'US';

export interface Video { title: string; minutes: number }
export interface Material { type: MaterialType; title: string }

export interface Chapter {
  title: string;
  track?: Track;
  videos: Video[];
  materials: Material[];
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
  moduleWide: Material[];
}

export interface TitledItem { title: string; description: string }

/** One section of the program details page. `id` is its URL anchor; `label` names it in the jump list and eyebrow. */
export interface DetailSection {
  id: 'how-it-works' | 'goals' | 'outcomes' | 'portal' | 'options' | 'mentors' | 'community' | 'pilot';
  label: string;
  title: string;
  lede?: string;
}

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

export interface Assignment {
  id: string;
  title: string;
  module: string;
  status: StatusKey;
  date: string;
  dateLabel: string;
  instructions?: string;
  feedbackId?: string;
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

export interface Resource { id: string; title: string; kind: string; module: string; track: Track | 'Both' }

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
  file: string;
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
