import { useFetch } from '@/hooks/useFetch.ts';
import { getProjects } from '@/services/api.ts';
import { SEO, PageHeader, Loader, ErrorState, Card } from '@/components/index.ts';
import { formatDateRange } from '@/utils/date.ts';

export default function Projects() {
    const { data, loading, error, status, refetch } = useFetch(() => getProjects(), []);

    return (
        <div className="page">
            <SEO title="Projets" description="Projets réalisés par Ilan LP" />
            <PageHeader title="Projets" subtitle="Une sélection de projets personnels et professionnels, illustrant mes compétences en développement" />

            {loading && <Loader fullPage />}
            {error && <ErrorState message={error} status={status} onRetry={refetch} />}
            {data && (
                <div className="card-grid">
                    {data.map((p) => (
                        <Card
                            key={p.id}
                            to={`/projets/${p.id}`}
                            title={p.title}
                            description={p.descriptionShort}
                            media={p.mainMedia}
                            meta={formatDateRange(p.startedAt, p.endAt)}
                            badge={p.status.name}
                        />
                    ))}
                </div>
            )}
            {data?.length === 0 && (
                <p className="empty-state">Aucun projet pour le moment</p>
            )}
        </div>
    );
}
