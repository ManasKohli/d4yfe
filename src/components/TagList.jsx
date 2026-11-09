export default function TagList({ tags }) {
  return <div className="curriculum-tags">{tags.map(tag => <span key={tag}>{tag}</span>)}</div>;
}
