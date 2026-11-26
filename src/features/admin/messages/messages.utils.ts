import type { Message, MessageStatus } from "./messages.types";
import { MESSAGE_STATUS_CONFIG } from "./messages.constants";

export const getMessageStatusConfig = (status: MessageStatus) => {
    return MESSAGE_STATUS_CONFIG[status];
};

export const getMessageInitials = (name: string): string => {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("");
};

export const getMessagePreview = (
    message: string,
    maxLength = 100
): string => {
    const trimmedMessage = message.trim();

    if (trimmedMessage.length <= maxLength) {
        return trimmedMessage;
    }

    return `${trimmedMessage.slice(0, maxLength).trimEnd()}...`;
};

export const isUnreadMessage = (message: Message): boolean => {
    return message.status === "unread";
};

export const sortMessagesByLatest = (messages: Message[]): Message[] => {
    return [...messages].sort((a, b) => {
        const dateA = a.createdAt?.getTime() ?? 0;
        const dateB = b.createdAt?.getTime() ?? 0;

        return dateB - dateA;
    });
};