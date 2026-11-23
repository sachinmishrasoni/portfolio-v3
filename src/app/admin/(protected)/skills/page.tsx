"use client";

import SkillsList from "@/features/admin/skills/components/list";
import { useSkillsQuery } from "@/features/admin/skills/hooks/skill.queries";

export default function SkillsPage() {
    const { data: skills = [], isLoading, } = useSkillsQuery();

    return (
        <SkillsList
            skills={skills}
            loading={isLoading}
        />
    );
}