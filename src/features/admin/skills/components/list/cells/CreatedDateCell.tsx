import type { ICellRendererParams } from "ag-grid-community";
import type { Skill } from "../../../skill.types";

export default function CreatedDateCell({
    value,
}: ICellRendererParams<Skill>) {
    if (!value) return <span>—</span>;

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return <span>—</span>;
    }

    return (
        <span>
            {date.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            })}
        </span>
    );
}