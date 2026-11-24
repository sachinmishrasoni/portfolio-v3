import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createEducation,
    deleteEducation,
    updateEducation,
} from "../education.service";
import type {
    CreateEducationInput,
    UpdateEducationInput,
} from "../education.types";
import { educationKeys } from "./education.queries";

export const useCreateEducationMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateEducationInput) =>
            createEducation(payload),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: educationKeys.lists() }),
                queryClient.invalidateQueries({ queryKey: educationKeys.active() }),
            ]);
        },
    });
};

export const useUpdateEducationMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            educationId,
            payload,
        }: {
            educationId: string;
            payload: UpdateEducationInput;
        }) => updateEducation(educationId, payload),
        onSuccess: async (_, variables) => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: educationKeys.lists() }),
                queryClient.invalidateQueries({ queryKey: educationKeys.active() }),
                queryClient.invalidateQueries({
                    queryKey: educationKeys.detail(variables.educationId),
                }),
            ]);
        },
    });
};

export const useDeleteEducationMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (educationId: string) =>
            deleteEducation(educationId),
        onSuccess: async (_, educationId) => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: educationKeys.lists() }),
                queryClient.invalidateQueries({ queryKey: educationKeys.active() }),
                queryClient.removeQueries({
                    queryKey: educationKeys.detail(educationId),
                }),
            ]);
        },
    });
};
