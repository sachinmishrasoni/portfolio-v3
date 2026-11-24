import type { ICellRendererParams } from "ag-grid-community";
import type { Experience } from "../../../experience.types";
import { getEmploymentTypeLabel } from "../../../experience.utils";

export default function EmploymentTypeCell({
    value,
}: ICellRendererParams<Experience>) {
    if (!value) return null;

    return <span>{getEmploymentTypeLabel(value)}</span>;
}