"use client";

import {
    Archive,
    Check,
    CheckCheck,
    Copy,
    Mail,
    Star,
    Trash2,
    User,
    Building2,
    Phone,
    CalendarDays,
    Reply,
    RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { formatDate, formatDateTime } from "@/lib/utils/date.utils";

import type { Message, MessageStatus } from "../../messages.types";
import { MESSAGE_STATUS_CONFIG } from "../../messages.constants";

interface MessageDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    message: Message | null;

    onStatusChange: (
        message: Message,
        status: MessageStatus
    ) => void;

    onToggleStar: (message: Message) => void;
    onDelete: (message: Message) => void;
}

const MessageDetailsDialog = ({
    open,
    onOpenChange,
    message,
    onStatusChange,
    onToggleStar,
    onDelete,
}: MessageDetailsDialogProps) => {
    if (!message) return null;

    const statusConfig = MESSAGE_STATUS_CONFIG[message.status];

    const handleCopyEmail = async () => {
        try {
            await navigator.clipboard.writeText(message.email);
            toast.success("Email address copied");
        } catch {
            toast.error("Unable to copy email address");
        }
    };

    const handleStatusChange = (status: MessageStatus) => {
        onStatusChange(message, status);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <div className="flex items-start justify-between gap-4 pr-6">
                        <div className="space-y-1">
                            <DialogTitle className="text-xl">
                                Message Details
                            </DialogTitle>

                            <DialogDescription>
                                View and manage the contact message.
                            </DialogDescription>
                        </div>

                        <Badge
                            variant="outline"
                            className={statusConfig.className}
                        >
                            {statusConfig.label}
                        </Badge>
                    </div>
                </DialogHeader>

                <div className="space-y-5">
                    {/* Sender Details */}
                    <div className="rounded-lg border p-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex items-start gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <User className="h-5 w-5" />
                                </div>

                                <div className="min-w-0 space-y-1">
                                    <h3 className="font-semibold">
                                        {message.name}
                                    </h3>

                                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                        <Mail className="h-4 w-4 shrink-0" />

                                        <span className="break-all">
                                            {message.email}
                                        </span>

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            title="Copy email"
                                            onClick={handleCopyEmail}
                                        >
                                            <Copy className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                title={message.isStarred ? "Remove star" : "Add star"}
                                onClick={() => onToggleStar(message)}
                            >
                                <Star
                                    className={`h-5 w-5 ${message.isStarred
                                        ? "fill-yellow-400 text-yellow-500"
                                        : "text-muted-foreground"
                                        }`}
                                />
                            </Button>
                        </div>

                        <Separator className="my-4" />

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {message.phone && (
                                <div className="flex items-start gap-2">
                                    <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />

                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Phone
                                        </p>
                                        <p className="text-sm font-medium">
                                            {message.phone}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {message.company && (
                                <div className="flex items-start gap-2">
                                    <Building2 className="mt-0.5 h-4 w-4 text-muted-foreground" />

                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Company
                                        </p>
                                        <p className="text-sm font-medium">
                                            {message.company}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-start gap-2">
                                <CalendarDays className="mt-0.5 h-4 w-4 text-muted-foreground" />

                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Received
                                    </p>
                                    <p className="text-sm font-medium">
                                        {formatDateTime(message.createdAt)}
                                    </p>
                                </div>
                            </div>

                            {message.repliedAt && (
                                <div className="flex items-start gap-2">
                                    <CheckCheck className="mt-0.5 h-4 w-4 text-muted-foreground" />

                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Replied At
                                        </p>
                                        <p className="text-sm font-medium">
                                            {formatDateTime(message.repliedAt)}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Message Content */}
                    <div className="space-y-3">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Subject
                            </p>

                            <h3 className="mt-1 text-base font-semibold">
                                {message.subject}
                            </h3>
                        </div>

                        <Separator />

                        <div>
                            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Message
                            </p>

                            <div className="whitespace-pre-wrap break-words rounded-lg bg-muted/50 p-4 text-sm leading-7">
                                {message.message}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <Separator />

                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-2">
                            {message.status !== "read" && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleStatusChange("read")}
                                >
                                    <Check className="mr-2 h-4 w-4" />
                                    Mark as Read
                                </Button>
                            )}

                            {message.status !== "unread" &&
                                message.status !== "archived" && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleStatusChange("unread")}
                                    >
                                        <RotateCcw className="mr-2 h-4 w-4" />
                                        Mark Unread
                                    </Button>
                                )}

                            {message.status !== "replied" && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleStatusChange("replied")}
                                >
                                    <CheckCheck className="mr-2 h-4 w-4" />
                                    Mark Replied
                                </Button>
                            )}

                            {message.status !== "archived" && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleStatusChange("archived")}
                                >
                                    <Archive className="mr-2 h-4 w-4" />
                                    Archive
                                </Button>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => onDelete(message)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </Button>

                            {/* <Button
                                type="button"
                                size="sm"
                                asChild
                            >
                                <a
                                    href={`mailto:${message.email}?subject=${encodeURIComponent(
                                        `Re: ${message.subject}`
                                    )}`}
                                >
                                    <Reply className="mr-2 h-4 w-4" />
                                    Reply
                                </a>
                            </Button> */}

                            <a
                                href={`mailto:${message.email}?subject=${encodeURIComponent(
                                    `Re: ${message.subject}`
                                )}`}
                                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
                            >
                                <Reply className="mr-2 h-4 w-4" />
                                Reply
                            </a>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default MessageDetailsDialog;