import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

router.get('/tech-stacks', async (_req: Request, res: Response) => {
    try {
        const techStacks = await prisma.techStack.findMany({
            select: {
                id: true,
                name: true,
                iconUrl: true,
                color: true,
                category: { select: { id: true, name: true } },
            },
            orderBy: { name: 'asc' },
        });

        if (techStacks.length === 0) {
            return res.status(404).json({ error: 'No tech stacks found' });
        }

        res.json(techStacks);
    } catch (error) {
        console.error('Error fetching tech stacks:', error);
        res.status(500).json({ error: 'Failed to fetch tech stacks' });
    }
});

router.get('/tech-stacks/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const techStack = await prisma.techStack.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                name: true,
                iconUrl: true,
                color: true,
                category: { select: { id: true, name: true, description: true } },
            },
        });

        if (!techStack) {
            return res.status(404).json({ error: 'Tech stack not found' });
        }

        res.json(techStack);
    } catch (error) {
        console.error('Error fetching tech stack:', error);
        res.status(500).json({ error: 'Failed to fetch tech stack' });
    }
});

export default router;
