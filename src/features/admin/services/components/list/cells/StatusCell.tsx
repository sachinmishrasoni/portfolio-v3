import type { ICellRendererParams } from "ag-grid-community";
import { Badge } from "@/components/ui/badge";
import type { Service } from "../../../services.types";

export default function StatusCell({
    value,
}: ICellRendererParams<Service>) {
    if (value === undefined) return null;
    return (
        <Badge variant={value ? "default" : "secondary"}>
            {value ? "Active" : "Inactive"}
        </Badge>
    );
}
