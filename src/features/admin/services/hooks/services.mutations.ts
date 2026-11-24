import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createService,
    deleteService,
    updateService,
} from "../services.service";
import type {
    CreateServiceInput,
    UpdateServiceInput,
} from "../services.types";
import { serviceKeys } from "./services.queries";

export const useCreateServiceMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateServiceInput) =>
            createService(payload),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: serviceKeys.lists() }),
                queryClient.invalidateQueries({ queryKey: serviceKeys.active() }),
            ]);
        },
    });
};

export const useUpdateServiceMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            serviceId,
            payload,
        }: {
            serviceId: string;
            payload: UpdateServiceInput;
        }) => updateService(serviceId, payload),
        onSuccess: async (_, variables) => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: serviceKeys.lists() }),
                queryClient.invalidateQueries({ queryKey: serviceKeys.active() }),
                queryClient.invalidateQueries({
                    queryKey: serviceKeys.detail(variables.serviceId),
                }),
            ]);
        },
    });
};

export const useDeleteServiceMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (serviceId: string) =>
            deleteService(serviceId),
        onSuccess: async (_, serviceId) => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: serviceKeys.lists() }),
                queryClient.invalidateQueries({ queryKey: serviceKeys.active() }),
                queryClient.removeQueries({
                    queryKey: serviceKeys.detail(serviceId),
                }),
            ]);
        },
    });
};
