import type { ICellRendererParams } from "ag-grid-community";
import { Badge } from "@/components/ui/badge";
import type { Education } from "../../../education.types";
import { getEducationLevelLabel } from "../../../education.utils";

export default function LevelCell({
    value,
}: ICellRendererParams<Education>) {
    if (!value) return null;
    return <Badge variant="secondary">{getEducationLevelLabel(value)}</Badge>;
}
