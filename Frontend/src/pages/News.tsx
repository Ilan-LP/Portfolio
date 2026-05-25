import { useFetch } from '@/hooks/useFetch.ts';
import { getGithubRepos } from '@/services/api.ts';
import { SEO, PageHeader, Loader, ErrorState } from '@/components/index.ts';
import { formatDate } from '@/utils/date.ts';
import './Home.css';

export default function News() {
    const { data, loading, error, status, refetch } = useFetch(() => getGithubRepos(), []);

    return (
        <div className="page">
            <SEO title="Mes Projets" description="Projets open source d'Ilan LP sur GitHub" />
            <PageHeader title="Mes Projets" subtitle="Mes projets open source disponibles sur GitHub, triés par activité récente" />

            {loading && <Loader fullPage />}
            {error && <ErrorState message={error} status={status} onRetry={refetch} />}
            {data && (
                <div className="card-grid">
                    {data.map((repo) => (
                        <a
                            key={repo.name}
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="card"
                        >
                            <div className="card__body">
                                <div className="card__header">
                                    <h3 className="card__title">{repo.name}</h3>
                                    {repo.language && (
                                        <span className="card__badge">{repo.language}</span>
                                    )}
                                </div>
                                <p className="card__meta">
                                    ★ {repo.stargazers_count} · Mis à jour le {formatDate(repo.updated_at)}
                                </p>
                                {repo.description && (
                                    <p className="card__desc">{repo.description}</p>
                                )}
                            </div>
                        </a>
                    ))}
                </div>
            )}
            {data?.length === 0 && (
                <p className="empty-state">Aucun dépôt trouvé</p>
            )}
        </div>
    );
}
