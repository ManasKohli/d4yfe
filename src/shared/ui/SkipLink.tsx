/** First focusable element on every page; jumps keyboard users past the navigation. */
export default function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only z-50 rounded-full bg-green px-4 py-2 text-white no-underline focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
    >
      Skip to content
    </a>
  );
}
