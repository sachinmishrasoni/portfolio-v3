
"use client";

import type { ReactNode } from "react";
import type { IconType } from "react-icons";

interface ProjectFormSectionProps {
    icon: IconType;
    title: string;
    description: string;
    children: ReactNode;
    className?: string;
}

const ProjectFormSection = ({
    icon: Icon,
    title,
    description,
    children,
    className = "",
}: ProjectFormSectionProps) => {
    return (
        <section
            className={`rounded-2xl border border-border bg-card p-3 ${className}`}
        >
            <div className="mb-5 flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon size={18} />
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-foreground">
                        {title}
                    </h3>

                    <p className="text-xs text-muted-foreground">
                        {description}
                    </p>
                </div>
            </div>

            <div className="space-y-5">
                {children}
            </div>
        </section>
    );
};

export default ProjectFormSection;
