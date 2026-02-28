import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme.tsx';
import './Navbar.css';

const NAV_LINKS = [
    { to: '/', label: 'Accueil' },
    { to: '/projets', label: 'Projets' },
    { to: '/competences', label: 'Compétences' },
    { to: '/experiences', label: 'Expériences' },
    { to: '/education', label: 'Éducation' },
    { to: '/actualites', label: 'Actualités' },
    { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="navbar">
            <div className="navbar__inner">
                <Link to="/" className="navbar__logo">
                    Ilan LP
                </Link>

                <nav className={`navbar__nav ${menuOpen ? 'navbar__nav--open' : ''}`}>
                    {NAV_LINKS.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                            }
                            onClick={() => setMenuOpen(false)}
                            end={link.to === '/'}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="navbar__actions">
                    <button
                        className="navbar__theme-toggle"
                        onClick={toggleTheme}
                        aria-label="Changer de thème"
                        title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
                    >
                        {theme === 'dark' ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="5" />
                                <line x1="12" y1="1" x2="12" y2="3" />
                                <line x1="12" y1="21" x2="12" y2="23" />
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                <line x1="1" y1="12" x2="3" y2="12" />
                                <line x1="21" y1="12" x2="23" y2="12" />
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                            </svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                            </svg>
                        )}
                    </button>

                    <button
                        className={`navbar__burger ${menuOpen ? 'navbar__burger--open' : ''}`}
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Menu"
                    >
                        <span />
                        <span />
                        <span />
                    </button>
                </div>
            </div>
        </header>
    );
}
