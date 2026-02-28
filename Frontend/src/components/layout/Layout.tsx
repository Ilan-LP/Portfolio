import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.tsx';
import Footer from './Footer.tsx';

export default function Layout() {
    return (
        <div className="layout">
            <Navbar />
            <main className="layout__main">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
