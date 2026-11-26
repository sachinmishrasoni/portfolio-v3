"use client";

import { useCallback, useMemo, useState } from "react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { toast } from "sonner";

import {
    DataTable,
    createActionColumn,
} from "@/components/common/DataTable";

import { alert } from "@/components/common/alert";

import type { Message, MessageStatus } from "../../messages.types";

import { useDeleteMessageMutation, useUpdateMessageMutation } from "../../hooks/messages.mutations";

import SenderCell from "./cells/SenderCell";
import SubjectCell from "./cells/SubjectCell";
import StatusCell from "./cells/StatusCell";
import StarredCell from "./cells/StarredCell";

import MessageDetailsDialog from "../details/MessageDetailsDialog";

import { formatDate } from "@/lib/utils/date.utils";

interface MessagesListProps {
    messages: Message[];
    loading: boolean;
}

interface DetailsModal {
    open: boolean;
    data: Message | null;
}

export default function MessagesList({
    messages,
    loading,
}: MessagesListProps) {
    const [detailsModal, setDetailsModal] = useState<DetailsModal>({
        open: false,
        data: null,
    });

    const { mutateAsync: deleteMessage, isPending: isDeleting, } = useDeleteMessageMutation();
    const { mutateAsync: updateMessage, isPending: isUpdating, } = useUpdateMessageMutation();

    // View message
    const handleView = useCallback((message: Message) => {
        setDetailsModal({
            open: true,
            data: message,
        });

        // Mark unread message as read
        if (message.status === "unread") {
            void updateMessage({
                id: message.id,
                data: {
                    status: "read",
                },
            }).catch((error) => {
                console.error("Mark message as read failed:", error);
            });
        }
    }, [updateMessage]);

    // Delete message
    const handleDelete = useCallback(
        async (message: Message) => {
            const confirmed = await alert.confirm({
                title: "Delete Message?",
                description: `Are you sure you want to delete the message from "${message.name}"? This action cannot be undone.`,
                confirmText: "Delete",
                cancelText: "Cancel",
            });

            if (!confirmed) return;

            try {
                await deleteMessage(message.id);

                toast.success("Message deleted successfully.");

                setDetailsModal((previous) => ({
                    open: false,
                    data: null,
                }));
            } catch (error) {
                console.error("Delete message failed:", error);
                toast.error("Failed to delete message.");
            }
        },
        [deleteMessage]
    );

    // Toggle starred state
    const handleToggleStar = useCallback(
        async (message: Message) => {
            try {
                await updateMessage({
                    id: message.id,
                    data: {
                        isStarred: !message.isStarred,
                    },
                });

                toast.success(
                    message.isStarred
                        ? "Message removed from starred."
                        : "Message starred successfully."
                );
            } catch (error) {
                console.error("Update message star failed:", error);
                toast.error("Failed to update starred message.");
            }
        },
        [updateMessage]
    );

    // Update message status
    const handleStatusChange = useCallback(
        async (message: Message, status: MessageStatus) => {
            try {
                await updateMessage({
                    id: message.id,
                    data: {
                        status,
                        ...(status === "replied"
                            ? { repliedAt: new Date() }
                            : {}),
                    },
                });

                toast.success("Message status updated successfully.");
            } catch (error) {
                console.error("Update message status failed:", error);
                toast.error("Failed to update message status.");
                throw error;
            }
        },
        [updateMessage]
    );

    // Filter messages
    const handleFilter = useCallback(() => {
        console.log("Open message filters");
    }, []);

    // Table columns
    const columns = useMemo<ColDef<Message>[]>(
        () => [
            {
                headerName: "Sender",
                field: "name",
                minWidth: 200,
                flex: 1,
                cellRenderer: SenderCell,
                autoHeight: true,
            },
            // {
            //     headerName: "Email",
            //     field: "email",
            //     minWidth: 200,
            //     flex: 1,
            // },
            {
                headerName: "Subject",
                field: "subject",
                minWidth: 220,
                flex: 1,
                // cellRenderer: SubjectCell,
                autoHeight: true,
            },
            {
                headerName: "Status",
                field: "status",
                minWidth: 130,
                flex: 0.8,
                cellRenderer: StatusCell,
                cellClass: "!flex items-center justify-center",
            },
            {
                headerName: "Starred",
                field: "isStarred",
                minWidth: 100,
                maxWidth: 110,
                cellRenderer: (params: ICellRendererParams<Message>) => (
                    <StarredCell
                        message={params.data}
                        onToggle={handleToggleStar}
                    />
                ),
                cellClass: "!flex items-center justify-center",
                sortable: false,
                filter: false,
            },
            {
                headerName: "Received Date",
                field: "createdAt",
                minWidth: 150,
                flex: 0.9,
                cellRenderer: ({
                    value,
                }: ICellRendererParams<Message, Date | undefined>) =>
                    formatDate(value),
            },
            createActionColumn({
                onView: handleView,
                onDelete: handleDelete,
                showView: true,
                showEdit: false,
                showDelete: true,
            }),
        ],
        [handleView, handleDelete, handleToggleStar]
    );

    return (
        <>
            <DataTable<Message>
                title="Messages List"
                columns={columns}
                data={messages}
                toolbar={{
                    searchPlaceholder: "Search messages...",
                    onFilterClick: handleFilter,
                    showAddButton: false
                }}
                loading={loading}
            />

            <MessageDetailsDialog
                open={detailsModal.open}
                onOpenChange={(open) =>
                    setDetailsModal((previous) => ({
                        open,
                        data: open ? previous.data : null,
                    }))
                }
                message={detailsModal.data}
                onStatusChange={handleStatusChange}
                onToggleStar={handleToggleStar}
                onDelete={handleDelete}
            />
        </>
    );
}