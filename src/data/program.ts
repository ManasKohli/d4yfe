// Program-level content from the D4Y Dental Pathway Program proposal.
// Pages render these exports; they never hold program copy themselves.

import type { DetailSection, TitledItem } from '@/types';

/** Home page hero. Headline is the existing site headline; the subline condenses proposal §1 Overview. */
export const hero = {
  eyebrow: 'Dentistry for Youth · Dental Pathway Program',
  modulesTitle: 'The seven modules',
  modulesLinkLabel: 'How the modules fit together',
  headline: 'A clear path to',
  headlineMuted: 'dental school.',
  subline: 'Modular support for the dental school application: workshops, practice, and individual feedback from dental students and dentists. Take only the modules you need.',
};

/** Proposal §1, shown at the top of the program details page. */
export const overview = [
  'The Dental Pathway Program is a structured, digital program that supports aspiring dental students throughout the dental school application process. It brings practical guidance, workshops, application resources, practice opportunities, and individualized feedback into one place.',
  'Rather than one general program every student must complete, it is modular: students access and pay for the specific areas where they need support.',
];

export const programGoals = [
  'Provide a clear understanding of the dental school application process',
  'Help students develop a strategic, personalized application plan',
  'Support students in understanding school-specific prerequisites and requirements',
  'Provide structured preparation for CASPer',
  'Help students develop strong personal statements and application entries',
  'Connect aspiring applicants with current dental students and dental professionals',
  'Provide opportunities for individualized feedback and mentorship',
  'Create a supportive community where applicants learn from one another',
  'Make reliable application guidance more accessible and organized',
];

export const studentOutcomes = [
  'A clear application timeline',
  'An understanding of your prerequisite requirements',
  'Improved CASPer preparation',
  'A stronger personal statement',
  'More effective application entries',
  'Access to dental student and dentist perspectives',
  'Greater confidence navigating the application process',
  'A community of peers and mentors',
];

/** The three steps every module follows. */
export const howItWorks: (TitledItem & { step: string })[] = [
  {
    step: 'Learn',
    title: 'Workshops and resources',
    description: 'Each module starts with a recorded or live workshop and the application resources that go with it.',
  },
  {
    step: 'Practice',
    title: 'Assignments and practice',
    description: 'Complete a planning checklist, work through timed CASPer scenarios, and draft your statement and entries.',
  },
  {
    step: 'Feedback',
    title: 'Reviews and a final check-in',
    description: 'Submit your work for individual review and book a one-on-one session with a dental student, dentist, or D4Y mentor.',
  },
];

/** Home page rows under the modules. `to` is a key of `paths`. */
export const homeRows: (TitledItem & { linkLabel: string; to: 'howItWorksDetail' | 'optionsSection' | 'mentorsSection' })[] = [
  {
    title: 'How it works',
    description: 'Every module follows the same three steps: learn in a workshop, practice with assignments, then get individual feedback.',
    linkLabel: 'See how it works',
    to: 'howItWorksDetail',
  },
  {
    title: 'Packages',
    description: 'Choose individual modules, or the Essential, Application, or Premium package. Hardship seats are available.',
    linkLabel: 'Compare options',
    to: 'optionsSection',
  },
  {
    title: 'Mentors',
    description: 'Your work is reviewed by current dental students, recent graduates, dentists, and D4Y mentors.',
    linkLabel: 'Meet the network',
    to: 'mentorsSection',
  },
];

export const portalFeatures: TitledItem[] = [
  {
    title: 'Everything in one view',
    description: 'Purchased modules, upcoming workshops, assignments, deadlines, submitted work, feedback, and resources.',
  },
  {
    title: 'Choose what you need',
    description: 'Register and pay for individual modules or a bundled package directly through the website.',
  },
  {
    title: 'Submit, then get feedback',
    description: 'Upload personal statements, application entries, practice CASPer responses, and planning documents, and receive feedback on the platform.',
  },
];

export const accessOptions: TitledItem[] = [
  { title: 'Individual modules', description: 'Purchase only the modules you need: Applicant Strategy, DAT, CASPer, Personal Statement, Application Entries, Interview, or Final Check-In.' },
  { title: 'Essential package', description: 'Educational workshops and resources.' },
  { title: 'Application package', description: 'Workshops, application resources, and selected feedback.' },
  { title: 'Premium package', description: 'The full program, with individualized reviews and a mentorship check-in.' },
  { title: 'Hardship seats', description: 'Students facing financial hardship can apply for a seat. Two committee members review each application without seeing the applicant’s name.' },
];

export const mentorNetwork = [
  'Current dental students',
  'Recent dental graduates',
  'Dentists',
  'D4Y alumni',
  'Previous D4Y board members',
  'Other qualified application mentors',
];

/** How the reviewer network works, shown beside the list of who is in it. */
export const mentorNetworkNotes = [
  'Students can choose the type of feedback they want.',
  'A network, rather than a single reviewer, lets the program support more students.',
  'Over time, the network becomes a formal D4Y Dental Mentor Network.',
];

export const communityItems: TitledItem[] = [
  { title: 'Applicant discussion groups', description: 'Share questions and perspectives with other applicants' },
  { title: 'Group workshops and Q&A sessions', description: 'Learn together and ask what matters to you' },
  { title: 'Dental student panels and mentor events', description: 'Hear from people at different stages of the path' },
  { title: 'Peer accountability and cycle check-ins', description: 'Stay on track through the application cycle' },
];

/** What the pilot cohort evaluates before the full launch. */
export const pilotFocus = [
  'Student satisfaction',
  'Platform usability',
  'Workshop effectiveness',
  'Reviewer quality',
  'Pricing',
  'Where students need more support',
];

/** Program details page: the page heading, then its sections in order (proposal §2-§12 and the pilot phase). */
export const detailsHeader = {
  eyebrow: 'Program details',
  title: 'How the program fits together',
};

export const detailSections = [
  { id: 'how-it-works', label: 'How it works', title: 'Learn, practice, then get feedback' },
  { id: 'goals', label: 'Program goals', title: 'What the program is built to do' },
  { id: 'outcomes', label: 'Outcomes', title: 'What students leave with' },
  {
    id: 'portal',
    label: 'Student portal',
    title: 'Your program in one place',
    lede: 'The website works as a student portal, so registration, payment, module access, assignments, resources, workshops, and feedback are managed from one location.',
  },
  {
    id: 'options',
    label: 'Program options',
    title: 'Pay only for what you need',
    lede: 'Purchase individual modules, or choose a bundled package.',
  },
  {
    id: 'mentors',
    label: 'Mentors and reviewers',
    title: 'Feedback from people who have been there',
    lede: 'Individual reviews and check-ins come from a network of people who have successfully navigated the dental school application process.',
  },
  {
    id: 'community',
    label: 'Community',
    title: 'Go through it with others',
    lede: 'The program is primarily digital, but applicants should not have to navigate the process alone. Community activities connect students with each other and with mentors throughout the application cycle.',
  },
  {
    id: 'pilot',
    label: 'Pilot cohort',
    title: 'Starting with a pilot cohort',
    lede: 'Before a full launch, D4Y will run the program with a small pilot cohort. Feedback from pilot students will be used to improve the workshops, reviews, and platform before the official launch.',
  },
] as const satisfies readonly DetailSection[];

export type DetailSectionId = (typeof detailSections)[number]['id'];
