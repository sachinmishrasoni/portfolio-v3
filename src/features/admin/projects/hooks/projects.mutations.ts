import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject, updateProject } from "../projects.service";
import { projectKeys } from "./projects.queries";
import type { ProjectInput } from "../projects.types";

interface UpdateProjectVariables {
    projectId: string;
    projectData: ProjectInput;
}

export const useCreateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProject,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: projectKeys.lists(),
            });
        },
    });
};

export const useUpdateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ projectId, projectData }: UpdateProjectVariables) => updateProject(projectId, projectData),
        onSuccess: async (_, variables) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: projectKeys.lists(),
                }),
                queryClient.invalidateQueries({
                    queryKey: projectKeys.detail(variables.projectId),
                }),
            ]);
        },
    });
};
