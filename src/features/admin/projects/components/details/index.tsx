"use client";

import { useState } from "react";
import {
    FiFileText,
    FiImage,
    FiCode,
    FiSearch,
} from "react-icons/fi";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    const [activeTab, setActiveTab] = useState("overview");

    const tabs = [
        {
            value: "overview",
            label: "Overview",
            icon: FiFileText,
            component: <Overview data={data} />,
        },
        {
            value: "media",
            label: `Media (${data.images.length + 1})`,
            icon: FiImage,
            component: <ProjectGallery data={data} />,
        },
        {
            value: "technical",
            label: "Technical",
            icon: FiCode,
            component: (
                <div className="space-y-4">
                    <ProjectLinks data={data} />
                </div>
            ),
        },
        {
            value: "seo",
            label: "SEO",
            icon: FiSearch,
            component: <SEOSection data={data} />,
        },
    ];

    return (
        <div className="space-y-5">
            {/* Project Banner */}
            <div className="rounded-xl border bg-card p-4">
                <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-2">
                    <div className="overflow-hidden rounded-lg">
                        <img
                            src={data.thumbnail.url}
                            alt={data.title}
                            className="h-56 w-full object-cover"
                        />
                    </div>

                    <div className="space-y-3">
                        <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                            {data.projectId}
                        </span>

                        <h2 className="text-2xl font-bold">{data.title}</h2>

                        <p className="text-sm text-muted-foreground">
                            {data.overview}
                        </p>

                        <div className="flex flex-wrap gap-2">
                            <span className="rounded-md bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                {data.status}
                            </span>

                            <span className="rounded-md bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                {data.projectType}
                            </span>

                            {data.featured && (
                                <span className="rounded-md border px-3 py-1 text-xs">
                                    Featured
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Project Tabs and Sidebar */}
            <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
                <div className="min-w-0">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid h-auto w-full grid-cols-4">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;

                                return (
                                    <TabsTrigger
                                        key={tab.value}
                                        value={tab.value}
                                        className="gap-2 py-3"
                                    >
                                        <Icon size={16} />
                                        <span className="hidden sm:inline">{tab.label}</span>
                                        <span className="sm:hidden">
                                            {tab.value === "technical"
                                                ? "Tech"
                                                : tab.value.charAt(0).toUpperCase() +
                                                tab.value.slice(1)}
                                        </span>
                                    </TabsTrigger>
                                );
                            })}
                        </TabsList>

                        {tabs.map((tab) => (
                            <TabsContent
                                key={tab.value}
                                value={tab.value}
                                className="mt-4"
                            >
                                {tab.component}
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>

                {/* Right Sidebar */}
                <aside className="space-y-4">
                    <ProjectInformation data={data} />
                    <Timeline data={data} />
                    <ProjectLinks data={data} />
                    <SEOSection data={data} compact />
                    <SystemInfo data={data} />
                </aside>
            </div>
        </div>
    );
};

export default ProjectDetails;