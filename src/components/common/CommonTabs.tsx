"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { IconType } from "react-icons";
import { motion } from "motion/react";

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

export interface TabItem {
    value: string;
    label: string;
    icon?: IconType;
    count?: number;
    shortLabel?: string;
    content?: ReactNode;
    disabled?: boolean;
}

interface CommonTabsProps {
    tabs: TabItem[];
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    className?: string;
    listClassName?: string;
    contentClassName?: string;
}

const CommonTabs = ({
    tabs,
    defaultValue,
    value,
    onValueChange,
    className = "w-full",
    listClassName = "",
    contentClassName = "mt-2",
}: CommonTabsProps) => {
    const [internalValue, setInternalValue] = useState(
        defaultValue ?? tabs[0]?.value,
    );
    const rootRef = useRef<HTMLDivElement>(null);

    const activeValue = value ?? internalValue;

    const handleValueChange = (nextValue: string) => {
        if (value === undefined) {
            setInternalValue(nextValue);
        }

        onValueChange?.(nextValue);
    };

    // Bring a tab fully into view (centered) inside the scrollable list
    const scrollTabIntoView = (tabValue: string) => {
        const root = rootRef.current;
        if (!root) return;

        const tab = Array.from(
            root.querySelectorAll<HTMLElement>('[role="tab"]'),
        ).find((el) => el.dataset.tabValue === tabValue);

        tab?.scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest",
        });
    };

    // Covers changes from outside (controlled `value`) and normal clicks
    useEffect(() => {
        if (!activeValue) return;

        const frame = requestAnimationFrame(() => {
            scrollTabIntoView(activeValue);
        });

        return () => cancelAnimationFrame(frame);
    }, [activeValue]);

    return (
        <div ref={rootRef} className="contents">
            <Tabs
                value={activeValue}
                onValueChange={handleValueChange}
                className={className}
            >
                {/* Tab Navigation */}
                <TabsList
                    className={`
                        relative !h-12 !w-full !p-1 shrink-0
                        flex items-center justify-start gap-1.5
                        overflow-x-auto overflow-y-hidden
                        !rounded-xl border border-border bg-muted/70
                        [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
                        ${listClassName}
                    `}
                >
                    {tabs.map(
                        ({
                            value: tabValue,
                            label,
                            icon: Icon,
                            count,
                            shortLabel,
                            disabled,
                        }) => {
                            const isActive = activeValue === tabValue;
                            const countText =
                                count !== undefined ? ` (${count})` : "";

                            return (
                                <TabsTrigger
                                    key={tabValue}
                                    value={tabValue}
                                    disabled={disabled}
                                    data-tab-value={tabValue}
                                    onClick={() =>
                                        requestAnimationFrame(() =>
                                            scrollTabIntoView(tabValue),
                                        )
                                    }
                                    className="
                                        relative isolate flex !h-full min-w-fit flex-1
                                        items-center justify-center gap-2 whitespace-nowrap
                                        !rounded-lg border border-transparent !px-4 !py-0
                                        !shadow-none
                                        text-xs font-medium leading-none text-muted-foreground
                                        transition-colors duration-200
                                        hover:text-foreground cursor-pointer

                                        focus-visible:border-transparent
                                        focus-visible:outline-none
                                        focus-visible:ring-0

                                        data-[state=active]:!bg-transparent
                                        data-[state=active]:!text-primary
                                        data-[state=active]:!shadow-none
                                        data-[state=active]:!border-transparent
                                        dark:data-[state=active]:!bg-transparent
                                        dark:data-[state=active]:!text-primary
                                        dark:data-[state=active]:!shadow-none
                                        dark:data-[state=active]:!border-transparent

                                        sm:text-sm
                                    "
                                >
                                    {/* Animated Active Background */}
                                    {isActive && (
                                        <motion.span
                                            layoutId="common-tabs-active-background"
                                            className="
                                                absolute inset-0 -z-10 rounded-xl
                                                border border-primary/40 bg-primary/10
                                            "
                                            transition={{
                                                type: "spring",
                                                stiffness: 500,
                                                damping: 32,
                                                mass: 0.8,
                                            }}
                                        />
                                    )}

                                    {/* Tab Icon */}
                                    {Icon && (
                                        <Icon
                                            className={`
                                                relative z-10 h-4 w-4 shrink-0
                                                transition-colors duration-200
                                                ${isActive ? "text-primary" : ""}
                                            `}
                                        />
                                    )}

                                    {/* Desktop Label */}
                                    <span className="relative z-10 hidden sm:inline">
                                        {label}
                                        {countText}
                                    </span>

                                    {/* Mobile Label */}
                                    <span className="relative z-10 sm:hidden">
                                        {shortLabel ?? label}
                                        {countText}
                                    </span>
                                </TabsTrigger>
                            );
                        },
                    )}
                </TabsList>

                {/* Tab Content */}
                {tabs.map((tab) => (
                    <TabsContent
                        key={tab.value}
                        value={tab.value}
                        className={contentClassName}
                    >
                        {tab.content}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
};

export default CommonTabs;
