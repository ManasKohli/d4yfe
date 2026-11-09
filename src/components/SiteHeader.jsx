import { useState } from 'react';
import { Link } from 'react-router';
import Brand from './Brand.jsx';
import Icon from './Icon.jsx';
import { paths } from '../routes.js';

const navLinks = [
  { label: 'Overview', to: paths.home },
  { label: 'Modules', to: paths.modulesSection },
  { label: 'Application support', to: paths.applicationSupport },
  { label: 'Program details', to: paths.programDetails },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <Brand aria-label="Dentistry for Youth home" onClick={closeMenu}/>
      <button className="menu-toggle" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(open => !open)}>
        <Icon name="menu"/>
      </button>
      <nav className={menuOpen ? 'nav-open' : ''} aria-label="Main navigation">
        {navLinks.map(link => <Link key={link.label} to={link.to} onClick={closeMenu}>{link.label}</Link>)}
        <Link to={paths.modulesSection} className="nav-cta" onClick={closeMenu}>Explore the modules <Icon name="arrow" size={16}/></Link>
      </nav>
    </header>
  );
}
