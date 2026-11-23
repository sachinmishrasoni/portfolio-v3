import type { ICellRendererParams } from "ag-grid-community";
import type { Skill } from "../../../skill.types";

export default function ProficiencyCell({
    value,
}: ICellRendererParams<Skill>) {
    const proficiency = Number(value ?? 0);

    return (
        <div className="flex items-center justify-center gap-3">
            <div className="h-2 w-20 overflow-hidden rounded-full bg-muted">
                <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${proficiency}%` }}
                />
            </div>

            <span className="text-sm font-medium">
                {proficiency}%
            </span>
        </div>
    );
}