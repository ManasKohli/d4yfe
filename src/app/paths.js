/** Central list of URLs so links and <Route> definitions never drift apart. */
export const paths = {
  home: '/',
  modulesSection: '/#modules',
  howItWorksSection: '/#how-it-works',
  programDetails: '/program-details',
  portalSection: '/program-details#portal',
  mentorsSection: '/program-details#mentors',
  communitySection: '/program-details#community',
  pilotSection: '/program-details#pilot',
  login: '/login',
  student: '/portal',
  mentor: '/mentor',
  admin: '/admin',
};

export const modulePath = (slug) => `/modules/${slug}`;

export const portalModulePath = (slug) => `${paths.student}/modules/${slug}`;
export const portalFeedbackPath = (id) => `${paths.student}/feedback/${id}`;
export const mentorReviewPath = (id) => `${paths.mentor}/reviews/${id}`;
