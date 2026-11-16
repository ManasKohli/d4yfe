import type { ComponentProps } from 'react';
import { Link } from 'react-router';
import { buttonClass, type ButtonVariant } from '@/shared/ui/buttonClass';

export function Button({ variant, className, type = 'button', ...props }: ComponentProps<'button'> & { variant?: ButtonVariant }) {
  return <button type={type} className={buttonClass(variant, className)} {...props}/>;
}

/** A router link styled as a button. */
export function ButtonLink({ variant, className, ...props }: ComponentProps<typeof Link> & { variant?: ButtonVariant }) {
  return <Link className={buttonClass(variant, className)} {...props}/>;
}
