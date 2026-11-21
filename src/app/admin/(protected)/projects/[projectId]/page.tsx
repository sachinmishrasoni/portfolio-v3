"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/PageHeader";
import ProjectDetails from "@/features/admin/projects/components/details";
import { LucideEdit } from "lucide-react";
import { LuTrash2 } from "react-icons/lu";
import AsyncContent from "@/components/common/AsyncContent";
import { useProject } from "@/features/admin/projects/hooks/projects.queries";

const ProjectDetailPage = () => {
    const router = useRouter();
    const { projectId } = useParams<{ projectId: string }>();

    const { data: project, isLoading, error, isError, refetch } = useProject(projectId);

    return (
        <AsyncContent
            isLoading={isLoading}
            isError={isError}
            error={error}
            isEmpty={!project}
            onRetry={() => refetch()}
            loadingMessage="Loading project..."
            emptyMessage="Project not found."
        >
            <div className="space-y-6">
                <PageHeader
                    title="Project Details"
                    description="View complete information about this project."
                    onBack={() => router.push("/admin/projects")}
                    actions={
                        <div className="flex gap-2">
                            <Button
                                onClick={() => router.push(`/admin/projects/${projectId}/edit`)}
                                startIcon={<LucideEdit />}
                            >
                                Edit Project
                            </Button>

                            <Button
                                variant="destructive"
                                onClick={() => console.log("Delete project")}
                                startIcon={<LuTrash2 />}
                            >
                                Delete
                            </Button>
                        </div>
                    }
                />

                {project && <ProjectDetails data={project} />}
            </div>
        </AsyncContent>
    );
};

export default ProjectDetailPage;