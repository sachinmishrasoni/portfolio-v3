
import { LuCalendar } from "react-icons/lu";
import type { Project } from "../../../projects.types";

interface TimelineProps {
    data: Project;
}

const formatDate = (value?: string) => {
    if (!value) return "Not specified";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Invalid date";

    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
};

const getDuration = (startDate: string, endDate?: string) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return "Not available";
    }

    const days = Math.max(
        1,
        Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    );

    return `${days} ${days === 1 ? "day" : "days"}`;
};

const Timeline = ({ data }: TimelineProps) => {
    return (
        <div className="rounded-xl border bg-card p-4">
            <h3 className="mb-3 flex items-center gap-2 font-semibold">
                <LuCalendar className="shrink-0 text-primary" />
                Timeline
            </h3>

            <div className="space-y-3">
                <div className="flex justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">Start Date</span>
                    <span className="font-medium">{formatDate(data.startDate)}</span>
                </div>

                <div className="flex justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">End Date</span>
                    <span className="font-medium">{formatDate(data.endDate)}</span>
                </div>

                <div className="flex justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                        {getDuration(data.startDate, data.endDate)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Timeline;
