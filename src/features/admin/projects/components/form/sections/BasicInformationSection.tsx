
"use client";

import { Controller, useFormContext } from "react-hook-form";
import { FiInfo } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import {
    SelectField,
    TextField,
    type SelectOption,
} from "@/components/ui/forms";

import type { ProjectFormInput } from "../../../project.schema";
import ProjectFormSection from "../ProjectFormSection";
import { CATEGORY_OPTIONS, PROJECT_TYPE_OPTIONS, STATUS_OPTIONS } from "../../../projects.constants";

interface Props {
    projectId?: string;
}

const BasicInformationSection = ({ projectId }: Props) => {
    const {
        control,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useFormContext<ProjectFormInput>();

    const title = watch("title");

    const generateSlug = () => {
        const slug = title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

        setValue("slug", slug, {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    return (
        <ProjectFormSection
            icon={FiInfo}
            title="Basic Information"
            description="Add the core details about your project."
        >

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Project ID */}
                {false && (
                    <TextField
                        variant="outlined"
                        id="project-id"
                        name="project-id"
                        label="Project ID"
                        placeholder="Generated automatically"
                        required
                        value={projectId ?? "Generated automatically"}
                        onChange={() => { }}
                        // onBlur={field.onBlur}
                        disabled={true}
                    />
                )}

                {/* Title */}
                <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            variant="outlined"
                            id="project-title"
                            name={field.name}
                            label="Project Title"
                            placeholder="Portfolio Website"
                            required
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            disabled={isSubmitting}
                            error={errors.title?.message}
                        />
                    )}
                />

                {/* Slug */}
                <div className="flex items-end gap-2">
                    <div className="min-w-0 flex-1">
                        <Controller
                            name="slug"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    variant="outlined"
                                    id="project-slug"
                                    name={field.name}
                                    label="Project Slug"
                                    placeholder="portfolio-website"
                                    required
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    disabled={isSubmitting}
                                    error={errors.slug?.message}
                                />
                            )}
                        />
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={generateSlug}
                        disabled={!title?.trim() || isSubmitting}
                    >
                        Generate
                    </Button>
                </div>

                {/* Category */}
                <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                        <SelectField
                            variant="outlined"
                            id="project-category"
                            name={field.name}
                            label="Category"
                            placeholder="Select category"
                            options={CATEGORY_OPTIONS}
                            required
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            disabled={isSubmitting}
                            error={errors.category?.message}
                        />
                    )}
                />

                {/* Project Type */}
                <Controller
                    name="projectType"
                    control={control}
                    render={({ field }) => (
                        <SelectField
                            variant="outlined"
                            id="project-type"
                            name={field.name}
                            label="Project Type"
                            options={PROJECT_TYPE_OPTIONS}
                            required
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            disabled={isSubmitting}
                            error={errors.projectType?.message}
                        />
                    )}
                />

                {/* Status */}
                <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <SelectField
                            variant="outlined"
                            id="project-status"
                            name={field.name}
                            label="Project Status"
                            options={STATUS_OPTIONS}
                            required
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            disabled={isSubmitting}
                            error={errors.status?.message}
                        />
                    )}
                />
            </div>
        </ProjectFormSection>
    );
};

export default BasicInformationSection;
