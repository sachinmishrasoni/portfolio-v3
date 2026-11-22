import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject, deleteProject, updateProject } from "../projects.service";
import { projectKeys } from "./projects.queries";
import type { CloudinaryProjectImage, Project, ProjectInput } from "../projects.types";
import { deleteCloudinaryImages } from "@/services/cloudinary/cloudinary.client";

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

// export const useDeleteProject = () => {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: deleteProject,
//         onSuccess: async (_, projectId) => {
//             await Promise.all([
//                 queryClient.invalidateQueries({
//                     queryKey: projectKeys.lists(),
//                 }),
//                 queryClient.removeQueries({
//                     queryKey: projectKeys.detail(projectId),
//                 }),
//             ]);
//         },
//     });
// };

export const useDeleteProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (project: Project) => {
            await deleteProject(project.id);

            const publicIds = [
                project.thumbnail,
                ...project.images,
            ]
                .filter(
                    (image): image is CloudinaryProjectImage =>
                        image.source === "cloudinary"
                )
                .map((image) => image.publicId);

            if (publicIds.length) {
                try {
                    await deleteCloudinaryImages(publicIds);
                } catch (error) {
                    console.error("Cloudinary cleanup failed:", error);
                }
            }

            return project.id;
        },

        onSuccess: async (projectId) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: projectKeys.lists(),
                }),
                queryClient.removeQueries({
                    queryKey: projectKeys.detail(projectId),
                }),
            ]);
        },
    });
};