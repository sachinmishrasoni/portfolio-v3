"use client";

import ServiceList from "@/features/admin/services/components/list";
import { useServicesQuery } from "@/features/admin/services/hooks/services.queries";

export default function ServicesPage() {
    const { data: services = [], isLoading } = useServicesQuery();

    return (
        <ServiceList
            services={services}
            loading={isLoading}
        />
    );
}
