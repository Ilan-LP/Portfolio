import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

router.get('/learning-journey', async (_req: Request, res: Response) => {
    try {
        const entries = await prisma.learningJourneyEntry.findMany({
            orderBy: { order: 'asc' },
            include: {
                journeyProjects: {
                    select: {
                        project: { select: { id: true, title: true } },
                    },
                },
            },
        });

        if (entries.length === 0) {
            return res.status(404).json({ error: 'No learning journey entries found' });
        }

        const mapped = entries.map(({ journeyProjects, ...entry }) => ({
            ...entry,
            projects: journeyProjects.map((jp) => jp.project),
        }));

        res.json(mapped);
    } catch (error) {
        console.error('Error fetching learning journey:', error);
        res.status(500).json({ error: 'Failed to fetch learning journey' });
    }
});

export default router;
