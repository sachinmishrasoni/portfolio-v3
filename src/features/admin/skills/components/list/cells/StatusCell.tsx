import type { ICellRendererParams } from "ag-grid-community";
import type { Skill } from "../../../skill.types";
import { Badge } from "@/components/ui/badge";

export default function StatusCell({
    value,
}: ICellRendererParams<Skill>) {
    const isActive = Boolean(value);

    return (
        <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Active" : "Inactive"}
        </Badge>
    );
}