
"use client";

import { useMemo } from "react";
import type { ColDef } from "ag-grid-community";

import { Badge } from "@/components/ui/badge";
import {
    DataTable,
    createActionColumn,
} from "@/components/common/DataTable";

// Project type
interface Project {
    id: string;
    name: string;
    description: string;
    category: string;
    status: "Completed" | "In Progress" | "On Hold" | "Pending";
    createdAt: string;
}

// Static project data
const projects: Project[] = [
    {
        id: "PRJ-001",
        name: "Portfolio Website",
        description: "Personal portfolio with admin dashboard",
        category: "Web Development",
        status: "Completed",
        createdAt: "2026-10-20",
    },
    {
        id: "PRJ-002",
        name: "E-commerce Platform",
        description: "Online shopping and product management",
        category: "E-commerce",
        status: "In Progress",
        createdAt: "2026-10-22",
    },
    {
        id: "PRJ-003",
        name: "Task Management",
        description: "Team collaboration and task tracking",
        category: "SaaS",
        status: "On Hold",
        createdAt: "2026-10-25",
    },
    {
        id: "PRJ-004",
        name: "CRM Dashboard",
        description: "Customer relationship management system",
        category: "Dashboard",
        status: "Pending",
        createdAt: "2026-10-28",
    },
    {
        id: "PRJ-005",
        name: "Resume Builder",
        description: "Dynamic resume creation platform",
        category: "Web Development",
        status: "Completed",
        createdAt: "2026-11-01",
    },
];

// Status badge
const StatusBadge = ({ status }: { status: Project["status"] }) => {
    const variants: Record<Project["status"], string> = {
        Completed: "bg-green-100 text-green-700 border-green-200",
        "In Progress": "bg-blue-100 text-blue-700 border-blue-200",
        "On Hold": "bg-orange-100 text-orange-700 border-orange-200",
        Pending: "bg-gray-100 text-gray-700 border-gray-200",
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

export default function ProjectTable() {
    // Row actions
    const handleView = (project: Project) => {
        console.log("View project:", project);
    };

    const handleEdit = (project: Project) => {
        console.log("Edit project:", project);
    };

    const handleDelete = (project: Project) => {
        console.log("Delete project:", project);
    };

    const handleAdd = () => {
        console.log("Add new project");
    };

    const handleFilter = () => {
        console.log("Open project filters");
    };

    // Table columns
    const columns = useMemo<ColDef<Project>[]>(
        () => [
            {
                field: "id",
                headerName: "Project ID",
                minWidth: 115,
                flex: 0.8,
            },
            {
                field: "name",
                headerName: "Project Name",
                minWidth: 170,
                flex: 1.2,
            },
            {
                field: "description",
                headerName: "Description",
                minWidth: 230,
                flex: 1.8,
                tooltipField: "description",
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
            createActionColumn<Project>({
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
        />
    );
}
