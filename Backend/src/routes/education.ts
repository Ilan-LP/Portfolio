import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

/**
 * @openapi
 * /education:
 *   get:
 *     tags: [Education]
 *     summary: Get all education entries
 *     description: Returns a list of all enabled education entries with summary information.
 *     responses:
 *       200:
 *         description: List of education entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EducationSummary'
 *       404:
 *         description: No education entries found
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
router.get('/education', async (_req: Request, res: Response) => {
    try {
        const education = await prisma.education.findMany({
            select: {
                id: true,
                title: true,
                descriptionShort: true,
                startedAt: true,
                endAt: true,
                school: { select: { id: true, name: true, websiteUrl: true } },
                degree: { select: { id: true, name: true } },
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
        if (!education || education.length === 0) {
            return res.status(404).json({ error: 'No education entries found' });
        }

        res.json(education);
    } catch (error) {
        console.error('Error fetching education entries:', error);
        res.status(500).json({ error: 'Failed to fetch education entries' });
    }
});

/**
 * @openapi
 * /education/{id}:
 *   get:
 *     tags: [Education]
 *     summary: Get an education entry by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Education detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EducationDetail'
 *       404:
 *         description: Education entry not found
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
router.get('/education/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const entry = await prisma.education.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                title: true,
                descriptionShort: true,
                descriptionLong: true,
                startedAt: true,
                endAt: true,
                school: { select: { id: true, name: true, description: true, websiteUrl: true } },
                degree: { select: { id: true, name: true, description: true } },
                status: { select: { id: true, name: true } },
                mainMedia: {
                    select: { id: true, url: true, altText: true, type: true },
                },
                educationMedias: {
                    select: {
                        media: { select: { id: true, url: true, altText: true, type: true } },
                    },
                },
                educationTechStacks: {
                    select: {
                        techStack: { select: { id: true, name: true, iconUrl: true, color: true } },
                    },
                },
                educationSkills: {
                    select: {
                        skill: { select: { id: true, name: true, iconUrl: true, color: true } },
                    },
                },
            },
        });

        if (!entry) {
            return res.status(404).json({ error: 'Education entry not found' });
        }

        res.json(entry);
    } catch (error) {
        console.error('Error fetching education entry:', error);
        res.status(500).json({ error: 'Failed to fetch education entry' });
    }
});

export default router;