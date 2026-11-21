
import {
    FiInfo,
    FiFileText,
    FiCheckCircle,
    FiAlertCircle,
    FiUser,
} from "react-icons/fi";

import RichTextContent from "@/components/common/RichTextContent";
import type { Project } from "../../../projects.types";
import { FaListUl } from "react-icons/fa";
import { ImStack } from "react-icons/im";
import { TiLightbulb } from "react-icons/ti";

interface OverviewProps {
    data: Project;
}

const Overview = ({ data }: OverviewProps) => {
    return (
        <div className="space-y-5 rounded-xl border bg-card p-5">
            {/* Overview */}
            <section>
                <h3 className="mb-2 flex items-center gap-2 font-semibold">
                    <FiInfo className="h-4 w-4 shrink-0 text-primary" />
                    Overview
                </h3>

                <p className="text-sm leading-6 text-muted-foreground">
                    {data.overview || "No overview available."}
                </p>
            </section>

            <div className="border-t" />

            {/* Description */}
            <section>
                <h3 className="mb-2 flex items-center gap-2 font-semibold">
                    <FiFileText className="h-4 w-4 shrink-0 text-primary" />
                    Description
                </h3>

                <RichTextContent
                    content={data.description}
                    fallback="No description available."
                    className="!text-muted-foreground"
                />
            </section>

            <div className="border-t" />

            {/* Key Features */}
            <section>
                <h3 className="mb-3 flex items-center gap-2 font-semibold">
                    <FaListUl className="h-4 w-4 shrink-0 text-primary" />
                    Key Features
                </h3>

                {data.features?.length ? (
                    <ul className="grid gap-3 rounded-lg bg-muted/50 p-4 sm:grid-cols-2">
                        {data.features.map((feature, index) => (
                            <li
                                key={`${feature}-${index}`}
                                className="flex items-start gap-2 text-sm"
                            >
                                <FiCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        No features added.
                    </p>
                )}
            </section>

            <div className="border-t" />

            {/* Challenges */}
            <section>
                <h3 className="mb-2 flex items-center gap-2 font-semibold">
                    <FiAlertCircle className="h-4 w-4 shrink-0 text-primary" />
                    Challenges
                </h3>

                <p className="whitespace-pre-line text-sm leading-6 text-muted-foreground">
                    {data.challenges || "No challenges documented."}
                </p>
            </section>

            <div className="border-t" />

            {/* Solution */}
            <section>
                <h3 className="mb-2 flex items-center gap-2 font-semibold">
                    <TiLightbulb className="h-4 w-4 shrink-0 text-primary" />
                    Solution
                </h3>

                <RichTextContent
                    content={data.solution}
                    fallback="No solution documented."
                    className="!text-muted-foreground"
                />
            </section>

            <div className="border-t" />

            {/* My Role */}
            <section>
                <h3 className="mb-2 flex items-center gap-2 font-semibold">
                    <FiUser className="h-4 w-4 shrink-0 text-primary" />
                    My Role
                </h3>

                <p className="text-sm leading-6 text-muted-foreground">
                    {data.role || "No role specified."}
                </p>
            </section>

            <div className="border-t" />

            {/* Technologies */}
            <section>
                <h3 className="mb-3 flex items-center gap-2 font-semibold">
                    <ImStack className="h-4 w-4 shrink-0 text-primary" />
                    Technologies
                </h3>

                {data.technologies.length ? (
                    <div className="flex flex-wrap gap-2">
                        {data.technologies.map((technology) => (
                            <span
                                key={technology}
                                className="rounded-full border bg-background px-3 py-1.5 text-xs"
                            >
                                {technology}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        No technologies added.
                    </p>
                )}
            </section>
        </div>
    );
};

export default Overview;
