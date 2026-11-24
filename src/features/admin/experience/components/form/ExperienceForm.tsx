
"use client";

import { useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    TextField,
    TextareaField,
    SelectField,
    DateField,
} from "@/components/ui/forms";

import { Button } from "@/components/ui/button";
import SettingSwitch from "@/components/common/SettingSwitch";

import {
    EMPLOYMENT_TYPE_OPTIONS,
    WORK_MODE_OPTIONS,
    EXPERIENCE_DEFAULT_VALUES,
} from "../../experience.constants";

import { experienceSchema } from "../../experience.schema";

import type { Experience } from "../../experience.types";
import type {
    ExperienceFormInput,
    ExperienceFormValues,
} from "../../experience.schema";

import { mapExperienceToForm } from "./experience-form.utils";
import { Label } from "@/components/ui/label";
import { formatDateInput } from "@/lib/utils/date.utils";

interface ExperienceFormProps {
    initialData?: Experience | null;
    onSubmit: (values: ExperienceFormValues) => Promise<void> | void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

const ExperienceForm = ({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting = false,
}: ExperienceFormProps) => {
    const methods = useForm<
        ExperienceFormInput,
        unknown,
        ExperienceFormValues
    >({
        resolver: zodResolver(experienceSchema),
        defaultValues: EXPERIENCE_DEFAULT_VALUES,
    });

    const {
        handleSubmit,
        control,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = methods;

    const isCurrent = watch("isCurrent");
    const responsibilities = watch("responsibilities") ?? [];
    const technologies = watch("technologies") ?? [];

    useEffect(() => {
        reset(
            initialData
                ? mapExperienceToForm(initialData)
                : EXPERIENCE_DEFAULT_VALUES
        );
    }, [initialData, reset]);

    const handleFormSubmit = async (values: ExperienceFormValues) => {
        await onSubmit(values);
    };

    const handleAddResponsibility = () => {
        setValue("responsibilities", [...responsibilities, ""], {
            shouldDirty: true,
        });
    };

    const handleRemoveResponsibility = (index: number) => {
        setValue(
            "responsibilities",
            responsibilities.filter((_, i) => i !== index),
            { shouldDirty: true, shouldValidate: true }
        );
    };

    const handleAddTechnology = () => {
        setValue("technologies", [...technologies, ""], {
            shouldDirty: true,
        });
    };

    const handleRemoveTechnology = (index: number) => {
        setValue(
            "technologies",
            technologies.filter((_, i) => i !== index),
            { shouldDirty: true, shouldValidate: true }
        );
    };

    return (
        <FormProvider {...methods}>
            <form
                noValidate
                onSubmit={handleSubmit(handleFormSubmit)}
                className="space-y-5"
            >
                {/* Company Information */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold">Company Information</h3>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Controller
                            name="company"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    variant="outlined"
                                    id="experience-company"
                                    name={field.name}
                                    label="Company Name"
                                    placeholder="e.g. Google"
                                    required
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    disabled={isSubmitting}
                                    error={errors.company?.message}
                                />
                            )}
                        />

                        <Controller
                            name="designation"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    variant="outlined"
                                    id="experience-designation"
                                    name={field.name}
                                    label="Designation"
                                    placeholder="e.g. Frontend Developer"
                                    required
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    disabled={isSubmitting}
                                    error={errors.designation?.message}
                                />
                            )}
                        />

