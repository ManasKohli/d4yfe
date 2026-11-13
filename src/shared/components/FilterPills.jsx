/** A single-choice filter rendered as toggle buttons. `options` is a list of strings. */
export default function FilterPills({ label, options, value, onChange }) {
  return (
    <div className="filter-pills" role="group" aria-label={label}>
      {options.map(option => (
        <button key={option} type="button" aria-pressed={option === value} onClick={() => onChange(option)}>{option}</button>
      ))}
    </div>
  );
}
