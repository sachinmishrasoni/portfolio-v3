import type { ReactNode } from "react";
import { FiAlertCircle, FiInbox, FiLoader } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AsyncContentProps {
    isLoading?: boolean;
    isError?: boolean;
    isEmpty?: boolean;
    error?: { message?: string } | null;

    loadingMessage?: string;
    emptyMessage?: string;

    onRetry?: () => void;
    emptyAction?: {
        label: string;
        onClick: () => void;
    };

    /** Extra classes for the state container (e.g. change the min height) */
    className?: string;

    /** Rendered only when not loading, not errored and not empty */
    children?: ReactNode;
}

const containerClass =
    "flex min-h-[300px] flex-col items-center justify-center gap-3 text-center";

export function AsyncContent({
    isLoading = false,
    isError = false,
    isEmpty = false,
    error,
    loadingMessage = "Loading...",
    emptyMessage = "No data found.",
    onRetry,
    emptyAction,
    className,
    children,
}: AsyncContentProps) {
    // Loading State
    if (isLoading) {
        return (
            <div className={cn(containerClass, className)}>
                <FiLoader className="h-6 w-6 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">{loadingMessage}</p>
            </div>
        );
    }

    // Error State
    if (isError) {
        return (
            <div className={cn(containerClass, className)}>
                <FiAlertCircle className="h-8 w-8 text-destructive" />
                <p className="text-sm text-destructive">
                    {error?.message || "Something went wrong. Please try again."}
                </p>
                {onRetry && (
                    <Button type="button" size="sm" onClick={onRetry}>
                        Try Again
                    </Button>
                )}
            </div>
        );
    }

    // Empty State
    if (isEmpty) {
        return (
            <div className={cn(containerClass, className)}>
                <FiInbox className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{emptyMessage}</p>
                {emptyAction && (
                    <Button type="button" size="sm" onClick={emptyAction.onClick}>
                        {emptyAction.label}
                    </Button>
                )}
            </div>
        );
    }

    // Success State
    return <>{children}</>;
}

export default AsyncContent;