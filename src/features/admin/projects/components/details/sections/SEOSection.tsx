
import { FiSearch } from "react-icons/fi";
import type { Project } from "../../../projects.types";

interface SEOSectionProps {
    data: Project;
    compact?: boolean;
}

const SEOSection = ({
    data,
    compact = false,
}: SEOSectionProps) => {
    const metaTitle = data.seo?.metaTitle;
    const metaDescription = data.seo?.metaDescription;

    return (
        <section className="rounded-xl border bg-card p-4">
            {/* Header */}
            <h3 className="mb-4 flex items-center gap-2 font-semibold">
                <FiSearch className="h-4 w-4 text-primary" />
                SEO (Meta)
            </h3>

            <div className="space-y-4">
                {/* Meta Title */}
                <div className="min-w-0">
                    <p className="mb-1.5 text-sm font-medium">
                        Meta Title
                    </p>

                    <div className="break-words rounded-md border bg-background px-3 py-2 text-sm">
                        {metaTitle || "No meta title available."}
                    </div>
                </div>

                {/* Meta Description */}
                <div className="min-w-0">
                    <p className="mb-1.5 text-sm font-medium">
                        Meta Description
                    </p>

                    <div className="whitespace-pre-wrap break-words rounded-md border bg-background px-3 py-2 text-sm leading-relaxed text-muted-foreground">
                        {metaDescription || "No meta description available."}
                    </div>
                </div>

                {/* Search Preview - Full View Only */}
                {!compact && (
                    <div className="rounded-lg border bg-muted/50 p-3">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Search Preview
                        </p>

                        <p className="break-words text-base font-medium text-blue-700 dark:text-blue-400">
                            {metaTitle || data.title}
                        </p>

                        <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-muted-foreground">
                            {metaDescription || data.overview}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default SEOSection;
