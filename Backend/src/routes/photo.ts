import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

router.get('/photo', (_req: Request, res: Response) => {
    const filePath = path.join(process.cwd(), 'uploads', 'pp.png');
    if (!fs.existsSync(filePath)) {
        res.status(404).json({ error: 'Photo not found' });
        return;
    }
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.sendFile(filePath);
});

export default router;
