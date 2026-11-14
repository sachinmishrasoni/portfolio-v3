
"use client";

import { Controller, useFormContext } from "react-hook-form";
import { FiSearch } from "react-icons/fi";

import {
    TextField,
    TextareaField,
} from "@/components/ui/forms";

import type { ProjectFormInput } from "../../../project.schema";
import ProjectFormSection from "../ProjectFormSection";

const ProjectSEOSection = () => {
    const {
        control,
        formState: { errors, isSubmitting },
    } = useFormContext<ProjectFormInput>();

    return (
        <ProjectFormSection
            icon={FiSearch}
            title="SEO Settings"
            description="Optimize your project page for search engines."
        >
            <Controller
                name="metaTitle"
                control={control}
                render={({ field }) => (
                    <TextField
                        variant="outlined"
                        id="project-meta-title"
                        name={field.name}
                        label="Meta Title"
                        placeholder="Portfolio Website | Next.js"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        disabled={isSubmitting}
                        error={errors.metaTitle?.message}
                    />
                )}
            />

            <Controller
                name="metaDescription"
                control={control}
                render={({ field }) => (
                    <TextareaField
                        variant="outlined"
                        id="project-meta-description"
                        name={field.name}
                        label="Meta Description"
                        placeholder="Write a short SEO description..."
                        rows={3}
                        maxLength={160}
                        showCount
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        disabled={isSubmitting}
                        error={errors.metaDescription?.message}
                    />
                )}
            />
        </ProjectFormSection>
    );
};

export default ProjectSEOSection;
