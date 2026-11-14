
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "./projects.service";

export const projectKeys = {
    all: ["projects"] as const,
    lists: () => [...projectKeys.all, "list"] as const,
    details: () => [...projectKeys.all, "detail"] as const,
    detail: (id: string) =>
        [...projectKeys.details(), id] as const,
};

export const useProjects = () => {
    return useQuery({
        queryKey: projectKeys.lists(),
        queryFn: getProjects,
    });
};
