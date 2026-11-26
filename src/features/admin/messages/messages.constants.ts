import type { MessageStatus } from "./messages.types";

export const MESSAGE_STATUS = {
    UNREAD: "unread",
    READ: "read",
    REPLIED: "replied",
    ARCHIVED: "archived",
} as const satisfies Record<string, MessageStatus>;

export const MESSAGE_STATUS_OPTIONS = [
    { label: "Unread", value: MESSAGE_STATUS.UNREAD },
    { label: "Read", value: MESSAGE_STATUS.READ },
    { label: "Replied", value: MESSAGE_STATUS.REPLIED },
    { label: "Archived", value: MESSAGE_STATUS.ARCHIVED },
];

export const MESSAGE_STATUS_CONFIG: Record<
    MessageStatus,
    { label: string; className: string }
> = {
    unread: {
        label: "Unread",
        className: "bg-blue-100 text-blue-700",
    },
    read: {
        label: "Read",
        className: "bg-gray-100 text-gray-700",
    },
    replied: {
        label: "Replied",
        className: "bg-green-100 text-green-700",
    },
    archived: {
        label: "Archived",
        className: "bg-orange-100 text-orange-700",
    },
};

export const MESSAGE_DEFAULT_VALUES = {
    status: MESSAGE_STATUS.UNREAD,
    isStarred: false,
    repliedAt: null,
} as const;