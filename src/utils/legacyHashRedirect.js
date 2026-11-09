import { modulePath, paths } from '../routes.js';

// The site originally used hash URLs such as /#module-02 or /#program-model.
// Map them onto the new paths so bookmarks and shared links still work.
const legacyHashes = {
  home: paths.home,
  'application-support': paths.applicationSupport,
  'program-model': paths.programDetails,
  goals: paths.goalsSection,
  community: paths.communitySection,
};

export function getLegacyRedirect(pathname, hash) {
  if (pathname !== '/' || !hash) return null;
  const key = hash.slice(1);
  const moduleMatch = key.match(/^module-([\w-]+)$/);
  if (moduleMatch) return modulePath(moduleMatch[1]);
  return legacyHashes[key] ?? null;
}

export function redirectLegacyHashUrl() {
  const target = getLegacyRedirect(window.location.pathname, window.location.hash);
  if (target) window.history.replaceState(null, '', target);
}
