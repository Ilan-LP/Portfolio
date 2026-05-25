import { Router, Request, Response } from 'express';
import systemRouter from './system';
import projectRouter from './project';
import educationRouter from './education';
import experienceRouter from './experience';
import githubRouter from './github';
import skillRouter from './skill';
import techStackRouter from './techstack';
import contactRouter from './contact';
import photoRouter from './photo';
import cvRouter from './cv';
import journeyRouter from './journey';
import aboutRouter from './about';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
    res.json({
        message: "Ilan LP's portfolio API",
        endpoints: {
            '/health': 'Check the health of the API',
            '/projects': 'List all projects',
            '/projects/:id': 'Get a project by ID',
            '/education': 'List all education entries',
            '/education/:id': 'Get an education entry by ID',
            '/experiences': 'List all experiences',
            '/experiences/:id': 'Get an experience by ID',
            '/github/repos': 'List public GitHub repositories',
            '/skills': 'List all skills',
            '/skills/:id': 'Get a skill by ID',
            '/tech-stacks': 'List all tech stacks',
            '/tech-stacks/:id': 'Get a tech stack by ID',
            '/contact': 'Send a contact email (POST)',
        },
    });
});

router.use('/', systemRouter);
router.use('/', projectRouter);
router.use('/', educationRouter);
router.use('/', experienceRouter);
router.use('/', githubRouter);
router.use('/', skillRouter);
router.use('/', techStackRouter);
router.use('/', contactRouter);
router.use('/', photoRouter);
router.use('/', cvRouter);
router.use('/', journeyRouter);
router.use('/', aboutRouter);

export default router;

