/** Small uppercase label shown above section headings. `tone` is "dark" or "light". */
export default function Eyebrow({ tone, children }) {
  return <div className={tone ? `eyebrow ${tone}-eyebrow` : 'eyebrow'}><span className="eyebrow-dot"/> {children}</div>;
}
