import { isAllowedAnswerLink, parseVideoLink, videoLinkFor } from '@/shared/lib/videoLinks';

describe('parseVideoLink', () => {
  it.each([
    ['https://vimeo.com/123456789', { provider: 'vimeo', ref: '123456789' }],
    ['https://vimeo.com/123456789/abc123def', { provider: 'vimeo', ref: '123456789:abc123def' }],
    ['https://player.vimeo.com/video/123456789?h=abc123', { provider: 'vimeo', ref: '123456789:abc123' }],
    ['https://www.youtube.com/watch?v=dQw4w9WgXcQ', { provider: 'youtube', ref: 'dQw4w9WgXcQ' }],
    ['https://m.youtube.com/watch?v=dQw4w9WgXcQ', { provider: 'youtube', ref: 'dQw4w9WgXcQ' }],
    ['https://youtu.be/dQw4w9WgXcQ', { provider: 'youtube', ref: 'dQw4w9WgXcQ' }],
    ['https://www.youtube.com/shorts/dQw4w9WgXcQ', { provider: 'youtube', ref: 'dQw4w9WgXcQ' }],
    ['https://stream.mux.com/a1B2c3D4.m3u8', { provider: 'mux', ref: 'a1B2c3D4' }],
    ['https://vimeo.com/showcase/111/video/123456789', { provider: 'vimeo', ref: '123456789' }],
    ['https://vimeo.com/123456789?h=not-hex!', { provider: 'vimeo', ref: '123456789' }],
  ])('reads %s', (input, expected) => {
    expect(parseVideoLink(input)).toEqual(expected);
  });

  it.each(['http://vimeo.com/123', 'https://vimeo.com/channels', 'https://example.com/video/1', 'https://mux.com/pricing', 'not a link', ''])('rejects %s', input => {
    expect(parseVideoLink(input)).toBeNull();
  });

  it('round-trips a link through videoLinkFor, keeping the unlisted hash', () => {
    const parsed = parseVideoLink('https://vimeo.com/123456789/abc123def')!;
    expect(parseVideoLink(videoLinkFor(parsed.provider, parsed.ref))).toEqual(parsed);
  });
});

describe('isAllowedAnswerLink', () => {
  it.each([
    'https://youtu.be/abc123',
    'https://www.youtube.com/watch?v=abc123',
    'https://m.youtube.com/shorts/abc123',
    'https://vimeo.com/123456',
    'https://www.loom.com/share/abc',
    'https://drive.google.com/file/d/abc/view',
    'https://docs.google.com/file/d/abc',
  ])('accepts %s', input => {
    expect(isAllowedAnswerLink(input)).toBe(true);
  });

  it.each(['http://youtu.be/abc', 'https://youtube.com.evil.example/watch', 'https://dropbox.com/s/abc', 'https://youtu.be/', 'video.mp4'])('rejects %s', input => {
    expect(isAllowedAnswerLink(input)).toBe(false);
  });
});
