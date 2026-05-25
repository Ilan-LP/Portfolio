import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const LOCAL_MEDIA_URLS: Record<string, string> = {
    'MyEpiPlus Website': '/uploads/myepiplus1.jpg',
    'MyEpiPlus Popup': '/uploads/myepiplus2.jpg',
    'MyEpiPlus Full': '/uploads/myepiplus3.jpg',
    'Portfolio Home': '/uploads/portfolio1.png',
    'Juice Shop Home': '/uploads/hackjuice1.png',
    'Carbon Alert Home': '/uploads/carbonalert1.png',
    'Logo IFPEN': '/uploads/ifpen1.png',
    'Logo Akuiteo': '/uploads/akuiteo1.png',
    'Logo Berlioz': '/uploads/berlioz1.png',
    'Bellevue Logo': '/uploads/bellevue1.png',
    'Epitech Logo': '/uploads/epitech1.png',
    'IdentiQ Home': '/uploads/identiq1.png',
    'Nexus-I Logo': '/uploads/nexus1.jpg',
    'Nexus-I Banner': '/uploads/nexus2.jpg',
    'SUI Certificate': '/uploads/sui1.png',
    "Salon L'Etudiant": '/uploads/salon1.png',
    'Logo IFPEN Stage': '/uploads/ifpen1.png',
    'Logo PoC Innovation': '/uploads/poc1.png',
    'Logo Wave BDE': '/uploads/wave1.png',
    'WeGhost Home': '/uploads/weghostdevs.png',
    'Charles Home': '/uploads/charles1.png',
    'Alice Home': '/uploads/alice1.png',
    'Tardis Home': '/uploads/tardis1.png',
};

function strip<T extends Record<string, unknown>>(
    obj: T,
): Omit<T, `$${string}`> {
    return Object.fromEntries(
        Object.entries(obj).filter(([k]) => !k.startsWith('$')),
    ) as Omit<T, `$${string}`>;
}

