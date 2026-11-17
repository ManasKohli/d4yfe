/** Central list of URLs so links and <Route> definitions never drift apart. */
export const paths = {
  home: '/',
  modulesSection: '/#modules',
  howItWorksSection: '/#how-it-works',
  howItWorks: '/how-it-works',
  packages: '/packages',
  pilotSection: '/packages#pilot',
  mentors: '/mentors',
  communitySection: '/mentors#community',
  login: '/login',
  student: '/portal',
  mentor: '/mentor',
  admin: '/admin',
} as const;

export const modulePath = (slug: string) => `/modules/${slug}`;

export const portalModulePath = (slug: string) => `${paths.student}/modules/${slug}`;
export const portalFeedbackPath = (id: string) => `${paths.student}/feedback/${id}`;
export const mentorReviewPath = (id: string) => `${paths.mentor}/reviews/${id}`;
