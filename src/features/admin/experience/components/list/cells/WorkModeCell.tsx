import type { ICellRendererParams } from "ag-grid-community";
import type { Experience } from "../../../experience.types";
import { getWorkModeLabel } from "../../../experience.utils";

export default function WorkModeCell({
    value,
}: ICellRendererParams<Experience>) {
    if (!value) return null;

    return <span>{getWorkModeLabel(value)}</span>;
}