
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