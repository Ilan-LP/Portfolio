import './SEO.css';

interface SEOProps {
    title: string;
    description?: string;
}

function setOgMeta(property: string, content: string) {
    let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
    }
    el.setAttribute('content', content);
}

export default function SEO({ title, description }: SEOProps) {
    const fullTitle = `${title} — Ilan LP`;

    if (typeof document !== 'undefined') {
        document.title = fullTitle;

        if (description) {
            let descMeta = document.querySelector('meta[name="description"]');
            if (!descMeta) {
                descMeta = document.createElement('meta');
                descMeta.setAttribute('name', 'description');
                document.head.appendChild(descMeta);
            }
            descMeta.setAttribute('content', description);
        }

        setOgMeta('og:title', fullTitle);
        if (description) setOgMeta('og:description', description);
    }

    return null;
}
