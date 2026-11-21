
"use client";

import { useCallback, useMemo } from "react";
import type { ColDef } from "ag-grid-community";

import { Badge } from "@/components/ui/badge";
import {
    DataTable,
    createActionColumn,
} from "@/components/common/DataTable";
import { Project } from "../../projects.types";
import { useRouter } from "next/navigation";


// Status badge
const StatusBadge = ({ status }: { status: Project["status"] }) => {
    const variants: Record<Project["status"], string> = {
        "completed": "bg-green-100 text-green-700 border-green-200",
        "in-progress": "bg-blue-100 text-blue-700 border-blue-200",
        "on-hold": "bg-orange-100 text-orange-700 border-orange-200",
        // "pending": "bg-gray-100 text-gray-700 border-gray-200",
        "archived": "bg-red-100 text-red-700 border-red-200",
    };

    return (
        <Badge
            variant="outline"
            className={`${variants[status]} font-medium`}
        >
            {status}
        </Badge>
    );
};

export default function ProjectList({ projects, loading }: { projects: Project[], loading: boolean }) {
    const router = useRouter();


    const handleView = useCallback((project: Project) => {
        router.push(`/admin/projects/${project.id}`);
    }, [router]);

    const handleEdit = useCallback((project: Project) => {
        router.push(`/admin/projects/${project.id}/edit`);
    }, [router]);

    const handleDelete = (project: Project) => {
        console.log("Delete project:", project);
    };

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
                headerName: "Project ID",
                field: "projectId",
                minWidth: 115,
                flex: 0.8,
            },
            {
                headerName: "Project Name",
                field: "title",
                minWidth: 170,
                flex: 1.2,
            },
            {
                field: "overview",
                headerName: "Overview",
                minWidth: 230,
                flex: 1.8,
                // tooltipField: "overview",
                tooltip: ({ data }) => data?.overview ?? "",
            },
            {
                field: "category",
                headerName: "Category",
                minWidth: 150,
                flex: 1,
            },
            {
                field: "status",
                headerName: "Status",
                minWidth: 130,
                flex: 0.8,
                cellRenderer: (params: { value: Project["status"] }) => (
                    <StatusBadge status={params.value} />
                ),
            },
            {
                field: "createdAt",
                headerName: "Created Date",
                minWidth: 140,
                flex: 0.9,
            },

            // Reusable actions column
            createActionColumn({
                onView: handleView,
                onEdit: handleEdit,
                onDelete: handleDelete,
                showView: true,
                showEdit: true,
                showDelete: true,
            }),
        ],
        []
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
