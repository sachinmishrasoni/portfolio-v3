
import type { SelectOption } from "@/components/ui/forms";
import type {
    EmploymentType,
    WorkMode,
} from "./experience.types";

// Employment Type Options
export const EMPLOYMENT_TYPE_OPTIONS: SelectOption[] = [
    { label: "Full-time", value: "full-time" },
    { label: "Part-time", value: "part-time" },
    { label: "Internship", value: "internship" },
    { label: "Contract", value: "contract" },
    { label: "Freelance", value: "freelance" },
];

// Work Mode Options
export const WORK_MODE_OPTIONS: SelectOption[] = [
    { label: "On-site", value: "onsite" },
    { label: "Remote", value: "remote" },
    { label: "Hybrid", value: "hybrid" },
];

// Default Form Values
export const EXPERIENCE_DEFAULT_VALUES = {
    company: "",
    companyLogo: "",
    companyWebsite: "",

    designation: "",
    employmentType: "full-time" as EmploymentType,
    workMode: "onsite" as WorkMode,
    location: "",

    startDate: undefined,
    endDate: null,
    isCurrent: false,

    description: "",
    responsibilities: [""],
    technologies: [],

    isActive: true,
    displayOrder: 0,
};
