import type { Education } from "../../education.types";
import type { EducationFormInput } from "../../education.schema";
import { EDUCATION_DEFAULT_VALUES } from "../../education.constants";

export const mapEducationToForm = (
    education: Education
): EducationFormInput => ({
    institution: education.institution,
    institutionLogo: education.institutionLogo ?? "",
    institutionWebsite: education.institutionWebsite ?? "",
    educationLevel: education.educationLevel,
    degree: education.degree,
    fieldOfStudy: education.fieldOfStudy,
    location: education.location,
    startDate: education.startDate,
    endDate: education.endDate,
    isCurrent: education.isCurrent,
    grade: education.grade ?? "",
    description: education.description,
    achievements: education.achievements ?? [],
    isActive: education.isActive,
    displayOrder: education.displayOrder,
});

export const getDefaultEducationValues = (): EducationFormInput => ({
    ...EDUCATION_DEFAULT_VALUES,
    achievements: [...EDUCATION_DEFAULT_VALUES.achievements],
});
