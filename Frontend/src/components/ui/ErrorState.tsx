import { Link } from 'react-router-dom';
import './ErrorState.css';

interface ErrorStateProps {
    message?: string;
    status?: number | null;
    onRetry?: () => void;
}

export default function ErrorState({ message, status, onRetry }: ErrorStateProps) {
    const is404 = status === 404;

    return (
        <div className="error-state">
            <div className="error-state__code">{is404 ? '404' : 'Erreur'}</div>
            <p className="error-state__message">
                {is404 ? "Cette page n'existe pas." : (message ?? 'Une erreur est survenue.')}
            </p>
            <div className="error-state__actions">
                {onRetry && (
                    <button className="error-state__btn" onClick={onRetry}>
                        Réessayer
                    </button>
                )}
                <Link to="/" className="error-state__btn error-state__btn--ghost">
                    Retour à l'accueil
                </Link>
            </div>
        </div>
    );
}
