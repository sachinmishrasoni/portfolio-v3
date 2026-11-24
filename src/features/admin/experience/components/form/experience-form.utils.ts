
import type { Experience } from "../../experience.types";
import type { ExperienceFormInput } from "../../experience.schema";
import { EXPERIENCE_DEFAULT_VALUES } from "../../experience.constants";

export const mapExperienceToForm = (
    experience: Experience
): ExperienceFormInput => ({
    company: experience.company,
    companyLogo: experience.companyLogo ?? "",
    companyWebsite: experience.companyWebsite ?? "",

    designation: experience.designation,
    employmentType: experience.employmentType,
    workMode: experience.workMode,
    location: experience.location,

    startDate: experience.startDate,
    endDate: experience.endDate,
    isCurrent: experience.isCurrent,

    description: experience.description,
    responsibilities: experience.responsibilities ?? [],
    technologies: experience.technologies ?? [],

    isActive: experience.isActive,
    displayOrder: experience.displayOrder,
});

export const getDefaultExperienceValues = (): ExperienceFormInput => ({
    ...EXPERIENCE_DEFAULT_VALUES,
    responsibilities: [...EXPERIENCE_DEFAULT_VALUES.responsibilities],
    technologies: [...EXPERIENCE_DEFAULT_VALUES.technologies],
});
