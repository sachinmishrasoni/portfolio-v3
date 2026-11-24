
export type EmploymentType =
    | "full-time"
    | "part-time"
    | "internship"
    | "contract"
    | "freelance";

export type WorkMode =
    | "onsite"
    | "remote"
    | "hybrid";

export interface Experience {
    id: string;

    // Company Information
    company: string;
    companyLogo?: string;
    companyWebsite?: string;

    // Job Information
    designation: string;
    employmentType: EmploymentType;
    workMode: WorkMode;
    location: string;

    // Employment Duration
    startDate: Date;
    endDate: Date | null;
    isCurrent: boolean;

    // Experience Details
    description: string;
    responsibilities: string[];
    technologies: string[];

    // Publishing Settings
    isActive: boolean;
    displayOrder: number;

    // Timestamps
    createdAt?: Date;
    updatedAt?: Date;
}

export type CreateExperienceInput = Omit<
    Experience,
    "id" | "createdAt" | "updatedAt"
>;

export type UpdateExperienceInput = Partial<CreateExperienceInput>;
