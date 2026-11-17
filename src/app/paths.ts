/** Central list of URLs so links and <Route> definitions never drift apart. */
export const paths = {
  home: '/',
  modulesSection: '/#modules',
  howItWorksSection: '/#how-it-works',
  programDetails: '/program-details',
  howItWorksDetail: '/program-details#how-it-works',
  goalsSection: '/program-details#goals',
  portalSection: '/program-details#portal',
  optionsSection: '/program-details#options',
  mentorsSection: '/program-details#mentors',
  communitySection: '/program-details#community',
  pilotSection: '/program-details#pilot',
  login: '/login',
  student: '/portal',
  mentor: '/mentor',
  admin: '/admin',
} as const;

export const modulePath = (slug: string) => `/modules/${slug}`;

export const portalModulePath = (slug: string) => `${paths.student}/modules/${slug}`;
export const portalFeedbackPath = (id: string) => `${paths.student}/feedback/${id}`;
export const mentorReviewPath = (id: string) => `${paths.mentor}/reviews/${id}`;
