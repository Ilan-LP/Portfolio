import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

router.get('/projects', async (_req: Request, res: Response) => {
    try {
        const projects = await prisma.project.findMany({
            select: {
                id: true,
                title: true,
                descriptionShort: true,
                startedAt: true,
                endAt: true,
                githubUrl: true,
                liveUrl: true,
                status: { select: { id: true, name: true } },
                mainMedia: {
                    select: {
                        id: true,
                        url: true,
                        altText: true,
                        type: true,
                    },
                },
            },
            where: { enabled: true },
            orderBy: { startedAt: 'desc' },
        });
        if (projects.length === 0) {
            return res.status(404).json({ error: 'No projects found' });
        }

        res.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

router.get('/projects/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const project = await prisma.project.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                title: true,
                descriptionShort: true,
                descriptionLong: true,
                startedAt: true,
                endAt: true,
                githubUrl: true,
                liveUrl: true,
                status: { select: { id: true, name: true } },
                mainMedia: {
                    select: {
                        id: true,
                        url: true,
                        altText: true,
                        type: true,
                    },
                },
                projectMedias: {
                    select: {
                        media: {
                            select: {
                                id: true,
                                url: true,
                                altText: true,
                                type: true,
                            },
                        },
                    },
                },
                projectTechStacks: {
                    select: {
                        techStack: { select: { id: true, name: true, iconUrl: true, color: true } },
                    },
                },
                projectSkills: {
                    select: {
                        skill: { select: { id: true, name: true, iconUrl: true, color: true } },
                    },
                },
            },
        });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json(project);
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ error: 'Failed to fetch project' });
    }
});

export default router;
