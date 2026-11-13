// Sample records for the signed-in areas.
// This file stands in for the database until Supabase is connected: every export here maps to a table or query.
// Names, dates, and school details are illustrative and must not be shown to real users as fact.

export const demoNotice = 'Preview with sample data. Accounts, uploads, and bookings connect when the database is set up.';

// ---- Student portal -------------------------------------------------------

export const student = {
  name: 'Sam L.',
  firstName: 'Sam',
  initials: 'SL',
  track: 'Canada',
  package: 'Application package',
  cycle: 'Applying fall 2027',
  startHereDone: 6,
  reviewRounds: { used: 1, total: 2 },
  oneOnOnes: { left: 2, total: 3 },
  mentorTurnaroundDays: 7,
};

/** Status of each module for this student, keyed by module slug. `done` counts finished chapters; `current` is the chapter index in progress. */
export const enrollment = {
  'applicant-strategy': { status: 'complete', done: 6 },
  dat: { status: 'in-progress', done: 3, current: 3 },
  casper: { status: 'enrolled', done: 0 },
  'personal-statement': { status: 'enrolled', done: 0 },
  'application-entries': { status: 'available', done: 0, note: 'Included in Premium. Chapter 5.1 is free to preview.' },
  interview: { status: 'upcoming', done: 0, note: 'Opens August 2027.' },
  'final-check-in': { status: 'available', done: 0, note: 'Included in Premium.' },
};

export const assignments = [
  { id: 'a1', title: 'DAT study plan', module: 'dat', status: 'not-started', date: '2026-11-16', dateLabel: 'Due', instructions: 'Use the 12-week template. Include your diagnostic scores and weekly study hours.' },
  { id: 'a2', title: 'Planning checklist and timeline', module: 'applicant-strategy', status: 'feedback-ready', date: '2026-10-20', dateLabel: 'Reviewed', feedbackId: 'f1' },
  { id: 'a3', title: 'Personal statement draft 1', module: 'personal-statement', status: 'in-review', date: '2026-11-09', dateLabel: 'Submitted' },
  { id: 'a4', title: 'CASPer practice set', module: 'casper', status: 'revise', date: '2026-10-18', dateLabel: 'Submitted' },
];

export const feedback = [
  {
    id: 'f1',
    assignmentId: 'a2',
    module: 'applicant-strategy',
    reviewer: 'Priya R.',
    reviewerRole: 'Second-year dental student, Canadian school',
    date: '2026-10-20',
    scores: { Completeness: 4, 'Accuracy of school requirements': 3, 'Realistic timeline': 3 },
    strengths: 'Clear school list with deadlines tracked for every program.',
    priorities: ['Book CASPer before McGill’s last sitting', 'Confirm letter writer types for Alberta', 'Move the DAT date three weeks earlier'],
    followUp: 'Which of your three Canadian schools is your first choice, and why?',
  },
];

/** Times are stored in UTC and shown in the viewer's own time zone. */
export const sessions = [
  { id: 's1', title: 'CASPer workshop', kind: 'Live', start: '2026-11-15T02:00:00Z', status: 'in-progress' },
  { id: 's2', title: 'DAT accountability group', kind: 'Group', start: '2026-11-20T03:00:00Z', status: 'in-progress' },
  { id: 's3', title: 'Office hours: PAT', kind: 'Drop-in', start: '2026-11-21T18:00:00Z', status: 'in-progress' },
  { id: 's4', title: 'DAT mentor check-in', kind: '1-1', start: '2026-11-24T01:30:00Z', status: 'booked' },
];

export const bookable = [
  { id: 'b1', title: 'DAT check-in', minutes: 30, module: 'dat' },
  { id: 'b2', title: 'DAT score review', minutes: 30, module: 'dat' },
  { id: 'b3', title: 'Final check-in', minutes: 45, module: 'final-check-in' },
  { id: 'b4', title: 'Mock interview', minutes: 45, module: 'interview', opens: 'Opens August 2027' },
];

