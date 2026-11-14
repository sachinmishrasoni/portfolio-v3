"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";

import PageHeader from "@/components/common/PageHeader";
import Paper from "@/components/common/Paper";
// import ProjectDetails from "@/features/admin/projects/components/ProjectDetails";

const ProjectDetailPage: React.FC = () => {
    const router = useRouter();
    const params = useParams();

    const projectId = params.id as string;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Project Details"
                description="View project information and publishing details."
                onBack={() => router.push("/admin/projects")}
                actions={
                    <button
                        onClick={() =>
                            router.push(`/admin/projects/${projectId}/edit`)
                        }
                    >
                        Edit Project
                    </button>
                }
            />

            <Paper className="p-5">
                {/* <ProjectDetails projectId={projectId} /> */}
            </Paper>
        </div>
    );
};

export default ProjectDetailPage;