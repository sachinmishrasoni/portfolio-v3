
import * as React from "react";
import { cn } from "@/lib/utils";

export interface PaperProps
    extends React.HTMLAttributes<HTMLDivElement> {
    elevation?: 0 | 1 | 2 | 3 | 4;
    variant?: "elevation" | "outlined";
    rounded?: "none" | "sm" | "md" | "lg" | "xl" | "2xl";
}

const elevationStyles: Record<NonNullable<PaperProps["elevation"]>, string> = {
    0: "shadow-none",
    1: "shadow-sm",
    2: "shadow",
    3: "shadow-md",
    4: "shadow-lg",
};

const roundedStyles: Record<NonNullable<PaperProps["rounded"]>, string> = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
};

const Paper = React.forwardRef<HTMLDivElement, PaperProps>(
    (
        {
            children,
            className,
            elevation = 1,
            variant = "elevation",
            rounded = "xl",
            ...props
        },
        ref
    ) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "bg-card text-card-foreground p-3",
                    roundedStyles[rounded],
                    variant === "outlined"
                        ? "border border-border shadow-none"
                        : elevationStyles[elevation],
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Paper.displayName = "Paper";

export default Paper;
