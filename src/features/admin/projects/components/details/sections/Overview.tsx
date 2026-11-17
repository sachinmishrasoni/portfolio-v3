
import type { Project } from "../../../projects.types";

interface OverviewProps {
    data: Project;
}

const Overview = ({ data }: OverviewProps) => {
    return (
        <div className="space-y-5 rounded-xl border bg-card p-5">
            <section>
                <h3 className="mb-2 font-semibold">Overview</h3>
                <p className="text-sm leading-6 text-muted-foreground">
                    {data.overview || "No overview available."}
                </p>
            </section>

            <div className="border-t" />

            <section>
                <h3 className="mb-2 font-semibold">Description</h3>
                <p className="whitespace-pre-line text-sm leading-6 text-muted-foreground">
                    {data.description || "No description available."}
                </p>
            </section>

            <div className="border-t" />

            <section>
                <h3 className="mb-3 font-semibold">Key Features</h3>
                {data.features?.length ? (
                    <ul className="grid gap-3 rounded-lg bg-muted/50 p-4 sm:grid-cols-2">
                        {data.features.map((feature, index) => (
                            <li key={`${feature}-${index}`} className="flex items-start gap-2 text-sm">
                                <span className="text-primary">✓</span>
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground">No features added.</p>
                )}
            </section>

            <div className="border-t" />

            <section>
                <h3 className="mb-2 font-semibold">Challenges</h3>
                <p className="whitespace-pre-line text-sm leading-6 text-muted-foreground">
                    {data.challenges || "No challenges documented."}
                </p>
            </section>

            <div className="border-t" />

            <section>
                <h3 className="mb-2 font-semibold">Solution</h3>
                <p className="whitespace-pre-line text-sm leading-6 text-muted-foreground">
                    {data.solution || "No solution documented."}
                </p>
            </section>

            <div className="border-t" />

            <section>
                <h3 className="mb-2 font-semibold">My Role</h3>
                <p className="text-sm leading-6 text-muted-foreground">
                    {data.role || "No role specified."}
                </p>
            </section>

            <div className="border-t" />

            <section>
                <h3 className="mb-3 font-semibold">Technologies</h3>
                {data.technologies.length ? (
                    <div className="flex flex-wrap gap-2">
                        {data.technologies.map((technology) => (
                            <span
                                key={technology}
                                className="rounded-md border bg-background px-3 py-2 text-sm"
                            >
                                {technology}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">No technologies added.</p>
                )}
            </section>
        </div>
    );
};

export default Overview;
