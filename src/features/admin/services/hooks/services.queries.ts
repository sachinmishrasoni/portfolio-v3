import { useQuery } from "@tanstack/react-query";
import {
    getActiveServices,
    getServiceById,
    getServices,
} from "../services.service";

export const serviceKeys = {
    all: ["services"] as const,
    lists: () => [...serviceKeys.all, "list"] as const,
    list: () => [...serviceKeys.lists()] as const,
    active: () => [...serviceKeys.all, "active"] as const,
    details: () => [...serviceKeys.all, "detail"] as const,
    detail: (id: string) => [...serviceKeys.details(), id] as const,
};

export const useServicesQuery = () => useQuery({
    queryKey: serviceKeys.list(),
    queryFn: getServices,
});

export const useActiveServicesQuery = () => useQuery({
    queryKey: serviceKeys.active(),
    queryFn: getActiveServices,
});

export const useServiceQuery = (serviceId: string) => useQuery({
    queryKey: serviceKeys.detail(serviceId),
    queryFn: () => getServiceById(serviceId),
    enabled: Boolean(serviceId),
});