export const resources = [
  { id: 'r1', title: 'Application planning checklist', kind: 'Checklists', module: 'applicant-strategy', track: 'Both' },
  { id: 'r2', title: 'DAT 12-week study plan', kind: 'Templates', module: 'dat', track: 'Both' },
  { id: 'r3', title: 'Personal statement brainstorm workbook', kind: 'Workbooks', module: 'personal-statement', track: 'Both' },
  { id: 'r4', title: 'CASPer scenario bank', kind: 'Practice', module: 'casper', track: 'Canada' },
  { id: 'r5', title: 'Workshop recording: AADSAS overview', kind: 'Recordings', module: 'applicant-strategy', track: 'US' },
  { id: 'r6', title: 'Partner discount codes for DAT and CASPer prep', kind: 'Partner discounts', module: 'dat', track: 'Both' },
];

/** Sample school data for layout only. Every school must be verified before launch. */
export const schools = [
  {
    id: 'toronto', name: 'University of Toronto', place: 'Toronto, ON', degree: 'DDS', country: 'Canada', casper: true, interview: 'Panel', verified: '2026-10',
    url: 'https://www.dentistry.utoronto.ca/',
    facts: [['DAT', 'Canadian or US'], ['CASPer', 'Required'], ['Essays', 'Statement, accomplishment'], ['Interview', 'Panel, 20 min'], ['Deadline', 'Nov 1']],
  },
  {
    id: 'alberta', name: 'University of Alberta', place: 'Edmonton, AB', degree: 'DDS', country: 'Canada', casper: true, interview: 'MMI', verified: '2026-10',
    url: 'https://www.ualberta.ca/en/medicine-dentistry/',
    facts: [['DAT', 'Canadian'], ['CASPer', 'Required'], ['Minimum GPA', '3.3'], ['Interview', 'MMI'], ['Deadline', 'Nov 1']],
  },
  {
    id: 'mcgill', name: 'McGill University', place: 'Montréal, QC', degree: 'DMD', country: 'Canada', casper: true, interview: null, verified: '2026-10',
    url: 'https://www.mcgill.ca/dentistry/',
    facts: [['CASPer', 'English or French'], ['Documents', 'CV, verifier list'], ['Deadline', 'Nov 1']],
  },
  {
    id: 'nyu', name: 'NYU College of Dentistry', place: 'New York, NY', degree: 'DDS', country: 'US', casper: false, interview: 'Kira', verified: '2026-10',
    url: 'https://dental.nyu.edu/',
    facts: [['Application', 'AADSAS'], ['Video', 'Kira assessment'], ['Deadline', 'See program page']],
  },
];

// ---- Mentor area ----------------------------------------------------------

export const mentor = {
  name: 'Priya R.',
  initials: 'PR',
  role: 'Second-year dental student, Canadian school',
  monthlyReviewLimit: 4,
  monthlySessionLimit: 2,
  reviewsThisMonth: 3,
};

export const reviewQueue = [
  {
    id: 'q1', student: 'Sam L.', track: 'Canada', title: 'Personal statement draft 1', module: 'personal-statement',
    submitted: '2026-11-09', due: '2026-11-16', status: 'in-review',
    file: 'personal-statement-draft-1.docx', note: 'I’m not sure my ending connects back to the opening story.',
  },
  {
    id: 'q2', student: 'Jordan K.', track: 'US', title: 'Experience log and 3 entries', module: 'application-entries',
    submitted: '2026-11-11', due: '2026-11-18', status: 'new',
    file: 'experience-log.xlsx', note: '',
  },
  {
    id: 'q3', student: 'Ava T.', track: 'Canada', title: 'DAT study plan', module: 'dat',
    submitted: '2026-11-07', due: '2026-11-14', status: 'due-soon',
    file: 'dat-study-plan.pdf', note: 'Diagnostic scores are on page 2.',
  },
];

