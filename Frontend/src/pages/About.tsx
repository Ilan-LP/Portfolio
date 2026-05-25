import { Link } from 'react-router-dom';
import type { LucideProps } from 'lucide-react';
import {
    Gamepad2,
    Activity,
    Waves,
    Zap,
    HelpCircle,
} from 'lucide-react';
import { SEO, PageHeader, Loader, ErrorState } from '@/components/index.ts';
import { useFetch } from '@/hooks/useFetch.ts';
import { getPhilosophyPoints, getHobbies } from '@/services/api.ts';
import './About.css';

type IconComponent = React.ComponentType<LucideProps>;

const ICON_MAP: Record<string, IconComponent> = {
    Gamepad2,
    Activity,
    Waves,
    Zap,
};

function HobbyIcon({ name, size }: { name: string; size: number }) {
    const Icon = ICON_MAP[name] ?? HelpCircle;
    return <Icon size={size} className="about__hobby-icon" aria-hidden="true" />;
}

export default function About() {
    const philosophy = useFetch(() => getPhilosophyPoints(), []);
    const hobbies = useFetch(() => getHobbies(), []);

    const loading = philosophy.loading || hobbies.loading;

    return (
        <div className="page about">
            <SEO
                title="À propos"
                description="Qui est Ilan LP ? Autobiographie, philosophie professionnelle et centres d'intérêts"
            />
            <PageHeader
                title="À propos"
                subtitle="Qui je suis, ce en quoi je crois, et ce qui m'anime en dehors du code"
            />

            {loading && <Loader fullPage />}

            <section className="about__section" aria-labelledby="about-bio-heading">
                <h2 className="about__heading" id="about-bio-heading">Mon parcours</h2>
                <div className="about__bio-row">
                    <div className="about__prose">
                        <p>
                            Je m'appelle Ilan Leroux Pinchinat, étudiant à Epitech Lyon et fondateur de{' '}
                            <a
                                href="https://nexus-i.fr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="about__link"
                            >
                                Nexus-I
                            </a>
                            , ma micro-entreprise dédiée au développement web
                            sur mesure. Ce qui m'a toujours attiré dans le
                            développement, c'est de pouvoir rendre concrète une
                            idée - concevoir quelque chose, et voir des gens
                            l'utiliser vraiment.
                        </p>
                        <p>
                            Epitech m'a donné le cadre pour aller au fond des
                            choses, avec une pédagogie par projets qui oblige à
                            livrer plutôt qu'à théoriser. En parallèle,
                            j'explore le deep learning en autodidacte - PyTorch,
                            TensorFlow, les architectures transformers - parce
                            que l'IA me semble être le terrain de jeu technique
                            le plus intéressant de la décennie.
                        </p>
                        <p>
                            En dehors du code, je suis président du BDE Wave à
                            Epitech Lyon. C'est un autre terrain d'apprentissage
                            : prendre des décisions, coordonner une équipe,
                            assumer les responsabilités qui vont avec.
                        </p>
                        <p>
                            Monter Nexus-I pendant mes études n'était pas prévu.
                            C'est venu d'une demande concrète, d'un premier
                            client qui avait besoin d'un site robuste et bien
                            pensé. Cette expérience m'a appris autant sur la
                            gestion de projet et la relation client que sur le
                            code lui-même. Aujourd'hui je cherche des missions
                            et des stages où je peux contribuer à quelque chose
                            qui compte vraiment.
                        </p>
                    </div>
                    <div className="about__photo-wrap">
                        <img
                            src="/api/photo"
                            alt="Photo de profil d'Ilan LP"
                            className="about__photo"
                        />
                    </div>
                </div>
            </section>

            {philosophy.error && (
                <ErrorState message={philosophy.error} status={philosophy.status} onRetry={philosophy.refetch} />
            )}
            {philosophy.data && philosophy.data.length > 0 && (
                <section className="about__section" aria-labelledby="about-philosophy-heading">
                    <h2 className="about__heading" id="about-philosophy-heading">Ma philosophie</h2>
                    <div className="about__grid">
                        {philosophy.data.map((point) => (
                            <div key={point.id} className="about__card">
                                <h3 className="about__card-title">{point.title}</h3>
                                <p className="about__card-body">{point.body}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {hobbies.error && (
                <ErrorState message={hobbies.error} status={hobbies.status} onRetry={hobbies.refetch} />
            )}
            {hobbies.data && hobbies.data.length > 0 && (
                <section className="about__section" aria-labelledby="about-hobbies-heading">
                    <h2 className="about__heading" id="about-hobbies-heading">
                        {"Centres d'intérêts"}
                    </h2>
                    <div className="about__hobbies">
                        {hobbies.data.map((hobby) => (
                            <div key={hobby.id} className="about__hobby">
                                <HobbyIcon name={hobby.icon} size={22} />
                                <div>
                                    <p className="about__hobby-label">{hobby.label}</p>
                                    <p className="about__hobby-desc">{hobby.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <div className="about__cta">
                <Link to="/projets" className="btn btn--primary">Voir mes projets</Link>
                <Link to="/contact" className="btn btn--ghost">Me contacter</Link>
            </div>
        </div>
    );
}
