import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

router.get('/about/philosophy', async (_req: Request, res: Response) => {
    try {
        const points = await prisma.philosophyPoint.findMany({
            where: { enabled: true },
            orderBy: { order: 'asc' },
        });

        if (points.length === 0) {
            return res.status(404).json({ error: 'No philosophy points found' });
        }

        res.json(points);
    } catch (error) {
        console.error('Error fetching philosophy points:', error);
        res.status(500).json({ error: 'Failed to fetch philosophy points' });
    }
});

router.get('/about/hobbies', async (_req: Request, res: Response) => {
    try {
        const hobbies = await prisma.hobby.findMany({
            where: { enabled: true },
            orderBy: { order: 'asc' },
        });

        if (hobbies.length === 0) {
            return res.status(404).json({ error: 'No hobbies found' });
        }

        res.json(hobbies);
    } catch (error) {
        console.error('Error fetching hobbies:', error);
        res.status(500).json({ error: 'Failed to fetch hobbies' });
    }
});

export default router;
