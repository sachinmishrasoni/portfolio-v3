
/**
 * Converts a date into YYYY-MM-DD format.
 * Useful for DateField and HTML date inputs.
 */

// const toDateInput = (date?: Date) => {
//     if (!date) return "";

//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");

//     return `${year}-${month}-${day}`;
// };
export const formatDateInput = (
    value?: Date | string | null
): string => {
    if (!value) return "";

    if (typeof value === "string") {
        return value;
    }

    if (Number.isNaN(value.getTime())) {
        return "";
    }

    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

/**
 * Formats a date using the Indian locale.
 * Example: 24 Nov 2026
 */
export const formatDate = (
    value?: Date | string | null
): string => {
    if (!value) return "—";

    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

/**
 * Formats a date into month and year.
 * Example: Nov 2026
 */
export const formatMonthYear = (
    value?: Date | string | null
): string => {
    if (!value) return "—";

    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
    });
};

/**
 * Returns the current date in YYYY-MM-DD format.
 */
export const getCurrentDateInput = (): string => {
    return formatDateInput(new Date());
};

/**
 * Checks whether a date value is valid.
 */
export const isValidDate = (
    value?: Date | string | null
): boolean => {
    if (!value) return false;

    const date = value instanceof Date ? value : new Date(value);

    return !Number.isNaN(date.getTime());
};
