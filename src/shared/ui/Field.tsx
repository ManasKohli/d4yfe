import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

/** Shared look for text inputs, selects and textareas. Labels always sit outside the control. */
export const controlClass = 'block w-full min-h-11 rounded-field border border-line-strong bg-card px-3 py-2 text-base text-ink placeholder:text-subtle focus-visible:border-green';

interface FieldProps {
  label: string;
  htmlFor: string;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** A visible label, the control, and an optional hint. */
export function Field({ label, htmlFor, hint, children, className }: FieldProps) {
  return (
    <div className={cn('grid gap-1.5', className)}>
      <label htmlFor={htmlFor} className="text-ui font-medium">{label}</label>
      {children}
      {hint && <p className="text-sm text-muted">{hint}</p>}
    </div>
  );
}

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return <input className={cn(controlClass, className)} {...props}/>;
}

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return <textarea className={cn(controlClass, 'min-h-28', className)} {...props}/>;
}

export function Select({ className, ...props }: ComponentProps<'select'>) {
  return <select className={cn(controlClass, className)} {...props}/>;
}
