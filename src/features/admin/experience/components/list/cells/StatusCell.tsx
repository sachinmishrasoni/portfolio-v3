import type { ICellRendererParams } from "ag-grid-community";
import { Badge } from "@/components/ui/badge";
import type { Experience } from "../../../experience.types";

export default function StatusCell({
    value,
}: ICellRendererParams<Experience>) {
    if (value === undefined) return null;

    return (
        <Badge variant={value ? "default" : "secondary"}>
            {value ? "Active" : "Inactive"}
        </Badge>
    );
}