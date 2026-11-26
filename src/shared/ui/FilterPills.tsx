import { cn } from '@/shared/lib/cn';

interface FilterPillsProps<T extends string> {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}

/** A single-choice filter rendered as toggle buttons. */
export default function FilterPills<T extends string>({ label, options, value, onChange }: FilterPillsProps<T>) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
      {options.map(option => (
        <button
          key={option}
          type="button"
          aria-pressed={option === value}
          onClick={() => onChange(option)}
          className={cn(
            'min-h-11 rounded-full border px-4 text-ui transition-colors',
            option === value ? 'border-blue bg-blue text-white' : 'border-line bg-card text-ink hover:border-line-strong',
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
