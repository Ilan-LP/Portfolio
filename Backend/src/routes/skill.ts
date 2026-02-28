import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

/**
 * @openapi
 * /skills:
 *   get:
 *     tags: [Skills]
 *     summary: Get all skills
 *     description: Returns a list of all skills ordered alphabetically.
 *     responses:
 *       200:
 *         description: List of skills
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Skill'
 *       404:
 *         description: No skills found
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

        if (!skills || skills.length === 0) {
            return res.status(404).json({ error: 'No skills found' });
        }

        res.json(skills);
    } catch (error) {
        console.error('Error fetching skills:', error);
        res.status(500).json({ error: 'Failed to fetch skills' });
    }
});

/**
 * @openapi
 * /skills/{id}:
 *   get:
 *     tags: [Skills]
 *     summary: Get a skill by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Skill detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SkillDetail'
 *       404:
 *         description: Skill not found
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
