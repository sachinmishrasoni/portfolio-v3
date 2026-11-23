import type { SkillCategory } from "./skill.types";

export const getCategoryLabel = (
    category: SkillCategory
): string => {
    const labels: Record<SkillCategory, string> = {
        frontend: "Frontend",
        backend: "Backend",
        database: "Database",
        devops: "DevOps",
        tools: "Tools",
        other: "Other",
    };

    return labels[category] ?? "Other";
};