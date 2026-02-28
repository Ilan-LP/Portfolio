import './SEO.css';

interface SEOProps {
    title: string;
    description?: string;
}

/**
 * Lightweight SEO component that sets document title.
 * We avoid react-helmet-async since it doesn't support React 19 yet.
 * Using a simple useEffect in each page via this helper is sufficient.
 */
export default function SEO({ title, description }: SEOProps) {
    const fullTitle = `${title} — Ilan LP`;

    // Set document title synchronously during render for SSR-readiness
    if (typeof document !== 'undefined') {
        document.title = fullTitle;
        if (description) {
            let meta = document.querySelector('meta[name="description"]');
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('name', 'description');
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', description);
        }
    }

    return null;
}
