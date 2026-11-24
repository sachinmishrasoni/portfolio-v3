import type { Service } from "../../services.types";
import type { ServiceFormInput } from "../../services.schema";
import { SERVICE_DEFAULT_VALUES } from "../../services.constants";

export const mapServiceToForm = (
    service: Service
): ServiceFormInput => ({
    title: service.title,
    slug: service.slug,
    tagline: service.tagline,
    description: service.description,
    icon: service.icon,
    image: service.image ?? "",
    features: service.features ?? [],
    technologies: service.technologies ?? [],
    isFeatured: service.isFeatured,
    isActive: service.isActive,
    displayOrder: service.displayOrder,
});

export const getDefaultServiceValues = (): ServiceFormInput => ({
    ...SERVICE_DEFAULT_VALUES,
    features: [...SERVICE_DEFAULT_VALUES.features],
    technologies: [...SERVICE_DEFAULT_VALUES.technologies],
});
