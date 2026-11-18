import { CATEGORY_OPTIONS, PROJECT_TYPE_OPTIONS, STATUS_OPTIONS } from "./projects.constants";

export const generateProjectId = (): string => {
    const date = new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "");

    const randomId = crypto
        .randomUUID()
        .replace(/-/g, "")
        .slice(0, 6)
        .toUpperCase();

    return `PRJ-${date}-${randomId}`;
};

const getOptionLabel = (
    options: { value: string; label: string }[],
    value: string
) => {
    return options.find((option) => option.value === value)?.label ?? value;
};

export const getCategoryLabel = (value: string) =>
    getOptionLabel(CATEGORY_OPTIONS, value);

export const getProjectTypeLabel = (value: string) =>
    getOptionLabel(PROJECT_TYPE_OPTIONS, value);

export const getProjectStatusLabel = (value: string) =>
    getOptionLabel(STATUS_OPTIONS, value);