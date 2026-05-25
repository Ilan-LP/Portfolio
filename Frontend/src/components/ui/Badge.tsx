import { useTheme } from '@/hooks/useTheme.tsx';
import { adaptColorToTheme, getIconFilter } from '@/utils/index.ts';
import './Badge.css';

interface BadgeProps {
    label: string;
    color?: string;
    iconUrl?: string;
}

export default function Badge({ label, color, iconUrl }: BadgeProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const adapted = adaptColorToTheme(color, isDark);
    const iconFilter = getIconFilter(color, isDark);

    return (
        <span
            className="badge"
            style={adapted ? { borderColor: adapted + '66', color: adapted } : undefined}
        >
            {iconUrl && (
                <img
                    className="badge__icon"
                    src={iconUrl}
                    alt=""
                    width={14}
                    height={14}
                    style={iconFilter ? { filter: iconFilter } : undefined}
                />
            )}
            {label}
        </span>
    );
}
