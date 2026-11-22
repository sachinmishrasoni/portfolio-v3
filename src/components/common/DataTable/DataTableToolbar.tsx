
"use client";

import { useState } from "react";
import { Filter, Plus, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

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
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <div className="flex w-full flex-wrap items-center justify-between gap-3">
            {/* Title */}
            <h2 className="min-w-0 flex-1 text-lg font-semibold tracking-tight">
                {title}
            </h2>

            {/* Toolbar Actions */}
            <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
                {/* Search */}
                {showSearch && (
                    <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                        <PopoverTrigger
                            render={
                                <Button
                                    type="button"
                                    variant={searchValue ? "secondary" : "outline"}
                                    size="icon"
                                    aria-label="Search"
                                    title="Search"
                                >
                                    <Search className="size-4" />
                                </Button>
                            }
                        />

                        <PopoverContent
                            align="end"
                            sideOffset={8}
                            className="w-[min(300px,calc(100vw-2rem))] p-3"
                        >
                            <div className="space-y-2">
                                <p className="text-sm font-medium">
                                    Search
                                </p>

                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                                    <Input
                                        autoFocus
                                        value={searchValue}
                                        onChange={(event) =>
                                            onSearchChange(event.target.value)
                                        }
                                        placeholder={searchPlaceholder}
                                        className="pl-9 pr-9"
                                        aria-label={searchPlaceholder}
                                    />

                                    {searchValue && (
                                        <button
                                            type="button"
                                            onClick={() => onSearchChange("")}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                                            aria-label="Clear search"
                                        >
                                            <X className="size-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                )}

                {/* Filter */}
                {showFilter && (
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={onFilterClick}
                        aria-label="Open filters"
                        title="Filters"
                    >
                        <Filter className="size-4" />
                    </Button>
                )}

                {/* Add */}
                {showAddButton && (
                    <Button type="button" onClick={onAdd}>
                        <Plus className="size-4" />
                        <span>{addButtonLabel}</span>
                    </Button>
                )}
            </div>
        </div>
    );
}
