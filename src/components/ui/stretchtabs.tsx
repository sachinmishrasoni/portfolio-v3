
"use client";

import {
    useCallback,
    useEffect,
    useId,
    useLayoutEffect,
    useRef,
    useState,
    type KeyboardEvent,
    type ReactNode,
} from "react";

import {
    AnimatePresence,
    animate,
    motion,
    useMotionValue,
    useReducedMotion,
    useTransform,
    type Variants,
} from "motion/react";

import { cn } from "@/lib/utils";

// Avoids the SSR warning for useLayoutEffect
const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Types
export type StretchTabItem = {
    label: ReactNode;
    value: string;
    icon?: ReactNode;
    content?: ReactNode;
    disabled?: boolean;
};

export type StretchTabsProps = {
    items: StretchTabItem[];
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    variant?: "pill" | "underline";
    fullWidth?: boolean;
    className?: string;
    listClassName?: string;
    indicatorClassName?: string;
    panelClassName?: string;
};

// Constants
const LEADING_SPRING = {
    type: "spring",
    stiffness: 520,
    damping: 40,
    mass: 0.8,
} as const;

const TRAILING_SPRING = {
    type: "spring",
    stiffness: 170,
    damping: 26,
    mass: 0.9,
} as const;

const PANEL_OFFSET = 16;

// Panel animation
const panelVariants: Variants = {
    enter: (direction: number) => ({
        opacity: 0,
        x: direction * PANEL_OFFSET,
        filter: "blur(4px)",
    }),
    center: {
        opacity: 1,
        x: 0,
        filter: "blur(0px)",
    },
    exit: (direction: number) => ({
        opacity: 0,
        x: direction * -PANEL_OFFSET,
        filter: "blur(4px)",
    }),
};

