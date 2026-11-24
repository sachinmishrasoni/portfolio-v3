
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
    createExperience,
    deleteExperience,
    updateExperience,
} from "../experience.service";

import type {
    CreateExperienceInput,
    UpdateExperienceInput,
} from "../experience.types";

import { experienceKeys } from "./experience.queries";

// Create Experience
export const useCreateExperienceMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateExperienceInput) =>
            createExperience(payload),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: experienceKeys.lists(),
            });

            await queryClient.invalidateQueries({
                queryKey: experienceKeys.active(),
            });
        },
    });
};

// Update Experience
export const useUpdateExperienceMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            experienceId,
            payload,
        }: {
            experienceId: string;
            payload: UpdateExperienceInput;
        }) => updateExperience(experienceId, payload),

        onSuccess: async (_, variables) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: experienceKeys.lists(),
                }),
                queryClient.invalidateQueries({
                    queryKey: experienceKeys.active(),
                }),
                queryClient.invalidateQueries({
                    queryKey: experienceKeys.detail(variables.experienceId),
                }),
            ]);
        },
    });
};

// Delete Experience
export const useDeleteExperienceMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (experienceId: string) =>
            deleteExperience(experienceId),

        onSuccess: async (_, experienceId) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: experienceKeys.lists(),
                }),
                queryClient.invalidateQueries({
                    queryKey: experienceKeys.active(),
                }),
                queryClient.removeQueries({
                    queryKey: experienceKeys.detail(experienceId),
                }),
            ]);
        },
    });
};
