/** Bubbles' horizontal position (% of width), size (px), rise time (s) and start offset (s). Fixed, so
 * the pattern is the same on every visit. */
const BUBBLES = [
  [6, 10, 9, 0], [14, 6, 7, 3.1], [23, 14, 11, 5.2], [35, 8, 8, 1.4], [47, 5, 6.5, 4.4], [58, 12, 10, 2.2],
  [66, 7, 7.5, 6.3], [74, 16, 12, 0.8], [83, 6, 6.8, 3.7], [91, 11, 9.5, 5.8], [97, 7, 8.2, 2.9],
] as const;

/**
 * Toothpaste foam: soft bubbles drifting up behind the content of a blue panel. Put it first inside a
 * `relative isolate overflow-hidden` panel. Decorative; hidden from assistive tech and under reduced motion.
 */
export default function FoamBubbles() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 motion-reduce:hidden">
      {BUBBLES.map(([left, size, seconds, delay]) => (
        <span
          key={left}
          className="absolute -bottom-6 animate-rise rounded-full border border-white/30 bg-white/15"
          style={{ left: `${left}%`, width: size, height: size, animationDuration: `${seconds}s`, animationDelay: `${-delay}s` }}
        />
      ))}
    </div>
  );
}
