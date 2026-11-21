
import { FiExternalLink, FiLink } from "react-icons/fi";
import type { Project } from "../../../projects.types";

interface ProjectLinksProps {
    data: Project;
}

const ProjectLinks = ({ data }: ProjectLinksProps) => {
    const links = [
        { label: "Live URL", url: data.liveUrl },
        { label: "GitHub URL", url: data.githubUrl },
    ].filter((item) => item.url);

    return (
        <div className="rounded-xl border bg-card p-4">
            <h3 className="mb-3 flex items-center gap-2 font-semibold">
                <FiLink className="shrink-0 text-primary" />
                Project Links
            </h3>

            {links.length ? (
                <div className="space-y-3">
                    {links.map((link) => (
                        <div
                            key={link.label}
                            className="flex items-center gap-3"
                        >
                            <span className="w-20 shrink-0 whitespace-nowrap text-sm text-muted-foreground">
                                {link.label}
                            </span>

                            <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex min-w-0 flex-1 items-center gap-1 text-sm text-primary hover:underline"
                            >
                                <span className="min-w-0 truncate">{link.url}</span>
                                <FiExternalLink className="shrink-0" size={14} />
                            </a>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">
                    No project links available.
                </p>
            )}
        </div>
    );
};

export default ProjectLinks;
