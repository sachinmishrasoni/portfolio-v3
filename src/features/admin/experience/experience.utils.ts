
import type {
    EmploymentType,
    WorkMode,
} from "./experience.types";

const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
    "full-time": "Full-time",
    "part-time": "Part-time",
    internship: "Internship",
    contract: "Contract",
    freelance: "Freelance",
};

const WORK_MODE_LABELS: Record<WorkMode, string> = {
    onsite: "On-site",
    remote: "Remote",
    hybrid: "Hybrid",
};

export const getEmploymentTypeLabel = (
    type: EmploymentType
): string => EMPLOYMENT_TYPE_LABELS[type] ?? "Other";

export const getWorkModeLabel = (
    mode: WorkMode
): string => WORK_MODE_LABELS[mode] ?? "Other";
