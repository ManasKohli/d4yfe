export default function TagList({ tags }: { tags: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Topics">
      {tags.map(tag => <li key={tag} className="rounded-full bg-tint px-3 py-1 text-sm text-ink-2">{tag}</li>)}
    </ul>
  );
}
