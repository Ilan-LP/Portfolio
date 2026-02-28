import { api } from './client.ts';
import type {
    ProjectSummary,
    ProjectDetail,
    EducationSummary,
    EducationDetail,
    ExperienceSummary,
    ExperienceDetail,
    NewsSummary,
    NewsDetail,
    Skill,
    TechStack,
    HealthResponse,
} from '@/types';

// ── System ──
export const getHealth = () => api.get<HealthResponse>('/health');

// ── Projects ──
export const getProjects = () => api.get<ProjectSummary[]>('/projects');
export const getProject = (id: number) => api.get<ProjectDetail>(`/projects/${id}`);

// ── Education ──
export const getEducations = () => api.get<EducationSummary[]>('/education');
export const getEducation = (id: number) => api.get<EducationDetail>(`/education/${id}`);

// ── Experiences ──
export const getExperiences = () => api.get<ExperienceSummary[]>('/experiences');
export const getExperience = (id: number) => api.get<ExperienceDetail>(`/experiences/${id}`);

// ── News ──
export const getNewsList = () => api.get<NewsSummary[]>('/news');
export const getNewsItem = (id: number) => api.get<NewsDetail>(`/news/${id}`);

// ── Skills ──
export const getSkills = () => api.get<Skill[]>('/skills');
export const getSkill = (id: number) => api.get<Skill>(`/skills/${id}`);

// ── Tech Stack ──
export const getTechStacks = () => api.get<TechStack[]>('/tech-stacks');
export const getTechStack = (id: number) => api.get<TechStack>(`/tech-stacks/${id}`);
