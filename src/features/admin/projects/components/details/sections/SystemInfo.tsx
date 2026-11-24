
import { LuDatabase } from "react-icons/lu";
import type { Project } from "../../../projects.types";
import { formatDate } from "@/lib/utils/date.utils";

interface SystemInfoProps {
    data: Project;
}

const SystemInfo = ({ data }: SystemInfoProps) => {
    return (
        <div className="rounded-xl border bg-card p-4">

            <h3 className="mb-3 flex items-center gap-2 font-semibold">
                <LuDatabase className="shrink-0 text-primary" />
                System Information
            </h3>

            <div className="space-y-3">
                <div className="flex justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">Created At</span>
                    <span className="text-right font-medium">
                        {formatDate(data.createdAt)}
                    </span>
                </div>

                <div className="flex justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">Updated At</span>
                    <span className="text-right font-medium">
                        {formatDate(data.updatedAt)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SystemInfo;
