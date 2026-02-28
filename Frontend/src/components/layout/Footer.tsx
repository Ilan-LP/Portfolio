import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer__inner">
                <div className="footer__left">
                    <Link to="/" className="footer__logo">
                        Ilan LP
                    </Link>
                    <p className="footer__copy">&copy; {year} Ilan Leroux Pinchinat — Tous droits réservés</p>
                </div>
                <nav className="footer__nav">
                    <Link to="/projets">Projets</Link>
                    <Link to="/competences">Compétences</Link>
                    <Link to="/experiences">Expériences</Link>
                    <Link to="/education">Éducation</Link>
                    <Link to="/actualites">Actualités</Link>
                    <Link to="/contact">Contact</Link>
                </nav>
            </div>
        </footer>
    );
}
