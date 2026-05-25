import { Router, Request, Response } from 'express';

const router = Router();

router.get('/github/repos', async (_req: Request, res: Response) => {
    try {
        const response = await fetch(
            'https://api.github.com/users/Ilan-LP/repos?sort=updated&per_page=20&type=public',
            { headers: { 'User-Agent': 'portfolio-backend' } },
        );

        if (!response.ok) {
            return res.status(502).json({ error: 'Failed to fetch GitHub repositories' });
        }

        const repos = (await response.json()) as Array<Record<string, unknown>>;

        const filtered = repos.map((repo) => ({
            name: repo.name,
            description: (repo.description as string | null) ?? '',
            updated_at: repo.updated_at,
            language: repo.language,
            html_url: repo.html_url,
            stargazers_count: repo.stargazers_count,
        }));

        res.json(filtered);
    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        res.status(502).json({ error: 'Failed to fetch GitHub repositories' });
    }
});

export default router;
