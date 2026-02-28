import { Link } from 'react-router-dom';
import { useFetch } from '@/hooks/useFetch.ts';
import { getProjects, getExperiences, getNewsList } from '@/services/api.ts';
import { SEO, Loader, ErrorState, Card } from '@/components/index.ts';
import { formatDateRange, formatDate } from '@/utils/date.ts';
import './Home.css';

export default function Home() {
    const projects = useFetch(() => getProjects(), []);
    const experiences = useFetch(() => getExperiences(), []);
    const news = useFetch(() => getNewsList(), []);

    return (
        <div className="page home">
            <SEO
                title="Accueil"
                description="Ilan LP — Développeur Web & IA. Étudiant et auto-entrepreneur disponible pour stages et missions"
            />

            {/* Hero */}
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
                </div>
            </section>

            {/* Dernières Actus */}
            <section className="home__section">
                <div className="home__section-header">
                    <h2 className="home__section-title">Dernières actualités</h2>
                    <Link to="/actualites" className="home__section-link">
                        Voir tout →
                    </Link>
                </div>

                {news.loading && <Loader />}
                {news.error && (
                    <ErrorState message={news.error} status={news.status} onRetry={news.refetch} />
                )}
                {news.data && (
                    <div className="card-grid">
                        {news.data.slice(0, 3).map((n) => (
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
            </section>

            {/* Projets récents */}
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

            {/* Expériences */}
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
        </div>
    );
}
