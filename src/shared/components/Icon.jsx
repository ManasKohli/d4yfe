const ICON_PATHS = {
  compass: <><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8 4.8-2.2Z"/></>,
  spark: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z"/><path d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z"/></>,
  pen: <><path d="m4 20 4.5-1 10.8-10.8a2.1 2.1 0 0 0-3-3L5.5 16 4 20Z"/><path d="m14.8 6.2 3 3"/></>,
  layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/></>,
  check: <><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/></>,
  arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
  tooth: <><path d="M7.2 3.6c2.5 0 3.1 1.3 4.8 1.3s2.3-1.3 4.8-1.3c2.8 0 4 2.3 3.6 5.5-.4 3.1-2.3 10.8-4.2 11.2-1.7.4-2.3-5.9-4.2-5.9s-2.5 6.3-4.2 5.9C5.9 19.9 4 12.2 3.6 9.1c-.4-3.2.8-5.5 3.6-5.5Z"/><path d="M9 7.5c1.1-.5 1.9-.5 3-.1"/></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
};

/** Decorative inline SVG icon (hidden from screen readers). */
export default function Icon({ name, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {ICON_PATHS[name]}
    </svg>
  );
}
