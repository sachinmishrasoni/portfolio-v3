import type { ICellRendererParams } from "ag-grid-community";
import { Badge } from "@/components/ui/badge";
import type { Education } from "../../../education.types";

export default function StatusCell({
    value,
}: ICellRendererParams<Education>) {
    if (value === undefined) return null;
    return (
        <Badge variant={value ? "default" : "secondary"}>
            {value ? "Active" : "Inactive"}
        </Badge>
    );
}
