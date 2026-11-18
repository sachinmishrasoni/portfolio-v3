
import { type SelectOption, } from "@/components/ui/forms";

export const CATEGORY_OPTIONS: SelectOption[] = [
    { value: "web-development", label: "Web Development" },
    { value: "frontend", label: "Frontend Development" },
    { value: "backend", label: "Backend Development" },
    { value: "fullstack", label: "Full Stack Development" },
    { value: "enterprise", label: "Enterprise Application" },
    { value: "mobile-app", label: "Mobile Application" },
    { value: "ui-ux", label: "UI / UX Design" },
    { value: "other", label: "Other" },
];

export const PROJECT_TYPE_OPTIONS: SelectOption[] = [
    { value: "professional", label: "Professional" },
    { value: "personal", label: "Personal" },
];

export const STATUS_OPTIONS: SelectOption[] = [
    { value: "completed", label: "Completed" },
    { value: "in-progress", label: "In Progress" },
    { value: "on-hold", label: "On Hold" },
    { value: "archived", label: "Archived" },
];
