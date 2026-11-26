"use client";

import MessagesList from "@/features/admin/messages/components/list";
import { useMessagesQuery } from "@/features/admin/messages/hooks/messages.queries";

export default function MessagesPage() {
    const { data: messages = [], isLoading, } = useMessagesQuery();

    return (
        <MessagesList
            messages={messages}
            loading={isLoading}
        />
    );
}