type WithRelations = {
    $media?: string[];
    $techStacks?: string[];
    $skills?: string[];
};

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Seeding database...');

    const existingCount = await prisma.status.count();
    if (existingCount > 0) {
        console.log('⏭️  Database already seeded, skipping...');
        return;
    }

    const statuses = await prisma.status.createManyAndReturn({
        data: [
            {
                name: 'En cours',
                description: "L'élément n'a pas encore commencé",
            },
            {
                name: 'En Progression',
                description:
                    "L'élément est actuellement en cours de traitement",
            },
            { name: 'Terminé', description: "L'élément est terminé" },
            {
                name: 'En Attente',
                description: "L'élément est actuellement en attente",
            },
            { name: 'Annulé', description: "L'élément est annulé" },
            { name: 'Archivé', description: "L'élément est archivé" },
            {
                name: 'Planification',
                description: "L'élément est en phase de planification",
            },
            { name: 'Abandonné', description: "L'élément est abandonné" },
            {
                name: 'Actif',
                description: "L'élément est actif et en cours d'utilisation",
            },
        ],
    });
    const S = Object.fromEntries(statuses.map((s) => [s.name, s.id]));
    console.log(`✅ Created ${statuses.length} statuses`);

    const degrees = await prisma.degree.createManyAndReturn({
        data: [
            {
                name: 'Baccalauréat',
                description: 'Diplôme obtenu à la fin du lycée',
            },
            {
                name: 'Bachelor',
                description: 'Diplôme obtenu après 3 ans en études supérieures',
            },
            {
                name: 'Master',
                description: 'Diplôme obtenu après 5 ans en études supérieures',
            },
        ],
    });
    const D = Object.fromEntries(degrees.map((d) => [d.name, d.id]));
    console.log(`✅ Created ${degrees.length} degrees`);

    const jobTypes = await prisma.jobType.createManyAndReturn({
        data: [
            {
                name: 'Temps plein',
                description:
                    'Contrat de travail standard de 35–40h par semaine',
            },
            {
                name: 'Temps partiel',
                description: 'Contrat de travail à temps réduit',
            },
            {
                name: 'Stage',
                description:
                    'Période de travail temporaire pour étudiants ou diplômés',
            },
            {
                name: 'Freelance',
                description:
                    'Travail en indépendant, contrats ponctuels basés sur des projets',
            },
            {
                name: 'Alternance',
                description: 'Contrat en alternance combinant emploi et école',
            },
            {
                name: 'Bénévolat',
                description: 'Engagement associatif bénévole',
            },
        ],
    });
    const JT = Object.fromEntries(jobTypes.map((j) => [j.name, j.id]));
    console.log(`✅ Created ${jobTypes.length} job types`);

    const techCategories = await prisma.techStackCategory.createManyAndReturn({
        data: [
            {
                name: 'Frontend',
                description:
                    "Technologies UI/UX s'exécutant dans le navigateur",
            },
            {
                name: 'Backend',
                description: 'Technologies et frameworks côté serveur',
            },
            {
                name: 'Base de données',
                description:
                    'Technologies de stockage et de requêtage de données',
            },
            {
                name: 'DevOps',
                description: "Outils d'infrastructure, CI/CD et conteneurs",
            },
            {
                name: 'Mobile',
                description: 'Frameworks de développement iOS et Android',
            },
            {
                name: 'Outils',
                description:
                    'Utilitaires de développement et outils de productivité',
            },
        ],
    });
    const TC = Object.fromEntries(techCategories.map((c) => [c.name, c.id]));
    console.log(`✅ Created ${techCategories.length} tech-stack categories`);

    const skillCategories = await prisma.skillCategory.createManyAndReturn({
        data: [
            {
                name: 'Technique',
                description: 'Compétences techniques avancées',
            },
            {
                name: 'Compétences relationnelles',
                description:
                    'Compétences interpersonnelles et de communication',
            },
            {
                name: 'Management',
                description: "Compétences en gestion de projet et d'équipe",
            },
            {
                name: 'Design',
                description: 'Compétences en design UI/UX et graphique',
            },
        ],
    });
    const SC = Object.fromEntries(skillCategories.map((c) => [c.name, c.id]));
    console.log(`✅ Created ${skillCategories.length} skill categories`);

    const skillLevels = await prisma.skillLevel.createManyAndReturn({
        data: [
            {
                name: 'Débutant',
                description:
                    'Compréhension de base, expérience pratique limitée',
            },
            {
                name: 'Intermédiaire',
                description:
                    'Bonne compréhension avec une expérience pratique régulière',
            },
            {
                name: 'Avancé',
                description:
                    'Connaissances approfondies et vaste expérience pratique',
            },
            {
                name: 'Expert',
                description:
                    'Niveau de maîtrise, autorité reconnue dans le domaine',
            },
        ],
    });
    const L = Object.fromEntries(skillLevels.map((l) => [l.name, l.id]));
    console.log(`✅ Created ${skillLevels.length} skill levels`);

    const techStacks = await prisma.techStack.createManyAndReturn({
        data: [
            {
                name: 'React',
                iconUrl: 'https://cdn.simpleicons.org/react',
                color: '#61DAFB',
                categoryId: TC['Frontend'],
            },
            {
                name: 'TypeScript',
                iconUrl: 'https://cdn.simpleicons.org/typescript',
                color: '#3178C6',
                categoryId: TC['Frontend'],
            },
            {
                name: 'JavaScript',
                iconUrl: 'https://cdn.simpleicons.org/javascript',
                color: '#F7DF1E',
                categoryId: TC['Frontend'],
            },
            {
                name: 'Tailwind CSS',
                iconUrl: 'https://cdn.simpleicons.org/tailwindcss',
                color: '#06B6D4',
                categoryId: TC['Frontend'],
            },
            {
                name: 'Vite',
                iconUrl: 'https://cdn.simpleicons.org/vite',
                color: '#646CFF',
                categoryId: TC['Frontend'],
            },
            {
                name: 'Node.js',
                iconUrl: 'https://cdn.simpleicons.org/nodedotjs',
                color: '#339933',
                categoryId: TC['Backend'],
            },
            {
                name: 'Express',
                iconUrl: 'https://cdn.simpleicons.org/express',
                color: '#000000',
                categoryId: TC['Backend'],
            },
            {
                name: 'Prisma',
                iconUrl: 'https://cdn.simpleicons.org/prisma',
                color: '#2D3748',
                categoryId: TC['Base de données'],
            },
            {
                name: 'PostgreSQL',
                iconUrl: 'https://cdn.simpleicons.org/postgresql',
                color: '#4169E1',
                categoryId: TC['Base de données'],
            },
            {
                name: 'Docker',
                iconUrl: 'https://cdn.simpleicons.org/docker',
                color: '#2496ED',
                categoryId: TC['DevOps'],
            },
            {
                name: 'Git',
                iconUrl: 'https://cdn.simpleicons.org/git',
                color: '#F05032',
                categoryId: TC['Outils'],
            },
            {
                name: 'Postman',
                iconUrl: 'https://cdn.simpleicons.org/postman',
                color: '#FF6C37',
                categoryId: TC['Outils'],
            },
            {
                name: 'Python',
                iconUrl: 'https://cdn.simpleicons.org/python',
                color: '#3776AB',
                categoryId: TC['Backend'],
            },
            {
                name: 'PyTorch',
                iconUrl: 'https://cdn.simpleicons.org/pytorch',
                color: '#EE4C2C',
                categoryId: TC['Backend'],
            },
            {
                name: 'FastAPI',
                iconUrl: 'https://cdn.simpleicons.org/fastapi',
                color: '#009688',
                categoryId: TC['Backend'],
            },
            {
                name: 'NLTK',
                iconUrl: 'https://cdn.simpleicons.org/python',
                color: '#154F5B',
                categoryId: TC['Backend'],
            },
        ],
    });
    const T = Object.fromEntries(techStacks.map((t) => [t.name, t.id]));
    console.log(`✅ Created ${techStacks.length} tech stacks`);

    const skills = await prisma.skill.createManyAndReturn({
        data: [
            {
                name: 'Résolution de problèmes',
                iconUrl: 'https://cdn.simpleicons.org/minds',
                color: '#FF6B6B',
                description:
                    'Capacité à analyser des problèmes complexes et à concevoir des solutions',
                categoryId: SC['Technique'],
                levelId: L['Intermédiaire'],
            },
            {
                name: "Conception d'API REST",
                iconUrl: 'https://cdn.simpleicons.org/express',
                color: '#009688',
                description: "Conception d'API REST propres et cohérentes",
                categoryId: SC['Technique'],
                levelId: L['Avancé'],
            },
            {
                name: 'Modélisation de BDD',
                iconUrl: 'https://cdn.simpleicons.org/prisma',
                color: '#4169E1',
                description:
                    'Conception de bases de données relationnelles et non relationnelles',
                categoryId: SC['Technique'],
                levelId: L['Avancé'],
            },
            {
                name: "Communication d'équipe",
                iconUrl: 'https://cdn.simpleicons.org/googlechat',
                color: '#00AC47',
                description:
                    "Communication claire et efficace au sein d'une équipe",
                categoryId: SC['Compétences relationnelles'],
                levelId: L['Avancé'],
            },
            {
                name: "Gestion d'équipe",
                iconUrl: 'https://cdn.simpleicons.org/trello',
                color: '#0079BF',
                description:
                    "Coordination et motivation d'une équipe pour atteindre des objectifs communs",
                categoryId: SC['Management'],
                levelId: L['Intermédiaire'],
            },
            {
                name: 'Agile',
                iconUrl: 'https://cdn.simpleicons.org/jira',
                color: '#0052CC',
                description: 'Travail dans des sprints Agile',
                categoryId: SC['Management'],
                levelId: L['Intermédiaire'],
            },
            {
                name: 'Relations clients',
                iconUrl: 'https://cdn.simpleicons.org/hubspot',
                color: '#FF7A59',
                description:
                    'Gestion des relations avec les clients et les parties prenantes',
                categoryId: SC['Compétences relationnelles'],
                levelId: L['Intermédiaire'],
            },
            {
                name: 'Design UI/UX',
                iconUrl: 'https://cdn.simpleicons.org/figma',
                color: '#F24E1E',
                description:
                    "Création d'interfaces et d'expériences conviviales",
                categoryId: SC['Design'],
                levelId: L['Débutant'],
            },
        ],
    });
    const SK = Object.fromEntries(skills.map((s) => [s.name, s.id]));
    console.log(`✅ Created ${skills.length} skills`);

    const companies = await prisma.company.createManyAndReturn({
        data: [
            {
                name: 'IFPEN',
                description:
                    'Institut français du pétrole et des énergies nouvelles',
                websiteUrl: 'https://www.ifpenergiesnouvelles.com',
            },
            {
                name: 'Akuiteo',
                description: "Akuiteo est un éditeur français d'ERP",
                websiteUrl: 'https://www.akuiteo.com',
            },
            {
                name: "Pave D'Ozon",
                description: 'Boulangerie, Patisserie et Traiteur',
                websiteUrl: 'https://share.google/xvLSRGmwsa69WAxjx',
            },
            {
                name: 'Nexus-I',
                description:
                    'Nexus-I est une entreprise de services numériques spécialisée dans le développement web',
                websiteUrl: 'https://www.nexus-i.fr',
            },
            {
                name: 'PoC Innovation',
                description:
                    "Association étudiante spécialisée dans l'innovation technologique et l'intelligence artificielle",
                websiteUrl: 'https://poc-innovation.fr',
            },
            {
                name: 'Wave BDE',
                description:
                    "Bureau des Étudiants d'Epitech Lyon - association loi 1901 animant la vie étudiante du campus",
                websiteUrl: 'https://epitech.eu',
            },
        ],
    });
    const CO = Object.fromEntries(companies.map((c) => [c.name, c.id]));
    console.log(`✅ Created ${companies.length} companies`);

    const schools = await prisma.school.createManyAndReturn({
        data: [
            {
                name: 'Epitech',
                description: "l'école de l'excellence informatique",
                websiteUrl: 'https://www.epitech.eu',
            },
            {
                name: 'Bellevue Assomption Lyon',
                description: 'Lycée général et technologique',
                websiteUrl:
                    'https://www.assomption-lyon.org/nos-etablissements/lycee-bellevue',
            },
        ],
    });
    const SCH = Object.fromEntries(schools.map((s) => [s.name, s.id]));
    console.log(`✅ Created ${schools.length} schools`);

    const mediaAltTexts = [
        'MyEpiPlus Website',
        'MyEpiPlus Popup',
        'MyEpiPlus Full',
        'Portfolio Home',
        'Juice Shop Home',
        'Carbon Alert Home',
        'Logo IFPEN',
        'Logo Akuiteo',
        'Logo Berlioz',
        'Bellevue Logo',
        'Epitech Logo',
        'IdentiQ Home',
        'Nexus-I Logo',
        'Nexus-I Banner',
        'SUI Certificate',
        "Salon L'Etudiant",
        'Logo PoC Innovation',
        'Logo Wave BDE',
        'Logo IFPEN Stage',
        'WeGhost Home',
        'Charles Home',
        'Alice Home',
        'Tardis Home',
    ];

    const medias = await prisma.media.createManyAndReturn({
        data: mediaAltTexts.map((altText) => ({
            url: LOCAL_MEDIA_URLS[altText] ?? '/uploads/placeholder',
            type: 'IMAGE' as const,
            altText,
        })),
    });

    const M = Object.fromEntries(medias.map((m) => [m.altText, m.id]));
    console.log(`✅ Created ${medias.length} medias`);

    const projectDefs = [
        {
            title: 'MyEpiPlus',
            descriptionShort:
                "Une extension Chrome/Firefox qui permet d'améliorer les informations disponibles sur l'intranet de mon école",
            descriptionLong:
                "Cette extension Chrome/Firefox améliore l'intranet d'Epitech en ajoutant des fonctionnalités manquantes sur la plateforme officielle. Elle permet notamment d'afficher directement les notes et les moyennes, de visualiser les crédits (EIP, activités hub) et d'améliorer la navigation générale\n\nDéveloppée en JavaScript pur, elle est compatible avec Chrome et Firefox et disponible sur le Chrome Web Store. Elle a été conçue pour répondre aux besoins concrets des étudiants Epitech qui trouvaient l'intranet officiel peu pratique et incomplet",
            startedAt: new Date('2026-02-25'),
            statusId: S['Actif'],
            mainProjectMediaId: M['MyEpiPlus Website'],
            githubUrl: 'https://github.com/Ilan-LP/MyEpiPlus',
            liveUrl:
                'https://chromewebstore.google.com/detail/phamedghehobpnbhpemgpbophoojaeio',
            enabled: true,
            $media: [
                'MyEpiPlus Website',
                'MyEpiPlus Popup',
                'MyEpiPlus Full',
            ] as string[],
            $techStacks: ['JavaScript'] as string[],
            $skills: [
                "Conception d'API REST",
                'Résolution de problèmes',
            ] as string[],
        },
        {
            title: 'Portfolio',
            descriptionShort:
                'Mon portfolio personnel pour présenter mes projets, expériences et compétences',
            descriptionLong:
                "Ce portfolio est construit avec une architecture fullstack moderne : un backend Node.js/Express exposant une API REST documentée avec Swagger, une base de données PostgreSQL gérée via Prisma, et un frontend React/TypeScript\n\nL'ensemble est containerisé avec Docker et déployé en production. Il met en valeur mes projets, expériences professionnelles, compétences techniques et réalisations académiques de manière interactive et dynamique",
            startedAt: new Date('2026-02-22'),
            statusId: S['En Progression'],
            mainProjectMediaId: M['Portfolio Home'],
            githubUrl: 'https://github.com/Ilan-LP/Portfolio',
            liveUrl: 'https://ilanlp.nexus-i.fr',
            enabled: true,
            $media: ['Portfolio Home'] as string[],
            $techStacks: [
                'React',
                'Node.js',
                'Prisma',
                'Express',
                'Docker',
                'Git',
            ] as string[],
            $skills: ["Conception d'API REST"] as string[],
        },
        {
            title: 'Hack & Juice',
            descriptionShort:
                'Un projet de hackathon sur la célèbre plateforme Juice Shop de OWASP, visant à identifier et exploiter des vulnérabilités de sécurité dans une application e-commerce délibérément vulnérable',
            descriptionLong:
                "Lors d'un hackathon de 2 semaines, j'ai travaillé en équipe pour identifier et exploiter des vulnérabilités de sécurité dans OWASP Juice Shop, une application e-commerce délibérément vulnérable. Nous avons utilisé des outils comme Burp Suite et des techniques de pentesting pour trouver des failles telles que l'injection SQL, le cross-site scripting (XSS) et les failles d'authentification, démontrant ainsi l'importance de la sécurité dans le développement web moderne",
            startedAt: new Date('2025-05-12'),
            endAt: new Date('2025-12-19'),
            statusId: S['Terminé'],
            mainProjectMediaId: M['Juice Shop Home'],
            liveUrl: 'https://owasp.org/www-project-juice-shop/',
            enabled: true,
            $media: ['Juice Shop Home'] as string[],
            $techStacks: ['Postman', 'Git'] as string[],
            $skills: [
                'Résolution de problèmes',
                "Communication d'équipe",
            ] as string[],
        },
        {
            title: 'Carbon Alert',
            descriptionShort:
                "Un site web développé dans le cadre d'un Hackathon de 4 jours organisé par Epitech en collaboration avec The Shifter, visant à faciliter l'accès à des données de mobilité durable organisées par les communes de France",
            descriptionLong:
                "Dans le cadre d'un Hackathon de 4 jours organisé par Epitech en collaboration avec The Shifter, j'ai développé un site web appelé Carbon Alert pour faciliter l'accès à des données de mobilité durable organisées par les communes de France\n\nLe projet visait à sensibiliser les utilisateurs à l'empreinte carbone de leurs déplacements et à promouvoir des alternatives plus écologiques. Nous avons utilisé des API publiques pour collecter des données sur les transports en commun, les pistes cyclables et les émissions de CO2, offrant ainsi une interface conviviale pour aider les utilisateurs à prendre des décisions de mobilité plus durables",
            startedAt: new Date('2026-01-19'),
            endAt: new Date('2026-01-22'),
            statusId: S['Archivé'],
            mainProjectMediaId: M['Carbon Alert Home'],
            enabled: true,
            $media: ['Carbon Alert Home'] as string[],
            $techStacks: ['React', 'Node.js', 'Express', 'Git'] as string[],
            $skills: [
                'Résolution de problèmes',
                "Communication d'équipe",
            ] as string[],
        },
        {
            title: 'IdentiQ',
            descriptionShort:
                "Réseau social anonyme conçu dans le cadre d'un projet Epitech, visant à connecter les individus tout en garantissant leur confidentialité et la sécurité de leurs données personnelles",
            descriptionLong:
                "IdentiQ est un réseau social imaginé dans le cadre d'un projet Epitech où nous devions concevoir la maquette fonctionnelle d'une application innovante. L'idée centrale : connecter les individus de manière anonyme, sans jamais compromettre la confidentialité de leurs données\n\nL'application permet aux utilisateurs de partager des pensées, des idées et des expériences sans révéler leur identité, favorisant ainsi une communication plus authentique et ouverte\n\nNous avons intégré des techniques de cryptographie pour assurer l'anonymat et la sécurité des données, tout en concevant une interface utilisateur intuitive pour encourager l'engagement au sein de la communauté",
            startedAt: new Date('2026-01-11'),
            endAt: new Date('2026-01-30'),
            statusId: S['Archivé'],
            mainProjectMediaId: M['IdentiQ Home'],
            enabled: true,
            $media: ['IdentiQ Home'] as string[],
            $techStacks: [
                'Docker',
                'Git',
                'Node.js',
                'Express',
                'Prisma',
                'React',
            ] as string[],
            $skills: [
                'Résolution de problèmes',
                "Communication d'équipe",
            ] as string[],
        },
        {
            title: 'WeGhost',
            descriptionShort:
                "Surcouche à WeLoveDevs sous forme de Tinder pour les offres d'emploi, développée dans le cadre du projet Epitech Job Aggregator",
            descriptionLong:
                "WeGhost est un agrégateur d'offres d'emploi développé dans le cadre du projet Epitech \"Job Aggregator\". Le concept : une interface style Tinder permettant de swiper des offres récupérées depuis WeLoveDevs\n\nL'application intègre un système de scraping des offres, un matching basé sur le profil utilisateur, et une interface fluide pour parcourir et sauvegarder les opportunités\n\nDéveloppé en équipe avec React côté frontend, Node.js/Express côté backend, Prisma et PostgreSQL pour la persistance des données",
            startedAt: new Date('2026-04-20'),
            endAt: new Date('2026-05-21'),
            statusId: S['Terminé'],
            mainProjectMediaId: M['WeGhost Home'],
            enabled: true,
            $media: ['WeGhost Home'] as string[],
            $techStacks: [
                'React',
                'Node.js',
                'Express',
                'Prisma',
                'PostgreSQL',
                'TypeScript',
            ] as string[],
            $skills: [
                'Résolution de problèmes',
                "Communication d'équipe",
                "Conception d'API REST",
                'Modélisation de BDD',
            ] as string[],
        },
        {
            title: 'Charles',
            descriptionShort:
                "Chatbot RAG d'aide à la création d'auto-entreprise, connecté aux documents URSSAF et aux API de l'INPI en temps réel",
            descriptionLong:
                "Charles est un chatbot développé dans le cadre du projet Epitech \"Eliza\". Il aide les utilisateurs dans les démarches de création d'auto-entreprise en s'appuyant sur deux mécanismes complémentaires\n\nUn système RAG (Retrieval-Augmented Generation) indexe les documents officiels de l'URSSAF pour répondre aux questions réglementaires. Des tools LLM appellent les API de l'INPI pour récupérer des informations en temps réel sur les entreprises existantes\n\nStack : React pour l'interface, FastAPI pour le backend et l'orchestration des appels LLM",
            startedAt: new Date('2026-03-30'),
            endAt: new Date('2026-04-16'),
            statusId: S['Terminé'],
            mainProjectMediaId: M['Charles Home'],
            enabled: true,
            $media: ['Charles Home'] as string[],
            $techStacks: ['React', 'FastAPI', 'Python'] as string[],
            $skills: [
                'Résolution de problèmes',
                "Communication d'équipe",
                "Conception d'API REST",
            ] as string[],
        },
        {
            title: 'Alice in Wonderland',
            descriptionShort:
                "CLI de NLP pour l'analyse des livres du Projet Gutenberg, développée dans le cadre d'un projet Epitech",
            descriptionLong:
                "Alice in Wonderland est une interface en ligne de commande développée dans le cadre d'un projet Epitech autour du NLP (Natural Language Processing)\n\nL'outil permet d'analyser des textes issus du Projet Gutenberg : tokenisation, analyse de fréquence, extraction d'entités, exploration sémantique et autres traitements linguistiques\n\nDéveloppé en Python avec NLTK comme librairie principale de traitement du langage naturel",
            startedAt: new Date('2026-03-16'),
            endAt: new Date('2026-03-26'),
            statusId: S['Terminé'],
            mainProjectMediaId: M['Alice Home'],
            enabled: true,
            $media: ['Alice Home'] as string[],
            $techStacks: ['Python', 'NLTK'] as string[],
            $skills: ['Résolution de problèmes'] as string[],
        },
        {
            title: 'Tardis',
            descriptionShort:
                'Dashboard de statistiques de retards de trains avec modèle de prédiction, projet Epitech',
            descriptionLong:
                "Tardis est un dashboard de visualisation et de prédiction des retards de trains, développé dans le cadre d'un projet Epitech\n\nL'application agrège des données historiques de ponctualité ferroviaire pour produire des statistiques détaillées par ligne, gare et période. Un modèle de machine learning permet de prédire les retards probables sur une ligne donnée\n\nDéveloppé en Python avec des librairies de data science et de visualisation",
            startedAt: new Date('2026-02-23'),
            endAt: new Date('2026-02-27'),
            statusId: S['Terminé'],
            mainProjectMediaId: M['Tardis Home'],
            enabled: true,
            $media: ['Tardis Home'] as string[],
            $techStacks: ['Python', 'NLTK'] as string[],
            $skills: [
                'Résolution de problèmes',
                "Communication d'équipe",
            ] as string[],
        },
    ] satisfies (WithRelations & Record<string, unknown>)[];

    const projects = await prisma.project.createManyAndReturn({
        data: projectDefs.map(strip),
    });
    const P = Object.fromEntries(projects.map((p) => [p.title, p.id]));

    await prisma.projectMedia.createMany({
        data: projectDefs.flatMap((def) =>
            (def.$media ?? []).map((alt) => ({
                projectId: P[def.title as string],
                mediaId: M[alt],
            })),
        ),
    });
    await prisma.projectTechStack.createMany({
        data: projectDefs.flatMap((def) =>
            (def.$techStacks ?? []).map((ts) => ({
                projectId: P[def.title as string],
                techStackId: T[ts],
            })),
        ),
    });
    await prisma.projectSkill.createMany({
        data: projectDefs.flatMap((def) =>
            (def.$skills ?? []).map((sk) => ({
                projectId: P[def.title as string],
                skillId: SK[sk],
            })),
        ),
    });
    console.log(`✅ Created ${projects.length} projects with their relations`);

    const experienceDefs = [
        {
            title: 'Stage Découverte 3ème',
            descriptionShort:
                "Découverte du monde professionnel à l'IFPEN, institut spécialisé dans la recherche sur le pétrole et les énergies nouvelles",
            descriptionLong:
                "Stage de découverte d'une semaine à l'IFPEN (Institut Français du Pétrole et des Énergies Nouvelles), réalisé en classe de 3ème\n\nJ'ai eu l'occasion d'observer différents métiers scientifiques et techniques, de comprendre le fonctionnement d'un grand établissement de recherche, et de découvrir pour la première fois l'environnement professionnel",
            startedAt: new Date('2022-02-06'),
            endAt: new Date('2022-06-06'),
            companyId: CO['IFPEN'],
            statusId: S['Terminé'],
            jobTypeId: JT['Stage'],
            mainExperienceMediaId: M['Logo IFPEN'],
            enabled: true,
            $media: ['Logo IFPEN'] as string[],
            $techStacks: [] as string[],
            $skills: ["Communication d'équipe"] as string[],
        },
        {
            title: 'Stage Découverte seconde',
            descriptionShort:
                "Découverte du développement logiciel en entreprise chez Akuiteo, éditeur français d'ERP",
            descriptionLong:
                "Stage de découverte de 2 semaines chez Akuiteo, éditeur français d'ERP, réalisé en classe de seconde\n\nJ'ai pu assister à des réunions d'équipe, observer le processus de développement logiciel et comprendre l'organisation d'une équipe technique. Cette expérience a confirmé mon intérêt pour le développement et le monde du numérique",
            startedAt: new Date('2023-02-06'),
            endAt: new Date('2023-06-14'),
            companyId: CO['Akuiteo'],
            statusId: S['Terminé'],
            jobTypeId: JT['Stage'],
            mainExperienceMediaId: M['Logo Akuiteo'],
            enabled: true,
            $media: ['Logo Akuiteo'] as string[],
            $techStacks: ['Git'] as string[],
            $skills: ["Communication d'équipe"] as string[],
        },
        {
            title: 'Vendeur en boulangerie',
            descriptionShort:
                'Vente et service client dans une boulangerie locale',
            descriptionLong:
                "En tant que vendeur en boulangerie, j'étais responsable de l'accueil des clients, de la prise de commandes, du service et de la gestion de la caisse. Cette expérience m'a permis de développer mes compétences en communication, en gestion du temps et en travail d'équipe dans un environnement dynamique",
            startedAt: new Date('2025-10-15'),
            companyId: CO["Pave D'Ozon"],
            statusId: S['En cours'],
            jobTypeId: JT['Temps partiel'],
            mainExperienceMediaId: M['Logo Berlioz'],
            enabled: true,
            $media: ['Logo Berlioz'] as string[],
            $techStacks: [] as string[],
            $skills: [
                "Communication d'équipe",
                'Relations clients',
            ] as string[],
        },
        {
            title: 'Développeur Web Freelance',
            descriptionShort:
                "Développement de sites web sur mesure pour des clients, dans le cadre d'une collaboration freelance avec Nexus-I",
            descriptionLong:
                "En tant que développeur web freelance via Nexus-I, j'ai travaillé avec plusieurs clients pour créer des sites web personnalisés répondant à leurs besoins spécifiques\n\nJ'étais responsable de la conception, du développement et du déploiement de ces sites, en utilisant des technologies telles que React, Node.js, TypeScript et Prisma\n\nCette expérience m'a permis de renforcer mes compétences techniques tout en développant ma capacité à gérer les relations clients, les délais et les priorités de projet",
            startedAt: new Date('2026-01-14'),
            companyId: CO['Nexus-I'],
            statusId: S['En cours'],
            jobTypeId: JT['Freelance'],
            mainExperienceMediaId: M['Nexus-I Banner'],
            enabled: true,
            $media: ['Nexus-I Logo', 'Nexus-I Banner'] as string[],
            $techStacks: [
                'React',
                'Node.js',
                'Prisma',
                'Express',
                'Docker',
                'Git',
                'TypeScript',
            ] as string[],
            $skills: [
                'Résolution de problèmes',
                "Communication d'équipe",
            ] as string[],
        },
        {
            title: 'Stage Ingénieur IFPEN',
            descriptionShort:
                "Développement d'applications Python pour l'extraction de données et la visualisation d'analyses RockEval à l'IFPEN",
            descriptionLong:
                "Stage ingénieur à l'IFPEN (Institut Français du Pétrole et des Énergies Nouvelles) portant sur le développement de deux applications Python\n\nLa première permet l'extraction automatique de données numériques contenues dans des fichiers Word et PDF. La seconde est dédiée à la visualisation des données issues d'un analyseur RockEval, outil de référence en géochimie pétrolière\n\nCe stage m'a permis d'approfondir mes compétences en Python appliqué à la manipulation de données et au traitement documentaire dans un contexte de recherche industrielle",
            startedAt: new Date('2026-06-01'),
            endAt: new Date('2026-07-24'),
            companyId: CO['IFPEN'],
            statusId: S['Planification'],
            jobTypeId: JT['Stage'],
            mainExperienceMediaId: M['Logo IFPEN Stage'],
            enabled: true,
            $media: ['Logo IFPEN Stage'] as string[],
            $techStacks: ['Python'] as string[],
            $skills: ['Résolution de problèmes'] as string[],
        },
        {
            title: 'Développeur IA - PoC Innovation',
            descriptionShort:
                "Développement d'outils pédagogiques en IA pour l'apprentissage des stacks intelligence artificielle au sein de l'association PoC Innovation",
            descriptionLong:
                "En tant que membre actif de PoC Innovation, association étudiante spécialisée dans l'innovation technologique, je participe au développement d'outils basés sur l'intelligence artificielle visant à faciliter l'apprentissage des stacks IA\n\nLe projet s'appuie sur PyTorch pour la partie modélisation, FastAPI pour exposer les modèles sous forme d'API, et React pour l'interface utilisateur\n\nCette expérience me permet de combiner développement fullstack et IA dans un cadre associatif orienté transmission et montée en compétences",
            startedAt: new Date('2026-04-01'),
            companyId: CO['PoC Innovation'],
            statusId: S['En cours'],
            jobTypeId: JT['Bénévolat'],
            mainExperienceMediaId: M['Logo PoC Innovation'],
            enabled: true,
            $media: ['Logo PoC Innovation'] as string[],
            $techStacks: ['Python', 'PyTorch', 'FastAPI', 'React'] as string[],
            $skills: [
                'Résolution de problèmes',
                "Communication d'équipe",
            ] as string[],
        },
        {
            title: 'Président - Wave BDE',
            descriptionShort:
                "Président du Bureau des Étudiants d'Epitech Lyon, responsable de la vie associative et de l'animation du campus",
            descriptionLong:
                "En tant que président du Wave BDE, bureau des étudiants d'Epitech Lyon (association loi 1901), je supervise l'ensemble des activités associatives du campus : organisation d'événements, gestion des pôles Marketing, Communication et Événements, pilotage administratif et financier de l'association\n\nJe représente les étudiants auprès de la direction de l'école et coordonne une équipe de plusieurs responsables de pôle au sein du comité de gestion\n\nCette expérience développe mes compétences en management, en gestion de projet et en communication institutionnelle",
            startedAt: new Date('2026-05-01'),
            companyId: CO['Wave BDE'],
            statusId: S['Actif'],
            jobTypeId: JT['Bénévolat'],
            mainExperienceMediaId: M['Logo Wave BDE'],
            enabled: true,
            $media: ['Logo Wave BDE'] as string[],
            $techStacks: [] as string[],
            $skills: [
                "Gestion d'équipe",
                "Communication d'équipe",
                'Relations clients',
            ] as string[],
        },
    ] satisfies (WithRelations & Record<string, unknown>)[];

    const experiences = await prisma.experience.createManyAndReturn({
        data: experienceDefs.map(strip),
    });
    const E = Object.fromEntries(experiences.map((e) => [e.title, e.id]));

    await prisma.experienceMedia.createMany({
        data: experienceDefs.flatMap((def) =>
            (def.$media ?? []).map((alt) => ({
                experienceId: E[def.title as string],
                mediaId: M[alt],
            })),
        ),
    });
    await prisma.experienceTechStack.createMany({
        data: experienceDefs.flatMap((def) =>
            (def.$techStacks ?? []).map((ts) => ({
                experienceId: E[def.title as string],
                techStackId: T[ts],
            })),
        ),
    });
    await prisma.experienceSkill.createMany({
        data: experienceDefs.flatMap((def) =>
            (def.$skills ?? []).map((sk) => ({
                experienceId: E[def.title as string],
                skillId: SK[sk],
            })),
        ),
    });
    console.log(
        `✅ Created ${experiences.length} experiences with their relations`,
    );

    const educationDefs = [
        {
            title: 'Baccalauréat',
            descriptionShort:
                'Baccalauréat Maths/NSI obtenu avec mention assez bien',
            descriptionLong:
                "Diplômé avec mention assez bien du lycée Bellevue Assomption Lyon, avec les spécialités Mathématiques et Numérique et Sciences Informatiques (NSI). J'ai acquis de solides compétences en mathématiques, en algorithmie et en programmation, ce qui m'a préparé pour mes études supérieures en informatique",
            startedAt: new Date('2022-09-01'),
            endAt: new Date('2025-06-30'),
            statusId: S['Terminé'],
            schoolId: SCH['Bellevue Assomption Lyon'],
            degreeId: D['Baccalauréat'],
            mainEducationMediaId: M['Bellevue Logo'],
            enabled: true,
            $media: ['Bellevue Logo'] as string[],
            $techStacks: [] as string[],
            $skills: [
                'Résolution de problèmes',
                "Communication d'équipe",
                "Gestion d'équipe",
            ] as string[],
        },
        {
            title: 'Bachelor Informatique',
            descriptionShort: 'Programme de 3 ans en informatique à Epitech',
            descriptionLong:
                "Bachelor en 3 ans à Epitech, couvrant l'ensemble des fondamentaux de l'informatique : la première année est axée sur le développement web fullstack, puis une spécialisation en intelligence artificielle prend le relais\n\nJ'ai travaillé sur de nombreux projets pratiques en équipe, renforçant mes compétences en développement logiciel, en gestion de projet et en méthodologie Agile",
            startedAt: new Date('2025-09-15'),
            endAt: new Date('2028-06-30'),
            statusId: S['En Progression'],
            schoolId: SCH['Epitech'],
            degreeId: D['Bachelor'],
            mainEducationMediaId: M['Epitech Logo'],
            enabled: true,
            $media: ['Epitech Logo'] as string[],
            $techStacks: [
                'Git',
                'Docker',
                'Node.js',
                'React',
                'Prisma',
                'Express',
                'PostgreSQL',
                'Tailwind CSS',
                'Vite',
                'TypeScript',
                'JavaScript',
                'Postman',
            ] as string[],
            $skills: [
                'Résolution de problèmes',
                "Conception d'API REST",
                'Modélisation de BDD',
                "Communication d'équipe",
                "Gestion d'équipe",
                'Agile',
                'Design UI/UX',
            ] as string[],
        },
    ] satisfies (WithRelations & Record<string, unknown>)[];

    const educations = await prisma.education.createManyAndReturn({
        data: educationDefs.map(strip),
    });
    const ED = Object.fromEntries(educations.map((e) => [e.title, e.id]));

    await prisma.educationMedia.createMany({
        data: educationDefs.flatMap((def) =>
            (def.$media ?? []).map((alt) => ({
                educationId: ED[def.title as string],
                mediaId: M[alt],
            })),
        ),
    });
    await prisma.educationTechStack.createMany({
        data: educationDefs.flatMap((def) =>
            (def.$techStacks ?? []).map((ts) => ({
                educationId: ED[def.title as string],
                techStackId: T[ts],
            })),
        ),
    });
    await prisma.educationSkill.createMany({
        data: educationDefs.flatMap((def) =>
            (def.$skills ?? []).map((sk) => ({
                educationId: ED[def.title as string],
                skillId: SK[sk],
            })),
        ),
    });
    console.log(
        `✅ Created ${educations.length} educations with their relations`,
    );

    console.log('\n🎉 Base de données initialisée avec succès !');
}

