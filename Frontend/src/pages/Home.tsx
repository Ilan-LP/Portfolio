import { Link } from 'react-router-dom';
import { useFetch } from '@/hooks/useFetch.ts';
import { getProjects, getExperiences, getGithubRepos } from '@/services/api.ts';
import { SEO, Loader, ErrorState, Card } from '@/components/index.ts';
import { formatDateRange, formatDate } from '@/utils/date.ts';
import './Home.css';

export default function Home() {
    const projects = useFetch(() => getProjects(), []);
    const experiences = useFetch(() => getExperiences(), []);
    const repos = useFetch(() => getGithubRepos(), []);

    return (
        <div className="page home">
            <SEO
                title="Accueil"
                description="Ilan LP — Développeur Web & IA. Étudiant et auto-entrepreneur disponible pour stages et missions"
            />

            <section className="home__hero">
                <h1 className="home__hero-title">
                    Je code le Web.
                    <br />
                    <span className="home__hero-accent">{"J'entraîne l'IA."}</span>
                </h1>
                <p className="home__hero-desc">
                    {"Étudiant en informatique et auto-entrepreneur, je construis des applications web robustes avec Node.js et React, et j'explore la profondeur du deep learning avec PyTorch et TensorFlow. Deux mondes, une même rigueur"}
                </p>
                <div className="home__hero-actions">
                    <Link to="/projets" className="btn btn--primary">
                        Voir les projets
                    </Link>
                    <Link to="/contact" className="btn btn--ghost">
                        Me contacter
                    </Link>
                    <Link to="/a-propos" className="btn btn--ghost">
                        En savoir plus
                    </Link>
                </div>
            </section>

            <section className="home__section">
                <div className="home__section-header">
                    <h2 className="home__section-title">Projets GitHub récents</h2>
                    <Link to="/actualites" className="home__section-link">
                        Voir tout →
                    </Link>
                </div>

                {repos.loading && <Loader />}
                {repos.error && (
                    <ErrorState message={repos.error} status={repos.status} onRetry={repos.refetch} />
                )}
                {repos.data && (
                    <div className="card-grid">
                        {repos.data.slice(0, 3).map((repo) => (
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
            </section>

            <section className="home__section">
                <div className="home__section-header">
                    <h2 className="home__section-title">Projets récents</h2>
                    <Link to="/projets" className="home__section-link">
                        Voir tout →
                    </Link>
                </div>

                {projects.loading && <Loader />}
                {projects.error && (
                    <ErrorState message={projects.error} status={projects.status} onRetry={projects.refetch} />
                )}
                {projects.data && (
                    <div className="card-grid">
                        {projects.data.slice(0, 3).map((p) => (
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
            </section>

            <section className="home__section">
                <div className="home__section-header">
                    <h2 className="home__section-title">Expériences</h2>
                    <Link to="/experiences" className="home__section-link">
                        Voir tout →
                    </Link>
                </div>

                {experiences.loading && <Loader />}
                {experiences.error && (
                    <ErrorState message={experiences.error} status={experiences.status} onRetry={experiences.refetch} />
                )}
                {experiences.data && (
                    <div className="card-grid">
                        {experiences.data.slice(0, 3).map((e) => (
                            <Card
                                key={e.id}
                                to={`/experiences/${e.id}`}
                                title={e.title}
                                description={e.descriptionShort}
                                media={e.mainMedia}
                                meta={`${e.company.name} · ${e.jobType.name}`}
                                badge={e.status.name}
                            />
                        ))}
                    </div>
                )}
            </section>

            <section className="home__section">
                <div className="home__section-header">
                    <h2 className="home__section-title">Mon CV</h2>
                </div>
                <div className="card-grid">
                    <div className="card" style={{ gridColumn: '1 / -1' }}>
                        <img
                            src="/api/cv-preview"
                            alt="Aperçu du CV"
                            className="w-full object-cover h-64 md:h-80"
                        />
                        <div className="!p-6 flex flex-wrap justify-center gap-3">
                            <a href="/api/cv" download className="btn btn--primary">
                                Télécharger mon CV
                            </a>
                            <a href="/api/cv/view" target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
                                Voir le CV
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
