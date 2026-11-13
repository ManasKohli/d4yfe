import Brand from './Brand.jsx';

function scrollToTop(event) {
  event.preventDefault();
  window.scrollTo({ top: 0 });
}

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="section-wrap footer-wrap">
        <Brand className="brand footer-brand"/>
        <p className="footer-message">Supporting students<br/><em>on the path to dentistry.</em></p>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Dentistry for Youth</span>
          <span>DENTAL PATHWAY PROGRAM</span>
          <a href="#main" onClick={scrollToTop}>BACK TO TOP ↑</a>
        </div>
      </div>
    </footer>
  );
}