                        <Controller
                            name="companyLogo"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    variant="outlined"
                                    id="experience-company-logo"
                                    name={field.name}
                                    label="Company Logo URL"
                                    placeholder="https://example.com/logo.png"
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    disabled={isSubmitting}
                                    error={errors.companyLogo?.message}
                                />
                            )}
                        />

                        <Controller
                            name="companyWebsite"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    variant="outlined"
                                    id="experience-company-website"
                                    name={field.name}
                                    label="Company Website"
                                    placeholder="https://example.com"
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    disabled={isSubmitting}
                                    error={errors.companyWebsite?.message}
                                />
                            )}
                        />
                    </div>
                </div>

                {/* Job Information */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold">Job Information</h3>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Controller
                            name="employmentType"
                            control={control}
                            render={({ field }) => (
                                <SelectField
                                    variant="outlined"
                                    id="experience-employment-type"
                                    name={field.name}
                                    label="Employment Type"
                                    placeholder="Select employment type"
                                    options={EMPLOYMENT_TYPE_OPTIONS}
                                    required
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    disabled={isSubmitting}
                                    error={errors.employmentType?.message}
                                />
                            )}
                        />

                        <Controller
                            name="workMode"
                            control={control}
                            render={({ field }) => (
                                <SelectField
                                    variant="outlined"
                                    id="experience-work-mode"
                                    name={field.name}
                                    label="Work Mode"
                                    placeholder="Select work mode"
                                    options={WORK_MODE_OPTIONS}
                                    required
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    disabled={isSubmitting}
                                    error={errors.workMode?.message}
                                />
                            )}
                        />

                        <Controller
                            name="location"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    variant="outlined"
                                    id="experience-location"
                                    name={field.name}
                                    label="Location"
                                    placeholder="e.g. Noida, India"
                                    required
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    disabled={isSubmitting}
                                    error={errors.location?.message}
                                />
                            )}
                        />
                    </div>
                </div>

                {/* Employment Duration */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold">Employment Duration</h3>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Controller
                            name="startDate"
                            control={control}
                            render={({ field }) => (
                                <DateField
                                    id="experience-start-date"
                                    name={field.name}
                                    label="Start Date"
                                    placeholder="Select joining date"
                                    required
                                    value={field.value ? formatDateInput(field.value) : ""}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    disabled={isSubmitting}
                                    error={errors.startDate?.message}
                                />
                            )}
                        />

                        <Controller
                            name="endDate"
                            control={control}
                            render={({ field }) => (
                                <DateField
                                    id="experience-end-date"
                                    name={field.name}
                                    label="End Date"
                                    placeholder="Select leaving date"
                                    value={field.value ? formatDateInput(field.value) : ""}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    disabled={isSubmitting || isCurrent}
                                    error={errors.endDate?.message}
                                />
                            )}
                        />
                    </div>

                    <Controller
                        name="isCurrent"
                        control={control}
                        render={({ field }) => (
                            <SettingSwitch
                                id="experience-current"
                                label="Currently Working"
                                description="I currently work at this company."
                                checked={!!field.value}
                                onCheckedChange={(checked) => {
                                    field.onChange(checked);

                                    if (checked) {
                                        setValue("endDate", null, {
                                            shouldDirty: true,
                                            shouldValidate: true,
                                        });
                                    }
                                }}
                                disabled={isSubmitting}
                            />
                        )}
                    />
                </div>

                {/* Experience Description */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold">Experience Details</h3>

                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <TextareaField
                                variant="outlined"
                                id="experience-description"
                                name={field.name}
                                label="Description"
                                placeholder="Write a short overview of your role and experience."
                                rows={3}
                                required
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                disabled={isSubmitting}
                                error={errors.description?.message}
                            />
                        )}
                    />

                    {/* Responsibilities */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">
                                Responsibilities
                            </Label>

                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={handleAddResponsibility}
                                disabled={isSubmitting}
                            >
                                Add Responsibility
                            </Button>
                        </div>

                        {responsibilities.map((responsibility, index) => (
                            <div key={index} className="flex items-start gap-2">
                                <div className="flex-1">
                                    <Controller
                                        name={`responsibilities.${index}`}
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                variant="outlined"
                                                id={`experience-responsibility-${index}`}
                                                name={field.name}
                                                label={`Responsibility ${index + 1}`}
                                                placeholder="e.g. Developed reusable React components"
                                                value={field.value}
                                                onChange={field.onChange}
                                                onBlur={field.onBlur}
                                                disabled={isSubmitting}
                                                error={
                                                    errors.responsibilities?.[index]?.message
                                                }
                                            />
                                        )}
                                    />
                                </div>

                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    className="mt-7"
                                    onClick={() => handleRemoveResponsibility(index)}
                                    disabled={isSubmitting || responsibilities.length === 1}
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}

                        {errors.responsibilities?.root?.message && (
                            <p className="text-sm text-destructive">
                                {errors.responsibilities.root.message}
                            </p>
                        )}
                    </div>

                    {/* Technologies */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">Technologies</Label>

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

                        {technologies.length === 0 && (
                            <p className="text-xs text-muted-foreground">
                                Add technologies used during this experience.
                            </p>
                        )}

                        {technologies.map((technology, index) => (
                            <div key={index} className="flex items-start gap-2">
                                <div className="flex-1">
                                    <Controller
                                        name={`technologies.${index}`}
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                variant="outlined"
                                                id={`experience-technology-${index}`}
                                                name={field.name}
                                                label={`Technology ${index + 1}`}
                                                placeholder="e.g. React.js"
                                                value={field.value}
                                                onChange={field.onChange}
                                                onBlur={field.onBlur}
                                                disabled={isSubmitting}
                                                error={errors.technologies?.[index]?.message}
                                            />
                                        )}
                                    />
                                </div>

                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    className="mt-7"
                                    onClick={() => handleRemoveTechnology(index)}
                                    disabled={isSubmitting}
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Publishing Settings */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold">Publishing Settings</h3>

                    <Controller
                        name="isActive"
                        control={control}
                        render={({ field }) => (
                            <SettingSwitch
                                id="experience-active"
                                label="Active"
                                description="Show this experience on your public portfolio."
                                checked={!!field.value}
                                onCheckedChange={field.onChange}
                                disabled={isSubmitting}
                            />
                        )}
                    />

                    <Controller
                        name="displayOrder"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                id="experience-display-order"
                                name={field.name}
                                type="number"
                                label="Display Order"
                                placeholder="Enter display order"
                                value={String(field.value ?? 0)}
                                onChange={(event) => {
                                    const value = event.target.value;
                                    field.onChange(value === "" ? 0 : Number(value));
                                }}
                                onBlur={field.onBlur}
                                disabled={isSubmitting}
                                error={errors.displayOrder?.message}
                                hint="Smaller numbers appear first."
                            />
                        )}
                    />
                </div>

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
                    >
                        {initialData ? "Update Experience" : "Create Experience"}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};

export default ExperienceForm;
