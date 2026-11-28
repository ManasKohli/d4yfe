import type { Role } from '@/types';

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
  setPassword: '/account/password',
  student: '/portal',
  mentor: '/mentor',
  admin: '/admin',
} as const;

/** Where each role lands after signing in. */
export const roleHome = { student: '/portal', mentor: '/mentor', admin: '/admin' } as const satisfies Record<Role, string>;

export const modulePath = (slug: string) => `/modules/${slug}`;

export const portalModulePath = (slug: string) => `${paths.student}/modules/${slug}`;
export const portalFeedbackPath = (id: string) => `${paths.student}/feedback/${id}`;
export const mentorReviewPath = (id: string) => `${paths.mentor}/reviews/${id}`;
