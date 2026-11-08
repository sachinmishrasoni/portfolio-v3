export interface Project {
    id: string;
    title: string;
    slug: string;
    description: string;
    shortDescription: string;

    thumbnail: string;
    images: string[];

    technologies: string[];

    category: string;

    liveUrl?: string;
    githubUrl?: string;

    featured: boolean;
    published: boolean;
    displayOrder: number;

    createdAt?: Date;
    updatedAt?: Date;
}

export type CreateProjectInput = Omit<
    Project,
    "id" | "createdAt" | "updatedAt"
>;

export type UpdateProjectInput = Partial<CreateProjectInput>;
