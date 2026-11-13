import { useEffect } from 'react';

export const SITE_TITLE = 'Dental Pathway Program — Dentistry for Youth';

/** Sets the browser tab title for the current page. */
export default function useDocumentTitle(pageTitle) {
  useEffect(() => {
    document.title = pageTitle ? `${pageTitle} — Dentistry for Youth` : SITE_TITLE;
  }, [pageTitle]);
}
