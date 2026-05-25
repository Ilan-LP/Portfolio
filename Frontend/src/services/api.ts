import { api } from './client.ts';
import type {
    ProjectSummary,
    ProjectDetail,
    EducationSummary,
    EducationDetail,
    ExperienceSummary,
    ExperienceDetail,
    GithubRepo,
    Skill,
    TechStack,
    HealthResponse,
    LearningJourneyEntry,
    PhilosophyPoint,
    Hobby,
} from '@/types';

export const getHealth = () => api.get<HealthResponse>('/health');

export const getProjects = () => api.get<ProjectSummary[]>('/projects');
export const getProject = (id: number) => api.get<ProjectDetail>(`/projects/${id}`);

export const getEducations = () => api.get<EducationSummary[]>('/education');
export const getEducation = (id: number) => api.get<EducationDetail>(`/education/${id}`);

export const getExperiences = () => api.get<ExperienceSummary[]>('/experiences');
export const getExperience = (id: number) => api.get<ExperienceDetail>(`/experiences/${id}`);

export const getGithubRepos = () => api.get<GithubRepo[]>('/github/repos');

export const getSkills = () => api.get<Skill[]>('/skills');
export const getSkill = (id: number) => api.get<Skill>(`/skills/${id}`);

export const getTechStacks = () => api.get<TechStack[]>('/tech-stacks');
export const getTechStack = (id: number) => api.get<TechStack>(`/tech-stacks/${id}`);

export interface ContactPayload {
    name: string;
    email: string;
    subject: string;
    message: string;
}
export const sendContact = (payload: ContactPayload) =>
    api.post<{ message: string }>('/contact', payload);

export const getLearningJourney = () => api.get<LearningJourneyEntry[]>('/learning-journey');

export const getPhilosophyPoints = () => api.get<PhilosophyPoint[]>('/about/philosophy');
export const getHobbies = () => api.get<Hobby[]>('/about/hobbies');
