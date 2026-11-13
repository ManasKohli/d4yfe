export default function ProgressBar({ value, max, label }) {
  const percent = max ? Math.round((value / max) * 100) : 0;
  return (
    <div className="progress" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} aria-valuetext={`${value} of ${max}`}>
      <span style={{ width: `${percent}%` }}/>
    </div>
  );
}
