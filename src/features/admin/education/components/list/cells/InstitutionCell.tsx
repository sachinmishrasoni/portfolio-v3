import type { ICellRendererParams } from "ag-grid-community";
import type { Education } from "../../../education.types";

export default function InstitutionCell({
    data,
}: ICellRendererParams<Education>) {
    if (!data) return null;
    return (
        <div className="flex items-center gap-3 py-1">
            {data.institutionLogo ? (
                <img src={data.institutionLogo} alt={data.institution}
                    className="h-10 w-10 rounded-md border object-contain p-1" />
            ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-sm font-semibold">
                    {data.institution.charAt(0).toUpperCase()}
                </div>
            )}
            <div className="min-w-0">
                <p className="truncate font-medium leading-relaxed">{data.institution}</p>
                <p className="truncate text-xs text-muted-foreground">{data.location}</p>
            </div>
        </div>
    );
}
