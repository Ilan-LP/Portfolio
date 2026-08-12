import express, { Request, Response } from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './lib/swagger';
import apiRouter from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Required for correct client IP / secure cookie handling behind nginx + Caddy.
app.set('trust proxy', 1);

app.use(helmet());
app.use(compression());
app.use(
    cors({
        // In production, CORS_ORIGIN must be set explicitly (no wildcard
        // fallback). If it's missing, cross-origin requests are blocked
        // rather than silently allowed from anywhere.
        origin: isProduction ? (process.env.CORS_ORIGIN ?? false) : process.env.CORS_ORIGIN || '*',
        credentials: true,
    })
);
app.use(express.json({ limit: '250kb' }));
app.use(express.urlencoded({ extended: true, limit: '250kb' }));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// General API rate limit, on top of the stricter one on /contact.
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
});

app.get('/', (_req: Request, res: Response) => {
    res.json({
        message: "Welcome to Ilan LP's portfolio API",
        version: '1.0.0',
        endpoints: { api: '/api', docs: '/api-docs', json: '/api-docs.json' },
    });
});

app.use('/api', apiLimiter, apiRouter);

// Swagger UI exposes the full API surface; keep it out of production.
if (!isProduction) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get('/api-docs.json', (_req, res) => { res.json(swaggerSpec); });
}

app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.info(`Server started on port ${PORT}`);
});
