import type { ICellRendererParams } from "ag-grid-community";
import { Badge } from "@/components/ui/badge";
import type { Project } from "../../../projects.types";

type ProjectStatus = Project["status"];

const statusConfig: Record<
    ProjectStatus,
    { label: string; className: string }
> = {
    completed: {
        label: "Completed",
        className: "border-green-200 bg-green-50 text-green-700",
    },
    "in-progress": {
        label: "In Progress",
        className: "border-blue-200 bg-blue-50 text-blue-700",
    },
    "on-hold": {
        label: "On Hold",
        className: "border-orange-200 bg-orange-50 text-orange-700",
    },
    archived: {
        label: "Archived",
        className: "border-red-200 bg-red-50 text-red-700",
    },
};

export default function StatusCell({
    value,
}: ICellRendererParams<Project, ProjectStatus>) {
    if (!value || !statusConfig[value]) return null;

    const config = statusConfig[value];

    return (
        <Badge
            variant="outline"
            className={`${config.className} rounded-full px-2.5 py-1 text-xs font-medium`}
        >
            {config.label}
        </Badge>
    );
}