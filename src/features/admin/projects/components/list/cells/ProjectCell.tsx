
import type { ICellRendererParams } from "ag-grid-community";
import type { Project } from "../../../projects.types";

export default function ProjectCell({
    data,
}: ICellRendererParams<Project>) {
    if (!data) return null;

    const initials = data.title
        .split(" ")
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();

    return (
        <div className="flex h-full items-center gap-3 py-1.5">
          <div className="flex h-9 w-13 shrink-0 items-center justify-center overflow-hidden rounded-sm border bg-muted">
                {data.thumbnail?.url ? (
                    <img
                        src={data.thumbnail.url}
                        alt={data.title}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <span className="text-sm font-semibold text-muted-foreground">
                        {initials}
                    </span>
                )}
            </div>

            <div className="min-w-0 space-y-0">
                <p
                    className="truncate text-sm font-semibold leading-relaxed text-foreground"
                    title={data.title}
                >
                    {data.title}
                </p>

                <p className="truncate text-[10px] text-muted-foreground leading-3">
                    ID: {data.projectId}
                </p>
            </div>
        </div>
    );
}
