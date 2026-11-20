interface ProgressBarProps {
  value: number;
  max: number;
  label: string;
}

export default function ProgressBar({ value, max, label }: ProgressBarProps) {
  const percent = max ? Math.round((value / max) * 100) : 0;
  return (
    <div
      className="h-1.5 overflow-hidden rounded-full bg-tint"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={`${value} of ${max}`}
    >
      <span className="block h-full rounded-full bg-blue transition-[width] duration-300" style={{ width: `${percent}%` }}/>
    </div>
  );
}
