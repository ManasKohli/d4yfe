/** A titled card used throughout the signed-in areas. `action` renders at the right of the heading. */
export default function Panel({ title, label, action, className = '', headingLevel = 2, children, ...rest }) {
  const Heading = `h${headingLevel}`;
  return (
    <section className={`panel ${className}`} {...rest}>
      {(title || label || action) && (
        <div className="panel-head">
          <div>
            {label && <span className="panel-label">{label}</span>}
            {title && <Heading>{title}</Heading>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
