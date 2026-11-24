
"use client";

import { useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";

import {
    TextField,
    TextareaField,
} from "@/components/ui/forms";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import SettingSwitch from "@/components/common/SettingSwitch";

import { SERVICE_DEFAULT_VALUES } from "../../services.constants";
import {
    serviceSchema,
    type ServiceFormInput,
    type ServiceFormValues,
} from "../../services.schema";
import type { Service } from "../../services.types";
import { mapServiceToForm } from "./service-form.utils";

interface ServiceFormProps {
    initialData?: Service | null;
    onSubmit: (values: ServiceFormValues) => Promise<void> | void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export default function ServiceForm({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting = false,
}: ServiceFormProps) {
    const methods = useForm<
        ServiceFormInput,
        unknown,
        ServiceFormValues
    >({
        resolver: zodResolver(serviceSchema),
        defaultValues: SERVICE_DEFAULT_VALUES,
    });

    const {
        handleSubmit,
        control,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = methods;

    const title = watch("title");
    const features = watch("features") ?? [];
    const technologies = watch("technologies") ?? [];
    const selectedIcon = watch("icon");

    // Reset form when editing or creating a service.
    useEffect(() => {
        const values = initialData
            ? mapServiceToForm(initialData)
            : SERVICE_DEFAULT_VALUES;

        reset({
            ...values,
            features: values.features?.length ? values.features : [""],
            technologies: values.technologies?.length
                ? values.technologies
                : [""],
        });
    }, [initialData, reset]);

    // Generate slug from service title.
    const handleGenerateSlug = () => {
        const slug = (title ?? "")
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

        setValue("slug", slug, {
            shouldDirty: true,
            shouldValidate: true,
        });
    };

    // Feature handlers.
    const handleAddFeature = () => {
        setValue("features", [...features, ""], {
            shouldDirty: true,
        });
    };

    const handleRemoveFeature = (index: number) => {
        if (features.length <= 1) return;

        setValue(
            "features",
            features.filter((_, i) => i !== index),
            {
                shouldDirty: true,
                shouldValidate: true,
            }
        );
    };

    // Technology handlers.
    const handleAddTechnology = () => {
        setValue("technologies", [...technologies, ""], {
            shouldDirty: true,
        });
    };

    const handleRemoveTechnology = (index: number) => {
        if (technologies.length <= 1) return;

        setValue(
            "technologies",
            technologies.filter((_, i) => i !== index),
            {
                shouldDirty: true,
                shouldValidate: true,
            }
        );
    };

    return (
        <FormProvider {...methods}>
            <form
                noValidate
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
            >
                {/* Basic Information */}
                <section className="space-y-4">
                    <h3 className="text-sm font-semibold">
                        Basic Information
                    </h3>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Service Title */}
                        <Controller
                            name="title"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    variant="outlined"
                                    id="service-title"
                                    name={field.name}
                                    label="Service Title"
                                    placeholder="e.g. Frontend Development"
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
                        <Controller
                            name="slug"
                            control={control}
                            render={({ field }) => (
                                <div className="flex items-top gap-2">
                                    <div className="min-w-0 flex-1">
                                        <TextField
                                            variant="outlined"
                                            id="service-slug"
                                            name={field.name}
                                            label="Slug"
                                            placeholder="e.g. frontend-development"
                                            required
                                            value={field.value}
                                            onChange={field.onChange}
                                            onBlur={field.onBlur}
                                            disabled={isSubmitting}
                                            error={errors.slug?.message}
                                            hint="Lowercase letters, numbers, and hyphens only."
                                        />
                                    </div>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleGenerateSlug}
                                        disabled={isSubmitting || !title?.trim()}
                                    >
                                        Generate
                                    </Button>
                                </div>
                            )}
                        />

                        {/* Tagline */}
                        <Controller
                            name="tagline"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    variant="outlined"
                                    id="service-tagline"
                                    name={field.name}
                                    label="Tagline"
                                    placeholder="e.g. Modern interfaces for ambitious products"
                                    required
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    disabled={isSubmitting}
                                    error={errors.tagline?.message}
                                />
                            )}
                        />

                        {/* Icon */}
                        <Controller
                            name="icon"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    variant="outlined"
                                    id="service-icon"
                                    name={field.name}
                                    label="Iconify Icon"
                                    placeholder="e.g. lucide:monitor-smartphone"
                                    required
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    disabled={isSubmitting}
                                    error={errors.icon?.message}
                                />
                            )}
                        />
                    </div>

                    {/* Icon Preview */}
                    {selectedIcon && (
                        <div className="flex items-center gap-3 rounded-xl border border-border p-3">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                                <Icon
                                    icon={selectedIcon}
                                    width={28}
                                    height={28}
                                />
                            </div>

                            <p className="truncate text-xs text-muted-foreground">
                                {selectedIcon}
                            </p>
                        </div>
                    )}

                    {/* Image URL */}
                    <Controller
                        name="image"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                id="service-image"
                                name={field.name}
                                label="Image URL"
                                placeholder="https://example.com/service.png"
                                value={field.value ?? ""}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                disabled={isSubmitting}
                                error={errors.image?.message}
                            />
                        )}
                    />

                    {/* Description */}
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <TextareaField
                                variant="outlined"
                                id="service-description"
                                name={field.name}
                                label="Description"
                                placeholder="Describe what this service includes."
                                rows={4}
                                required
                                value={field.value ?? ""}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                disabled={isSubmitting}
                                error={errors.description?.message}
                            />
                        )}
                    />
                </section>

                {/* Features */}
                <section className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">
                            Features
                        </Label>

                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={handleAddFeature}
                            disabled={isSubmitting}
                        >
                            Add Feature
                        </Button>
                    </div>

                    {features.map((_, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-2"
                        >
                            <div className="min-w-0 flex-1">
                                <Controller
                                    name={`features.${index}`}
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            variant="outlined"
                                            id={`service-feature-${index}`}
                                            name={field.name}
                                            label={`Feature ${index + 1}`}
                                            placeholder="e.g. Responsive layouts"
                                            value={field.value ?? ""}
                                            onChange={field.onChange}
                                            onBlur={field.onBlur}
                                            disabled={isSubmitting}
                                            error={errors.features?.[index]?.message}
                                        />
                                    )}
                                />
                            </div>

                            {features.length > 1 && (
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleRemoveFeature(index)}
                                    disabled={isSubmitting}
                                >
                                    Remove
                                </Button>
                            )}
                        </div>
                    ))}

                    {errors.features?.root?.message && (
                        <p className="text-sm text-destructive">
                            {errors.features.root.message}
                        </p>
                    )}
                </section>

                {/* Technologies */}
                <section className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">
                            Technologies
                        </Label>

                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={handleAddTechnology}
                            disabled={isSubmitting}
                        >
                            Add Technology
                        </Button>
                    </div>

                    {technologies.map((_, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-2"
                        >
                            <div className="min-w-0 flex-1">
                                <Controller
                                    name={`technologies.${index}`}
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            variant="outlined"
                                            id={`service-technology-${index}`}
                                            name={field.name}
                                            label={`Technology ${index + 1}`}
                                            placeholder="e.g. React"
                                            value={field.value ?? ""}
                                            onChange={field.onChange}
                                            onBlur={field.onBlur}
                                            disabled={isSubmitting}
                                            error={errors.technologies?.[index]?.message}
                                        />
                                    )}
                                />
                            </div>

                            {technologies.length > 1 && (
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleRemoveTechnology(index)}
                                    disabled={isSubmitting}
                                >
                                    Remove
                                </Button>
                            )}
                        </div>
                    ))}

                    {errors.technologies?.root?.message && (
                        <p className="text-sm text-destructive">
                            {errors.technologies.root.message}
                        </p>
                    )}
                </section>

                {/* Publishing Settings */}
                <section className="space-y-4">
                    <h3 className="text-sm font-semibold">
                        Publishing Settings
                    </h3>

                    {/* Featured and Active */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Controller
                            name="isFeatured"
                            control={control}
                            render={({ field }) => (
                                <SettingSwitch
                                    id="service-featured"
                                    label="Featured"
                                    description="Highlight this service on your public portfolio."
                                    checked={!!field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={isSubmitting}
                                />
                            )}
                        />

                        <Controller
                            name="isActive"
                            control={control}
                            render={({ field }) => (
                                <SettingSwitch
                                    id="service-active"
                                    label="Active"
                                    description="Show this service on your public portfolio."
                                    checked={!!field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={isSubmitting}
                                />
                            )}
                        />
                    </div>

                    {/* Display Order */}
                    <Controller
                        name="displayOrder"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                id="service-display-order"
                                name={field.name}
                                type="number"
                                label="Display Order"
                                placeholder="Enter display order"
                                value={String(field.value ?? 0)}
                                onChange={(event) => {
                                    const value = event.target.value;

                                    field.onChange(
                                        value === "" ? 0 : Number(value)
                                    );
                                }}
                                onBlur={field.onBlur}
                                disabled={isSubmitting}
                                error={errors.displayOrder?.message}
                                hint="Smaller numbers appear first."
                            />
                        )}
                    />
                </section>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 border-t border-border pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        loading={isSubmitting}
                        loadingText="Saving..."
                        disabled={isSubmitting}
                    >
                        {initialData ? "Update Service" : "Create Service"}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}
