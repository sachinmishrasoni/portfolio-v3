import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import {
    deleteMessage,
    updateMessage,
} from "../messages.service";

import type { UpdateMessageInput } from "../messages.types";
import { messageKeys } from "./messages.queries";

export const useUpdateMessageMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: UpdateMessageInput;
        }) => updateMessage(id, data),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: messageKeys.all,
            });

            queryClient.invalidateQueries({
                queryKey: messageKeys.detail(variables.id),
            });

            toast.success("Message updated successfully");
        },

        onError: () => {
            toast.error("Failed to update message");
        },
    });
};

export const useDeleteMessageMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteMessage,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: messageKeys.all,
            });

            toast.success("Message deleted successfully");
        },

        onError: () => {
            toast.error("Failed to delete message");
        },
    });
};