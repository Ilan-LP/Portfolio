import { useFetch } from '@/hooks/useFetch.ts';
import { getNewsList } from '@/services/api.ts';
import { SEO, PageHeader, Loader, ErrorState, Card } from '@/components/index.ts';
import { formatDate } from '@/utils/date.ts';

export default function News() {
    const { data, loading, error, status, refetch } = useFetch(() => getNewsList(), []);

    return (
        <div className="page">
            <SEO title="Actualités" description="Actualités d'Ilan LP" />
            <PageHeader title="Actualités" subtitle="Ce qui se passe en ce moment : nouveaux projets, certifications et autres annonces importantes." />

            {loading && <Loader fullPage />}
            {error && <ErrorState message={error} status={status} onRetry={refetch} />}
            {data && (
                <div className="card-grid">
                    {data.map((n) => (
                        <Card
                            key={n.id}
                            to={`/actualites/${n.id}`}
                            title={n.title}
                            description={n.descriptionShort}
                            media={n.mainMedia}
                            meta={formatDate(n.publishedAt)}
                        />
                    ))}
                </div>
            )}
            {data?.length === 0 && (
                <p className="empty-state">Aucune actualité pour le moment.</p>
            )}
        </div>
    );
}
