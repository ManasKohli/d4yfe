import { providerLabels } from '@/shared/lib/videoLinks';
import Icon from '@/shared/ui/Icon';
import type { VideoProvider } from '@/types';

/**
 * Where the embedded player goes. Until videos are connected (plan build step 2b, which also adds the
 * player's origin to the CSP `frame-src`), it shows which video would play.
 */
export default function LessonPlayer({ provider, title, code }: { provider: VideoProvider; title: string; code?: string }) {
  return (
    <figure className="mt-2 mb-3 grid aspect-video place-items-center rounded-table bg-tint text-muted">
      <div className="grid justify-items-center gap-2 p-4 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-card text-green"><Icon name="play"/></span>
        <figcaption className="text-sm">{code ? `${code} · ` : ''}{title}<br/>{providerLabels[provider]} player in the live portal</figcaption>
      </div>
    </figure>
  );
}
