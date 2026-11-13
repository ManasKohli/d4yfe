import { useEffect } from 'react';
import { useLocation } from 'react-router';

/**
 * On every navigation, scroll to the section named in the URL hash (e.g. /#modules),
 * or to the top of the page when there is no hash.
 */
export default function ScrollManager() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) {
        target.scrollIntoView({ block: 'start' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash, key]);

  return null;
}
