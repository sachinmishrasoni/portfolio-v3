"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/PageHeader";
import ProjectDetails from "@/features/admin/projects/components/details";
import { useProject } from "@/features/admin/projects/useProjects";

const ProjectDetailPage = () => {
    const router = useRouter();
    const { projectId } = useParams<{ projectId: string }>();

    const { data: project, isLoading, error } = useProject(projectId);
    // console.log("project", project);

    if (isLoading) return <div>Loading project...</div>;
    if (error || !project) return <div>Project not found.</div>;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Project Details"
                description="View complete information about this project."
                onBack={() => router.push("/admin/projects")}
                actions={
                    <div className="flex gap-2">
                        <Button onClick={() => router.push(`/admin/projects/${projectId}/edit`)}>
                            Edit Project
                        </Button>

                        <Button variant="destructive">
                            Delete
                        </Button>
                    </div>
                }
            />

            <ProjectDetails data={project} />
        </div>
    );
};

export default ProjectDetailPage;