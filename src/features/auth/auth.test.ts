import { afterSignIn, passwordProblem } from '@/features/auth/auth';

describe('afterSignIn', () => {
  it('goes to the role’s home without a next path', () => {
    expect(afterSignIn('mentor', null)).toBe('/mentor');
  });

  it('returns to a deep link inside the role’s own area', () => {
    expect(afterSignIn('student', '/portal/feedback/f1')).toBe('/portal/feedback/f1');
    expect(afterSignIn('admin', '/admin')).toBe('/admin');
  });

  it.each([
    ['another role’s area', '/admin/students'],
    ['another site', 'https://evil.example/portal'],
    ['a protocol-relative URL', '//evil.example/portal'],
    ['a backslash trick', '/\\evil.example'],
    ['a lookalike prefix', '/portalx'],
  ])('ignores %s', (_name, next) => {
    expect(afterSignIn('student', next)).toBe('/portal');
  });
});

describe('passwordProblem', () => {
  it.each([
    ['short1', 'short1', 'Use at least 10 characters.'],
    ['onlyletterslong', 'onlyletterslong', 'Use both letters and numbers.'],
    ['1234567890', '1234567890', 'Use both letters and numbers.'],
    ['GoodPassword1', 'GoodPassword2', 'The two passwords don’t match.'],
  ])('rejects %s', (password, confirm, message) => {
    expect(passwordProblem(password, confirm)).toBe(message);
  });

  it('accepts 10+ characters with letters and numbers that match', () => {
    expect(passwordProblem('GoodPassword1', 'GoodPassword1')).toBeNull();
  });
});
