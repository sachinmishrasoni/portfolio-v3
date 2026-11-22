
import type { ICellRendererParams } from "ag-grid-community";
import type { Project } from "../../../projects.types";

export default function CreatedDateCell({
    value,
}: ICellRendererParams<Project>) {
    if (!value) {
        return <span className="text-muted-foreground">—</span>;
    }

    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
        return <span className="text-muted-foreground">—</span>;
    }

    return (
        <span className="text-sm text-muted-foreground">
            {new Intl.DateTimeFormat("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }).format(date)}
        </span>
    );
}
