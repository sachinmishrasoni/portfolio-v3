
import type { SelectOption } from "@/components/ui/forms";
import type { SkillCategory } from "./skill.types";

export const SKILL_CATEGORY_OPTIONS: SelectOption[] = [
    { label: "Frontend", value: "frontend" },
    { label: "Backend", value: "backend" },
    { label: "Database", value: "database" },
    { label: "DevOps", value: "devops" },
    { label: "Tools", value: "tools" },
    { label: "Other", value: "other" },
];

export const SKILL_DEFAULT_VALUES = {
    name: "",
    description: "",
    category: "frontend" as SkillCategory,
    proficiency: 50,
    icon: "",
    color: "",
    isActive: true,
    displayOrder: 0,
};
