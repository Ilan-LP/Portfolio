import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import fs from 'fs';
import path from 'path';

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif', '.bmp'];

/**
 * Scans the uploads/ folder for files named {id}.ext (e.g. 1.jpg, 3.png).
 * Returns a map of numeric ID -> local URL string (e.g. /uploads/1.jpg).
 */
function getLocalMediaMap(): Map<number, string> {
    const map = new Map<number, string>();
    if (!fs.existsSync(UPLOADS_DIR)) return map;
    for (const file of fs.readdirSync(UPLOADS_DIR)) {
        const ext = path.extname(file).toLowerCase();
        if (!IMAGE_EXTENSIONS.includes(ext)) continue;
        const id = parseInt(path.basename(file, ext), 10);
        if (!isNaN(id) && id > 0) map.set(id, `/uploads/${file}`);
    }
    return map;
}

/** Strips fields prefixed with $ before passing data to Prisma. */
function strip<T extends Record<string, unknown>>(obj: T): Omit<T, `$${string}`> {
    return Object.fromEntries(
        Object.entries(obj).filter(([k]) => !k.startsWith('$'))
    ) as Omit<T, `$${string}`>;
}

// ─── Relation field shape ──────────────────────────────────────────────────────
type WithRelations = {
    $media?:      string[];   // altText keys
    $techStacks?: string[];   // tech name keys
    $skills?:     string[];   // skill name keys
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

    // ─── Status ───────────────────────────────────────────────────────────────
    const statuses = await prisma.status.createManyAndReturn({
        data: [
            { name: 'En cours',       description: 'L\'élément n\'a pas encore commencé' },
            { name: 'En Progression', description: 'L\'élément est actuellement en cours de traitement' },
            { name: 'Terminé',        description: 'L\'élément est terminé' },
            { name: 'En Attente',     description: 'L\'élément est actuellement en attente' },
            { name: 'Annulé',         description: 'L\'élément est annulé' },
            { name: 'Archivé',        description: 'L\'élément est archivé' },
            { name: 'Planification',  description: 'L\'élément est en phase de planification' },
            { name: 'Abandonné',      description: 'L\'élément est abandonné' },
            { name: 'Actif',           description: 'L\'élément est actif et en cours d\'utilisation' },
        ],
    });
    const S = Object.fromEntries(statuses.map(s => [s.name, s.id]));
    console.log(`✅ Created ${statuses.length} statuses`);

    // ─── Degrees ──────────────────────────────────────────────────────────────
    const degrees = await prisma.degree.createManyAndReturn({
        data: [
            { name: 'Baccalauréat', description: 'Diplôme obtenu à la fin du lycée' },
            { name: 'Bachelor',      description: 'Diplôme obtenu après 3 ans en études supérieures' },
            { name: 'Master',       description: 'Diplôme obtenu après 5 ans en études supérieures' },
        ],
    });
    const D = Object.fromEntries(degrees.map(d => [d.name, d.id]));
    console.log(`✅ Created ${degrees.length} degrees`);

    // ─── Job Types ────────────────────────────────────────────────────────────
    const jobTypes = await prisma.jobType.createManyAndReturn({
        data: [
            { name: 'Temps plein',   description: 'Contrat de travail standard de 35–40h par semaine' },
            { name: 'Temps partiel', description: 'Contrat de travail à temps réduit' },
            { name: 'Stage',         description: 'Période de travail temporaire pour étudiants ou diplômés' },
            { name: 'Freelance',     description: 'Travail en indépendant, contrats ponctuels basés sur des projets' },
            { name: 'Alternance',    description: 'Contrat en alternance combinant emploi et école' },
        ],
    });
    const JT = Object.fromEntries(jobTypes.map(j => [j.name, j.id]));
    console.log(`✅ Created ${jobTypes.length} job types`);

    // ─── TechStack Categories ─────────────────────────────────────────────────
    const techCategories = await prisma.techStackCategory.createManyAndReturn({
        data: [
            { name: 'Frontend',  description: 'Technologies UI/UX s\'exécutant dans le navigateur' },
            { name: 'Backend',   description: 'Technologies et frameworks côté serveur' },
            { name: 'Base de données', description: 'Technologies de stockage et de requêtage de données' },
            { name: 'DevOps',    description: 'Outils d\'infrastructure, CI/CD et conteneurs' },
            { name: 'Mobile',    description: 'Frameworks de développement iOS et Android' },
            { name: 'Outils',    description: 'Utilitaires de développement et outils de productivité' },
        ],
    });
    const TC = Object.fromEntries(techCategories.map(c => [c.name, c.id]));
    console.log(`✅ Created ${techCategories.length} tech-stack categories`);

    // ─── Skill Categories ─────────────────────────────────────────────────────
    const skillCategories = await prisma.skillCategory.createManyAndReturn({
        data: [
            { name: 'Technique',               description: 'Compétences techniques avancées' },
            { name: 'Compétences relationnelles', description: 'Compétences interpersonnelles et de communication' },
            { name: 'Management',              description: 'Compétences en gestion de projet et d\'équipe' },
            { name: 'Design',                  description: 'Compétences en design UI/UX et graphique' },
        ],
    });
    const SC = Object.fromEntries(skillCategories.map(c => [c.name, c.id]));
    console.log(`✅ Created ${skillCategories.length} skill categories`);

    // ─── Skill Levels ─────────────────────────────────────────────────────────
    const skillLevels = await prisma.skillLevel.createManyAndReturn({
        data: [
            { name: 'Débutant',      description: 'Compréhension de base, expérience pratique limitée' },
            { name: 'Intermédiaire', description: 'Bonne compréhension avec une expérience pratique régulière' },
            { name: 'Avancé',        description: 'Connaissances approfondies et vaste expérience pratique' },
            { name: 'Expert',        description: 'Niveau de maîtrise, autorité reconnue dans le domaine' },
        ],
    });
    const L = Object.fromEntries(skillLevels.map(l => [l.name, l.id]));
    console.log(`✅ Created ${skillLevels.length} skill levels`);

    // ─── TechStacks ───────────────────────────────────────────────────────────
    const techStacks = await prisma.techStack.createManyAndReturn({
        data: [
            { name: 'React',        iconUrl: 'https://cdn.simpleicons.org/react',        color: '#61DAFB', categoryId: TC['Frontend']        },
            { name: 'TypeScript',   iconUrl: 'https://cdn.simpleicons.org/typescript',   color: '#3178C6', categoryId: TC['Frontend']        },
            { name: 'JavaScript',   iconUrl: 'https://cdn.simpleicons.org/javascript',   color: '#F7DF1E', categoryId: TC['Frontend']        },
            { name: 'Tailwind CSS', iconUrl: 'https://cdn.simpleicons.org/tailwindcss',  color: '#06B6D4', categoryId: TC['Frontend']        },
            { name: 'Vite',         iconUrl: 'https://cdn.simpleicons.org/vite',         color: '#646CFF', categoryId: TC['Frontend']        },
            { name: 'Node.js',      iconUrl: 'https://cdn.simpleicons.org/nodedotjs',    color: '#339933', categoryId: TC['Backend']         },
            { name: 'Express',      iconUrl: 'https://cdn.simpleicons.org/express',      color: '#000000', categoryId: TC['Backend']         },
            { name: 'Prisma',       iconUrl: 'https://cdn.simpleicons.org/prisma',       color: '#2D3748', categoryId: TC['Base de données'] },
            { name: 'PostgreSQL',   iconUrl: 'https://cdn.simpleicons.org/postgresql',   color: '#4169E1', categoryId: TC['Base de données'] },
            { name: 'Docker',       iconUrl: 'https://cdn.simpleicons.org/docker',       color: '#2496ED', categoryId: TC['DevOps']          },
            { name: 'Git',          iconUrl: 'https://cdn.simpleicons.org/git',          color: '#F05032', categoryId: TC['Outils']          },
            { name: 'Postman',      iconUrl: 'https://cdn.simpleicons.org/postman',      color: '#FF6C37', categoryId: TC['Outils']          },
        ],
    });
    const T = Object.fromEntries(techStacks.map(t => [t.name, t.id]));
    console.log(`✅ Created ${techStacks.length} tech stacks`);

    // ─── Skills ───────────────────────────────────────────────────────────────
    const skills = await prisma.skill.createManyAndReturn({
        data: [
            { name: 'Résolution de problèmes',   iconUrl: 'https://cdn.simpleicons.org/minds',   color: '#FF6B6B', description: 'Capacité à analyser des problèmes complexes et à concevoir des solutions',          categoryId: SC['Technique'],                  levelId: L['Intermédiaire'] },
            { name: 'Conception d\'API REST',     iconUrl: 'https://cdn.simpleicons.org/express', color: '#009688', description: 'Conception d\'API REST propres et cohérentes',                                       categoryId: SC['Technique'],                  levelId: L['Avancé']        },
            { name: 'Modélisation de BDD',        iconUrl: 'https://cdn.simpleicons.org/prisma',  color: '#4169E1', description: 'Conception de bases de données relationnelles et non relationnelles',               categoryId: SC['Technique'],                  levelId: L['Avancé']        },
            { name: 'Communication d\'équipe',    iconUrl: 'https://cdn.simpleicons.org/slack',   color: '#4A154B', description: 'Communication claire et efficace au sein d\'une équipe',                             categoryId: SC['Compétences relationnelles'], levelId: L['Avancé']        },
            { name: 'Gestion d\'équipe',          iconUrl: 'https://cdn.simpleicons.org/trello',  color: '#0079BF', description: 'Coordination et motivation d\'une équipe pour atteindre des objectifs communs',     categoryId: SC['Management'],                 levelId: L['Intermédiaire'] },
            { name: 'Agile',                      iconUrl: 'https://cdn.simpleicons.org/jira',    color: '#0052CC', description: 'Travail dans des sprints Agile',                                                    categoryId: SC['Management'],                 levelId: L['Intermédiaire'] },
            { name: 'Relations clients',          iconUrl: 'https://cdn.simpleicons.org/hubspot', color: '#FF7A59', description: 'Gestion des relations avec les clients et les parties prenantes',                   categoryId: SC['Compétences relationnelles'], levelId: L['Intermédiaire'] },
            { name: 'Design UI/UX',               iconUrl: 'https://cdn.simpleicons.org/figma',   color: '#F24E1E', description: 'Création d\'interfaces et d\'expériences conviviales',                              categoryId: SC['Design'],                     levelId: L['Débutant']      },
        ],
    });
    const SK = Object.fromEntries(skills.map(s => [s.name, s.id]));
    console.log(`✅ Created ${skills.length} skills`);

    // ─── Companies ────────────────────────────────────────────────────────────
    const companies = await prisma.company.createManyAndReturn({
        data: [
            { name: 'IFPEN',        description: 'Institut français du pétrole et des énergies nouvelles',                                                              websiteUrl: 'https://www.ifpenergiesnouvelles.com'   },
            { name: 'Akuiteo',      description: 'Akuiteo est un éditeur français d\'ERP',                                                                              websiteUrl: 'https://www.akuiteo.com'                },
            { name: 'Pave D\'Ozon', description: 'Boulangerie, Patisserie et Traiteur',                                                                                 websiteUrl: 'https://share.google/xvLSRGmwsa69WAxjx' },
            { name: 'Nexus-I',      description: 'Nexus-I est une entreprise de services numériques spécialisée dans le développement web',                            websiteUrl: 'https://www.nexus-i.fr'                 },
        ],
    });
    const CO = Object.fromEntries(companies.map(c => [c.name, c.id]));
    console.log(`✅ Created ${companies.length} companies`);

    // ─── Schools ──────────────────────────────────────────────────────────────
    const schools = await prisma.school.createManyAndReturn({
        data: [
            { name: 'Epitech',             description: 'l’école de l’excellence informatique', websiteUrl: 'https://www.epitech.eu' },
            { name: 'Bellevue Assomption Lyon', description: 'Lycée général et technologique',        websiteUrl: 'https://www.assomption-lyon.org/nos-etablissements/lycee-bellevue' },
        ],
    });
    const SCH = Object.fromEntries(schools.map(s => [s.name, s.id]));
    console.log(`✅ Created ${schools.length} schools`);

    // ─── Media ────────────────────────────────────────────────────────────────
    // URLs are placeholders — overridden by uploads/{id}.ext if a matching file exists.
    const medias = await prisma.media.createManyAndReturn({
        data: [
            { url: '/uploads/placeholder', type: 'IMAGE', altText: 'MyEpiPlus Website'  },
            { url: '/uploads/placeholder', type: 'IMAGE', altText: 'MyEpiPlus Popup'    },
            { url: '/uploads/placeholder', type: 'IMAGE', altText: 'MyEpiPlus Full'     },
            { url: '/uploads/placeholder', type: 'IMAGE', altText: 'Portfolio Home'     },
            { url: '/uploads/placeholder', type: 'IMAGE', altText: 'Juice Shop Home'    },
            { url: '/uploads/placeholder', type: 'IMAGE', altText: 'Carbon Alert Home'  },
            { url: '/uploads/placeholder', type: 'IMAGE', altText: 'Logo IFPEN'         },
            { url: '/uploads/placeholder', type: 'IMAGE', altText: 'Logo Akuiteo'       },
            { url: '/uploads/placeholder', type: 'IMAGE', altText: 'Logo Berlioz'       },
            { url: '/uploads/placeholder', type: 'IMAGE', altText: 'Bellevue Logo'      },
            { url: '/uploads/placeholder', type: 'IMAGE', altText: 'Epitech Logo'       },
            { url: '/uploads/placeholder', type: 'IMAGE', altText: 'IdentiQ Home'       },
            { url: '/uploads/placeholder', type: 'IMAGE', altText: 'Nexus-I Logo'       },
            { url: '/uploads/placeholder', type: 'IMAGE', altText: 'Nexus-I Banner'     },
            { url: '/uploads/placeholder', type: 'IMAGE', altText: 'SUI Certificate'    },
            { url: '/uploads/placeholder', type: 'IMAGE', altText: 'Salon L\'Etudiant'  },
        ],
    });

    const localMediaMap = getLocalMediaMap();
    if (localMediaMap.size > 0) {
        console.log(`📁 Found ${localMediaMap.size} local media file(s) in uploads/ — overriding placeholder URLs...`);
        for (const media of medias) {
            const localUrl = localMediaMap.get(media.id);
            if (localUrl) {
                await prisma.media.update({ where: { id: media.id }, data: { url: localUrl } });
                console.log(`   ✅ Media #${media.id} ("${media.altText}") → ${localUrl}`);
            }
        }
    }

    const M = Object.fromEntries(medias.map(m => [m.altText, m.id]));
    console.log(`✅ Created ${medias.length} medias`);

    // ─── Projects ─────────────────────────────────────────────────────────────
    // Add $media / $techStacks / $skills alongside each entry — they're stripped
    // automatically before the DB insert and used to create the relation rows below.
    const projectDefs = [
        {
            title:               'MyEpiPlus',
            descriptionShort:    'Une extension Chrome/Firefox qui permet d\'améliorer les informations disponibles sur l\'intranet de mon école',
            descriptionLong:     'Cette extension Chrome/Firefox améliore l\'intranet d\'Epitech en ajoutant des fonctionnalités manquantes sur la plateforme officielle. Elle permet notamment d\'afficher directement les notes et les moyennes, de visualiser les crédits (EIP, activités hub) et d\'améliorer la navigation générale\n\nDéveloppée en JavaScript pur, elle est compatible avec Chrome et Firefox et disponible sur le Chrome Web Store. Elle a été conçue pour répondre aux besoins concrets des étudiants Epitech qui trouvaient l\'intranet officiel peu pratique et incomplet',
            startedAt:           new Date('2026-02-25'),
            statusId:            S['Actif'],
            mainProjectMediaId:  M['MyEpiPlus Website'],
            githubUrl:           'https://github.com/Ilan-LP/MyEpiPlus',
            liveUrl:             'https://chromewebstore.google.com/detail/phamedghehobpnbhpemgpbophoojaeio',
            enabled:             true,
            $media:              ['MyEpiPlus Website', 'MyEpiPlus Popup', 'MyEpiPlus Full'] as string[],
            $techStacks:         ['JavaScript'] as string[],
            $skills:             ['Conception d\'API REST', 'Résolution de problèmes'] as string[],
        },
        {
            title:               'Portfolio',
            descriptionShort:    'Mon portfolio personnel pour présenter mes projets, expériences et compétences',
            descriptionLong:     'Ce portfolio est construit avec une architecture fullstack moderne : un backend Node.js/Express exposant une API REST documentée avec Swagger, une base de données PostgreSQL gérée via Prisma, et un frontend React/TypeScript\n\nL\'ensemble est containerisé avec Docker et déployé en production. Il met en valeur mes projets, expériences professionnelles, compétences techniques et réalisations académiques de manière interactive et dynamique',
            startedAt:           new Date('2026-02-22'),
            statusId:            S['En Progression'],
            mainProjectMediaId:  M['Portfolio Home'],
            githubUrl:           'https://github.com/Ilan-LP/Portfolio',
            liveUrl:             'https://ilanlp.nexus-i.fr',
            enabled:             true,
            $media:              ['Portfolio Home'] as string[],
            $techStacks:         ['React', 'Node.js', 'Prisma', 'Express', 'Docker', 'Git'] as string[],
            $skills:             ['Conception d\'API REST'] as string[],
        },
        {
            title:               'Hack & Juice',
            descriptionShort:    'Un projet de hackathon sur la célèbre plateforme Juice Shop de OWASP, visant à identifier et exploiter des vulnérabilités de sécurité dans une application e-commerce délibérément vulnérable',
            descriptionLong:     'Lors d\'un hackathon de 2 semaines, j\'ai travaillé en équipe pour identifier et exploiter des vulnérabilités de sécurité dans OWASP Juice Shop, une application e-commerce délibérément vulnérable. Nous avons utilisé des outils comme Burp Suite et des techniques de pentesting pour trouver des failles telles que l\'injection SQL, le cross-site scripting (XSS) et les failles d\'authentification, démontrant ainsi l\'importance de la sécurité dans le développement web moderne',
            startedAt:           new Date('2025-05-12'),
            endAt:               new Date('2025-12-19'),
            statusId:            S['Terminé'],
            mainProjectMediaId:  M['Juice Shop Home'],
            liveUrl:             'https://owasp.org/www-project-juice-shop/',
            enabled:             true,
            $media:              ['Juice Shop Home'] as string[],
            $techStacks:         ['Postman', 'Git'] as string[],
            $skills:             ['Résolution de problèmes', 'Communication d\'équipe'] as string[],
        },
        {
            title:               'Carbon Alert',
            descriptionShort:    'Un site web développé dans le cadre d\'un Hackathon de 4 jours organisé par Epitech en collaboration avec The Shifter, visant à faciliter l\'accès à des données de mobilité durable organisées par les communes de France',
            descriptionLong:     'Dans le cadre d\'un Hackathon de 4 jours organisé par Epitech en collaboration avec The Shifter, j\'ai développé un site web appelé Carbon Alert pour faciliter l\'accès à des données de mobilité durable organisées par les communes de France\n\nLe projet visait à sensibiliser les utilisateurs à l\'empreinte carbone de leurs déplacements et à promouvoir des alternatives plus écologiques. Nous avons utilisé des API publiques pour collecter des données sur les transports en commun, les pistes cyclables et les émissions de CO2, offrant ainsi une interface conviviale pour aider les utilisateurs à prendre des décisions de mobilité plus durables',
            startedAt:           new Date('2026-01-19'),
            endAt:               new Date('2026-01-22'),
            statusId:            S['Archivé'],
            mainProjectMediaId:  M['Carbon Alert Home'],
            enabled:             true,
            $media:              ['Carbon Alert Home'] as string[],
            $techStacks:         ['React', 'Node.js', 'Express', 'Git'] as string[],
            $skills:             ['Résolution de problèmes', 'Communication d\'équipe'] as string[],
        },
        {
            title:               'IdentiQ',
            descriptionShort:    'Réseau social anonyme conçu dans le cadre d\'un projet Epitech, visant à connecter les individus tout en garantissant leur confidentialité et la sécurité de leurs données personnelles',
            descriptionLong:     'IdentiQ est un réseau social imaginé dans le cadre d\'un projet Epitech où nous devions concevoir la maquette fonctionnelle d\'une application innovante. L\'idée centrale : connecter les individus de manière anonyme, sans jamais compromettre la confidentialité de leurs données\n\nL\'application permet aux utilisateurs de partager des pensées, des idées et des expériences sans révéler leur identité, favorisant ainsi une communication plus authentique et ouverte\n\nNous avons intégré des techniques de cryptographie pour assurer l\'anonymat et la sécurité des données, tout en concevant une interface utilisateur intuitive pour encourager l\'engagement au sein de la communauté',
            startedAt:           new Date('2026-01-11'),
            endAt:               new Date('2026-01-30'),
            statusId:            S['Archivé'],
            mainProjectMediaId:  M['IdentiQ Home'],
            enabled:             true,
            $media:              ["IdentiQ Home"] as string[],
            $techStacks:         ['Docker', 'Git', 'Node.js', 'Express', 'Prisma', 'React'] as string[],
            $skills:             ['Résolution de problèmes', 'Communication d\'équipe'] as string[],
        },
    ] satisfies (WithRelations & Record<string, unknown>)[];

    const projects = await prisma.project.createManyAndReturn({ data: projectDefs.map(strip) });
    const P = Object.fromEntries(projects.map(p => [p.title, p.id]));

    await prisma.projectMedia.createMany({
        data: projectDefs.flatMap(def => (def.$media ?? []).map(alt => ({ projectId: P[def.title as string], mediaId: M[alt] }))),
    });
    await prisma.projectTechStack.createMany({
        data: projectDefs.flatMap(def => (def.$techStacks ?? []).map(ts => ({ projectId: P[def.title as string], techStackId: T[ts] }))),
    });
    await prisma.projectSkill.createMany({
        data: projectDefs.flatMap(def => (def.$skills ?? []).map(sk => ({ projectId: P[def.title as string], skillId: SK[sk] }))),
    });
    console.log(`✅ Created ${projects.length} projects with their relations`);

    // ─── Experiences ──────────────────────────────────────────────────────────
    const experienceDefs = [
        {
            title:                  'Stage Découverte 3ème',
            descriptionShort:       'Découverte du monde professionnel à l\'IFPEN, institut spécialisé dans la recherche sur le pétrole et les énergies nouvelles',
            descriptionLong:        'Stage de découverte d\'une semaine à l\'IFPEN (Institut Français du Pétrole et des Énergies Nouvelles), réalisé en classe de 3ème\n\nJ\'ai eu l\'occasion d\'observer différents métiers scientifiques et techniques, de comprendre le fonctionnement d\'un grand établissement de recherche, et de découvrir pour la première fois l\'environnement professionnel',
            startedAt:              new Date('2022-02-06'),
            endAt:                  new Date('2022-06-06'),
            companyId:              CO['IFPEN'],
            statusId:               S['Terminé'],
            jobTypeId:              JT['Stage'],
            mainExperienceMediaId:  M['Logo IFPEN'],
            enabled:                true,
            $media:                 ['Logo IFPEN'] as string[],
            $techStacks:            [] as string[],
            $skills:                ['Communication d\'équipe'] as string[],
        },
        {
            title:                  'Stage Découverte seconde',
            descriptionShort:       'Découverte du développement logiciel en entreprise chez Akuiteo, éditeur français d\'ERP',
            descriptionLong:        'Stage de découverte de 2 semaines chez Akuiteo, éditeur français d\'ERP, réalisé en classe de seconde\n\nJ\'ai pu assister à des réunions d\'équipe, observer le processus de développement logiciel et comprendre l\'organisation d\'une équipe technique. Cette expérience a confirmé mon intérêt pour le développement et le monde du numérique',
            startedAt:              new Date('2023-02-06'),
            endAt:                  new Date('2023-06-14'),
            companyId:              CO['Akuiteo'],
            statusId:               S['Terminé'],
            jobTypeId:              JT['Stage'],
            mainExperienceMediaId:  M['Logo Akuiteo'],
            enabled:                true,
            $media:                 ['Logo Akuiteo'] as string[],
            $techStacks:            ['Git'] as string[],
            $skills:                ['Communication d\'équipe'] as string[],
        },
        {
            title:                  'Vendeur en boulangerie',
            descriptionShort:       'Vente et service client dans une boulangerie locale',
            descriptionLong:        'En tant que vendeur en boulangerie, j\'étais responsable de l\'accueil des clients, de la prise de commandes, du service et de la gestion de la caisse. Cette expérience m\'a permis de développer mes compétences en communication, en gestion du temps et en travail d\'équipe dans un environnement dynamique',
            startedAt:              new Date('2025-10-15'),
            companyId:              CO['Pave D\'Ozon'],
            statusId:               S['En cours'],
            jobTypeId:              JT['Temps partiel'],
            mainExperienceMediaId:  M['Logo Berlioz'],
            enabled:                true,
            $media:                 ['Logo Berlioz'] as string[],
            $techStacks:            [] as string[],
            $skills:                ['Communication d\'équipe', 'Relations clients'] as string[],
        },
        {
            title:                  'Développeur Web Freelance',
            descriptionShort:       'Développement de sites web sur mesure pour des clients, dans le cadre d\'une collaboration freelance avec Nexus-I',
            descriptionLong:        'En tant que développeur web freelance via Nexus-I, j\'ai travaillé avec plusieurs clients pour créer des sites web personnalisés répondant à leurs besoins spécifiques\n\nJ\'étais responsable de la conception, du développement et du déploiement de ces sites, en utilisant des technologies telles que React, Node.js, TypeScript et Prisma\n\nCette expérience m\'a permis de renforcer mes compétences techniques tout en développant ma capacité à gérer les relations clients, les délais et les priorités de projet',
            startedAt:              new Date('2026-01-14'),
            companyId:              CO['Nexus-I'],
            statusId:               S['En cours'],
            jobTypeId:              JT['Freelance'],
            mainExperienceMediaId:  M['Nexus-I Banner'],
            enabled:                true,
            $media:                 ['Nexus-I Logo', "Nexus-I Banner"] as string[],
            $techStacks:            ['React', 'Node.js', 'Prisma', 'Express', 'Docker', 'Git', 'TypeScript'] as string[],
            $skills:                ['Résolution de problèmes', 'Communication d\'équipe'] as string[],
        },
    ] satisfies (WithRelations & Record<string, unknown>)[];

    const experiences = await prisma.experience.createManyAndReturn({ data: experienceDefs.map(strip) });
    const E = Object.fromEntries(experiences.map(e => [e.title, e.id]));

    await prisma.experienceMedia.createMany({
        data: experienceDefs.flatMap(def => (def.$media ?? []).map(alt => ({ experienceId: E[def.title as string], mediaId: M[alt] }))),
    });
    await prisma.experienceTechStack.createMany({
        data: experienceDefs.flatMap(def => (def.$techStacks ?? []).map(ts => ({ experienceId: E[def.title as string], techStackId: T[ts] }))),
    });
    await prisma.experienceSkill.createMany({
        data: experienceDefs.flatMap(def => (def.$skills ?? []).map(sk => ({ experienceId: E[def.title as string], skillId: SK[sk] }))),
    });
    console.log(`✅ Created ${experiences.length} experiences with their relations`);

    // ─── Educations ───────────────────────────────────────────────────────────
    const educationDefs = [
        {
            title:                  'Baccalauréat',
            descriptionShort:       'Baccalauréat Maths/NSI obtenu avec mention assez bien',
            descriptionLong:        'Diplômé avec mention assez bien du lycée Bellevue Assomption Lyon, avec les spécialités Mathématiques et Numérique et Sciences Informatiques (NSI). J\'ai acquis de solides compétences en mathématiques, en algorithmie et en programmation, ce qui m\'a préparé pour mes études supérieures en informatique',
            startedAt:              new Date('2022-09-01'),
            endAt:                  new Date('2025-06-30'),
            statusId:               S['Terminé'],
            schoolId:               SCH['Bellevue Assomption Lyon'],
            degreeId:               D['Baccalauréat'],
            mainEducationMediaId:   M['Bellevue Logo'],
            enabled:                true,
            $media:                 ['Bellevue Logo'] as string[],
            $techStacks:            [] as string[],
            $skills:                ['Résolution de problèmes', 'Communication d\'équipe', 'Gestion d\'équipe'] as string[],
        },
        {
            title:                  'Bachelor Informatique',
            descriptionShort:       'Programme de 3 ans en informatique à Epitech',
            descriptionLong:        'Bachelor en 3 ans à Epitech, couvrant l\'ensemble des fondamentaux de l\'informatique : la première année est axée sur le développement web fullstack, puis une spécialisation en intelligence artificielle prend le relais\n\nJ\'ai travaillé sur de nombreux projets pratiques en équipe, renforçant mes compétences en développement logiciel, en gestion de projet et en méthodologie Agile',
            startedAt:              new Date('2025-09-15'),
            endAt:                  new Date('2028-06-30'),
            statusId:               S['En Progression'],
            schoolId:               SCH['Epitech'],
            degreeId:               D['Bachelor'],
            mainEducationMediaId:   M['Epitech Logo'],
            enabled:                true,
            $media:                 ['Epitech Logo'] as string[],
            $techStacks:            ['Git', 'Docker', 'Node.js', 'React', 'Prisma', 'Express', 'PostgreSQL', 'Tailwind CSS', 'Vite', 'TypeScript', 'JavaScript', 'Postman'] as string[],
            $skills:                ['Résolution de problèmes', 'Conception d\'API REST', 'Modélisation de BDD', 'Communication d\'équipe', 'Gestion d\'équipe', 'Agile', 'Design UI/UX'] as string[],
        },
    ] satisfies (WithRelations & Record<string, unknown>)[];

    const educations = await prisma.education.createManyAndReturn({ data: educationDefs.map(strip) });
    const ED = Object.fromEntries(educations.map(e => [e.title, e.id]));

    await prisma.educationMedia.createMany({
        data: educationDefs.flatMap(def => (def.$media ?? []).map(alt => ({ educationId: ED[def.title as string], mediaId: M[alt] }))),
    });
    await prisma.educationTechStack.createMany({
        data: educationDefs.flatMap(def => (def.$techStacks ?? []).map(ts => ({ educationId: ED[def.title as string], techStackId: T[ts] }))),
    });
    await prisma.educationSkill.createMany({
        data: educationDefs.flatMap(def => (def.$skills ?? []).map(sk => ({ educationId: ED[def.title as string], skillId: SK[sk] }))),
    });
    console.log(`✅ Created ${educations.length} educations with their relations`);

    // ─── News ─────────────────────────────────────────────────────────────────
    const newsDefs = [
        {
            title:            'Mise à jour de MyEpiPlus',
            descriptionShort: 'Nouvelle version disponible avec des améliorations de performance',
            descriptionLong:  'La nouvelle version de MyEpiPlus est maintenant disponible avec des corrections de bugs et des améliorations de performance. Téléchargez la dernière version pour une expérience encore meilleure !',
            publishedAt:      new Date('2026-02-28'),
            mainNewsMediaId:  M['MyEpiPlus Website'],
            enabled:          true,
            $media:           ['MyEpiPlus Website'] as string[],
        },
        {
            title:            'Certificat Sui Fundamentals en poche !',
            descriptionShort: 'J\'ai récemment obtenu la certification Sui Fundamentals, validant mes connaissances de base sur la blockchain Sui et le développement de smart contracts',
            descriptionLong:  'En octobre dernier, j\'ai eu la chance de participer à deux workshops organisés par PoC Innovation en collaboration avec KRYPTOSPHERE® et la Sui Foundation. L\'objectif ? Découvrir la blockchain Sui et apprendre à développer mes premiers smart contracts\n\nCe qui m\'a le plus marqué, c\'est de passer de la théorie à la pratique : comprendre comment cette technologie fonctionne réellement, mettre les mains dans le code, et réaliser concrètement ce qu\'on peut construire avec des applications décentralisées\n\nMaintenant que j\'ai les bases, j\'ai envie d\'aller plus loin',
            publishedAt:      new Date('2025-12-15'),
            mainNewsMediaId:  M['SUI Certificate'],
            enabled:          true,
            $media:           ['SUI Certificate'] as string[],
        },
        {
            title:            'La vie privée est-elle devenue un luxe ?',
            descriptionShort: 'Face à la montée de la surveillance et de la censure, comment garantir la libre circulation de l\'information ?',
            descriptionLong:  'C\'est la question centrale qui a guidé notre réflexion lors d\'un récent projet de Product Design (module YOWL) à Epitech. Si le cadre académique consistait à "imaginer un réseau social", l\'ambition que nous portons aujourd\'hui dépasse cet exercice\n\nAvec Valentin Bassot et Léo Bouana, nous avons décidé d\'orienter notre prototype, IdentiQ, vers une mission précise : garantir la libre circulation de l\'information face aux enjeux croissants de surveillance et de censure. Nous concevons ce projet non pas comme un média, mais comme une infrastructure neutre de mise en relation, bâtie sur deux principes techniques forts :\n\nArchitecture Zero-Knowledge : Les messages sont stockés en base de données exclusivement sous forme chiffrée. N\'ayant pas les clés de déchiffrement, le contenu reste techniquement inaccessible pour nous ou toute entité tierce\n\nSensibilisation à la sécurité technique : La technique ne suffit pas. Nous avons intégré un volet pédagogique directement dans l\'expérience utilisateur pour inciter aux bonnes pratiques en amont (utilisation de VPN, protection de l\'IP)\n\nNotre stack technique est aujourd\'hui défini et le développement du prototype suit son cours. Au-delà du code, nous serions ravis d\'avoir votre avis sur la pertinence de ce positionnement face aux défis actuels de la confidentialité numérique',
            publishedAt:      new Date('2025-12-20'),
            mainNewsMediaId:  M['IdentiQ Home'],
            enabled:          true,
            $media:           ['IdentiQ Home'] as string[],
        },
        {
            title:            'Salon de l\'Étudiant 2025',
            descriptionShort: 'J\'ai eu l\'opportunité de participer au Salon de l\'Étudiant 2025 en tant que représentant de mon école, Epitech',
            descriptionLong:  'En tant qu\'étudiant en informatique à Epitech, j\'ai eu l\'opportunité de participer au Salon de l\'Étudiant 2025 en tant que représentant de mon école. Cet événement majeur de l\'orientation et de l\'éducation en France a été une expérience enrichissante, me permettant d\'échanger avec des futurs étudiants, des parents et des professionnels de l\'éducation sur les opportunités offertes par Epitech et le secteur de l\'informatique en général. J\'ai pu partager mon parcours, mes projets et mes aspirations',
            publishedAt:      new Date('2026-01-14'),
            mainNewsMediaId:  M['Salon L\'Etudiant'],
            enabled:          true,
            $media:           ['Salon L\'Etudiant'] as string[],
        }
    ] satisfies (WithRelations & Record<string, unknown>)[];

    const newsItems = await prisma.news.createManyAndReturn({ data: newsDefs.map(strip) });
    const N = Object.fromEntries(newsItems.map(n => [n.title, n.id]));

    await prisma.newsMedia.createMany({
        data: newsDefs.flatMap(def => (def.$media ?? []).map(alt => ({ newsId: N[def.title as string], mediaId: M[alt] }))),
    });
    console.log(`✅ Created ${newsItems.length} news items with their relations`);

    console.log('\n🎉 Base de données initialisée avec succès !');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });