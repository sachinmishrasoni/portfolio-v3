
import Image from "next/image";
import {
    FiCheckCircle,
    FiUser,
    FiStar,
} from "react-icons/fi";

import type { Project } from "../../../projects.types";
import {
    getProjectStatusLabel,
    getProjectTypeLabel,
} from "../../../project.utils";

interface ProjectBannerProps {
    data: Project;
}

const ProjectBanner = ({ data }: ProjectBannerProps) => {
    return (
        <section className="rounded-xl border bg-card p-3">
            <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2">
                {/* Project Thumbnail */}
                <div className="relative h-50 w-full overflow-hidden rounded-xl sm:h-50">
                    <Image
                        src={data.thumbnail.url}
                        alt={data.title}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                </div>

                {/* Project Information */}
                <div className="min-w-0 space-y-0">
                    {/* Project ID */}
                    <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold text-primary mb-2">
                        {data.projectId}
                    </span>

                    {/* Project Title */}
                    <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                        {data.title}
                    </h2>

                    {/* Project Overview */}
                    <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">
                        {data.overview}
                    </p>

                    {/* Project Badges */}
                    <div className="flex flex-wrap items-center gap-2 pt-3">
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-green-100 px-2.5 py-1.5 text-xs font-medium text-green-700">
                            <FiCheckCircle className="h-3.5 w-3.5" />
                            {getProjectStatusLabel(data.status)}
                        </span>

                        <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary">
                            <FiUser className="h-3.5 w-3.5" />
                            {getProjectTypeLabel(data.projectType)}
                        </span>

                        {data.featured && (
                            <span className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium">
                                <FiStar className="h-3.5 w-3.5 text-amber-500" />
                                Featured
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProjectBanner;
