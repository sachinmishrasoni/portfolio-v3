export function escapeHtml(value: unknown): string {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// Escape first, then convert line breaks
export function toHtmlWithBreaks(value: unknown): string {
    return escapeHtml(value).replace(/\r?\n/g, "<br />");
}