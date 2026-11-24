import type { ICellRendererParams } from "ag-grid-community";
import { Icon } from "@iconify/react";
import type { Service } from "../../../services.types";

export default function ServiceCell({
    data,
}: ICellRendererParams<Service>) {
    if (!data) return null;
    return (
        <div className="flex items-center gap-3 py-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-muted">
                {data.icon ? (
                    <Icon icon={data.icon} width={22} height={22} />
                ) : (
                    data.title.charAt(0).toUpperCase()
                )}
            </div>
            <div className="min-w-0">
                <p className="truncate font-medium leading-relaxed">{data.title}</p>
                <p className="truncate text-xs text-muted-foreground">{data.tagline}</p>
            </div>
        </div>
    );
}
