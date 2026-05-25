import './Loader.css';

interface LoaderProps {
    fullPage?: boolean;
}

export default function Loader({ fullPage = false }: LoaderProps) {
    return (
        <div
            className={`loader ${fullPage ? 'loader--full' : ''}`}
            role="status"
            aria-live="polite"
            aria-label="Chargement en cours"
        >
            <div className="loader__spinner" />
        </div>
    );
}
