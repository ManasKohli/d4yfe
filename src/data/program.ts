// Program-level content from the D4Y Dental Pathway Program proposal.
// Pages render these exports; they never hold program copy themselves.

import alberta from '@/assets/schools/alberta.png';
import harvard from '@/assets/schools/harvard.png';
import mcgill from '@/assets/schools/mcgill.png';
import nyu from '@/assets/schools/nyu.png';
import penn from '@/assets/schools/penn.png';
import toronto from '@/assets/schools/toronto.png';
import ubc from '@/assets/schools/ubc.png';
import ucla from '@/assets/schools/ucla.png';
import type { HomeSection, Package, SchoolLogo, TitledItem } from '@/types';

/** Home page hero. Headline is the existing site headline; the subline condenses proposal §1 Overview. */
export const hero = {
  headline: 'A clear path to',
  headlineMuted: 'dental school.',
  subline: 'Modular support for the dental school application: workshops, practice, and individual feedback from dental students and dentists. Take only the modules you need.',
  schoolsCaption: 'For applicants to dental schools in Canada and the US',
};

/**
 * Dental schools shown in the hero carousel, in each university's own colors (background removed,
 * cropped, 2x display height). Every school listed has a dental school. The program covers Canadian and
 * American applications (proposal §3, Module 1).
 */
export const schools: SchoolLogo[] = [
  { name: 'University of Toronto', logo: toronto, shape: 'crest' },
  { name: 'Harvard University', logo: harvard, shape: 'wordmark' },
  { name: 'McGill University', logo: mcgill, shape: 'crest' },
  { name: 'UCLA', logo: ucla, shape: 'wordmark' },
  { name: 'University of British Columbia', logo: ubc, shape: 'crest' },
  { name: 'New York University', logo: nyu, shape: 'wordmark' },
  { name: 'University of Pennsylvania', logo: penn, shape: 'crest' },
  { name: 'University of Alberta', logo: alberta, shape: 'wordmark' },
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

/** Bundled packages (proposal §9, option 2). No prices: pricing is announced before registration. */
export const packages: Package[] = [
  { name: 'Essential', includes: ['Educational workshops', 'Resources'] },
  { name: 'Application', includes: ['Workshops', 'Application resources', 'Selected feedback'] },
  { name: 'Premium', includes: ['Full program', 'Individualized reviews', 'Mentorship check-in'] },
];

/** The other two ways in, shown under the packages. */
export const otherAccess: TitledItem[] = [
  { title: 'Individual modules', description: 'Purchase only the modules you need: Applicant Strategy, DAT, CASPer, Personal Statement, Application Entries, Interview, or Final Check-In.' },
  { title: 'Hardship seats', description: 'Students facing financial hardship can apply for a seat. Two committee members review each application without seeing the applicant’s name.' },
];

export const pricingNote = 'Pricing will be announced before registration opens.';

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

export const pilotNote = 'Dates, pricing, and registration details will be announced.';

/**
 * The landing page's sections in order (proposal §1-§12 and the pilot phase). `id` is the URL anchor,
 * `label` names it in the nav, and `titleMuted` is the heading's quieter second line.
 */
export const homeSections = [
  {
    id: 'about',
    label: 'About',
    title: 'One place for the whole application.',
    titleMuted: 'Modular by design.', 
    lede: 'The Dental Pathway Program is a structured, digital program that supports aspiring dental students throughout the dental school application process. It brings practical guidance, workshops, application resources, practice opportunities, and individualized feedback into one place.',
  },
  {
    id: 'modules',
    label: 'Modules',
    title: 'Seven modules.',
    titleMuted: 'Pick what you need.', 
    lede: 'Rather than one general program every student must complete, it is modular: students access and pay for the specific areas where they need support.',
  },
  { id: 'how-it-works', label: 'How it works', title: 'Learn, practice,', titleMuted: 'then get feedback.', lede: 'Every module follows the same three steps.' },
  {
    id: 'portal',
    label: 'Student portal',
    title: 'Your program',
    titleMuted: 'in one place.',
    lede: 'The website works as a student portal, so registration, payment, module access, assignments, resources, workshops, and feedback are managed from one location.',
  },
  { id: 'options', label: 'Packages', title: 'Pay only', titleMuted: 'for what you need.', lede: 'Purchase individual modules, or choose a bundled package.' },
  {
    id: 'mentors',
    label: 'Mentors',
    title: 'Feedback from people',
    titleMuted: 'who have been there.',
    lede: 'Individual reviews and check-ins come from a network of people who have successfully navigated the dental school application process.',
  },
  {
    id: 'community',
    label: 'Community',
    title: 'Go through it',
    titleMuted: 'with others.',
    lede: 'The program is primarily digital, but applicants should not have to navigate the process alone. Community activities connect students with each other and with mentors throughout the application cycle.',
  },
  { id: 'outcomes', label: 'Outcomes', title: 'What students', titleMuted: 'leave with.' },
  {
    id: 'pilot',
    label: 'Pilot',
    title: 'Starting with',
    titleMuted: 'a pilot cohort.',
    lede: 'Before a full launch, D4Y will run the program with a small pilot cohort. Feedback from pilot students will be used to improve the workshops, reviews, and platform before the official launch.',
  },
] as const satisfies readonly HomeSection[];

export type HomeSectionId = (typeof homeSections)[number]['id'];

/** Heading props for one landing-page section, so the nav and the headings never drift apart. */
export function homeSection(id: HomeSectionId): HomeSection {
  const section = homeSections.find(item => item.id === id);
  if (!section) throw new Error(`Unknown home section: ${id}`);
  return section;
}
