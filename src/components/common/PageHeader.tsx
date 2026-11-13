
import React from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

import { Button } from "@/components/ui/button";

interface PageHeaderProps {
    title: string;
    description?: string;
    showBackButton?: boolean;
    onBack?: () => void;
    backLabel?: string;
    actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    description,
    showBackButton = true,
    onBack,
    backLabel = "Go back",
    actions,
}) => {
    const router = useRouter();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            router.back();
        }
    };

    return (
        <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
                {showBackButton && (
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleBack}
                        className="size-9 shrink-0"
                        aria-label={backLabel}
                    >
                        <FiArrowLeft className="size-4" />
                    </Button>
                )}

                <div className="min-w-0">
                    <h1 className="text-xl font-semibold tracking-tight text-foreground">
                        {title}
                    </h1>

                    {description && (
                        <p className="mt-0 text-xs text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            {actions && (
                <div className="flex shrink-0 items-center gap-2">
                    {actions}
                </div>
            )}
        </div>
    );
};

export default PageHeader;
