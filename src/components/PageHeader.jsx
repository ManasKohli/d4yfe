import Eyebrow from './Eyebrow.jsx';

/** Page title for the signed-in areas: eyebrow, editorial h1 with a muted second line, optional lede and actions. */
export default function PageHeader({ eyebrow, title, muted, lede, children }) {
  return (
    <header className="app-page-head">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1>{title}{muted && <><br/><em>{muted}</em></>}</h1>
      {lede && <p>{lede}</p>}
      {children}
    </header>
  );
}
