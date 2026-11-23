
import type { Skill } from "../../skill.types";
import type { SkillFormInput } from "../../skill.schema";
import { SKILL_DEFAULT_VALUES } from "../../skill.constants";

export const mapSkillToForm = (
    skill: Skill
): SkillFormInput => ({
    name: skill.name,
    description: skill.description,
    category: skill.category,
    proficiency: skill.proficiency,
    icon: skill.icon,
    color: skill.color ?? "",
    isActive: skill.isActive,
    displayOrder: skill.displayOrder,
});

export const getDefaultSkillValues = (): SkillFormInput => ({
    ...SKILL_DEFAULT_VALUES,
});
