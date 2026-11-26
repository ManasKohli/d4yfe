import { cn } from '@/shared/lib/cn';

export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'light';

const base = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-ui font-medium no-underline transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50';

const variants: Record<ButtonVariant, string> = {
  solid: 'bg-blue text-white hover:bg-blue-hover',
  outline: 'border border-line-strong bg-card text-ink hover:border-ink-2',
  ghost: 'text-ink hover:bg-tint',
  /** For use on a blue panel. */
  light: 'bg-card text-blue hover:bg-blue-soft focus-visible:outline-white',
};

/** Class string for anything that should look like a button, e.g. a plain <a>. */
export const buttonClass = (variant: ButtonVariant = 'solid', className?: string) => cn(base, variants[variant], className);
