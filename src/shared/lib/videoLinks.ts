import type { VideoProvider } from '@/types';

// Video links (plan D25, D29). The API runs the same rules; the forms check first so mistakes show immediately.

export interface ParsedVideo { provider: VideoProvider; ref: string }

const hostIs = (host: string, domain: string) => host === domain || host.endsWith(`.${domain}`);

function toUrl(input: string): URL | null {
  try {
    const url = new URL(input.trim());
    return url.protocol === 'https:' ? url : null;
  } catch {
    return null;
  }
}

/**
 * Turns a pasted lesson-video link into a provider and ref. Unlisted Vimeo links keep their hash
 * (`123456789:abcdef`), without which the video won't play. Returns null for anything else.
 */
export function parseVideoLink(input: string): ParsedVideo | null {
  const url = toUrl(input);
  if (!url) return null;
  const host = url.hostname;
  const parts = url.pathname.split('/').filter(Boolean);

  if (hostIs(host, 'vimeo.com')) {
    // In a showcase or album link the video id follows `video`; otherwise it's the first number.
    const afterVideo = parts.indexOf('video') + 1;
    const index = afterVideo > 0 && /^\d+$/.test(parts[afterVideo] ?? '') ? afterVideo : parts.findIndex(part => /^\d+$/.test(part));
    if (index === -1) return null;
    const isHash = (value: string | null | undefined) => Boolean(value && /^[a-f0-9]+$/i.test(value));
    const query = url.searchParams.get('h');
    const hash = isHash(query) ? query : isHash(parts[index + 1]) ? parts[index + 1] : null;
    return { provider: 'vimeo', ref: hash ? `${parts[index]}:${hash}` : parts[index]! };
  }
  if (hostIs(host, 'youtube.com') || host === 'youtu.be') {
    const id = host === 'youtu.be' ? parts[0] : url.searchParams.get('v') ?? (['shorts', 'embed', 'live'].includes(parts[0] ?? '') ? parts[1] : undefined);
    return id && /^[\w-]{6,}$/.test(id) ? { provider: 'youtube', ref: id } : null;
  }
  if (host === 'stream.mux.com' || host === 'player.mux.com') {
    const id = parts[0]?.replace(/\.m3u8$/, '');
    return id && /^[A-Za-z0-9]{8,}$/.test(id) ? { provider: 'mux', ref: id } : null;
  }
  return null;
}

/** A link an admin can paste back in to edit a lesson. */
export function videoLinkFor(provider: VideoProvider, ref: string): string {
  if (provider === 'vimeo') {
    const [id, hash] = ref.split(':');
    return hash ? `https://vimeo.com/${id}/${hash}` : `https://vimeo.com/${id}`;
  }
  if (provider === 'youtube') return `https://www.youtube.com/watch?v=${ref}`;
  return `https://stream.mux.com/${ref}`;
}

export const providerLabels: Record<VideoProvider, string> = { vimeo: 'Vimeo', youtube: 'YouTube', mux: 'Mux' };

const answerHosts = ['youtube.com', 'youtu.be', 'vimeo.com', 'loom.com', 'drive.google.com', 'docs.google.com'];

/** Whether a student's video answer link is from a host mentors can open (plan D29). */
export function isAllowedAnswerLink(input: string): boolean {
  const url = toUrl(input);
  return Boolean(url && url.pathname.length > 1 && answerHosts.some(domain => hostIs(url.hostname, domain)));
}
