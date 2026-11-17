
import { useQuery } from "@tanstack/react-query";
import { getProjectById, getProjects } from "./projects.service";

export const projectKeys = {
    all: ["projects"] as const,
    lists: () => [...projectKeys.all, "list"] as const,
    details: () => [...projectKeys.all, "detail"] as const,
    detail: (id: string) =>
        [...projectKeys.details(), id] as const,
};

// Fetch all projects
export const useProjects = () => {
    return useQuery({
        queryKey: projectKeys.lists(),
        queryFn: getProjects,
    });
};

// Fetch single project
export const useProject = (id: string) => {
    return useQuery({
        queryKey: projectKeys.detail(id),
        queryFn: () => getProjectById(id),
        enabled: Boolean(id),
    });
};
