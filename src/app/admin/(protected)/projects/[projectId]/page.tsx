"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/PageHeader";
import ProjectDetails from "@/features/admin/projects/components/details";
import { LucideEdit } from "lucide-react";
import { LuTrash2 } from "react-icons/lu";
import AsyncContent from "@/components/common/AsyncContent";
import { useProject } from "@/features/admin/projects/hooks/projects.queries";
import { useCallback } from "react";
import { toast } from "sonner";
import { Project } from "@/features/portfolio/projects/projects.data";
import { alert } from "@/components/common/alert";
import { useDeleteProject } from "@/features/admin/projects/hooks/projects.mutations";

const ProjectDetailPage = () => {
    const router = useRouter();
    const { projectId } = useParams<{ projectId: string }>();

    const { data: project, isLoading, error, isError, refetch } = useProject(projectId);
    const { mutateAsync: deleteProject, isPending: isDeleting } = useDeleteProject();

    const handleDelete = useCallback(async () => {
        if (!project) return;

        const confirmed = await alert.confirm({
            title: "Delete Project?",
            description: `Are you sure you want to delete "${project.title}"? This action cannot be undone.`,
            confirmText: "Delete",
            cancelText: "Cancel",
        });
        if (!confirmed) return;
        try {
            await deleteProject(project);
            toast.success("Project deleted successfully.");
            router.push("/admin/projects");
        } catch (error) {
            console.error("Delete project failed:", error);
            toast.error("Failed to delete project.");
        }
    }, [project, deleteProject, router]);

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
                                onClick={handleDelete}
                                startIcon={<LuTrash2 />}
                                loading={isDeleting}
                                loadingText="Deleting..."
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