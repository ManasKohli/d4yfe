import Brand from './Brand.jsx';

function scrollToTop(event) {
  event.preventDefault();
  window.scrollTo(0, 0);
}

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="section-wrap footer-wrap">
        <Brand className="brand footer-brand"/>
        <div className="footer-message">A stronger foundation<br/><em>for dental research.</em></div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Dentistry for Youth</span>
          <span>DENTAL RESEARCH PROGRAM</span>
          <a href="#top" onClick={scrollToTop}>BACK TO TOP ↑</a>
        </div>
      </div>
    </footer>
  );
}
