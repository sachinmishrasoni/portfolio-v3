
"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiLoader, FiSave } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import {
    SelectField,
    TextareaField,
    TextField,
    type SelectOption,
} from "@/components/ui/forms";

import type { Project } from "../projects.types";
import {
    projectFormSchema,
    type ProjectFormValues,
} from "../project.schema";

interface ProjectFormProps {
    initialData?: Project;
    onSubmit: (
        project: Omit<Project, "id" | "createdAt" | "updatedAt">
    ) => Promise<void> | void;
    onCancel?: () => void;
}

const CATEGORY_OPTIONS: SelectOption[] = [
    { value: "web-development", label: "Web Development" },
    { value: "frontend", label: "Frontend Development" },
    { value: "backend", label: "Backend Development" },
    { value: "fullstack", label: "Full Stack Development" },
    { value: "mobile-app", label: "Mobile Application" },
    { value: "ui-ux", label: "UI / UX Design" },
    { value: "other", label: "Other" },
];

const DEFAULT_VALUES: ProjectFormValues = {
    title: "",
    slug: "",
    description: "",
    shortDescription: "",
    thumbnail: "",
    images: "",
    technologies: "",
    category: "",
    liveUrl: "",
    githubUrl: "",
    featured: false,
    published: false,
    displayOrder: 0,
};

