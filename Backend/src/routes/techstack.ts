import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

/**
 * @openapi
 * /tech-stacks:
 *   get:
 *     tags: [TechStacks]
 *     summary: Get all tech stacks
 *     description: Returns a list of all tech stacks ordered alphabetically.
 *     responses:
 *       200:
 *         description: List of tech stacks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TechStack'
 *       404:
 *         description: No tech stacks found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

        if (!techStacks || techStacks.length === 0) {
            return res.status(404).json({ error: 'No tech stacks found' });
        }

        res.json(techStacks);
    } catch (error) {
        console.error('Error fetching tech stacks:', error);
        res.status(500).json({ error: 'Failed to fetch tech stacks' });
    }
});

/**
 * @openapi
 * /tech-stacks/{id}:
 *   get:
 *     tags: [TechStacks]
 *     summary: Get a tech stack by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: TechStack detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TechStackDetail'
 *       404:
 *         description: Tech stack not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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
