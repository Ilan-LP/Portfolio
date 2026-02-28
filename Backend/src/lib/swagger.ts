import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';

const isCompiled = __filename.endsWith('.js');
const routesGlob = isCompiled
    ? path.join(__dirname, '../routes/*.js')
    : path.join(__dirname, '../routes/*.ts');

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: "Ilan LP's Portfolio API",
            version: '1.0.0',
            description: 'REST API for the portfolio of Ilan LP',
        },
        servers: [
            { url: '/api', description: 'API base path' },
        ],
        components: {
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        error: { type: 'string', example: 'Resource not found' },
                    },
                },
                HealthResponse: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'ok' },
                        db: { type: 'string', example: 'connected' },
                        uptime: { type: 'number', example: 123.45 },
                    },
                },
                Media: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        url: { type: 'string' },
                        altText: { type: 'string' },
                        type: { type: 'string', enum: ['IMAGE', 'VIDEO', 'DOCUMENT'] },
                    },
                },
                StatusRef: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                    },
                },
                // Project
                ProjectSummary: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        title: { type: 'string' },
                        descriptionShort: { type: 'string' },
                        startedAt: { type: 'string', format: 'date-time' },
                        endAt: { type: 'string', format: 'date-time', nullable: true },
                        githubUrl: { type: 'string', nullable: true },
                        liveUrl: { type: 'string', nullable: true },
                        status: { $ref: '#/components/schemas/StatusRef' },
                        mainMedia: { $ref: '#/components/schemas/Media', nullable: true },
                    },
                },
                ProjectDetail: {
                    allOf: [
                        { $ref: '#/components/schemas/ProjectSummary' },
                        {
                            type: 'object',
                            properties: {
                                descriptionLong: { type: 'string' },
                                projectMedias: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            media: { $ref: '#/components/schemas/Media' },
                                        },
                                    },
                                },
                                projectTechStacks: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            techStack: { $ref: '#/components/schemas/TechStackSummary' },
                                        },
                                    },
                                },
                                projectSkills: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            skill: { $ref: '#/components/schemas/SkillSummary' },
                                        },
                                    },
                                },
                            },
                        },
                    ],
                },
                // Experience
                ExperienceSummary: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        title: { type: 'string' },
                        descriptionShort: { type: 'string' },
                        startedAt: { type: 'string', format: 'date-time' },
                        endAt: { type: 'string', format: 'date-time', nullable: true },
                        company: {
                            type: 'object',
                            properties: {
                                id: { type: 'integer' },
                                name: { type: 'string' },
                                websiteUrl: { type: 'string' },
                            },
                        },
                        jobType: { $ref: '#/components/schemas/StatusRef' },
                        status: { $ref: '#/components/schemas/StatusRef' },
                        mainMedia: { $ref: '#/components/schemas/Media', nullable: true },
                    },
                },
                ExperienceDetail: {
                    allOf: [
                        { $ref: '#/components/schemas/ExperienceSummary' },
                        {
                            type: 'object',
                            properties: {
                                descriptionLong: { type: 'string' },
                                company: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'integer' },
                                        name: { type: 'string' },
                                        description: { type: 'string' },
                                        websiteUrl: { type: 'string' },
                                    },
                                },
                                experienceMedias: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            media: { $ref: '#/components/schemas/Media' },
                                        },
                                    },
                                },
                                experienceTechStacks: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            techStack: { $ref: '#/components/schemas/TechStackSummary' },
                                        },
                                    },
                                },
                                experienceSkills: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            skill: { $ref: '#/components/schemas/SkillSummary' },
                                        },
                                    },
                                },
                            },
                        },
                    ],
                },
                // Education
                EducationSummary: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        title: { type: 'string' },
                        descriptionShort: { type: 'string' },
                        startedAt: { type: 'string', format: 'date-time' },
                        endAt: { type: 'string', format: 'date-time', nullable: true },
                        school: {
                            type: 'object',
                            properties: {
                                id: { type: 'integer' },
                                name: { type: 'string' },
                                websiteUrl: { type: 'string' },
                            },
                        },
                        degree: { $ref: '#/components/schemas/StatusRef' },
                        status: { $ref: '#/components/schemas/StatusRef' },
                        mainMedia: { $ref: '#/components/schemas/Media', nullable: true },
                    },
                },
                EducationDetail: {
                    allOf: [
                        { $ref: '#/components/schemas/EducationSummary' },
                        {
                            type: 'object',
                            properties: {
                                descriptionLong: { type: 'string' },
                                school: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'integer' },
                                        name: { type: 'string' },
                                        description: { type: 'string' },
                                        websiteUrl: { type: 'string' },
                                    },
                                },
                                degree: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'integer' },
                                        name: { type: 'string' },
                                        description: { type: 'string' },
                                    },
                                },
                                educationMedias: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            media: { $ref: '#/components/schemas/Media' },
                                        },
                                    },
                                },
                                educationTechStacks: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            techStack: { $ref: '#/components/schemas/TechStackSummary' },
                                        },
                                    },
                                },
                                educationSkills: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            skill: { $ref: '#/components/schemas/SkillSummary' },
                                        },
                                    },
                                },
                            },
                        },
                    ],
                },
                // News
                NewsSummary: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        title: { type: 'string' },
                        descriptionShort: { type: 'string' },
                        publishedAt: { type: 'string', format: 'date-time' },
                        mainMedia: { $ref: '#/components/schemas/Media', nullable: true },
                    },
                },
                NewsDetail: {
                    allOf: [
                        { $ref: '#/components/schemas/NewsSummary' },
                        {
                            type: 'object',
                            properties: {
                                descriptionLong: { type: 'string' },
                                status: { $ref: '#/components/schemas/StatusRef', nullable: true },
                                newsMedias: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            media: { $ref: '#/components/schemas/Media' },
                                        },
                                    },
                                },
                            },
                        },
                    ],
                },
                // Skill
                SkillSummary: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                        iconUrl: { type: 'string' },
                        color: { type: 'string' },
                    },
                },
                Skill: {
                    allOf: [
                        { $ref: '#/components/schemas/SkillSummary' },
                        {
                            type: 'object',
                            properties: {
                                description: { type: 'string' },
                                category: { $ref: '#/components/schemas/StatusRef' },
                                level: { $ref: '#/components/schemas/StatusRef' },
                            },
                        },
                    ],
                },
                SkillDetail: {
                    allOf: [
                        { $ref: '#/components/schemas/SkillSummary' },
                        {
                            type: 'object',
                            properties: {
                                description: { type: 'string' },
                                category: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'integer' },
                                        name: { type: 'string' },
                                        description: { type: 'string' },
                                    },
                                },
                                level: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'integer' },
                                        name: { type: 'string' },
                                        description: { type: 'string' },
                                    },
                                },
                            },
                        },
                    ],
                },
                // TechStack
                TechStackSummary: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                        iconUrl: { type: 'string' },
                        color: { type: 'string' },
                    },
                },
                TechStack: {
                    allOf: [
                        { $ref: '#/components/schemas/TechStackSummary' },
                        {
                            type: 'object',
                            properties: {
                                category: { $ref: '#/components/schemas/StatusRef' },
                            },
                        },
                    ],
                },
                TechStackDetail: {
                    allOf: [
                        { $ref: '#/components/schemas/TechStackSummary' },
                        {
                            type: 'object',
                            properties: {
                                category: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'integer' },
                                        name: { type: 'string' },
                                        description: { type: 'string' },
                                    },
                                },
                            },
                        },
                    ],
                },
            },
        },
    },
    apis: [routesGlob],
};

export const swaggerSpec = swaggerJsdoc(options);
