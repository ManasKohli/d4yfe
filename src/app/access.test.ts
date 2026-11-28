import { decideAccess } from '@/app/access';
import type { Me, Role } from '@/types';

const me = (role: Role): Me => ({ id: 'u1', email: 'a@example.com', fullName: null, role, student: null, mentor: null });

describe('decideAccess', () => {
  it('keeps every area open in preview mode', () => {
    expect(decideAccess({ status: 'disabled' }, 'admin', '/admin')).toEqual({ kind: 'allow' });
  });

  it('waits while the session loads', () => {
    expect(decideAccess({ status: 'loading' }, 'student', '/portal')).toEqual({ kind: 'wait' });
  });

  it('sends a signed-out visitor to sign in, remembering where they were going', () => {
    expect(decideAccess({ status: 'signed-out' }, 'mentor', '/mentor/reviews/r1?x=1')).toEqual({
      kind: 'login', to: '/login?next=%2Fmentor%2Freviews%2Fr1%3Fx%3D1',
    });
  });

  it('opens the area that matches the role', () => {
    expect(decideAccess({ status: 'signed-in', me: me('admin') }, 'admin', '/admin')).toEqual({ kind: 'allow' });
  });

  it.each<[Role, Role, string]>([
    ['student', 'admin', '/portal'],
    ['mentor', 'admin', '/mentor'],
    ['admin', 'student', '/admin'],
    ['student', 'mentor', '/portal'],
  ])('sends a %s away from the %s area to %s', (role, area, home) => {
    expect(decideAccess({ status: 'signed-in', me: me(role) }, area, `/${area}`)).toEqual({ kind: 'redirect', to: home });
  });

  it('shows the error instead of guessing', () => {
    expect(decideAccess({ status: 'error', message: 'down' }, 'student', '/portal')).toEqual({ kind: 'error', message: 'down' });
  });
});
