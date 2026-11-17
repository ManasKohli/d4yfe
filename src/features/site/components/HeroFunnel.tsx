// The hero's one decorative element: a ruled funnel of fine lines that narrows behind the headline
// and spreads into rings at the bottom. Pure geometry, computed once, static, hidden from assistive tech.

const CX = 600;
const LINES = 96;
const TWIST = (150 * Math.PI) / 180;
const TILT = 0.17; // ellipse height as a share of its width: the "looking down" perspective

const top = { y: -20, r: 560 };
const bottom = { y: 780, r: 420 };

const point = (ring: { y: number; r: number }, angle: number) =>
  `${(CX + ring.r * Math.cos(angle)).toFixed(1)} ${(ring.y + ring.r * TILT * Math.sin(angle)).toFixed(1)}`;

/** Straight lines from the top ring to a twisted point on the bottom ring; together they form the waist. */
const funnelPath = Array.from({ length: LINES }, (_, i) => {
  const angle = (2 * Math.PI * i) / LINES;
  return `M${point(top, angle)}L${point(bottom, angle + TWIST)}`;
}).join('');

const groundRings = [280, 420, 580, 760, 960];

export default function HeroFunnel() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_70%,transparent)]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_42%,var(--color-green-soft),transparent_70%)]"/>
      <svg
        viewBox="0 0 1200 900"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 size-full text-green"
        fill="none"
        stroke="currentColor"
      >
        <path d={funnelPath} strokeWidth={0.6} strokeOpacity={0.26}/>
        {groundRings.map((r, i) => (
          <ellipse key={r} cx={CX} cy={bottom.y} rx={r} ry={r * TILT} strokeWidth={0.6} strokeOpacity={0.22 - i * 0.03}/>
        ))}
      </svg>
    </div>
  );
}
