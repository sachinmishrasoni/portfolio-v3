
import { useQuery } from "@tanstack/react-query";

import {
    getSkills,
    getSkillById,
    getActiveSkills,
} from "../skill.service";

// Query keys
export const skillKeys = {
    all: ["skills"] as const,
    lists: () => [...skillKeys.all, "list"] as const,
    list: () => [...skillKeys.lists()] as const,
    active: () => [...skillKeys.all, "active"] as const,
    details: () => [...skillKeys.all, "detail"] as const,
    detail: (id: string) => [...skillKeys.details(), id] as const,
};

// Get all skills
export const useSkillsQuery = () => {
    return useQuery({
        queryKey: skillKeys.list(),
        queryFn: getSkills,
    });
};

// Get active skills
export const useActiveSkillsQuery = () => {
    return useQuery({
        queryKey: skillKeys.active(),
        queryFn: getActiveSkills,
    });
};

// Get skill by ID
export const useSkillByIdQuery = (id: string) => {
    return useQuery({
        queryKey: skillKeys.detail(id),
        queryFn: () => getSkillById(id),
        enabled: !!id,
    });
};
