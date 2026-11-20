import { useState } from 'react';
import { ApiError, getMaterialLink } from '@/shared/api/mockApi';
import { openLink } from '@/shared/lib/openLink';
import type { Material } from '@/types';



/** Download a file through the API (a signed URL), open a link, or toggle the player for a video material. */
export default function MaterialAction({ material, playing, onTogglePlay }: { material: Material; playing?: boolean; onTogglePlay?: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (material.kind === 'video') {
    return (
      <button type="button" aria-expanded={playing} aria-label={`${playing ? 'Close' : 'Watch'} ${material.title}`} onClick={onTogglePlay} className="min-h-11 text-sm font-medium text-blue hover:underline">
        {playing ? 'Close' : 'Watch'}
      </button>
    );
  }

  // Links are already in the payload, so they open as a real link (no await, so no popup blocker).
  if (material.url && !material.fileName) {
    return (
      <a href={material.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${material.title}`} className="inline-flex min-h-11 items-center text-sm font-medium text-blue hover:underline">
        Open
      </a>
    );
  }

  const open = async () => {
    setBusy(true);
    setError('');
    try {
      openLink(await getMaterialLink(material.id));
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : 'Couldn’t open this. Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <span className="flex items-center gap-3">
      {error && <span className="text-sm text-warn" role="alert">{error}</span>}
      <button type="button" onClick={open} disabled={busy} aria-label={`${busy ? 'Opening' : 'Download'} ${material.title}`} className="min-h-11 text-sm font-medium text-blue hover:underline disabled:opacity-50">
        {busy ? 'Opening…' : 'Download'}
      </button>
    </span>
  );
}
