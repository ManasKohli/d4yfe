import { useState } from 'react';
import { Link, NavLink } from 'react-router';
import Brand from './Brand.jsx';
import Icon from './Icon.jsx';
import { paths } from '../routes.js';

const navLinks = [
  { label: 'Program', to: paths.home, end: true },
  { label: 'Modules', to: paths.modulesSection },
  { label: 'How it works', to: paths.programDetails },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <Brand aria-label="Dentistry for Youth, home" onClick={closeMenu}/>
      <button
        className="menu-toggle"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        aria-controls="site-nav"
        onClick={() => setMenuOpen(open => !open)}
      >
        <Icon name="menu"/>
      </button>
      <nav id="site-nav" className={menuOpen ? 'nav-open' : ''} aria-label="Main">
        {navLinks.map(link => (
          <NavLink key={link.label} to={link.to} end={link.end} onClick={closeMenu}>{link.label}</NavLink>
        ))}
        <NavLink to={paths.login} onClick={closeMenu}>Log in</NavLink>
        <Link to={paths.pilotSection} className="nav-cta" onClick={closeMenu}>Pilot cohort <Icon name="arrow" size={16}/></Link>
      </nav>
    </header>
  );
}
