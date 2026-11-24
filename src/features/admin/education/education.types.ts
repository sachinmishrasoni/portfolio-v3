
export type EducationLevel =
    | "high-school"
    | "intermediate"
    | "diploma"
    | "bachelor"
    | "master"
    | "doctorate"
    | "other";

export interface Education {
    id: string;

    institution: string;
    institutionLogo?: string;
    institutionWebsite?: string;

    educationLevel: EducationLevel;
    degree: string;
    fieldOfStudy: string;
    location: string;

    startDate: Date;
    endDate: Date | null;
    isCurrent: boolean;

    grade?: string;
    description: string;
    achievements: string[];

    isActive: boolean;
    displayOrder: number;

    createdAt?: Date;
    updatedAt?: Date;
}

export type CreateEducationInput = Omit<
    Education,
    "id" | "createdAt" | "updatedAt"
>;

export type UpdateEducationInput = Partial<CreateEducationInput>;
