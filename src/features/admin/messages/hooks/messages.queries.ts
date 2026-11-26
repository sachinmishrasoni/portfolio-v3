import { useQuery } from "@tanstack/react-query";

import {
    getMessageById,
    getMessages,
} from "../messages.service";

export const messageKeys = {
    all: ["messages"] as const,
    lists: () => [...messageKeys.all, "list"] as const,
    list: () => [...messageKeys.lists()] as const,
    details: () => [...messageKeys.all, "detail"] as const,
    detail: (id: string) => [...messageKeys.details(), id] as const,
};

export const useMessagesQuery = () => {
    return useQuery({
        queryKey: messageKeys.list(),
        queryFn: getMessages,
    });
};

export const useMessageByIdQuery = (id: string) => {
    return useQuery({
        queryKey: messageKeys.detail(id),
        queryFn: () => getMessageById(id),
        enabled: Boolean(id),
    });
};