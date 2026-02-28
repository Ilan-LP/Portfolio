import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

/**
 * @openapi
 * /news:
 *   get:
 *     tags: [News]
 *     summary: Get all news
 *     description: Returns a list of all enabled news items ordered by publication date descending.
 *     responses:
 *       200:
 *         description: List of news items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/NewsSummary'
 *       404:
 *         description: No news found
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
router.get('/news', async (_req: Request, res: Response) => {
    try {
        const news = await prisma.news.findMany({
            select: {
                id: true,
                title: true,
                descriptionShort: true,
                publishedAt: true,
                mainMedia: {
                    select: { id: true, url: true, altText: true, type: true },
                },
            },
            where: { enabled: true },
            orderBy: { publishedAt: 'desc' },
        });

        if (!news || news.length === 0) {
            return res.status(404).json({ error: 'No news found' });
        }

        res.json(news);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});

/**
 * @openapi
 * /news/{id}:
 *   get:
 *     tags: [News]
 *     summary: Get a news item by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: News detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NewsDetail'
 *       404:
 *         description: News not found
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
router.get('/news/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const item = await prisma.news.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                title: true,
                descriptionShort: true,
                descriptionLong: true,
                publishedAt: true,
                mainMedia: {
                    select: { id: true, url: true, altText: true, type: true },
                },
                newsMedias: {
                    select: {
                        media: { select: { id: true, url: true, altText: true, type: true } },
                    },
                },
            },
        });

        if (!item) {
            return res.status(404).json({ error: 'News not found' });
        }

        res.json(item);
    } catch (error) {
        console.error('Error fetching news item:', error);
        res.status(500).json({ error: 'Failed to fetch news item' });
    }
});

export default router;
