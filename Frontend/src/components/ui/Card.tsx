import { Link } from 'react-router-dom';
import type { Media } from '@/types';
import './Card.css';

interface CardProps {
    to: string;
    title: string;
    description: string;
    media?: Media | null;
    meta?: string;
    badge?: string;
}

export default function Card({ to, title, description, media, meta, badge }: CardProps) {
    return (
        <Link to={to} className="card">
            {media && (
                <div className="card__image-wrapper">
                    <img
                        className="card__image"
                        src={media.url}
                        alt={media.altText}
                        loading="lazy"
                    />
                </div>
            )}
            <div className="card__body">
                <div className="card__header">
                    <h3 className="card__title">{title}</h3>
                    {badge && <span className="card__badge">{badge}</span>}
                </div>
                {meta && <p className="card__meta">{meta}</p>}
                <p className="card__desc">{description}</p>
            </div>
        </Link>
    );
}
