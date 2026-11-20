import type { ComponentProps } from 'react';
import { Link } from 'react-router';
import { paths } from '@/app/paths';
import { cn } from '@/shared/lib/cn';
import Icon from '@/shared/ui/Icon';

/** D4Y wordmark linking to the public home page. */
export default function Brand({ className, ...linkProps }: Omit<ComponentProps<typeof Link>, 'to'>) {
  return (
    <Link className={cn('inline-flex min-h-11 items-center gap-2.5 text-ink no-underline', className)} to={paths.home} {...linkProps}>
      <span className="grid size-8 place-items-center rounded-full bg-blue text-white"><Icon name="tooth" size={18}/></span>
      <span className="leading-tight">
        <strong className="block font-display text-ui">D4Y Dental Pathway</strong>
        <small className="block text-xs text-muted">Dentistry for Youth</small>
      </span>
    </Link>
  );
}
