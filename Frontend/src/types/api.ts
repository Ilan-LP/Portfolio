// ── Media ──
export interface Media {
    id: number;
    url: string;
    altText: string;
    type: 'IMAGE' | 'VIDEO' | 'DOCUMENT';
}

// ── Status ──
export interface Status {
    id: number;
    name: string;
    description?: string;
}

// ── TechStack ──
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

// ── Skill ──
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

// ── Project ──
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

// ── Education ──
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

// ── Experience ──
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

// ── News ──
export interface NewsSummary {
    id: number;
    title: string;
    descriptionShort: string;
    publishedAt: string;
    mainMedia: Media | null;
}

export interface NewsDetail extends NewsSummary {
    descriptionLong: string;
    status: Status | null;
    newsMedias: { media: Media }[];
}

// ── Health ──
export interface HealthResponse {
    status: string;
    db: string;
    uptime: number;
}
