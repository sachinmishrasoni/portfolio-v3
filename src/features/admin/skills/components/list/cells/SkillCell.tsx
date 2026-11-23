
import { Icon } from "@iconify/react";
import type { ICellRendererParams } from "ag-grid-community";
import type { Skill } from "../../../skill.types";
import { getCategoryLabel } from "../../../skill.utils";

export default function SkillCell({
    data,
}: ICellRendererParams<Skill>) {
    if (!data) return null;

    return (
        <div className="flex items-center gap-3 py-1.5">
            <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted"
            >
                <Icon
                    icon={data.icon}
                    width={24}
                    height={24}
                    color={data.color || "currentColor"}
                />
            </div>

            <div className="">
                <p className="font-medium leading-relaxed">{data.name}</p>
                <p className="text-xs text-muted-foreground ">{getCategoryLabel(data.category)}</p>
            </div>
        </div>
    );
}
