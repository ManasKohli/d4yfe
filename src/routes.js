/** Central list of URLs so links and <Route> definitions never drift apart. */
export const paths = {
  home: '/',
  modulesSection: '/#modules',
  approachSection: '/#approach',
  applicationSupport: '/application-support',
  programDetails: '/program-details',
  goalsSection: '/program-details#goals',
  communitySection: '/program-details#community',
};

export const modulePath = (moduleNumber) => `/modules/${moduleNumber}`;
