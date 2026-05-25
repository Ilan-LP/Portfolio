export interface Media {
    id: number;
    url: string;
    altText: string;
    type: 'IMAGE' | 'VIDEO' | 'DOCUMENT';
}

export interface Status {
    id: number;
    name: string;
    description?: string;
}

export interface TechStackCategory {
    id: number;
    name: string;
    description?: string;
}

export interface TechStack {
    id: number;
    name: string;
    iconUrl: string;
    color: string;
    category: TechStackCategory;
}

export interface SkillCategory {
    id: number;
    name: string;
    description?: string;
}

export interface SkillLevel {
    id: number;
    name: string;
    description?: string;
}

export interface Skill {
    id: number;
    name: string;
    iconUrl: string;
    color: string;
    description: string;
    category: SkillCategory;
    level: SkillLevel;
}

export interface ProjectSummary {
    id: number;
    title: string;
    descriptionShort: string;
    startedAt: string;
    endAt: string | null;
    githubUrl: string | null;
    liveUrl: string | null;
    status: Status;
    mainMedia: Media | null;
}

export interface ProjectDetail extends ProjectSummary {
    descriptionLong: string;
    projectMedias: { media: Media }[];
    projectTechStacks: { techStack: TechStack }[];
    projectSkills: { skill: Skill }[];
}

export interface School {
    id: number;
    name: string;
    websiteUrl: string;
    description?: string;
}

export interface Degree {
    id: number;
    name: string;
    description?: string;
}

export interface EducationSummary {
    id: number;
    title: string;
    descriptionShort: string;
    startedAt: string;
    endAt: string | null;
    school: School;
    degree: Degree;
    status: Status;
    mainMedia: Media | null;
}

export interface EducationDetail extends EducationSummary {
    descriptionLong: string;
    educationMedias: { media: Media }[];
    educationTechStacks: { techStack: TechStack }[];
    educationSkills: { skill: Skill }[];
}

export interface Company {
    id: number;
    name: string;
    websiteUrl: string;
    description?: string;
}

export interface JobType {
    id: number;
    name: string;
}

export interface ExperienceSummary {
    id: number;
    title: string;
    descriptionShort: string;
    startedAt: string;
    endAt: string | null;
    company: Company;
    jobType: JobType;
    status: Status;
    mainMedia: Media | null;
}

export interface ExperienceDetail extends ExperienceSummary {
    descriptionLong: string;
    experienceMedias: { media: Media }[];
    experienceTechStacks: { techStack: TechStack }[];
    experienceSkills: { skill: Skill }[];
}

export interface GithubRepo {
    name: string;
    description: string;
    updated_at: string;
    language: string | null;
    html_url: string;
    stargazers_count: number;
}

export interface HealthResponse {
    status: string;
    db: string;
    uptime: number;
}

export interface PhilosophyPoint {
    id: number;
    title: string;
    body: string;
    order: number;
}

export interface Hobby {
    id: number;
    label: string;
    icon: string;
    description: string;
    order: number;
}

export interface LearningJourneyEntry {
    id: number;
    domain: string;
    iconUrl: string;
    color: string;
    before: string;
    after: string;
    order: number;
    projects: { id: number; title: string }[];
}
