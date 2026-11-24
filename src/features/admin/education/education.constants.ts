import type { SelectOption } from "@/components/ui/forms";
import type { EducationLevel } from "./education.types";

export const EDUCATION_LEVEL_OPTIONS: SelectOption[] = [
    { label: "High School", value: "high-school" },
    { label: "Intermediate", value: "intermediate" },
    { label: "Diploma", value: "diploma" },
    { label: "Bachelor", value: "bachelor" },
    { label: "Master", value: "master" },
    { label: "Doctorate", value: "doctorate" },
    { label: "Other", value: "other" },
];

export const EDUCATION_DEFAULT_VALUES = {
    institution: "",
    institutionLogo: "",
    institutionWebsite: "",
    educationLevel: "bachelor" as EducationLevel,
    degree: "",
    fieldOfStudy: "",
    location: "",
    startDate: undefined,
    endDate: null,
    isCurrent: false,
    grade: "",
    description: "",
    achievements: [],
    isActive: true,
    displayOrder: 0,
};
