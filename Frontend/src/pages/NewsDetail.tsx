import { useParams } from 'react-router-dom';
import { useFetch } from '@/hooks/useFetch.ts';
import { getNewsItem } from '@/services/api.ts';
import { SEO, Loader, ErrorState, Badge } from '@/components/index.ts';
import { formatDate } from '@/utils/date.ts';
import './ExperienceDetail.css'; /* reuse shared detail styles */

export default function NewsDetail() {
    const { id } = useParams<{ id: string }>();
    const { data, loading, error, status, refetch } = useFetch(
        () => getNewsItem(Number(id)),
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
                    <span className="detail-page__date">{formatDate(data.publishedAt)}</span>
                    {data.status && <Badge label={data.status.name} />}
                </div>
                <h1 className="detail-page__title">{data.title}</h1>
            </div>

            {data.mainMedia && (
                <div className="detail-page__hero-image">
                    <img src={data.mainMedia.url} alt={data.mainMedia.altText} />
                </div>
            )}

            <div className="detail-page__content">
                <p>{data.descriptionLong}</p>
            </div>

            {data.newsMedias.length > 0 && (
                <div className="detail-page__section">
                    <h2 className="detail-page__section-title">Galerie</h2>
                    <div className="media-grid">
                        {data.newsMedias.map(({ media: m }) => (
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
