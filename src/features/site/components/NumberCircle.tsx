import { cn } from '@/shared/lib/cn';

/** A step or item number in a circle. Decorative: the list it sits in already carries the order. */
export default function NumberCircle({ n, size = 'md' }: { n: number; size?: 'sm' | 'md' }) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-display font-bold tabular-nums',
        size === 'md' ? 'size-12 bg-green text-lg text-white' : 'size-8 bg-green-soft text-sm text-green',
      )}
    >
      {n}
    </span>
  );
}
