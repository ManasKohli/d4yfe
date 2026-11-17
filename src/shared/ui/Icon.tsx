const ICON_PATHS = {
  arrow: <path d="M5 12h14M13 6l6 6-6 6"/>,
  check: <><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/></>,
  tooth: <><path d="M7.2 3.6c2.5 0 3.1 1.3 4.8 1.3s2.3-1.3 4.8-1.3c2.8 0 4 2.3 3.6 5.5-.4 3.1-2.3 10.8-4.2 11.2-1.7.4-2.3-5.9-4.2-5.9s-2.5 6.3-4.2 5.9C5.9 19.9 4 12.2 3.6 9.1c-.4-3.2.8-5.5 3.6-5.5Z"/><path d="M9 7.5c1.1-.5 1.9-.5 3-.1"/></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
  pause: <path d="M9 6v12M15 6v12"/>,
  play: <path d="M8 5.5v13l10.5-6.5L8 5.5Z"/>,
  close: <path d="M6 6l12 12M18 6 6 18"/>,
  external: <><path d="M14 5h5v5M19 5l-8 8"/><path d="M18 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4"/></>,
};

export type IconName = keyof typeof ICON_PATHS;

/** Decorative inline SVG icon (hidden from screen readers). */
export default function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0">
      {ICON_PATHS[name]}
    </svg>
  );
}
