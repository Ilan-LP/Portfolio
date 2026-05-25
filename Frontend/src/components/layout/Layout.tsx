import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.tsx';
import Footer from './Footer.tsx';
import './Layout.css';

export default function Layout() {
    return (
        <div className="layout">
            <a href="#main-content" className="skip-link">Aller au contenu principal</a>
            <Navbar />
            <main id="main-content" className="layout__main">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
