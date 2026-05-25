import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

router.get('/skills', async (_req: Request, res: Response) => {
    try {
        const skills = await prisma.skill.findMany({
            select: {
                id: true,
                name: true,
                iconUrl: true,
                color: true,
                description: true,
                category: { select: { id: true, name: true } },
                level: { select: { id: true, name: true } },
            },
            orderBy: { name: 'asc' },
        });

        if (skills.length === 0) {
            return res.status(404).json({ error: 'No skills found' });
        }

        res.json(skills);
    } catch (error) {
        console.error('Error fetching skills:', error);
        res.status(500).json({ error: 'Failed to fetch skills' });
    }
});

router.get('/skills/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const skill = await prisma.skill.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                name: true,
                iconUrl: true,
                color: true,
                description: true,
                category: { select: { id: true, name: true, description: true } },
                level: { select: { id: true, name: true, description: true } },
            },
        });

        if (!skill) {
            return res.status(404).json({ error: 'Skill not found' });
        }

        res.json(skill);
    } catch (error) {
        console.error('Error fetching skill:', error);
        res.status(500).json({ error: 'Failed to fetch skill' });
    }
});

export default router;
