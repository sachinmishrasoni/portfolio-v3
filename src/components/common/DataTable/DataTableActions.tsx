
"use client";

import React from "react";
import {
    MoreHorizontal,
    Eye,
    Pencil,
    Trash2,
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

export interface DataTableActionsProps<TData> {
    data: TData;
    onView?: (data: TData) => void;
    onEdit?: (data: TData) => void;
    onDelete?: (data: TData) => void;

    showView?: boolean;
    showEdit?: boolean;
    showDelete?: boolean;
}

export default function DataTableActions<TData>({
    data,
    onView,
    onEdit,
    onDelete,
    showView = true,
    showEdit = true,
    showDelete = true,
}: DataTableActionsProps<TData>) {
    const hasView = showView && !!onView;
    const hasEdit = showEdit && !!onEdit;
    const hasDelete = showDelete && !!onDelete;

    if (!hasView && !hasEdit && !hasDelete) {
        return null;
    }

    return (
        <div className="flex items-center justify-center">
            <DropdownMenu>
                <DropdownMenuTrigger
                    render={
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="Open row actions"
                            className="h-8 w-8"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    }
                />

                <DropdownMenuContent align="end" className="min-w-40">
                    {hasView && (
                        <DropdownMenuItem onClick={() => onView(data)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                        </DropdownMenuItem>
                    )}

                    {hasEdit && (
                        <DropdownMenuItem onClick={() => onEdit(data)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                    )}

                    {hasDelete && (
                        <>
                            {(hasView || hasEdit) && <DropdownMenuSeparator />}

                            <DropdownMenuItem
                                onClick={() => onDelete(data)}
                                className="text-destructive focus:text-destructive"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