async function seedLearningJourney() {
    const entries = [
        {
            domain: 'Frontend',
            iconUrl: 'https://cdn.simpleicons.org/react',
            color: '#61DAFB',
            before: 'Seul JavaScript pour des bots Discord. Zéro framework, zéro TypeScript',
            after: 'Applications React/TypeScript complètes : routing, hooks personnalisés, thème dynamique',
            order: 1,
            projectTitles: [
                'MyEpiPlus',
                'Portfolio',
                'WeGhost',
                'IdentiQ',
                'Carbon Alert',
                'Charles',
            ],
        },
        {
            domain: 'Backend & Base de données',
            iconUrl: 'https://cdn.simpleicons.org/nodedotjs',
            color: '#339933',
            before: 'Aucune expérience côté serveur ni en base de données relationnelle',
            after: 'API REST avec Node.js/Express et Prisma/PostgreSQL, middlewares et permissions maîtrisés',
            order: 2,
            projectTitles: ['Portfolio', 'WeGhost', 'IdentiQ', 'Carbon Alert'],
        },
        {
            domain: 'DevOps & Docker',
            iconUrl: 'https://cdn.simpleicons.org/docker',
            color: '#2496ED',
            before: "Je ne savais même pas ce que c'était",
            after: 'Dockerfiles, docker-compose, réseaux et volumes maîtrisés pour la mise en production',
            order: 3,
            projectTitles: ['Portfolio'],
        },
        {
            domain: 'Python & Intelligence Artificielle',
            iconUrl: 'https://cdn.simpleicons.org/python',
            color: '#3776AB',
            before: 'Des projets Python full-script, sans aucun framework. Outils IA (LLM, RAG, NLP) totalement inconnus',
            after: 'Pipelines RAG fonctionnels, NLP avec NLTK, modèles exposés via FastAPI',
            order: 4,
            projectTitles: ['Charles', 'Alice in Wonderland', 'Tardis'],
        },
        {
            domain: 'Sécurité web',
            iconUrl: 'https://cdn.simpleicons.org/owasp',
            color: '#000000',
            before: 'Les vulnérabilités web existaient pour moi en théorie seulement',
            after: 'Failles OWASP (XSS, SQLi, auth) comprises et appliquées sur mes propres projets',
            order: 5,
            projectTitles: ['Hack & Juice'],
        },
        {
            domain: 'Compétences relationnelles',
            iconUrl: 'https://cdn.simpleicons.org/trello',
            color: '#0079BF',
            before: "Aucune expérience de gestion d'équipe ni de relation client",
            after: 'Président du Wave BDE, clients freelance gérés, méthodologie Agile pratiquée',
            order: 6,
            projectTitles: ['WeGhost', 'Carbon Alert', 'IdentiQ'],
        },
    ];

    for (const entry of entries) {
        const { projectTitles, ...data } = entry;
        const saved = await prisma.learningJourneyEntry.upsert({
            where: { domain: data.domain },
            update: data,
            create: data,
        });

        await prisma.learningJourneyProject.deleteMany({
            where: { entryId: saved.id },
        });

        const projects = await prisma.project.findMany({
            where: { title: { in: projectTitles } },
            select: { id: true },
        });

        if (projects.length > 0) {
            await prisma.learningJourneyProject.createMany({
                data: projects.map((p) => ({
                    entryId: saved.id,
                    projectId: p.id,
                })),
            });
        }
    }

    console.log('✅ Upserted learning journey entries with project links');
}

