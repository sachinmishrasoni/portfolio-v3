
import { useQuery } from "@tanstack/react-query";

import {
    getActiveExperiences,
    getExperienceById,
    getExperiences,
} from "../experience.service";

export const experienceKeys = {
    all: ["experiences"] as const,
    lists: () => [...experienceKeys.all, "list"] as const,
    list: () => [...experienceKeys.lists()] as const,
    active: () => [...experienceKeys.all, "active"] as const,
    details: () => [...experienceKeys.all, "detail"] as const,
    detail: (id: string) => [...experienceKeys.details(), id] as const,
};

// Get All Experiences
export const useExperiencesQuery = () => {
    return useQuery({
        queryKey: experienceKeys.list(),
        queryFn: getExperiences,
    });
};

// Get Active Experiences
export const useActiveExperiencesQuery = () => {
    return useQuery({
        queryKey: experienceKeys.active(),
        queryFn: getActiveExperiences,
    });
};

// Get Experience By ID
export const useExperienceQuery = (experienceId: string) => {
    return useQuery({
        queryKey: experienceKeys.detail(experienceId),
        queryFn: () => getExperienceById(experienceId),
        enabled: Boolean(experienceId),
    });
};
