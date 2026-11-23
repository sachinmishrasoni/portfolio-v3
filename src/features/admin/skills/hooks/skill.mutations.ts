
import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    createSkill,
    updateSkill,
    deleteSkill,
} from "../skill.service";

import type {
    CreateSkillInput,
    UpdateSkillInput,
} from "../skill.types";

import { skillKeys } from "./skill.queries";

// Create skill
export const useCreateSkillMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateSkillInput) => createSkill(data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: skillKeys.all,
            });
        },
    });
};

// Update skill
export const useUpdateSkillMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: UpdateSkillInput;
        }) => updateSkill(id, data),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: skillKeys.all,
            });

            queryClient.invalidateQueries({
                queryKey: skillKeys.detail(variables.id),
            });
        },
    });
};

// Delete skill
export const useDeleteSkillMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteSkill(id),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: skillKeys.all,
            });
        },
    });
};