const ProjectForm = ({
    initialData,
    onSubmit,
    onCancel,
}: ProjectFormProps) => {
    const {
        control,
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<ProjectFormValues>({
        resolver: zodResolver(projectFormSchema),
        defaultValues: DEFAULT_VALUES,
        mode: "onSubmit",
        reValidateMode: "onBlur",
    });

    // Populate form when editing an existing project.
    useEffect(() => {
        if (initialData) {
            reset({
                title: initialData.title,
                slug: initialData.slug,
                description: initialData.description,
                shortDescription: initialData.shortDescription,
                thumbnail: initialData.thumbnail,
                images: initialData.images.join(", "),
                technologies: initialData.technologies.join(", "),
                category: initialData.category,
                liveUrl: initialData.liveUrl ?? "",
                githubUrl: initialData.githubUrl ?? "",
                featured: initialData.featured,
                published: initialData.published,
                displayOrder: initialData.displayOrder,
            });
        } else {
            reset(DEFAULT_VALUES);
        }
    }, [initialData, reset]);

    const title = watch("title");

    // Generate project slug from title.
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

    // Transform form values into project payload.
    const handleFormSubmit = async (values: ProjectFormValues) => {
        const payload: Omit<Project, "id" | "createdAt" | "updatedAt"> = {
            title: values.title.trim(),
            slug: values.slug.trim(),
            description: values.description.trim(),
            shortDescription: values.shortDescription.trim(),
            thumbnail: values.thumbnail.trim(),

            images: values.images
                .split(",")
                .map((image) => image.trim())
                .filter(Boolean),

            technologies: values.technologies
                .split(",")
                .map((technology) => technology.trim())
                .filter(Boolean),

            category: values.category,
            liveUrl: values.liveUrl.trim() || undefined,
            githubUrl: values.githubUrl.trim() || undefined,
            featured: values.featured,
            published: values.published,
            displayOrder: values.displayOrder,
        };

        await onSubmit(payload);
    };

    return (
        <form
            noValidate
            onSubmit={handleSubmit(handleFormSubmit)}
            className="w-full space-y-6"
        >
            {/* ================= BASIC INFORMATION ================= */}

            <section className="space-y-4">
                <div>
                    <h3 className="text-base font-semibold text-foreground">
                        Basic Information
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Enter the main details of your project.
                    </p>
                </div>

                <div className="grid grid-cols-1 items-start gap-x-4 gap-y-4 md:grid-cols-2 xl:grid-cols-12">
                    {/* Project Title */}

                    <div className="md:col-span-1 xl:col-span-4">
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
                    </div>

                    {/* Project Slug + Generate Button */}

                    <div className="flex items-end gap-2 md:col-span-1 xl:col-span-4">
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
                            disabled={isSubmitting || !title?.trim()}
                            className="h-10 shrink-0 px-3"
                        >
                            Generate
                        </Button>
                    </div>

                    {/* Category */}

                    <div className="md:col-span-2 xl:col-span-4">
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
                    </div>

                    {/* Display Order */}

                    <div className="md:col-span-1 xl:col-span-3">
                        <Controller
                            name="displayOrder"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    variant="outlined"
                                    id="project-display-order"
                                    name={field.name}
                                    type="number"
                                    label="Display Order"
                                    placeholder="0"
                                    value={String(field.value)}
                                    onChange={(value) =>
                                        field.onChange(value === "" ? 0 : Number(value))
                                    }
                                    onBlur={field.onBlur}
                                    disabled={isSubmitting}
                                    error={errors.displayOrder?.message}
                                />
                            )}
                        />
                    </div>

                    {/* Short Description */}

                    <div className="md:col-span-1 xl:col-span-9">
                        <Controller
                            name="shortDescription"
                            control={control}
                            render={({ field }) => (
                                <TextareaField
                                    variant="outlined"
                                    id="project-short-description"
                                    name={field.name}
                                    label="Short Description"
                                    placeholder="A brief summary of the project..."
                                    rows={3}
                                    maxLength={200}
                                    showCount
                                    required
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    disabled={isSubmitting}
                                    error={errors.shortDescription?.message}
                                />
                            )}
                        />
                    </div>

                    {/* Full Description */}

                    <div className="md:col-span-2 xl:col-span-12">
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <TextareaField
                                    variant="outlined"
                                    id="project-description"
                                    name={field.name}
                                    label="Full Description"
                                    placeholder="Describe the project, its features and purpose..."
                                    rows={5}
                                    required
                                    showCount
                                    maxLength={200}
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    disabled={isSubmitting}
                                    error={errors.description?.message}
                                />
                            )}
                        />
                    </div>
                </div>
            </section>

            <div className="border-t border-border" />

            {/* ================= PROJECT MEDIA ================= */}

            <section className="space-y-4">
                <div>
                    <h3 className="text-base font-semibold text-foreground">
                        Project Media
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Add the thumbnail and project image URLs.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Thumbnail */}

                    <div className="md:col-span-2">
                        <Controller
                            name="thumbnail"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    variant="outlined"
                                    id="project-thumbnail"
                                    name={field.name}
                                    label="Thumbnail URL"
                                    placeholder="https://example.com/thumbnail.png"
                                    required
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    disabled={isSubmitting}
                                    error={errors.thumbnail?.message}
                                />
                            )}
                        />
                    </div>

                    {/* Project Images */}

                    <div className="md:col-span-2">
                        <Controller
                            name="images"
                            control={control}
                            render={({ field }) => (
                                <TextareaField
                                    variant="outlined"
                                    id="project-images"
                                    name={field.name}
                                    label="Project Image URLs"
                                    placeholder="https://example.com/image-1.png, https://example.com/image-2.png"
                                    rows={3}
                                    hint="Enter multiple image URLs separated by commas."
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    disabled={isSubmitting}
                                    error={errors.images?.message}
                                />
                            )}
                        />
                    </div>
                </div>
            </section>

            <div className="border-t border-border" />

            {/* ================= TECHNOLOGIES & LINKS ================= */}

            <section className="space-y-4">
                <div>
                    <h3 className="text-base font-semibold text-foreground">
                        Technologies & Links
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Specify the technologies and project URLs.
                    </p>
                </div>

                <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-12">
                    {/* Technologies */}

                    <div className="md:col-span-2 xl:col-span-6">
                        <Controller
                            name="technologies"
                            control={control}
                            render={({ field }) => (
                                <TextareaField
                                    variant="outlined"
                                    id="project-technologies"
                                    name={field.name}
                                    label="Technologies"
                                    placeholder="Next.js, React, TypeScript, Tailwind CSS"
                                    rows={3}
                                    required
                                    hint="Separate technologies with commas."
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    disabled={isSubmitting}
                                    error={errors.technologies?.message}
                                />
                            )}
                        />
                    </div>

                    {/* Live URL */}

                    <div className="md:col-span-1 xl:col-span-3">
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
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    disabled={isSubmitting}
                                    error={errors.liveUrl?.message}
                                />
                            )}
                        />
                    </div>

                    {/* GitHub URL */}

                    <div className="md:col-span-1 xl:col-span-3">
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
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    disabled={isSubmitting}
                                    error={errors.githubUrl?.message}
                                />
                            )}
                        />
                    </div>
                </div>
            </section>

            <div className="border-t border-border" />

            {/* ================= PUBLISHING SETTINGS ================= */}

            <section className="space-y-4">
                <div>
                    <h3 className="text-base font-semibold text-foreground">
                        Publishing Settings
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Control how this project appears on your portfolio.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {/* Featured Project */}

                    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3.5 transition-colors hover:bg-muted/30">
                        <input
                            type="checkbox"
                            {...register("featured")}
                            disabled={isSubmitting}
                            className="mt-1 size-4 accent-primary"
                        />

                        <span>
                            <span className="block text-sm font-medium text-foreground">
                                Featured Project
                            </span>

                            <span className="mt-1 block text-xs text-muted-foreground">
                                Highlight this project on your portfolio.
                            </span>
                        </span>
                    </label>

                    {/* Published */}

                    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3.5 transition-colors hover:bg-muted/30">
                        <input
                            type="checkbox"
                            {...register("published")}
                            disabled={isSubmitting}
                            className="mt-1 size-4 accent-primary"
                        />

                        <span>
                            <span className="block text-sm font-medium text-foreground">
                                Published
                            </span>

                            <span className="mt-1 block text-xs text-muted-foreground">
                                Make this project visible on your public portfolio.
                            </span>
                        </span>
                    </label>
                </div>
            </section>

            {/* ================= FORM ACTIONS ================= */}

            <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
                {onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                )}

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <FiLoader className="animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <FiSave />
                            {initialData ? "Update Project" : "Create Project"}
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
};

export default ProjectForm;
