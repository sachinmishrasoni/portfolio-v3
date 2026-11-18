
"use client";

import {
    FiFileText,
    FiImage,
    FiCode,
    FiSearch,
} from "react-icons/fi";

import CommonTabs, {
    type TabItem,
} from "@/components/common/CommonTabs";

import ProjectBanner from "./sections/ProjectBanner";
import Overview from "./sections/Overview";
import ProjectGallery from "./sections/ProjectGallery";
import ProjectInformation from "./sections/ProjectInformation";
import ProjectLinks from "./sections/ProjectLinks";
import SEOSection from "./sections/SEOSection";
import SystemInfo from "./sections/SystemInfo";
import Timeline from "./sections/Timeline";

import type { Project } from "../../projects.types";

interface ProjectDetailsProps {
    data: Project;
}

const ProjectDetails = ({ data }: ProjectDetailsProps) => {
    const tabs: TabItem[] = [
        {
            value: "overview",
            label: "Overview",
            icon: FiFileText,
            content: (
                <div className="space-y-4">
                    <Overview data={data} />
                    <ProjectGallery data={data} />
                </div>
            ),
        },
        {
            value: "media",
            label: "Media",
            count: data.images.length + 1,
            icon: FiImage,
            content: <ProjectGallery data={data} />,
        },
        {
            value: "technical",
            label: "Technical",
            shortLabel: "Tech",
            icon: FiCode,
            content: (
                <div className="space-y-4">
                    {/* Technology Stack */}
                    <div className="rounded-xl border bg-card p-5">
                        <h3 className="mb-4 font-semibold">Technology Stack</h3>

                        <div className="flex flex-wrap gap-2">
                            {data.technologies.map((technology) => (
                                <span
                                    key={technology}
                                    className="rounded-md border bg-background px-3 py-2 text-sm"
                                >
                                    {technology}
                                </span>
                            ))}
                        </div>
                    </div>

                    <ProjectLinks data={data} />
                </div>
            ),
        },
        {
            value: "seo",
            label: "SEO",
            icon: FiSearch,
            content: <SEOSection data={data} />,
        },
    ];

    return (
        <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1.8fr)_minmax(300px,0.9fr)]">

            {/* Left Content */}
            <main className="min-w-0 space-y-4">

                {/* Project Banner */}
                <ProjectBanner data={data} />

                {/* Project Tabs and Content */}
                <CommonTabs
                    tabs={tabs}
                    defaultValue="overview"
                />
            </main>

            {/* Right Sidebar */}
            <aside className="min-w-0 space-y-4">
                <ProjectInformation data={data} />
                <Timeline data={data} />
                <ProjectLinks data={data} />
                <SEOSection data={data} compact />
                <SystemInfo data={data} />
            </aside>
        </div>
    );
};

export default ProjectDetails;
