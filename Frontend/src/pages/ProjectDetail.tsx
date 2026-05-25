import { useParams } from 'react-router-dom';
import { useFetch } from '@/hooks/useFetch.ts';
import { getProject } from '@/services/api.ts';
import { SEO, Loader, ErrorState, Badge } from '@/components/index.ts';
import { formatDateRange } from '@/utils/date.ts';
import './ProjectDetail.css';

export default function ProjectDetail() {
    const { id } = useParams<{ id: string }>();
    const { data, loading, error, status, refetch } = useFetch(
        () => getProject(Number(id)),
        [id],
    );

    if (loading) return <Loader fullPage />;
    if (error) return <ErrorState message={error} status={status} onRetry={refetch} />;
    if (!data) return null;

    return (
        <div className="page project-detail">
            <SEO title={data.title} description={data.descriptionShort} />

            <div className="project-detail__header">
                <div className="project-detail__meta">
                    <span className="project-detail__date">
                        {formatDateRange(data.startedAt, data.endAt)}
                    </span>
                    <Badge label={data.status.name} />
                </div>
                <h1 className="project-detail__title">{data.title}</h1>

                <div className="project-detail__links">
                    {data.githubUrl && (
                        <a
                            href={data.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn--ghost"
                        >
                            GitHub
                        </a>
                    )}
                    {data.liveUrl && (
                        <a
                            href={data.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn--primary"
                        >
                            Voir le site
                        </a>
                    )}
                </div>
            </div>

            {data.mainMedia && (
                <div className="project-detail__hero-image">
                    <img src={data.mainMedia.url} alt={data.mainMedia.altText} />
                </div>
            )}

            <div className="project-detail__content">
                <p>{data.descriptionLong}</p>
            </div>

            {data.projectTechStacks.length > 0 && (
                <div className="project-detail__section">
                    <h2 className="project-detail__section-title">Technologies</h2>
                    <div className="badge-list">
                        {data.projectTechStacks.map(({ techStack: t }) => (
                            <Badge key={t.id} label={t.name} color={t.color} iconUrl={t.iconUrl} />
                        ))}
                    </div>
                </div>
            )}

            {data.projectSkills.length > 0 && (
                <div className="project-detail__section">
                    <h2 className="project-detail__section-title">Compétences</h2>
                    <div className="badge-list">
                        {data.projectSkills.map(({ skill: s }) => (
                            <Badge key={s.id} label={s.name} color={s.color} iconUrl={s.iconUrl} />
                        ))}
                    </div>
                </div>
            )}

            {data.projectMedias.length > 0 && (
                <div className="project-detail__section">
                    <h2 className="project-detail__section-title">Galerie</h2>
                    <div className="media-grid">
                        {data.projectMedias.map(({ media: m }) => (
                            <img
                                key={m.id}
                                className="media-grid__item"
                                src={m.url}
                                alt={m.altText}
                                loading="lazy"
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
