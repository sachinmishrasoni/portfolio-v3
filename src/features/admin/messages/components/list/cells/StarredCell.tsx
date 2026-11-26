import { Star } from "lucide-react";
import type { Message } from "../../../messages.types";
import { Button } from "@/components/ui/button";

interface StarredCellProps {
    message: Message | undefined;
    onToggle: (message: Message) => void;
}

export default function StarredCell({
    message,
    onToggle,
}: StarredCellProps) {
    if (!message) return null;

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title={message.isStarred ? "Remove star" : "Add star"}
            onClick={() => onToggle(message)}
        >
            <Star
                className={`h-4 w-4 ${message.isStarred
                        ? "fill-yellow-400 text-yellow-500"
                        : "text-muted-foreground"
                    }`}
            />
        </Button>
    );
}