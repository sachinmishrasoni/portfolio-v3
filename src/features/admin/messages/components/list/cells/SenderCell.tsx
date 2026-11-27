
import { UserRound } from "lucide-react";
import type { ICellRendererParams } from "ag-grid-community";
import type { Message } from "../../../messages.types";

export default function SenderCell({
    data,
}: ICellRendererParams<Message>) {
    if (!data) return null;

    return (
        <div className="flex items-center gap-3 py-1">
            {/* User Icon */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UserRound className="h-4 w-4" />
            </div>

            {/* Sender Details */}
            <div className="flex min-w-0 flex-col justify-center">
                <span className="truncate font-medium leading-relaxed text-foreground">
                    {data.name}
                </span>

                <span className="truncate text-[10px] leading-relaxed text-muted-foreground">
                    {data.email}
                </span>
            </div>
        </div>
    );
}