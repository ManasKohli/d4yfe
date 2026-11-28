import { getAuthLinkRedirect } from '@/app/authLinks';

describe('getAuthLinkRedirect', () => {
  it.each([
    ['an invite link', '#access_token=t&refresh_token=r&type=invite'],
    ['a reset link', '#access_token=t&type=recovery'],
    ['an expired link', '#error=access_denied&error_code=otp_expired&error_description=x'],
  ])('sends %s to the set-password page, keeping the hash', (_name, hash) => {
    expect(getAuthLinkRedirect('/', hash)).toBe(`/account/password${hash}`);
  });

  it.each([
    ['a section anchor', '/', '#modules'],
    ['a plain sign-in token (magic link) without a type we handle', '/', '#access_token=t&type=magiclink'],
    ['the set-password page itself', '/account/password', '#access_token=t&type=invite'],
    ['no hash', '/', ''],
  ])('leaves %s alone', (_name, pathname, hash) => {
    expect(getAuthLinkRedirect(pathname, hash)).toBeNull();
  });
});
