import React from 'react';
import Image from 'next/image';
import { FiAlertTriangle, FiCode } from 'react-icons/fi';
import type { Project } from './projects.data';

export const PlaceholderBadge: React.FC<{ className?: string }> = ({ className = '' }) => (
    <span
        className={`inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-amber-600 backdrop-blur dark:text-amber-400 ${className}`}
    >
        <FiAlertTriangle className="size-3" />
        Placeholder
    </span>
);

type ProjectImageProps = {
    project: Project;
    sizes: string;
    priority?: boolean;
};

/** Fills its parent (parent needs `relative` and a height). Shows a themed fallback when there is no image. */
const ProjectImage: React.FC<ProjectImageProps> = ({ project, sizes, priority }) => {
    if (project.image) {
        return (
            <Image
                src={project.image}
                alt={`${project.title} preview`}
                fill
                sizes={sizes}
                priority={priority}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
        );
    }

    return (
        <div
            aria-hidden
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/25 via-primary/10 to-sky-500/20"
        >
            <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:28px_28px]" />
            <FiCode className="relative size-12 text-primary/50 transition-transform duration-500 group-hover:scale-110" />
        </div>
    );
};

export default ProjectImage;
