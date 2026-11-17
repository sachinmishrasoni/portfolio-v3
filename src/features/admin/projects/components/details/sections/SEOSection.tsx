
import { FiSearch } from "react-icons/fi";
import type { Project } from "../../../projects.types";

interface SEOSectionProps {
    data: Project;
    compact?: boolean;
}

const SEOSection = ({ data, compact = false }: SEOSectionProps) => {
    const metaTitle = data.seo?.metaTitle;
    const metaDescription = data.seo?.metaDescription;

    return (
        <div className="rounded-xl border bg-card p-4">
            <h3 className="mb-4 flex items-center gap-2 font-semibold">
                <FiSearch className="text-primary" />
                SEO (Meta)
            </h3>

            <div className="space-y-4">
                <div>
                    <p className="mb-1 text-sm font-medium">Meta Title</p>
                    <div className="rounded-md border bg-background px-3 py-2 text-sm">
                        {metaTitle || "No meta title available."}
                    </div>
                </div>

                <div>
                    <p className="mb-1 text-sm font-medium">Meta Description</p>
                    <div className={`rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground ${compact ? "line-clamp-3" : "whitespace-pre-line"}`}>
                        {metaDescription || "No meta description available."}
                    </div>
                </div>

                {!compact && (
                    <div className="rounded-lg bg-muted/50 p-3">
                        <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                            Search preview
                        </p>
                        <p className="text-base text-blue-700">
                            {metaTitle || data.title}
                        </p>
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                            {metaDescription || data.overview}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SEOSection;
