import { useFetch } from '@/hooks/useFetch.ts';
import { getSkills, getTechStacks } from '@/services/api.ts';
import { SEO, PageHeader, Loader, ErrorState, Badge } from '@/components/index.ts';
import { useTheme } from '@/hooks/useTheme.tsx';
import { getIconFilter } from '@/utils/index.ts';
import './Skills.css';

export default function Skills() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const skills = useFetch(() => getSkills(), []);
    const techStacks = useFetch(() => getTechStacks(), []);

    const loading = skills.loading || techStacks.loading;

    // Group skills by category
    const skillsByCategory = skills.data?.reduce(
        (acc, s) => {
            const cat = s.category.name;
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(s);
            return acc;
        },
        {} as Record<string, typeof skills.data>,
    );

    // Group tech stacks by category
    const techByCategory = techStacks.data?.reduce(
        (acc, t) => {
            const cat = t.category.name;
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(t);
            return acc;
        },
        {} as Record<string, typeof techStacks.data>,
    );

    return (
        <div className="page">
            <SEO title="Compétences" description="Compétences techniques d'Ilan LP" />
            <PageHeader
                title="Compétences"
                subtitle="Un aperçu de mes compétences techniques, classées par catégorie pour une lecture facile"
            />

            {loading && <Loader fullPage />}

            {skills.error && (
                <ErrorState message={skills.error} status={skills.status} onRetry={skills.refetch} />
            )}

            {/* Skills */}
            {skillsByCategory && (
                <div className="skills__section">
                    <h2 className="skills__heading">Compétences</h2>
                    {Object.entries(skillsByCategory).map(([category, items]) => (
                        <div key={category} className="skills__group">
                            <h3 className="skills__category">{category}</h3>
                            <div className="skills__list">
                                {items.map((s) => (
                                    <div key={s.id} className="skill-card">
                                        {s.iconUrl && (
                                            <img
                                                className="skill-card__icon"
                                                src={s.iconUrl}
                                                alt=""
                                                width={24}
                                                height={24}
                                                style={{ filter: getIconFilter(undefined, isDark) }}
                                            />
                                        )}
                                        <div className="skill-card__info">
                                            <span className="skill-card__name">{s.name}</span>
                                            <span className="skill-card__level">{s.level.name}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Tech Stack */}
            {techByCategory && (
                <div className="skills__section">
                    <h2 className="skills__heading">Stack Technique</h2>
                    {Object.entries(techByCategory).map(([category, items]) => (
                        <div key={category} className="skills__group">
                            <h3 className="skills__category">{category}</h3>
                            <div className="badge-list">
                                {items.map((t) => (
                                    <Badge
                                        key={t.id}
                                        label={t.name}
                                        color={t.color}
                                        iconUrl={t.iconUrl}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
