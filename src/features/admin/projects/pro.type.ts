
export interface ProjectImage {
    url: string;
    path: string;
    alt: string;
}

export type ProjectStatus =
    | "completed"
    | "in-progress"
    | "on-hold"
    | "archived";

export type ProjectType =
    | "professional"
    | "personal";

export interface ProjectSEO {
    metaTitle?: string;
    metaDescription?: string;
}

export interface Project {
    // Identity
    id: string;
    projectId: string;
    slug: string;

    // Basic Information
    title: string;
    overview: string;
    description: string;
    category: string;
    projectType: ProjectType;

    // Media
    thumbnail: ProjectImage;
    images: ProjectImage[];

    // Technical Information
    technologies: string[];
    features?: string[];
    challenges?: string;
    solution?: string;

    // Contribution
    role?: string;

    // Timeline
    startDate: string;
    endDate?: string;

    // Links
    liveUrl?: string;
    githubUrl?: string;

    // Publishing
    status: ProjectStatus;
    featured: boolean;
    published: boolean;
    displayOrder: number;

    // SEO
    seo?: ProjectSEO;

    // System Fields
    createdAt?: Date;
    updatedAt?: Date;
}

export type ProjectInput = Omit<
    Project,
    "id" | "projectId" | "createdAt" | "updatedAt"
>;

