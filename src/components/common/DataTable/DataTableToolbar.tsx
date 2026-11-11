"use client";

import { Filter, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DataTableToolbarProps {
    title: string;
    addButtonLabel: string;
    searchPlaceholder: string;
    searchValue: string;

    showSearch: boolean;
    showFilter: boolean;
    showAddButton: boolean;

    onSearchChange: (value: string) => void;
    onAdd?: () => void;
    onFilterClick?: () => void;
}

export function DataTableToolbar({
    title,
    addButtonLabel,
    searchPlaceholder,
    searchValue,
    showSearch,
    showFilter,
    showAddButton,
    onSearchChange,
    onAdd,
    onFilterClick,
}: DataTableToolbarProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold tracking-tight">{title}</h2>

            <div className="flex flex-wrap items-center gap-2">
                {showSearch && (
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                            value={searchValue}
                            onChange={(event) => onSearchChange(event.target.value)}
                            placeholder={searchPlaceholder}
                            className="pl-9"
                            aria-label={searchPlaceholder}
                        />
                    </div>
                )}

                {showFilter && (
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={onFilterClick}
                        aria-label="Open filters"
                    >
                        <Filter className="size-4" />
                    </Button>
                )}

                {showAddButton && (
                    <Button type="button" onClick={onAdd}>
                        <Plus />
                        {addButtonLabel}
                    </Button>
                )}
            </div>
        </div>
    );
}
