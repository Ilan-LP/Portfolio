import { useFetch } from '@/hooks/useFetch.ts';
import { getEducations } from '@/services/api.ts';
import { SEO, PageHeader, Loader, ErrorState, Card } from '@/components/index.ts';
import { formatDateRange } from '@/utils/date.ts';

export default function Education() {
    const { data, loading, error, status, refetch } = useFetch(() => getEducations(), []);

    return (
        <div className="page">
            <SEO title="Éducation" description="Parcours académique d'Ilan LP" />
            <PageHeader title="Éducation" subtitle="Un aperçu de mon parcours académique, mettant en avant les écoles, diplômes et formations qui ont contribué à mon développement" />

            {loading && <Loader fullPage />}
            {error && <ErrorState message={error} status={status} onRetry={refetch} />}
            {data && (
                <div className="card-grid">
                    {data.map((e) => (
                        <Card
                            key={e.id}
                            to={`/education/${e.id}`}
                            title={e.title}
                            description={e.descriptionShort}
                            media={e.mainMedia}
                            meta={`${e.school.name} · ${e.degree.name} · ${formatDateRange(e.startedAt, e.endAt)}`}
                            badge={e.status.name}
                        />
                    ))}
                </div>
            )}
            {data?.length === 0 && (
                <p className="empty-state">Aucune formation pour le moment</p>
            )}
        </div>
    );
}
