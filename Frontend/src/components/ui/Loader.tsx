import './Loader.css';

interface LoaderProps {
    fullPage?: boolean;
}

export default function Loader({ fullPage = false }: LoaderProps) {
    return (
        <div className={`loader ${fullPage ? 'loader--full' : ''}`}>
            <div className="loader__spinner" />
        </div>
    );
}
