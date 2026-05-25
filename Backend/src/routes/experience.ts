import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

router.get('/experiences', async (_req: Request, res: Response) => {
    try {
        const experiences = await prisma.experience.findMany({
            select: {
                id: true,
                title: true,
                descriptionShort: true,
                startedAt: true,
                endAt: true,
                company: { select: { id: true, name: true, websiteUrl: true } },
                jobType: { select: { id: true, name: true } },
                status: { select: { id: true, name: true } },
                mainMedia: {
                    select: { id: true, url: true, altText: true, type: true },
                },
            },
            where: { enabled: true },
            orderBy: { startedAt: 'desc' },
        });

        if (experiences.length === 0) {
            return res.status(404).json({ error: 'No experiences found' });
        }

        res.json(experiences);
    } catch (error) {
        console.error('Error fetching experiences:', error);
        res.status(500).json({ error: 'Failed to fetch experiences' });
    }
});

router.get('/experiences/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const experience = await prisma.experience.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                title: true,
                descriptionShort: true,
                descriptionLong: true,
                startedAt: true,
                endAt: true,
                company: { select: { id: true, name: true, description: true, websiteUrl: true } },
                jobType: { select: { id: true, name: true } },
                status: { select: { id: true, name: true } },
                mainMedia: {
                    select: { id: true, url: true, altText: true, type: true },
                },
                experienceMedias: {
                    select: {
                        media: { select: { id: true, url: true, altText: true, type: true } },
                    },
                },
                experienceTechStacks: {
                    select: {
                        techStack: { select: { id: true, name: true, iconUrl: true, color: true } },
                    },
                },
                experienceSkills: {
                    select: {
                        skill: { select: { id: true, name: true, iconUrl: true, color: true } },
                    },
                },
            },
        });

        if (!experience) {
            return res.status(404).json({ error: 'Experience not found' });
        }

        res.json(experience);
    } catch (error) {
        console.error('Error fetching experience:', error);
        res.status(500).json({ error: 'Failed to fetch experience' });
    }
});

export default router;
