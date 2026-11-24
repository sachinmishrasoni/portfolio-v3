import { useQuery } from "@tanstack/react-query";
import {
    getActiveEducations,
    getEducationById,
    getEducations,
} from "../education.service";

export const educationKeys = {
    all: ["education"] as const,
    lists: () => [...educationKeys.all, "list"] as const,
    list: () => [...educationKeys.lists()] as const,
    active: () => [...educationKeys.all, "active"] as const,
    details: () => [...educationKeys.all, "detail"] as const,
    detail: (id: string) => [...educationKeys.details(), id] as const,
};

export const useEducationsQuery = () => useQuery({
    queryKey: educationKeys.list(),
    queryFn: getEducations,
});

export const useActiveEducationsQuery = () => useQuery({
    queryKey: educationKeys.active(),
    queryFn: getActiveEducations,
});

export const useEducationQuery = (educationId: string) => useQuery({
    queryKey: educationKeys.detail(educationId),
    queryFn: () => getEducationById(educationId),
    enabled: Boolean(educationId),
});
