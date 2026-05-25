import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

router.get('/cv', (_req: Request, res: Response) => {
    const filePath = path.join(process.cwd(), 'uploads', 'cv.pdf');
    if (!fs.existsSync(filePath)) {
        res.status(404).json({ error: 'CV not found' });
        return;
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="cv-ilan-lp.pdf"');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.sendFile(filePath);
});

router.get('/cv/view', (_req: Request, res: Response) => {
    const filePath = path.join(process.cwd(), 'uploads', 'cv.pdf');
    if (!fs.existsSync(filePath)) {
        res.status(404).json({ error: 'CV not found' });
        return;
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.sendFile(filePath);
});

router.get('/cv-preview', (_req: Request, res: Response) => {
    const filePath = path.join(process.cwd(), 'uploads', 'cv-preview.jpg');
    if (!fs.existsSync(filePath)) {
        res.status(404).json({ error: 'CV preview not found' });
        return;
    }
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.sendFile(filePath);
});

export default router;
