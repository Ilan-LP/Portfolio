import { useParams } from 'react-router-dom';
import { useFetch } from '@/hooks/useFetch.ts';
import { getEducation } from '@/services/api.ts';
import { SEO, Loader, ErrorState, Badge } from '@/components/index.ts';
import { formatDateRange } from '@/utils/date.ts';
import './ExperienceDetail.css';

export default function EducationDetail() {
    const { id } = useParams<{ id: string }>();
    const { data, loading, error, status, refetch } = useFetch(
        () => getEducation(Number(id)),
        [id],
    );

    if (loading) return <Loader fullPage />;
    if (error) return <ErrorState message={error} status={status} onRetry={refetch} />;
    if (!data) return null;

    return (
        <div className="page detail-page">
            <SEO title={data.title} description={data.descriptionShort} />

            <div className="detail-page__header">
                <div className="detail-page__meta">
                    <span className="detail-page__date">
                        {formatDateRange(data.startedAt, data.endAt)}
                    </span>
                    <Badge label={data.status.name} />
                    <Badge label={data.degree.name} />
                </div>
                <h1 className="detail-page__title">{data.title}</h1>
                <p className="detail-page__subtitle">
                    {data.school.name}
                    {data.school.websiteUrl && (
                        <>
                            {' · '}
                            <a
                                href={data.school.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="detail-page__external-link"
                            >
                                Site web ↗
                            </a>
                        </>
                    )}
                </p>
            </div>

            {data.mainMedia && (
                <div className="detail-page__hero-image">
                    <img src={data.mainMedia.url} alt={data.mainMedia.altText} />
                </div>
            )}

            <div className="detail-page__content">
                <p>{data.descriptionLong}</p>
            </div>

            {data.educationTechStacks.length > 0 && (
                <div className="detail-page__section">
                    <h2 className="detail-page__section-title">Technologies</h2>
                    <div className="badge-list">
                        {data.educationTechStacks.map(({ techStack: t }) => (
                            <Badge key={t.id} label={t.name} color={t.color} iconUrl={t.iconUrl} />
                        ))}
                    </div>
                </div>
            )}

            {data.educationSkills.length > 0 && (
                <div className="detail-page__section">
                    <h2 className="detail-page__section-title">Compétences</h2>
                    <div className="badge-list">
                        {data.educationSkills.map(({ skill: s }) => (
                            <Badge key={s.id} label={s.name} color={s.color} iconUrl={s.iconUrl} />
                        ))}
                    </div>
                </div>
            )}

            {data.educationMedias.length > 0 && (
                <div className="detail-page__section">
                    <h2 className="detail-page__section-title">Galerie</h2>
                    <div className="media-grid">
                        {data.educationMedias.map(({ media: m }) => (
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
