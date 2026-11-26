
export type MessageStatus = "unread" | "read" | "replied" | "archived";

export interface Message {
    id: string;

    name: string;
    email: string;
    subject: string;
    message: string;

    phone?: string;
    company?: string;

    status: MessageStatus;
    isStarred: boolean;

    repliedAt?: Date | null;

    createdAt?: Date;
    updatedAt?: Date;
}

export type CreateMessageInput = Omit<
    Message,
    "id" | "status" | "isStarred" | "repliedAt" | "createdAt" | "updatedAt"
>;

export type UpdateMessageInput = Partial<
    Pick<Message, "status" | "isStarred" | "repliedAt">
>;
