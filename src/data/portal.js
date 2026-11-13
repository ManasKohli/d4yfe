// Structure of the signed-in areas (student portal, mentor area, admin), from D4Y's portal prototype.
// These are fixed program rules and labels. Per-person records live in src/data/demo.js until Supabase is connected.

/** Labels for chapter materials and module-wide items. */
export const materialTypes = {
  download: 'Download',
  template: 'Template',
  visual: 'Visual',
  quiz: 'Quiz',
  assignment: 'Assignment',
  booking: 'Booking',
  live: 'Live session',
  link: 'Link',
  spreadsheet: 'Spreadsheet',
  survey: 'Survey',
  practice: 'Practice',
  tool: 'Tool',
  text: 'Reading',
  callout: 'Tips',
};

/** The orientation every student completes before module 1. */
export const startHere = {
  title: 'Start here',
  chapters: ['Welcome', 'Choose your track', 'Timeline quiz', 'Platform tour', 'Code of conduct', 'Join community'],
};

export const tracks = ['Canada', 'US'];

/** What every chapter page contains, in order, besides its videos and listed materials. */
export const chapterTemplate = {
  summary: 'Written summary and key points',
  callouts: 'Common mistake and D4Y tip callouts',
};

/** Status labels shared by the student, mentor, and admin views. `tone` maps to a pill style. */
export const statuses = {
  'not-started': { label: 'Not started', tone: 'neutral' },
  submitted: { label: 'Submitted', tone: 'active' },
  'in-review': { label: 'In review', tone: 'active' },
  'feedback-ready': { label: 'Feedback ready', tone: 'done' },
  revise: { label: 'Revise', tone: 'warn' },
  new: { label: 'New', tone: 'neutral' },
  'due-soon': { label: 'Due soon', tone: 'warn' },
  overdue: { label: 'Overdue', tone: 'warn' },
  completed: { label: 'Completed', tone: 'done' },
  complete: { label: 'Complete', tone: 'done' },
  'in-progress': { label: 'In progress', tone: 'active' },
  enrolled: { label: 'In your package', tone: 'neutral' },
  available: { label: 'Add module', tone: 'active' },
  upcoming: { label: 'Opens later', tone: 'warn' },
  booked: { label: 'Booked', tone: 'done' },
  pending: { label: 'Pending', tone: 'warn' },
  approved: { label: 'Approved', tone: 'done' },
  active: { label: 'Active', tone: 'done' },
  onboarding: { label: 'Onboarding', tone: 'warn' },
};

/** Review rubrics. Every criterion is scored out of `rubricScale`. Draft criteria: confirm with D4Y before launch. */
export const rubricScale = 4;
export const rubrics = {
  'applicant-strategy': ['Completeness', 'Accuracy of school requirements', 'Realistic timeline'],
  dat: ['Uses diagnostic results', 'Realistic weekly hours', 'Covers every section'],
  casper: ['Critical thinking', 'Communication', 'Empathy', 'Decision-making'],
  'personal-statement': ['Reflection', 'Connection to dentistry', 'Cohesive narrative', 'Strong introduction'],
  'application-entries': ['Clear', 'Concise', 'Reflective', 'Specific', 'Impactful', 'Consistent with overall narrative'],
  interview: ['Structure', 'Reflection', 'Professionalism'],
};

/** What a mentor's written feedback contains. */
export const feedbackParts = ['Rubric scores', 'Strengths', 'Top three priorities', 'One follow-up question'];

/** Overdue reviews escalate automatically. `day` counts from submission. */
export const escalationRule = [
  { day: 5, action: 'Mentor reminder' },
  { day: 7, action: 'Coordinator alert' },
  { day: 9, action: 'Reassigned' },
];

export const sessionRules = {
  reminders: 'Reminders go out 24 hours and 1 hour before each session.',
  reschedule: 'Reschedule up to 48 hours before.',
};

export const mentorRules = [
  'Mentors see only the students assigned to them.',
  'Access starts after orientation and a signed confidentiality agreement.',
  'Monthly limits protect volunteer time.',
  'Volunteer hours log automatically from completed reviews and sessions.',
];

export const community = {
  platform: 'Discord',
  // Invite link from D4Y. Leave empty until the server is set up.
  inviteUrl: '',
  moderation: 'Moderated by D4Y mentors',
  conduct: 'A code of conduct applies in every community space.',
  channels: [
    { name: 'general', description: 'Introductions and announcements' },
    { name: 'dat-study', description: 'Study buddies and questions' },
    { name: 'casper-practice', description: 'Scenario swaps' },
    { name: 'ps-swap', description: 'Personal statement peer review' },
    { name: 'canada-track', description: 'Canadian applicant chat' },
    { name: 'us-track', description: 'AADSAS applicant chat' },
    { name: 'wins', description: 'Interviews and acceptances' },
  ],
  peerCircle: {
    title: 'Peer review circle',
    description: 'Get matched with three students on your track and at your stage.',
  },
};

export const resourceKinds = ['Checklists', 'Templates', 'Workbooks', 'Practice', 'Recordings', 'Partner discounts'];

export const partnerDisclosure = 'Some codes come from program partners. Listing a code is not an endorsement.';

export const schoolsNote = 'Requirements change each cycle. Confirm every detail on the school’s official page.';

/** Navigation for each signed-in area. Paths are relative to the area's base path. */
export const areas = {
  student: {
    label: 'Student portal',
    nav: [
      { label: 'Home', to: '', end: true },
      { label: 'Assignments', to: 'assignments' },
      { label: 'Feedback', to: 'feedback' },
      { label: 'Sessions', to: 'sessions' },
      { label: 'Resources', to: 'resources' },
      { label: 'School requirements', to: 'schools' },
      { label: 'Community', to: 'community' },
    ],
  },
  mentor: {
    label: 'Mentor area',
    nav: [
      { label: 'Dashboard', to: '', end: true },
      { label: 'Review queue', to: 'reviews' },
      { label: 'Availability', to: 'availability' },
      { label: 'Volunteer record', to: 'hours' },
    ],
  },
  admin: {
    label: 'Admin',
    nav: [
      { label: 'Overview', to: '', end: true },
      { label: 'Students', to: 'students' },
      { label: 'Mentors', to: 'mentors' },
      { label: 'Reviews', to: 'reviews' },
      { label: 'Hardship seats', to: 'hardship' },
    ],
  },
};
