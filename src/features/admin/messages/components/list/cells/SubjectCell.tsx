import type { ICellRendererParams } from "ag-grid-community";
import type { Message } from "../../../messages.types";
import { getMessagePreview } from "../../../messages.utils";

export default function SubjectCell({
    data,
}: ICellRendererParams<Message>) {
    if (!data) return null;

    return (
        <div className="flex flex-col justify-center py-1">
            <span className="font-medium text-foreground">
                {data.subject}
            </span>

            <span className="text-xs text-muted-foreground">
                {getMessagePreview(data.message, 65)}
            </span>
        </div>
    );
}