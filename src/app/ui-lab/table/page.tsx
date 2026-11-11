"use client";

import { useMemo } from "react";
import type { ColDef } from "ag-grid-community";
import { MoreHorizontal } from "lucide-react";

import { DataTable } from "@/components/common/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Project = {
  id: string;
  name: string;
  category: string;
  status: "Active" | "In Progress" | "Completed" | "On Hold";
  createdAt: string;
};

const projects: Project[] = [
  {
    id: "PRJ-001",
    name: "Portfolio Website",
    category: "Web Development",
    status: "Completed",
    createdAt: "2026-10-20",
  },
  {
    id: "PRJ-002",
    name: "Admin Dashboard",
    category: "Dashboard",
    status: "In Progress",
    createdAt: "2026-10-22",
  },
  {
    id: "PRJ-003",
    name: "E-commerce Platform",
    category: "E-commerce",
    status: "Active",
    createdAt: "2026-10-25",
  },
  {
    id: "PRJ-004",
    name: "CRM Application",
    category: "Web Development",
    status: "On Hold",
    createdAt: "2026-10-28",
  },
  {
    id: "PRJ-005",
    name: "Task Management App",
    category: "Productivity",
    status: "Completed",
    createdAt: "2026-11-01",
  },
];

export default function TablePage() {
  const handleView = (project: Project) => {
    console.log("View:", project);
  };

  const handleEdit = (project: Project) => {
    console.log("Edit:", project);
  };

  const handleDelete = (project: Project) => {
    console.log("Delete:", project);
  };

  const columns = useMemo<ColDef<Project>[]>(
    () => [
      {
        field: "id",
        headerName: "Project ID",
        minWidth: 120,
      },
      {
        field: "name",
        headerName: "Project Name",
        minWidth: 200,
      },
      {
        field: "category",
        headerName: "Category",
        minWidth: 160,
      },
      {
        field: "status",
        headerName: "Status",
        minWidth: 150,
        cellRenderer: (params: { value: Project["status"] }) => {
          const variants: Record<
            Project["status"],
            "default" | "secondary" | "outline" | "destructive"
          > = {
            Active: "default",
            "In Progress": "secondary",
            Completed: "outline",
            "On Hold": "destructive",
          };

          return (
            <Badge variant={variants[params.value]}>
              {params.value}
            </Badge>
          );
        },
      },
      {
        field: "createdAt",
        headerName: "Created Date",
        minWidth: 150,
      },
      {
        headerName: "Actions",
        colId: "actions",
        sortable: false,
        filter: false,
        resizable: false,
        width: 100,
        // cellRenderer: (params: { data: Project }) => (
        //   <DropdownMenu>
        //     <DropdownMenuTrigger>
        //       <Button variant="ghost" size="icon">
        //         <MoreHorizontal className="h-4 w-4" />
        //       </Button>
        //     </DropdownMenuTrigger>

        //     <DropdownMenuContent align="end">
        //       <DropdownMenuItem
        //         onClick={() => handleView(params.data)}
        //       >
        //         View
        //       </DropdownMenuItem>

        //       <DropdownMenuItem
        //         onClick={() => handleEdit(params.data)}
        //       >
        //         Edit
        //       </DropdownMenuItem>

        //       <DropdownMenuItem
        //         className="text-destructive"
        //         onClick={() => handleDelete(params.data)}
        //       >
        //         Delete
        //       </DropdownMenuItem>
        //     </DropdownMenuContent>
        //   </DropdownMenu>
        // ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-6 p-6">
      <DataTable<Project>
        title="Project Management"
        columns={columns}
        data={projects}
        // getRowId={(project) => project.id}
        addButtonLabel="Add Project"
        searchPlaceholder="Search projects..."
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 50]}
        onAdd={() => console.log("Add project")}
        onFilterClick={() => console.log("Open filters")}
      />
    </div>
  );
}