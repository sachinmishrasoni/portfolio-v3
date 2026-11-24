import type { EducationLevel } from "./education.types";

const EDUCATION_LEVEL_LABELS: Record<EducationLevel, string> = {
    "high-school": "High School",
    intermediate: "Intermediate",
    diploma: "Diploma",
    bachelor: "Bachelor",
    master: "Master",
    doctorate: "Doctorate",
    other: "Other",
};

export const getEducationLevelLabel = (
    level: EducationLevel
): string => EDUCATION_LEVEL_LABELS[level] ?? "Other";
