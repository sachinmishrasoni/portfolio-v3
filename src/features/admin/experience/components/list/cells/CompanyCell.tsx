import type { ICellRendererParams } from "ag-grid-community";
import type { Experience } from "../../../experience.types";

export default function CompanyCell({
    data,
}: ICellRendererParams<Experience>) {
    if (!data) return null;

    return (
        <div className="flex items-center gap-3 py-1">
            {data.companyLogo ? (
                <img
                    src={data.companyLogo}
                    alt={data.company}
                    className="h-10 w-10 rounded-md border object-contain p-1"
                />
            ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-sm font-semibold">
                    {data.company.charAt(0).toUpperCase()}
                </div>
            )}

            <div className="min-w-0">
                <p className="truncate font-medium leading-relaxed">{data.company}</p>
                <p className="truncate text-xs text-muted-foreground">
                    {data.location}
                </p>
            </div>
        </div>
    );
}