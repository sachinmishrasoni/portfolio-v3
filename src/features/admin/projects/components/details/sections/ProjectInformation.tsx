
import { LuBadgeInfo } from "react-icons/lu";
import { getCategoryLabel, getProjectStatusLabel, getProjectTypeLabel } from "../../../project.utils";
import type { Project } from "../../../projects.types";

interface ProjectInformationProps {
    data: Project;
}

const DetailRow = ({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) => (
    <div className="flex items-center justify-between gap-3 border-b py-2.5 last:border-0">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-right text-sm font-medium">{children}</span>
    </div>
);

const ProjectInformation = ({ data }: ProjectInformationProps) => {
    return (
        <div className="rounded-xl border bg-card p-4">
            <h3 className="mb-3 flex items-center gap-2 font-semibold">
                <LuBadgeInfo className="shrink-0 text-primary" />
                Project Information
            </h3>

            <DetailRow label="Project ID">{data.projectId}</DetailRow>
            <DetailRow label="Slug">{data.slug}</DetailRow>
            <DetailRow label="Category">{getCategoryLabel(data.category)}</DetailRow>
            <DetailRow label="Project Type">{getProjectTypeLabel(data.projectType)}</DetailRow>

            <DetailRow label="Status">
                <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs text-green-700">
                    {getProjectStatusLabel(data.status)}
                </span>
            </DetailRow>

            <DetailRow label="Featured">
                {data.featured ? "Yes" : "No"}
            </DetailRow>

            <DetailRow label="Published">
                {data.published ? "Yes" : "No"}
            </DetailRow>

            <DetailRow label="Display Order">{data.displayOrder}</DetailRow>
        </div>
    );
};

export default ProjectInformation;
