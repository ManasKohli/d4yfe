import { modulePath, paths } from '@/app/paths';

// The site originally used hash URLs such as /#module-02 or /#program-model.
// Map them onto the current paths so bookmarks and shared links still work.
const legacyHashes: Record<string, string> = {
  home: paths.home,
  approach: paths.howItWorksSection,
  'application-support': paths.modulesSection,
  'program-model': paths.aboutSection,
  goals: paths.aboutSection,
  community: paths.communitySection,
};

// Module numbers as they were when hash URLs were in use (before DAT and Interview were added).
const legacyModuleSlugs = ['applicant-strategy', 'casper', 'personal-statement', 'application-entries', 'final-check-in'];

export function getLegacyRedirect(pathname: string, hash: string): string | null {
  if (pathname !== '/' || !hash) return null;
  const key = hash.slice(1);
  const moduleMatch = key.match(/^module-(\d+)$/);
  if (moduleMatch) {
    const slug = legacyModuleSlugs[Number(moduleMatch[1]) - 1];
    return slug ? modulePath(slug) : paths.modulesSection;
  }
  return Object.hasOwn(legacyHashes, key) ? legacyHashes[key] ?? null : null;
}

export function redirectLegacyHashUrl() {
  const target = getLegacyRedirect(window.location.pathname, window.location.hash);
  if (target) window.history.replaceState(null, '', target);
}
