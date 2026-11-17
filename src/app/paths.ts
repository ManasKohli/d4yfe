/** Central list of URLs so links and <Route> definitions never drift apart. */
export const paths = {
  home: '/',
  aboutSection: '/#about',
  modulesSection: '/#modules',
  howItWorksSection: '/#how-it-works',
  portalSection: '/#portal',
  optionsSection: '/#options',
  mentorsSection: '/#mentors',
  communitySection: '/#community',
  pilotSection: '/#pilot',
  login: '/login',
  student: '/portal',
  mentor: '/mentor',
  admin: '/admin',
} as const;

export const modulePath = (slug: string) => `/modules/${slug}`;

export const portalModulePath = (slug: string) => `${paths.student}/modules/${slug}`;
export const portalFeedbackPath = (id: string) => `${paths.student}/feedback/${id}`;
export const mentorReviewPath = (id: string) => `${paths.mentor}/reviews/${id}`;
