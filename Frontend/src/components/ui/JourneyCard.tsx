import { Link } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme.tsx';
import { adaptColorToTheme, getIconFilter } from '@/utils/index.ts';
import type { LearningJourneyEntry } from '@/types';
import './JourneyCard.css';

interface JourneyCardProps {
    entry: LearningJourneyEntry;
}

export default function JourneyCard({ entry }: JourneyCardProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const adapted = adaptColorToTheme(entry.color, isDark);
    const iconFilter = getIconFilter(entry.color, isDark);

    return (
        <div
            className="journey-card"
            style={adapted ? { borderLeftColor: adapted } : undefined}
        >
            <div className="journey-card__header">
                {entry.iconUrl && (
                    <img
                        className="journey-card__icon"
                        src={entry.iconUrl}
                        alt=""
                        width={18}
                        height={18}
                        style={iconFilter ? { filter: iconFilter } : undefined}
                    />
                )}
                <span
                    className="journey-card__domain"
                    style={adapted ? { color: adapted } : undefined}
                >
                    {entry.domain}
                </span>
            </div>

            <div className="journey-card__body">
                <div className="journey-card__block">
                    <span className="journey-card__label">Avant</span>
                    <p className="journey-card__text">{entry.before}</p>
                </div>
                <div className="journey-card__block">
                    <span className="journey-card__label journey-card__label--after">Maintenant</span>
                    <p className="journey-card__text">{entry.after}</p>
                </div>
            </div>

            {entry.projects.length > 0 && (
                <div className="journey-card__projects">
                    {entry.projects.map((p) => (
                        <Link
                            key={p.id}
                            to={`/projets/${p.id}`}
                            className="journey-card__project-link"
                            style={adapted ? { borderColor: adapted + '44', color: adapted } : undefined}
                        >
                            {p.title}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
