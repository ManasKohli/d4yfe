import { statuses } from '@/data/portal';
import { cn } from '@/shared/lib/cn';
import type { StatusKey, Tone } from '@/types';

const tones: Record<Tone, string> = {
  neutral: 'bg-surface text-muted',
  active: 'bg-blue-soft text-blue',
  done: 'bg-done-soft text-ink-2',
  warn: 'bg-warn-soft text-warn',
};

type BadgeProps = { status: StatusKey; label?: string; tone?: Tone } | { status?: undefined; label: string; tone?: Tone };

/** A status from `statuses` in src/data/portal, or a custom label with a tone. */
export default function Badge({ status, label, tone }: BadgeProps) {
  const known = status ? statuses[status] : undefined;
  return (
    <span className={cn('inline-flex shrink-0 items-center rounded-field px-2 py-0.5 text-sm font-medium whitespace-nowrap', tones[tone ?? known?.tone ?? 'neutral'])}>
      {label ?? known?.label}
    </span>
  );
}
