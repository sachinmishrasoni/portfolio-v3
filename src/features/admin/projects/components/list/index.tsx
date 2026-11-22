
"use client";

import { useCallback, useMemo } from "react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import {
    DataTable,
    createActionColumn,
} from "@/components/common/DataTable";
import { Project } from "../../projects.types";
import { useRouter } from "next/navigation";
import { alert } from "@/components/common/alert";
import { toast } from "sonner";
import { useDeleteProject } from "../../hooks/projects.mutations";
import ProjectCell from "./cells/ProjectCell";
import StatusCell from "./cells/StatusCell";
import CreatedDateCell from "./cells/CreatedDateCell";
import { getCategoryLabel } from "../../project.utils";


export default function ProjectList({ projects, loading }: { projects: Project[], loading: boolean }) {
    const router = useRouter();
    const { mutateAsync: deleteProject, isPending: isDeleting } = useDeleteProject();


    const handleView = useCallback((project: Project) => {
        router.push(`/admin/projects/${project.id}`);
    }, [router]);

    const handleEdit = useCallback((project: Project) => {
        router.push(`/admin/projects/${project.id}/edit`);
    }, [router]);

    const handleDelete = useCallback(async (project: Project) => {
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
        } catch (error) {
            console.error("Delete project failed:", error);
            toast.error("Failed to delete project.");
        }
    }, []);

    const handleAdd = useCallback(() => {
        router.push("/admin/projects/create");
    }, [router]);

    const handleFilter = () => {
        console.log("Open project filters");
    };

    // Table columns
    const columns = useMemo<ColDef<Project>[]>(
        () => [
            {
                headerName: "Project",
                field: "title",
                minWidth: 250,
                flex: 1,
                cellRenderer: ProjectCell,
                autoHeight: true
            },
            {
                headerName: "Overview",
                field: "overview",
                minWidth: 200,
                flex: 1,
                tooltip: ({ data }) => data?.overview ?? "",
            },
            {
                headerName: "Category",
                field: "category",
                minWidth: 140,
                flex: 0.9,
                cellRenderer: (props: ICellRendererParams) => getCategoryLabel(props.value),
            },
            {
                headerName: "Status",
                field: "status",
                minWidth: 130,
                flex: 0.8,
                cellRenderer: StatusCell,
            },
            {
                headerName: "Created Date",
                field: "createdAt",
                minWidth: 140,
                flex: 0.9,
                cellRenderer: CreatedDateCell,
            },
            createActionColumn({
                onView: handleView,
                onEdit: handleEdit,
                onDelete: handleDelete,
                showView: true,
                showEdit: true,
                showDelete: true,
            }),
        ],
        [handleView, handleEdit, handleDelete]
    );

    return (
        <DataTable<Project>
            title="Project Management"
            columns={columns}
            data={projects}
            toolbar={{
                addButtonLabel: "Add Project",
                searchPlaceholder: "Search projects...",

                onAdd: handleAdd,
                onFilterClick: handleFilter,
            }}
            loading={loading}
        />
    );
}
