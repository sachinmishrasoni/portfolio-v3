export type SkillCategory =
    | "frontend"
    | "backend"
    | "database"
    | "devops"
    | "tools"
    | "other";

export interface Skill {
    id: string;
    name: string;
    description: string;
    category: SkillCategory;
    proficiency: number;
    icon: string;
    color?: string;
    isActive: boolean;
    displayOrder: number;

    createdAt?: Date;
    updatedAt?: Date;
}

export type CreateSkillInput = Omit<
    Skill,
    "id" | "createdAt" | "updatedAt"
>;

export type UpdateSkillInput = Partial<CreateSkillInput>;