async function seedAbout() {
    const philosophyPoints = [
        {
            title: 'Écrire du code qui dure',
            body: "Un projet bien structuré aujourd'hui, c'est une heure économisée demain. Je privilégie la lisibilité et la simplicité à la sur-ingénierie : la meilleure solution est souvent la plus directe",
            order: 1,
        },
        {
            title: 'Comprendre avant de coder',
            body: "Avant d'écrire une ligne, je cherche à comprendre le vrai besoin. Un bug mal cerné ou un besoin mal compris coûte dix fois plus cher à corriger qu'une heure passée à poser les bonnes questions au départ",
            order: 2,
        },
        {
            title: 'Apprendre en permanence',
            body: "Le Web et l'IA évoluent vite. Je considère chaque projet comme une occasion d'apprendre quelque chose de nouveau — une techno, un pattern, une façon de penser différemment",
            order: 3,
        },
        {
            title: 'Autonomie et responsabilité',
            body: "En tant qu'auto-entrepreneur, j'ai appris à me fixer des objectifs clairs, à respecter mes délais et à assumer mes choix techniques. Je n'attends pas qu'on me dise quoi faire",
            order: 4,
        },
    ];

    for (const point of philosophyPoints) {
        await prisma.philosophyPoint.upsert({
            where: { title: point.title },
            update: point,
            create: point,
        });
    }
    console.log(`✅ Upserted ${philosophyPoints.length} philosophy points`);

    const hobbies = [
        {
            label: 'Jeux vidéo',
            icon: 'Gamepad2',
            description: 'Ma façon de décrocher et de me vider la tête',
            order: 1,
        },
        {
            label: 'Badminton',
            icon: 'Activity',
            description:
                'Un sport que je fait en famille, entre compétition et bonne humeur',
            order: 2,
        },
        {
            label: 'Plongée',
            icon: 'Waves',
            description: "Rien de plus zen que le silence sous l'eau",
            order: 3,
        },
        {
            label: 'Sensations fortes',
            icon: 'Zap',
            description: "Élastique, parachute : j'aime repousser mes limites",
            order: 4,
        },
    ];

    for (const hobby of hobbies) {
        await prisma.hobby.upsert({
            where: { label: hobby.label },
            update: hobby,
            create: hobby,
        });
    }
    console.log(`✅ Upserted ${hobbies.length} hobbies`);
}

main()
    .then(() => seedLearningJourney())
    .then(() => seedAbout())
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
