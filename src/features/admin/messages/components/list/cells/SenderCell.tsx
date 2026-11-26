import type { ICellRendererParams } from "ag-grid-community";
import type { Message } from "../../../messages.types";

export default function SenderCell({
    data,
}: ICellRendererParams<Message>) {
    if (!data) return null;

    return (
        <div className="flex flex-col justify-center py-1">
            <span className="font-medium text-foreground leading-relaxed">
                {data.name}
            </span>

            <span className="text-[10px] text-muted-foreground leading-2">
                {data.email}
            </span>
        </div>
    );
}