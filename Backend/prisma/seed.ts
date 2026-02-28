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
    const statusDict: Record<string, number> = Object.fromEntries(statuses.map(s => [s.name, s.id]));
    console.log(`✅ Created ${statuses.length} statuses`);

    // ─── Degrees ──────────────────────────────────────────────────────────────
    const degrees = await prisma.degree.createManyAndReturn({
        data: [
            { name: 'Baccalauréat', description: 'Diplôme obtenu à la fin du lycée' },
            { name: 'Bachelor',      description: 'Diplôme obtenu après 3 ans en études supérieures' },
            { name: 'Master',       description: 'Diplôme obtenu après 5 ans en études supérieures' },
        ],
    });
    const degreeDict: Record<string, number> = Object.fromEntries(degrees.map(d => [d.name, d.id]));
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
    const jobTypeDict: Record<string, number> = Object.fromEntries(jobTypes.map(j => [j.name, j.id]));
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
    const techCatDict: Record<string, number> = Object.fromEntries(techCategories.map(c => [c.name, c.id]));
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
    const skillCatDict: Record<string, number> = Object.fromEntries(skillCategories.map(c => [c.name, c.id]));
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
    const levelDict: Record<string, number> = Object.fromEntries(skillLevels.map(l => [l.name, l.id]));
    console.log(`✅ Created ${skillLevels.length} skill levels`);

    // ─── TechStacks ───────────────────────────────────────────────────────────
    const techStacks = await prisma.techStack.createManyAndReturn({
        data: [
            { name: 'React',          iconUrl: 'https://cdn.simpleicons.org/react',          color: '#61DAFB', categoryId: techCatDict['Frontend'] },
            { name: 'TypeScript',     iconUrl: 'https://cdn.simpleicons.org/typescript',     color: '#3178C6', categoryId: techCatDict['Frontend'] },
            { name: 'JavaScript',     iconUrl: 'https://cdn.simpleicons.org/javascript',     color: '#F7DF1E', categoryId: techCatDict['Frontend'] },
            { name: 'Tailwind CSS',   iconUrl: 'https://cdn.simpleicons.org/tailwindcss',    color: '#06B6D4', categoryId: techCatDict['Frontend'] },
            { name: 'Vite',           iconUrl: 'https://cdn.simpleicons.org/vite',           color: '#646CFF', categoryId: techCatDict['Frontend'] },
            { name: 'Node.js',        iconUrl: 'https://cdn.simpleicons.org/nodedotjs',      color: '#339933', categoryId: techCatDict['Backend'] },
            { name: 'Express',        iconUrl: 'https://cdn.simpleicons.org/express',        color: '#000000', categoryId: techCatDict['Backend'] },
            { name: 'Prisma',         iconUrl: 'https://cdn.simpleicons.org/prisma',         color: '#2D3748', categoryId: techCatDict['Backend'] },
            { name: 'PostgreSQL',     iconUrl: 'https://cdn.simpleicons.org/postgresql',     color: '#4169E1', categoryId: techCatDict['Base de données'] },
            { name: 'Docker',         iconUrl: 'https://cdn.simpleicons.org/docker',         color: '#2496ED', categoryId: techCatDict['DevOps'] },
            { name: 'Git',            iconUrl: 'https://cdn.simpleicons.org/git',            color: '#F05032', categoryId: techCatDict['Outils'] },
            { name: 'Postman',        iconUrl: 'https://cdn.simpleicons.org/postman',        color: '#FF6C37', categoryId: techCatDict['Outils'] },

        ],
    });
    const techDict: Record<string, number> = Object.fromEntries(techStacks.map(t => [t.name, t.id]));
    console.log(`✅ Created ${techStacks.length} tech stacks`);

    // ─── Skills ───────────────────────────────────────────────────────────────
    const skills = await prisma.skill.createManyAndReturn({
        data: [
            { name: 'Résolution de problèmes',      iconUrl: 'https://cdn.simpleicons.org/minds',   color: '#FF6B6B', description: 'Capacité à analyser des problèmes complexes et à concevoir des solutions.',    categoryId: skillCatDict['Technique'],               levelId: levelDict['Intermédiaire']        },
            { name: 'Conception d\'API REST',        iconUrl: 'https://cdn.simpleicons.org/express',    color: '#009688', description: 'Conception d\'API REST propres et cohérentes.',                               categoryId: skillCatDict['Technique'],               levelId: levelDict['Avancé']        },
            { name: 'Modélisation de BDD',           iconUrl: 'https://cdn.simpleicons.org/prisma', color: '#4169E1', description: 'Conception de bases de données relationnelles et non relationnelles.',         categoryId: skillCatDict['Technique'],               levelId: levelDict['Avancé'] },
            { name: 'Communication d\'équipe',       iconUrl: 'https://cdn.simpleicons.org/slack',      color: '#4A154B', description: 'Communication claire et efficace au sein d\'une équipe.',                     categoryId: skillCatDict['Compétences relationnelles'], levelId: levelDict['Avancé']        },
            { name: 'Gestion d\'équipe',              iconUrl: 'https://cdn.simpleicons.org/trello',     color: '#0079BF', description: 'Coordination et motivation d\'une équipe pour atteindre des objectifs communs.', categoryId: skillCatDict['Management'],              levelId: levelDict['Intermédiaire']        },
            { name: 'Agile',                 iconUrl: 'https://cdn.simpleicons.org/jira',       color: '#0052CC', description: 'Travail dans des sprints Agile',                     categoryId: skillCatDict['Management'],              levelId: levelDict['Intermédiaire'] },
            { name: 'Relations clients',        iconUrl: 'https://cdn.simpleicons.org/hubspot',    color: '#FF7A59', description: 'Gestion des relations avec les clients et les parties prenantes.',              categoryId: skillCatDict['Compétences relationnelles'], levelId: levelDict['Intermédiaire'] },
            { name: 'Design UI/UX',                  iconUrl: 'https://cdn.simpleicons.org/figma',      color: '#F24E1E', description: 'Création d\'interfaces et d\'expériences conviviales.',                      categoryId: skillCatDict['Design'],                  levelId: levelDict['Débutant'] },
        ],
    });
    const skillDict: Record<string, number> = Object.fromEntries(skills.map(s => [s.name, s.id]));
    console.log(`✅ Created ${skills.length} skills`);

    // ─── Companies ────────────────────────────────────────────────────────────
    const companies = await prisma.company.createManyAndReturn({
        data: [
            { name: 'IFPEN',        description: 'Institut français du pétrole et des énergies nouvelles',   websiteUrl: 'https://www.ifpenergiesnouvelles.com' },
            { name: 'Akuiteo',      description: 'Akuiteo est un éditeur français d\'ERP',                    websiteUrl: 'https://www.akuiteo.com' },
            { name: 'Pave D\'Ozon',  description: 'Boulangerie, Patisserie et Traiteur',                       websiteUrl: 'https://share.google/xvLSRGmwsa69WAxjx' },
            { name: 'Nexus-I',       description: 'Nexus-I est une entreprise de services numériques spécialisée dans le développement web.', websiteUrl: 'https://www.nexus-i.fr' },
        ],
    });
    const companyDict: Record<string, number> = Object.fromEntries(companies.map(c => [c.name, c.id]));
    console.log(`✅ Created ${companies.length} companies`);

    // ─── Schools ──────────────────────────────────────────────────────────────
    const schools = await prisma.school.createManyAndReturn({
        data: [
            { name: 'Epitech',             description: 'l’école de l’excellence informatique', websiteUrl: 'https://www.epitech.eu' },
            { name: 'Bellevue Assomption Lyon', description: 'Lycée général et technologique',        websiteUrl: 'https://www.assomption-lyon.org/nos-etablissements/lycee-bellevue' },
        ],
    });
    const schoolDict: Record<string, number> = Object.fromEntries(schools.map(s => [s.name, s.id]));
    console.log(`✅ Created ${schools.length} schools`);

    // ─── Media ────────────────────────────────────────────────────────────────
    const medias = await prisma.media.createManyAndReturn({
        data: [
            { url: '[FIRST FOLDER MEDIA]',    type: 'IMAGE',    altText: 'MyEpiPlus Website' },
            { url: '[SECOND FOLDER MEDIA]',    type: 'IMAGE',    altText: 'MyEpiPlus Popup' },
            { url: '[THIRD FOLDER MEDIA]',    type: 'IMAGE',    altText: 'MyEpiPlus Full' },
            { url: '[FOURTH FOLDER MEDIA]',    type: 'IMAGE',    altText: 'Portfolio Home' },
            { url: '[FIFTH FOLDER MEDIA]',    type: 'IMAGE',    altText: 'Juice Shop Home' },
            { url: '[SIXTH FOLDER MEDIA]',    type: 'IMAGE',    altText: 'Carbon Alert Home' },
            { url: '[SEVENTH FOLDER MEDIA]',    type: 'IMAGE',    altText: 'Logo IFPEN' },
            { url: '[EIGHTH FOLDER MEDIA]',    type: 'IMAGE',    altText: 'Logo Akuiteo' },
            { url: '[NINTH FOLDER MEDIA]',    type: 'IMAGE',    altText: 'Logo Berlioz' },
            { url: '[TENTH FOLDER MEDIA]',    type: 'IMAGE',    altText: 'Bellevue Logo' },
            { url: '[ELEVENTH FOLDER MEDIA]',    type: 'IMAGE',    altText: 'Epitech Logo' },
        ],
    });

    // Override URLs with local files from uploads/{id}.ext
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

    const mediaDict: Record<string, number> = Object.fromEntries(medias.map(m => [m.altText, m.id]));
    console.log(`✅ Created ${medias.length} medias`);

    // ─── Projects ─────────────────────────────────────────────────────────────
    const projects = await prisma.project.createManyAndReturn({
        data: [
            {
                title:            'MyEpiPlus',
                descriptionShort: 'Une extension Chrome/Firefox qui permet d\'améliorer les informations disponibles sur l\'intranet de mon école',
                descriptionLong:  'Cette extension Chrome/Firefox améliore l\'intranet de mon école en ajoutant des fonctionnalités telles que l\'affichage de nos grades',
                startedAt:        new Date('2026-02-25'),
                statusId:         statusDict['Actif'],
                mainProjectMediaId: mediaDict['MyEpiPlus Website'],
                githubUrl:        'https://github.com/Ilan-LP/MyEpiPlus',
                liveUrl:          'https://chromewebstore.google.com/detail/phamedghehobpnbhpemgpbophoojaeio',
                enabled:          true,
            },
            {
                title :            'Portfolio',
                descriptionShort: 'Mon portfolio personnel pour présenter mes projets, expériences et compétences',
                descriptionLong:  'Ce portfolio est construit avec une architecture backend en Node.js et Prisma, exposant une API REST pour alimenter un frontend React. Il met en valeur mes projets, expériences professionnelles, compétences techniques et réalisations académiques',
                startedAt:        new Date('2025-02-22'),
                statusId:         statusDict['En Progression'],
                mainProjectMediaId: mediaDict['Portfolio Home'],
                githubUrl:         'https://github.com/Ilan-LP/Portfolio',
                liveUrl:           'https://ilanlp.nexus-i.fr',
                enabled:           true,
            },
            {
                title:            'Hack & Juice',
                descriptionShort: 'Un projet de hackathon sur la célèbre plateforme Juice Shop de OWASP, visant à identifier et exploiter des vulnérabilités de sécurité dans une application e-commerce délibérément vulnérable',
                descriptionLong:  'Lors d\'un hackathon de 2 semaines, j\'ai travaillé en équipe pour identifier et exploiter des vulnérabilités de sécurité dans OWASP Juice Shop, une application e-commerce délibérément vulnérable. Nous avons utilisé des outils comme Burp Suite et des techniques de pentesting pour trouver des failles telles que l\'injection SQL, le cross-site scripting (XSS) et les failles d\'authentification, démontrant ainsi l\'importance de la sécurité dans le développement web moderne',
                startedAt:        new Date('2025-05-12'),
                endAt:            new Date('2025-12-19'),
                statusId:         statusDict['Terminé'],
                mainProjectMediaId: mediaDict['Juice Shop Home'],
                liveUrl:          'https://owasp.org/www-project-juice-shop/',
                enabled:          true,
            },
            {
                title:            'Carbon Alert',
                descriptionShort: 'Un site web développé dans le cadre d\'un Hackathon de 4 jours organisé par Epitech en collaboration avec The Shifter, visant à facilé l\'accés à des données de mobilité durable organisées par les communes de France',
                descriptionLong:  'Dans le cadre d\'un Hackathon de 4 jours organisé par Epitech en collaboration avec The Shifter, j\'ai développé un site web appelé Carbon Alert pour faciliter l\'accès à des données de mobilité durable organisées par les communes de France. Le projet visait à sensibiliser les utilisateurs à l\'empreinte carbone de leurs déplacements et à promouvoir des alternatives plus écologiques. Nous avons utilisé des API publiques pour collecter des données sur les transports en commun, les pistes cyclables et les émissions de CO2, offrant ainsi une interface conviviale pour aider les utilisateurs à prendre des décisions de mobilité plus durables',
                startedAt:        new Date('2026-01-19'),
                endAt:            new Date('2026-01-22'),
                statusId:         statusDict['Archivé'],
                mainProjectMediaId: mediaDict['Carbon Alert Home'],
                enabled:          true,
            },
            {
                title:           'IdentiQ',
                descriptionShort: 'IdentiQ est un  réseau social imaginé dans le cadre d\'un projet Epitech ou l\'on devait concevoir la maquette fonctionnelle d\'une application innovante. IdentiQ vise à connecter les individus de manère anonyme en garantissant la confidentialité et la sécurité des données personnelles',
                descriptionLong:  'IdentiQ est un réseau social imaginé dans le cadre d\'un projet Epitech où nous devions concevoir la maquette fonctionnelle d\'une application innovante. IdentiQ vise à connecter les individus de manière anonyme en garantissant la confidentialité et la sécurité des données personnelles. L\'application permet aux utilisateurs de partager des pensées, des idées et des expériences sans révéler leur identité, favorisant ainsi une communication plus authentique et ouverte. Nous avons utilisé des techniques de cryptographie pour assurer l\'anonymat et la sécurité des données, tout en créant une interface utilisateur intuitive pour encourager l\'engagement et les interactions au sein de la communauté',
                startedAt:        new Date('2026-01-11'),
                endAt:            new Date('2026-01-30'),
                statusId:         statusDict['Abandonné'],
                enabled:          true,
            }
        ],
    });
    const projectDict: Record<string, number> = Object.fromEntries(projects.map(p => [p.title, p.id]));
    console.log(`✅ Created ${projects.length} projects`);

    // ─── Project relations ────────────────────────────────────────────────────
    await prisma.projectMedia.createMany({
        data: [
            { projectId: projectDict['MyEpiPlus'], mediaId: mediaDict['MyEpiPlus Website'] },
            { projectId: projectDict['MyEpiPlus'], mediaId: mediaDict['MyEpiPlus Popup'] },
            { projectId: projectDict['MyEpiPlus'], mediaId: mediaDict['MyEpiPlus Full'] },
            { projectId: projectDict['Portfolio'], mediaId: mediaDict['Portfolio Home'] },
            { projectId: projectDict['Hack & Juice'], mediaId: mediaDict['Juice Shop Home'] },
            { projectId: projectDict['Carbon Alert'], mediaId: mediaDict['Carbon Alert Home'] },
        ],
    });

    await prisma.projectTechStack.createMany({
        data: [
            { projectId: projectDict['MyEpiPlus'], techStackId: techDict['JavaScript'] },
            { projectId: projectDict['Portfolio'], techStackId: techDict['React'] },
            { projectId: projectDict['Portfolio'], techStackId: techDict['Node.js'] },
            { projectId: projectDict['Portfolio'], techStackId: techDict['Prisma'] },
            { projectId: projectDict['Portfolio'], techStackId: techDict['Express'] },
            { projectId: projectDict['Portfolio'], techStackId: techDict['Docker'] },
            { projectId: projectDict['Portfolio'], techStackId: techDict['Git'] },
            { projectId: projectDict['Hack & Juice'], techStackId: techDict['Postman'] },
            { projectId: projectDict['Hack & Juice'], techStackId: techDict['Git'] },
            { projectId: projectDict['Carbon Alert'], techStackId: techDict['React'] },
            { projectId: projectDict['Carbon Alert'], techStackId: techDict['Node.js'] },
            { projectId: projectDict['Carbon Alert'], techStackId: techDict['Express'] },
            { projectId: projectDict['Carbon Alert'], techStackId: techDict['Git'] },
            { projectId: projectDict['IdentiQ'], techStackId: techDict['Docker'] },
            { projectId: projectDict['IdentiQ'], techStackId: techDict['Git'] },
            { projectId: projectDict['IdentiQ'], techStackId: techDict['Node.js'] },
            { projectId: projectDict['IdentiQ'], techStackId: techDict['Express'] },
            { projectId: projectDict['IdentiQ'], techStackId: techDict['Prisma'] },
            { projectId: projectDict['IdentiQ'], techStackId: techDict['React'] },

        ],
    });

    await prisma.projectSkill.createMany({
        data: [
            { projectId: projectDict['MyEpiPlus'], skillId: skillDict['Conception d\'API REST'] },
            { projectId: projectDict['MyEpiPlus'], skillId: skillDict['Résolution de problèmes'] },
            { projectId: projectDict['Portfolio'], skillId: skillDict['Conception d\'API REST'] },
            { projectId: projectDict['Hack & Juice'], skillId: skillDict['Résolution de problèmes'] },
            { projectId: projectDict['Hack & Juice'], skillId: skillDict['Communication d\'équipe'] },
            { projectId: projectDict['Carbon Alert'], skillId: skillDict['Résolution de problèmes'] },
            { projectId: projectDict['Carbon Alert'], skillId: skillDict['Communication d\'équipe'] },
            { projectId: projectDict['IdentiQ'], skillId: skillDict['Résolution de problèmes'] },
            { projectId: projectDict['IdentiQ'], skillId: skillDict['Communication d\'équipe'] },
        ],
    });
    console.log(`✅ Created project relations (media, tech stacks, skills)`);

    // ─── Experiences ──────────────────────────────────────────────────────────
    const experiences = await prisma.experience.createManyAndReturn({
        data: [
            {
                title:            'Stage Découverte 3ème',
                descriptionShort: 'Découverte du monde professionnel',
                descriptionLong:  'Stage de découverte de 1 semaine dans une entreprise locale, où j\'ai pu observer différents métiers et comprendre le fonctionnement d\'une organisation professionnelle',
                startedAt:        new Date('2022-02-06'),
                endAt:            new Date('2022-06-06'),
                companyId:        companyDict['IFPEN'],
                statusId:         statusDict['Terminé'],
                jobTypeId:        jobTypeDict['Stage'],
                mainExperienceMediaId: mediaDict['Logo IFPEN'],
                enabled:          true,
            },
            {
                title:            'Stage Découverte seconde',
                descriptionShort: 'Découverte du développement en entreprise',
                descriptionLong:  'Stage de découverte de 2 semaines dans une entreprise de services numériques, où j\'ai pu assister à des réunions d\'équipe, observer le processus de développement logiciel',
                startedAt:        new Date('2023-02-06'),
                endAt:            new Date('2023-06-14'),
                companyId:        companyDict['Akuiteo'],
                statusId:         statusDict['Terminé'],
                jobTypeId:        jobTypeDict['Stage'],
                mainExperienceMediaId: mediaDict['Logo Akuiteo'],
                enabled:          true,
            },
            {
                title:            'Vendeur en boulangerie',
                descriptionShort: 'Vente et service client dans une boulangerie locale',
                descriptionLong:  'En tant que vendeur en boulangerie, j\'étais responsable de l\'accueil des clients, de la prise de commandes, du service et de la gestion de la caisse. Cette expérience m\'a permis de développer mes compétences en communication, en gestion du temps et en travail d\'équipe dans un environnement dynamique',
                startedAt:        new Date('2025-10-15'),
                companyId:        companyDict['Pave D\'Ozon'],
                statusId:         statusDict['En cours'],
                jobTypeId:        jobTypeDict['Temps partiel'],
                mainExperienceMediaId: mediaDict['Logo Berlioz'],
                enabled:          true,
            },
            {
                title:            'Développeur Web Freelance',
                descriptionShort: 'Développement de sites web pour des clients',
                descriptionLong:  'En tant que développeur web freelance, j\'ai travaillé avec plusieurs clients pour créer des sites web personnalisés répondant à leurs besoins spécifiques. J\'étais responsable de la conception, du développement et du déploiement de ces sites, en utilisant des technologies telles que React, Node.js et Prisma. Cette expérience m\'a permis de développer mes compétences techniques tout en gérant les relations clients et les délais de projet',
                startedAt:        new Date('2026-01-14'),
                companyId:        companyDict['Nexus-I'],
                statusId:         statusDict['En Progression'],
                jobTypeId:        jobTypeDict['Freelance'],
                enabled:          true,
            }
        ],
    });
    const expDict: Record<string, number> = Object.fromEntries(experiences.map(e => [e.title, e.id]));
    console.log(`✅ Created ${experiences.length} experiences`);

    // ─── Experience relations ─────────────────────────────────────────────────
    await prisma.experienceMedia.createMany({
        data: [
            { experienceId: expDict['Stage Découverte 3ème'], mediaId: mediaDict['Logo IFPEN'] },
            { experienceId: expDict['Stage Découverte seconde'], mediaId: mediaDict['Logo Akuiteo'] },
            { experienceId: expDict['Vendeur en boulangerie'], mediaId: mediaDict['Logo Berlioz'] },
        ],
    });

    await prisma.experienceTechStack.createMany({
        data: [
            { experienceId: expDict['Stage Découverte seconde'], techStackId: techDict['Git'] },
            { experienceId: expDict['Développeur Web Freelance'], techStackId: techDict['React'] },
            { experienceId: expDict['Développeur Web Freelance'], techStackId: techDict['Node.js'] },
            { experienceId: expDict['Développeur Web Freelance'], techStackId: techDict['Prisma'] },
            { experienceId: expDict['Développeur Web Freelance'], techStackId: techDict['Express'] },
            { experienceId: expDict['Développeur Web Freelance'], techStackId: techDict['Docker'] },
            { experienceId: expDict['Développeur Web Freelance'], techStackId: techDict['Git'] },
            { experienceId: expDict['Développeur Web Freelance'], techStackId: techDict['TypeScript'] },
        ],
    });

    await prisma.experienceSkill.createMany({
        data: [
            { experienceId: expDict['Stage Découverte 3ème'], skillId: skillDict['Communication d\'équipe'] },
            { experienceId: expDict['Stage Découverte seconde'], skillId: skillDict['Communication d\'équipe'] },
            { experienceId: expDict['Vendeur en boulangerie'], skillId: skillDict['Communication d\'équipe'] },
            { experienceId: expDict['Vendeur en boulangerie'], skillId: skillDict['Relations clients'] },
            { experienceId: expDict['Développeur Web Freelance'], skillId: skillDict['Résolution de problèmes'] },
            { experienceId: expDict['Développeur Web Freelance'], skillId: skillDict['Communication d\'équipe'] },
        ],
    });
    console.log(`✅ Created experience relations (media, tech stacks, skills)`);

    // ─── Educations ───────────────────────────────────────────────────────────
    const educations = await prisma.education.createManyAndReturn({
        data: [
            {
                title:            'Baccalauréat',
                descriptionShort: 'Baccalauréat Maths/NSI obtenu avec mention assez bien',
                descriptionLong:  'Diplômé avec mention assez bien du lycée Bellevue Assomption Lyon, avec les spécialités Mathématiques et Numérique et Sciences Informatiques (NSI). J\'ai acquis de solides compétences en mathématiques, en algorithmie et en programmation, ce qui m\'a préparé pour mes études supérieures en informatique',
                startedAt:        new Date('2022-09-01'),
                endAt:            new Date('2025-06-30'),
                statusId:         statusDict['Terminé'],
                schoolId:         schoolDict['Bellevue Assomption Lyon'],
                degreeId:         degreeDict['Baccalauréat'],
                mainEducationMediaId: mediaDict['Bellevue Logo'],
                enabled:          true,
            },
            {
                title:            'Bachelor Informatique',
                descriptionShort: 'Programme de 3 ans en informatique à Epitech',
                descriptionLong:  'Bachelor en 3 ans à Epitech, couvrant l\'ensemble des fondamentaux de l\'informatique, la première année étant axée sur le développement web, puis spécialisation en IA. J\'ai travaillé sur de nombreux projets pratiques, renforçant mes compétences en développement logiciel, en gestion de projet et en travail d\'équipe',
                startedAt:        new Date('2025-09-15'),
                endAt:            new Date('2028-06-30'),
                statusId:         statusDict['En Progression'],
                schoolId:         schoolDict['Epitech'],
                degreeId:         degreeDict['Bachelor'],
                mainEducationMediaId: mediaDict['Epitech Logo'],
                enabled:          true,
            },
        ],
    });
    const eduDict: Record<string, number> = Object.fromEntries(educations.map(e => [e.title, e.id]));
    console.log(`✅ Created ${educations.length} educations`);

    // ─── Education relations ──────────────────────────────────────────────────
    await prisma.educationMedia.createMany({
        data: [
            { educationId: eduDict['Baccalauréat'], mediaId: mediaDict['Bellevue Logo'] },
            { educationId: eduDict['Bachelor Informatique'], mediaId: mediaDict['Epitech Logo'] },
        ],
    });

    await prisma.educationTechStack.createMany({
        data: [
            { educationId: eduDict['Bachelor Informatique'], techStackId: techDict['Git'] },
            { educationId: eduDict['Bachelor Informatique'], techStackId: techDict['Docker'] },
            { educationId: eduDict['Bachelor Informatique'], techStackId: techDict['Node.js'] },
            { educationId: eduDict['Bachelor Informatique'], techStackId: techDict['React'] },
            { educationId: eduDict['Bachelor Informatique'], techStackId: techDict['Prisma'] },
            { educationId: eduDict['Bachelor Informatique'], techStackId: techDict['Express'] },
            { educationId: eduDict['Bachelor Informatique'], techStackId: techDict['PostgreSQL'] },
            { educationId: eduDict['Bachelor Informatique'], techStackId: techDict['Tailwind CSS'] },
            { educationId: eduDict['Bachelor Informatique'], techStackId: techDict['Vite'] },
            { educationId: eduDict['Bachelor Informatique'], techStackId: techDict['TypeScript'] },
            { educationId: eduDict['Bachelor Informatique'], techStackId: techDict['JavaScript'] },
            { educationId: eduDict['Bachelor Informatique'], techStackId: techDict['Postman'] },
        ],
    });

    await prisma.educationSkill.createMany({
        data: [
            { educationId: eduDict['Baccalauréat'], skillId: skillDict['Résolution de problèmes'] },
            { educationId: eduDict['Baccalauréat'], skillId: skillDict['Communication d\'équipe'] },
            { educationId: eduDict['Baccalauréat'], skillId: skillDict['Gestion d\'équipe'] },
            { educationId: eduDict['Bachelor Informatique'], skillId: skillDict['Résolution de problèmes'] },
            { educationId: eduDict['Bachelor Informatique'], skillId: skillDict['Conception d\'API REST'] },
            { educationId: eduDict['Bachelor Informatique'], skillId: skillDict['Modélisation de BDD'] },
            { educationId: eduDict['Bachelor Informatique'], skillId: skillDict['Communication d\'équipe'] },
            { educationId: eduDict['Bachelor Informatique'], skillId: skillDict['Gestion d\'équipe'] },
            { educationId: eduDict['Bachelor Informatique'], skillId: skillDict['Agile'] },
            { educationId: eduDict['Bachelor Informatique'], skillId: skillDict['Design UI/UX'] },
        ],
    });
    console.log(`✅ Created education relations (media, tech stacks, skills)`);

    // ─── News ─────────────────────────────────────────────────────────────────
    const newsItems = await prisma.news.createManyAndReturn({
        data: [
            {
                title: 'Mise à jour de MyEpiPlus',
                descriptionShort: 'Nouvelle version disponible avec des améliorations de performance',
                descriptionLong: 'La nouvelle version de MyEpiPlus est maintenant disponible avec des corrections de bugs et des améliorations de performance. Téléchargez la dernière version pour une expérience encore meilleure !',
                publishedAt: new Date('2026-02-28'),
                enabled: true,
            },
        ],
    });
    const newsDict: Record<string, number> = Object.fromEntries(newsItems.map(n => [n.title, n.id]));
    console.log(`✅ Created ${newsItems.length} news items`);

    // ─── News relations ───────────────────────────────────────────────────────
    await prisma.newsMedia.createMany({
        data: [
            { newsId: newsDict['Mise à jour de MyEpiPlus'], mediaId: mediaDict['MyEpiPlus Website'] },
        ],
    });
    console.log(`✅ Created news media relations`);

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