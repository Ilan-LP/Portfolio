import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/index.ts';
import {
    Home,
    Projects,
    ProjectDetail,
    Skills,
    Experiences,
    ExperienceDetail,
    Education,
    EducationDetail,
    News,
    NewsDetail,
    Contact,
    NotFound,
} from '@/pages/index.ts';

export const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            { index: true, element: <Home /> },
            { path: 'projets', element: <Projects /> },
            { path: 'projets/:id', element: <ProjectDetail /> },
            { path: 'competences', element: <Skills /> },
            { path: 'experiences', element: <Experiences /> },
            { path: 'experiences/:id', element: <ExperienceDetail /> },
            { path: 'education', element: <Education /> },
            { path: 'education/:id', element: <EducationDetail /> },
            { path: 'actualites', element: <News /> },
            { path: 'actualites/:id', element: <NewsDetail /> },
            { path: 'contact', element: <Contact /> },
            { path: '*', element: <NotFound /> },
        ],
    },
]);
