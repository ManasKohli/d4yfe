/** Faint concentric rings behind a hero: the site's one decorative element. */
export default function Rings() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 hidden h-full overflow-hidden [mask-image:linear-gradient(to_bottom,black_45%,transparent_92%)] md:block">
      {[36, 56, 76].map(size => (
        <span
          key={size}
          className="absolute top-[45%] left-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border border-line"
          style={{ width: `${size}rem` }}
        />
      ))}
    </div>
  );
}