export default function StretchTabs({
    items,
    value,
    defaultValue,
    onChange,
    variant = "pill",
    fullWidth = false,
    className,
    listClassName,
    indicatorClassName,
    panelClassName,
}: StretchTabsProps) {
    const baseId = useId();
    const reduceMotion = useReducedMotion();

    const listRef = useRef<HTMLDivElement>(null);
    const tabRefs = useRef(new Map<string, HTMLButtonElement>());
    const hasPlaced = useRef(false);

    const [ready, setReady] = useState(false);

    const [internalValue, setInternalValue] = useState(
        defaultValue ??
        items.find((item) => !item.disabled)?.value ??
        ""
    );

    // Support controlled and uncontrolled usage
    const isControlled = value !== undefined;
    const current = isControlled ? value : internalValue;

    const currentRef = useRef(current);

    useEffect(() => {
        currentRef.current = current;
    }, [current]);

    // Animated indicator
    const left = useMotionValue(0);
    const right = useMotionValue(0);

    const width = useTransform(
        [left, right],
        ([l, r]: number[]) => r - l
    );

    const activeIndex = items.findIndex(
        (item) => item.value === current
    );

    const activeItem = items[activeIndex];

    const hasContent = items.some(
        (item) => item.content !== undefined
    );

    // Track direction for panel animation
    const previousIndex = useRef(activeIndex);

    const direction =
        activeIndex >= previousIndex.current ? 1 : -1;

    useEffect(() => {
        previousIndex.current = activeIndex;
    }, [activeIndex]);

    // Position the active indicator
    const place = useCallback(
        (key: string, animated: boolean) => {
            const tab = tabRefs.current.get(key);
            if (!tab) return;

            const nextLeft = tab.offsetLeft;
            const nextRight = nextLeft + tab.offsetWidth;

            if (!animated || reduceMotion) {
                left.stop();
                right.stop();

                left.set(nextLeft);
                right.set(nextRight);
            } else {
                const movingRight = nextLeft >= left.get();

                animate(
                    right,
                    nextRight,
                    movingRight
                        ? LEADING_SPRING
                        : TRAILING_SPRING
                );

                animate(
                    left,
                    nextLeft,
                    movingRight
                        ? TRAILING_SPRING
                        : LEADING_SPRING
                );
            }

            // Scroll only the tab list when necessary
            const list = listRef.current;

            if (
                list &&
                list.scrollWidth > list.clientWidth
            ) {
                const tabLeft = tab.offsetLeft;
                const tabRight = tabLeft + tab.offsetWidth;

                const visibleLeft = list.scrollLeft;
                const visibleRight =
                    visibleLeft + list.clientWidth;

                if (
                    tabLeft < visibleLeft ||
                    tabRight > visibleRight
                ) {
                    list.scrollTo({
                        left:
                            tabLeft -
                            (list.clientWidth -
                                tab.offsetWidth) /
                            2,
                        behavior: reduceMotion
                            ? "auto"
                            : "smooth",
                    });
                }
            }
        },
        [left, right, reduceMotion]
    );

    // Initial placement and tab changes
    useIsomorphicLayoutEffect(() => {
        if (!current || !tabRefs.current.has(current)) {
            return;
        }

        place(current, hasPlaced.current);

        if (!hasPlaced.current) {
            hasPlaced.current = true;
            setReady(true);
        }
    }, [current, place]);

    // Recalculate indicator position when tabs resize
    useEffect(() => {
        const list = listRef.current;
        if (!list) return;

        const observer = new ResizeObserver(() => {
            if (
                currentRef.current &&
                tabRefs.current.has(currentRef.current)
            ) {
                place(currentRef.current, false);
            }
        });

        observer.observe(list);

        tabRefs.current.forEach((tab) => {
            observer.observe(tab);
        });

        return () => observer.disconnect();
    }, [items.length, place]);

    // Select a tab
    const select = (next: string) => {
        if (next === current) return;

        if (!isControlled) {
            setInternalValue(next);
        }

        onChange?.(next);
    };

    // Keyboard navigation
    const handleKeyDown = (
        event: KeyboardEvent<HTMLDivElement>
    ) => {
        const enabled = items.filter(
            (item) => !item.disabled
        );

        if (enabled.length === 0) return;

        const index = enabled.findIndex(
            (item) => item.value === current
        );

        let nextIndex: number | undefined;

        switch (event.key) {
            case "ArrowRight":
                nextIndex = (index + 1) % enabled.length;
                break;

            case "ArrowLeft":
                nextIndex =
                    (index - 1 + enabled.length) %
                    enabled.length;
                break;

            case "Home":
                nextIndex = 0;
                break;

            case "End":
                nextIndex = enabled.length - 1;
                break;

            default:
                return;
        }

        event.preventDefault();

        const target = enabled[nextIndex];

        select(target.value);
        tabRefs.current.get(target.value)?.focus();
    };

    return (
        <div
            className={cn(
                "w-full min-w-0 max-w-full",
                className
            )}
        >
            {/* Tab list */}
            <div
                ref={listRef}
                role="tablist"
                aria-orientation="horizontal"
                onKeyDown={handleKeyDown}
                className={cn(
                    "scrollbar-hide relative flex max-w-full min-w-0 items-center gap-1",
                    "overflow-x-auto overflow-y-hidden",
                    "overscroll-x-contain",
                    "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                    variant === "pill"
                        ? "rounded-full border bg-muted/50 p-1"
                        : "border-b",
                    fullWidth
                        ? "w-full"
                        : variant === "pill"
                            ? "w-fit"
                            : "w-full",
                    listClassName
                )}
            >
                {/* Active indicator */}
                <motion.span
                    aria-hidden="true"
                    style={{
                        x: left,
                        width,
                        opacity: ready ? 1 : 0,
                    }}
                    className={cn(
                        "pointer-events-none absolute left-0",
                        variant === "pill"
                            ? "inset-y-1 rounded-full bg-primary shadow-sm ring-1 ring-border"
                            : "bottom-0 h-0.5 rounded-full bg-primary",
                        indicatorClassName
                    )}
                />

                {items.map((item) => {
                    const isActive =
                        item.value === current;

                    return (
                        <button
                            key={item.value}
                            ref={(element) => {
                                if (element) {
                                    tabRefs.current.set(
                                        item.value,
                                        element
                                    );
                                } else {
                                    tabRefs.current.delete(
                                        item.value
                                    );
                                }
                            }}
                            type="button"
                            role="tab"
                            id={`${baseId}-tab-${item.value}`}
                            aria-selected={isActive}
                            aria-controls={`${baseId}-panel-${item.value}`}
                            tabIndex={isActive ? 0 : -1}
                            disabled={item.disabled}
                            onClick={() =>
                                select(item.value)
                            }
                            className={cn(
                                "relative z-10 inline-flex shrink-0 items-center justify-center gap-2",
                                "whitespace-nowrap text-xs font-medium",
                                "outline-none transition-colors duration-200",
                                "focus-visible:ring-2 focus-visible:ring-ring/60",
                                "disabled:pointer-events-none disabled:opacity-40",
                                "cursor-pointer",
                                variant === "pill"
                                    ? "rounded-full px-3 py-1.5"
                                    : "px-4 pb-3 pt-2",
                                fullWidth && "flex-1",
                                isActive
                                    ? "text-primary-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    );
                })}
            </div>

            {/* Animated tab panel */}
            {hasContent && activeItem && (
                <div
                    className={cn(
                        "mt-4 min-w-0 max-w-full",
                        "overflow-x-clip",
                        panelClassName
                    )}
                >
                    <AnimatePresence
                        mode="wait"
                        initial={false}
                        custom={direction}
                    >
                        <motion.div
                            key={current}
                            role="tabpanel"
                            id={`${baseId}-panel-${current}`}
                            aria-labelledby={`${baseId}-tab-${current}`}
                            tabIndex={0}
                            custom={direction}
                            variants={panelVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                duration: reduceMotion
                                    ? 0
                                    : 0.25,
                                ease: "easeOut",
                            }}
                            className="min-w-0 max-w-full outline-none"
                        >
                            {activeItem.content}
                        </motion.div>
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
