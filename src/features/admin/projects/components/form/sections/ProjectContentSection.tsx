
"use client";

import { Controller, useFormContext } from "react-hook-form";
import { FiFileText } from "react-icons/fi";

import {
    RichTextEditor,
    TextareaField,
} from "@/components/ui/forms";

import type { ProjectFormInput } from "../../../project.schema";
import ProjectFormSection from "../ProjectFormSection";

const ProjectContentSection = () => {
    const {
        control,
        formState: { errors, isSubmitting },
    } = useFormContext<ProjectFormInput>();

    return (
        <ProjectFormSection
            icon={FiFileText}
            title="Project Content"
            description="Describe your project and its purpose."
        >
            <Controller
                name="overview"
                control={control}
                render={({ field }) => (
                    <TextareaField
                        id="project-overview"
                        name={field.name}
                        label="Overview"
                        placeholder="Write a short introduction about your project..."
                        rows={1}
                        maxLength={300}
                        showCount
                        required
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        disabled={isSubmitting}
                        error={errors.overview?.message}
                    />
                )}
            />

            <Controller
                name="description"
                control={control}
                render={({ field }) => (
                    <RichTextEditor
                        id="project-description"
                        name={field.name}
                        label="Description"
                        placeholder="Write detailed information about your project..."
                        required
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        disabled={isSubmitting}
                        error={errors.description?.message}
                    />
                )}
            />
        </ProjectFormSection>
    );
};

export default ProjectContentSection;
