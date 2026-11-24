import type { ICellRendererParams } from "ag-grid-community";
import type { Experience } from "../../../experience.types";
import { formatMonthYear } from "@/lib/utils/date.utils";

export default function DurationCell({
    data,
}: ICellRendererParams<Experience>) {
    if (!data) return null;

    const startDate = formatMonthYear(data.startDate);

    const endDate = data.isCurrent
        ? "Present"
        : formatMonthYear(data.endDate);

    return (
        <span className="text-sm">
            {startDate} - {endDate}
        </span>
    );
}