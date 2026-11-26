import type { ICellRendererParams } from "ag-grid-community";

import type { Message, MessageStatus } from "../../../messages.types";
import { MESSAGE_STATUS_CONFIG } from "../../../messages.constants";

import { Badge } from "@/components/ui/badge";

interface StatusCellProps extends ICellRendererParams<Message> {
    value: MessageStatus;
}

export default function StatusCell({ value }: StatusCellProps) {
    if (!value) return null;

    const config = MESSAGE_STATUS_CONFIG[value];

    return (
        <Badge
            variant="outline"
            className={config.className}
        >
            {config.label}
        </Badge>
    );
}