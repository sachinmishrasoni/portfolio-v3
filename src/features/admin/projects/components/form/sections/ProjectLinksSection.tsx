
"use client";

import { Controller, useFormContext } from "react-hook-form";
import { FiLink } from "react-icons/fi";

import { TextField } from "@/components/ui/forms";

import type { ProjectFormInput } from "../../../project.schema";
import ProjectFormSection from "../ProjectFormSection";

const ProjectLinksSection = () => {
    const {
        control,
        formState: { errors, isSubmitting },
    } = useFormContext<ProjectFormInput>();

    return (
        <ProjectFormSection
            icon={FiLink}
            title="Project Links"
            description="Add live demo and source code links."
        >
            {/* <div className="grid grid-cols-1 gap-5 md:grid-cols-2"> */}
                <Controller
                    name="liveUrl"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            variant="outlined"
                            id="project-live-url"
                            name={field.name}
                            label="Live URL"
                            placeholder="https://example.com"
                            value={field.value ?? ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            disabled={isSubmitting}
                            error={errors.liveUrl?.message}
                        />
                    )}
                />

                <Controller
                    name="githubUrl"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            variant="outlined"
                            id="project-github-url"
                            name={field.name}
                            label="GitHub URL"
                            placeholder="https://github.com/username/project"
                            value={field.value ?? ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            disabled={isSubmitting}
                            error={errors.githubUrl?.message}
                        />
                    )}
                />
            {/* </div> */}
        </ProjectFormSection>
    );
};

export default ProjectLinksSection;
