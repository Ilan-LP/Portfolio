import './Badge.css';

interface BadgeProps {
    label: string;
    color?: string;
    iconUrl?: string;
}

export default function Badge({ label, color, iconUrl }: BadgeProps) {
    return (
        <span className="badge" style={color ? { borderColor: color + '40', color } : undefined}>
            {iconUrl && <img className="badge__icon" src={iconUrl} alt="" width={14} height={14} />}
            {label}
        </span>
    );
}