export const availability = [
  { id: 'v1', day: 'Tuesday', start: '17:30', end: '19:00' },
  { id: 'v2', day: 'Thursday', start: '18:00', end: '20:00' },
  { id: 'v3', day: 'Saturday', start: '10:00', end: '12:00' },
];

export const volunteerLog = [
  { id: 'h1', date: '2026-11-04', activity: 'Review: planning checklist', student: 'Sam L.', hours: 1.5 },
  { id: 'h2', date: '2026-11-02', activity: 'Session: DAT check-in', student: 'Ava T.', hours: 0.5 },
  { id: 'h3', date: '2026-10-28', activity: 'Review: CASPer practice set', student: 'Sam L.', hours: 2 },
  { id: 'h4', date: '2026-10-20', activity: 'Review: planning checklist', student: 'Jordan K.', hours: 1.5 },
  { id: 'h5', date: '2026-10-14', activity: 'Orientation', student: null, hours: 2 },
];

// ---- Admin ----------------------------------------------------------------

export const adminUser = { name: 'D4Y coordinator', initials: 'DC' };

export const cohort = { name: 'Pilot cohort', capacity: 25 };

export const roster = [
  { id: 'u1', name: 'Sam L.', track: 'Canada', package: 'Application', mentor: 'Priya R.', modules: 4, done: 1 },
  { id: 'u2', name: 'Jordan K.', track: 'US', package: 'Premium', mentor: 'Priya R.', modules: 7, done: 2 },
  { id: 'u3', name: 'Ava T.', track: 'Canada', package: 'Essential', mentor: 'Priya R.', modules: 3, done: 0 },
  { id: 'u4', name: 'Noah M.', track: 'US', package: 'Individual modules', mentor: 'Daniel O.', modules: 2, done: 1 },
  { id: 'u5', name: 'Leila S.', track: 'Canada', package: 'Premium', mentor: 'Daniel O.', modules: 7, done: 3 },
  { id: 'u6', name: 'Hardship seat A-103', track: 'Canada', package: 'Premium', mentor: 'Mei W.', modules: 7, done: 0 },
];

export const mentors = [
  { id: 'm1', name: 'Priya R.', role: 'Dental student', students: 3, reviewsThisMonth: 3, limit: 4, hours: 18, status: 'active' },
  { id: 'm2', name: 'Daniel O.', role: 'Dentist', students: 2, reviewsThisMonth: 2, limit: 3, hours: 11, status: 'active' },
  { id: 'm3', name: 'Mei W.', role: 'Recent graduate', students: 1, reviewsThisMonth: 0, limit: 4, hours: 4, status: 'active' },
  { id: 'm4', name: 'Arjun P.', role: 'D4Y alumni', students: 0, reviewsThisMonth: 0, limit: 2, hours: 0, status: 'onboarding' },
];

/** Open reviews across all mentors. `submitted` drives the escalation rule. */
export const openReviews = [
  { id: 'q1', student: 'Sam L.', title: 'Personal statement draft 1', mentor: 'Priya R.', submitted: '2026-11-09' },
  { id: 'q2', student: 'Jordan K.', title: 'Experience log and 3 entries', mentor: 'Priya R.', submitted: '2026-11-11' },
  { id: 'q3', student: 'Ava T.', title: 'DAT study plan', mentor: 'Priya R.', submitted: '2026-11-07' },
  { id: 'q4', student: 'Leila S.', title: 'CASPer practice set', mentor: 'Daniel O.', submitted: '2026-11-04' },
];

export const completedReviewsThisMonth = 21;

/** Hardship applications are identified by number only so reviewers stay blind to the applicant. */
export const hardshipApplications = [
  { id: 'A-102', submitted: '2026-11-03', reviewsDone: 1, reviewsNeeded: 2, status: 'pending', outcome: null },
  { id: 'A-103', submitted: '2026-10-21', reviewsDone: 2, reviewsNeeded: 2, status: 'approved', outcome: 'Premium package' },
];

/** The date the sample data is anchored to. Replace with the real current date once data is live. */
export const demoToday = '2026-11-13';
