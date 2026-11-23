import type { ICellRendererParams } from "ag-grid-community";
import type { Skill } from "../../../skill.types";
import { getCategoryLabel } from "../../../skill.utils";

export default function CategoryCell({
  value,
}: ICellRendererParams<Skill>) {
  return <span>{getCategoryLabel(value)}</span>;
}