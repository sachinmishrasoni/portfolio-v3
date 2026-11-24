
export interface Service {
    id: string;

    title: string;
    slug: string;
    tagline: string;
    description: string;

    icon: string;
    image?: string;

    features: string[];
    technologies: string[];

    isFeatured: boolean;
    isActive: boolean;
    displayOrder: number;

    createdAt?: Date;
    updatedAt?: Date;
}

export type CreateServiceInput = Omit<
    Service,
    "id" | "createdAt" | "updatedAt"
>;

export type UpdateServiceInput = Partial<CreateServiceInput>;
