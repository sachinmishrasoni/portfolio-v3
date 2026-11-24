import type { ICellRendererParams } from "ag-grid-community";
import type { Education } from "../../../education.types";
import { formatMonthYear } from "@/lib/utils/date.utils";

export default function DurationCell({
    data,
}: ICellRendererParams<Education>) {
    if (!data) return null;
    return (
        <span className="text-sm">
            {formatMonthYear(data.startDate)} - {data.isCurrent ? "Present" : formatMonthYear(data.endDate)}
        </span>
    );
}
