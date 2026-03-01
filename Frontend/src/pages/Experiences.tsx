import { useFetch } from '@/hooks/useFetch.ts';
import { getExperiences } from '@/services/api.ts';
import { SEO, PageHeader, Loader, ErrorState, Card } from '@/components/index.ts';
import { formatDateRange } from '@/utils/date.ts';

export default function Experiences() {
    const { data, loading, error, status, refetch } = useFetch(() => getExperiences(), []);

    return (
        <div className="page">
            <SEO title="Expériences" description="Expériences professionnelles d'Ilan LP" />
            <PageHeader
                title="Expériences"
                subtitle="Un aperçu de mon parcours professionnel, mettant en avant les rôles, entreprises et réalisations clés qui ont façonné ma carrière en développement"
            />

            {loading && <Loader fullPage />}
            {error && <ErrorState message={error} status={status} onRetry={refetch} />}
            {data && (
                <div className="card-grid">
                    {data.map((e) => (
                        <Card
                            key={e.id}
                            to={`/experiences/${e.id}`}
                            title={e.title}
                            description={e.descriptionShort}
                            media={e.mainMedia}
                            meta={`${e.company.name} · ${e.jobType.name} · ${formatDateRange(e.startedAt, e.endAt)}`}
                            badge={e.status.name}
                        />
                    ))}
                </div>
            )}
            {data?.length === 0 && (
                <p className="empty-state">Aucune expérience pour le moment</p>
            )}
        </div>
    );
}
