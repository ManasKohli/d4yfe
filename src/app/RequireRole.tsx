import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { decideAccess } from '@/app/access';
import { useAuth } from '@/shared/auth/authContext';
import { Button } from '@/shared/ui/Button';
import type { Role } from '@/types';

/** Opens a signed-in area only for its role; sends everyone else to sign in or to their own area. */
export default function RequireRole({ area, children }: { area: Role; children: ReactNode }) {
  const { state, retry } = useAuth();
  const { pathname, search, hash } = useLocation();
  const access = decideAccess(state, area, `${pathname}${search}${hash}`);

  switch (access.kind) {
    case 'allow': return children;
    case 'login':
    case 'redirect': return <Navigate to={access.to} replace/>;
    case 'wait': return <p className="sr-only" role="status">Loading your account</p>;
    case 'error':
      return (
        <main id="main" className="container-page grid max-w-xl gap-4 py-20">
          <h1 className="text-3xl">We couldn’t open your account</h1>
          <p role="alert" className="text-muted">{access.message}</p>
          <div><Button onClick={retry}>Try again</Button></div>
        </main>
      );
  }
}
