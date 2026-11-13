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
};

export const modulePath = (slug) => `/modules/${slug}`;
