"use client";

import { useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    DateField,
    SelectField,
    TextareaField,
    TextField,
} from "@/components/ui/forms";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import SettingSwitch from "@/components/common/SettingSwitch";
import { formatDateInput } from "@/lib/utils/date.utils";

import {
    EDUCATION_DEFAULT_VALUES,
    EDUCATION_LEVEL_OPTIONS,
} from "../../education.constants";
import { educationSchema } from "../../education.schema";
import type { Education } from "../../education.types";
import type {
    EducationFormInput,
    EducationFormValues,
} from "../../education.schema";
import { mapEducationToForm } from "./education-form.utils";

interface EducationFormProps {
    initialData?: Education | null;
    onSubmit: (values: EducationFormValues) => Promise<void> | void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export default function EducationForm({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting = false,
}: EducationFormProps) {
    const methods = useForm<
        EducationFormInput,
        unknown,
        EducationFormValues
    >({
        resolver: zodResolver(educationSchema),
        defaultValues: EDUCATION_DEFAULT_VALUES,
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
    const achievements = watch("achievements") ?? [];

    useEffect(() => {
        reset(
            initialData
                ? mapEducationToForm(initialData)
                : EDUCATION_DEFAULT_VALUES
        );
    }, [initialData, reset]);

    const handleAddAchievement = () => {
        setValue("achievements", [...achievements, ""], {
            shouldDirty: true,
        });
    };

    const handleRemoveAchievement = (index: number) => {
        setValue(
            "achievements",
            achievements.filter((_, i) => i !== index),
            { shouldDirty: true, shouldValidate: true }
        );
    };

    return (
        <FormProvider {...methods}>
            <form
                noValidate
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
            >
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold">Institution Information</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Controller name="institution" control={control} render={({ field }) => (
                            <TextField variant="outlined" id="education-institution" name={field.name}
                                label="Institution Name" placeholder="e.g. University of Delhi" required
                                value={field.value} onChange={field.onChange} onBlur={field.onBlur}
                                disabled={isSubmitting} error={errors.institution?.message} />
                        )} />
                        <Controller name="institutionLogo" control={control} render={({ field }) => (
                            <TextField variant="outlined" id="education-institution-logo" name={field.name}
                                label="Institution Logo URL" placeholder="https://example.com/logo.png"
                                value={field.value ?? ""} onChange={field.onChange} onBlur={field.onBlur}
                                disabled={isSubmitting} error={errors.institutionLogo?.message} />
                        )} />
                        <Controller name="institutionWebsite" control={control} render={({ field }) => (
                            <TextField variant="outlined" id="education-institution-website" name={field.name}
                                label="Institution Website" placeholder="https://example.edu"
                                value={field.value ?? ""} onChange={field.onChange} onBlur={field.onBlur}
                                disabled={isSubmitting} error={errors.institutionWebsite?.message} />
                        )} />
                        <Controller name="location" control={control} render={({ field }) => (
                            <TextField variant="outlined" id="education-location" name={field.name}
                                label="Location" placeholder="e.g. New Delhi, India" required
                                value={field.value} onChange={field.onChange} onBlur={field.onBlur}
                                disabled={isSubmitting} error={errors.location?.message} />
                        )} />
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-sm font-semibold">Education Information</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Controller name="educationLevel" control={control} render={({ field }) => (
                            <SelectField variant="outlined" id="education-level" name={field.name}
                                label="Education Level" placeholder="Select education level"
                                options={EDUCATION_LEVEL_OPTIONS} required value={field.value}
                                onChange={field.onChange} onBlur={field.onBlur}
                                disabled={isSubmitting} error={errors.educationLevel?.message} />
                        )} />
                        <Controller name="degree" control={control} render={({ field }) => (
                            <TextField variant="outlined" id="education-degree" name={field.name}
                                label="Degree" placeholder="e.g. Bachelor of Technology" required
                                value={field.value} onChange={field.onChange} onBlur={field.onBlur}
                                disabled={isSubmitting} error={errors.degree?.message} />
                        )} />
                        <Controller name="fieldOfStudy" control={control} render={({ field }) => (
                            <TextField variant="outlined" id="education-field" name={field.name}
                                label="Field of Study" placeholder="e.g. Computer Science" required
                                value={field.value} onChange={field.onChange} onBlur={field.onBlur}
                                disabled={isSubmitting} error={errors.fieldOfStudy?.message} />
                        )} />
                        <Controller name="grade" control={control} render={({ field }) => (
                            <TextField variant="outlined" id="education-grade" name={field.name}
                                label="Grade" placeholder="e.g. 8.5 CGPA"
                                value={field.value ?? ""} onChange={field.onChange} onBlur={field.onBlur}
                                disabled={isSubmitting} error={errors.grade?.message} />
                        )} />
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-sm font-semibold">Education Duration</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Controller name="startDate" control={control} render={({ field }) => (
                            <DateField id="education-start-date" name={field.name} label="Start Date"
                                placeholder="Select start date" required
                                value={field.value ? formatDateInput(field.value) : ""}
                                onChange={field.onChange} onBlur={field.onBlur}
                                disabled={isSubmitting} error={errors.startDate?.message} />
                        )} />
                        <Controller name="endDate" control={control} render={({ field }) => (
                            <DateField id="education-end-date" name={field.name} label="End Date"
                                placeholder="Select end date"
                                value={field.value ? formatDateInput(field.value) : ""}
                                onChange={field.onChange} onBlur={field.onBlur}
                                disabled={isSubmitting || isCurrent} error={errors.endDate?.message} />
                        )} />
                    </div>
                    <Controller name="isCurrent" control={control} render={({ field }) => (
                        <SettingSwitch id="education-current" label="Currently Studying"
                            description="I am currently enrolled in this education."
                            checked={!!field.value}
                            onCheckedChange={(checked) => {
                                field.onChange(checked);
                                if (checked) setValue("endDate", null, {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                });
                            }}
                            disabled={isSubmitting} />
                    )} />
                </div>

                <div className="space-y-3">
                    <h3 className="text-sm font-semibold">Education Details</h3>
                    <Controller name="description" control={control} render={({ field }) => (
                        <TextareaField variant="outlined" id="education-description" name={field.name}
                            label="Description" placeholder="Write a short overview of your education."
                            rows={3} value={field.value ?? ""} onChange={field.onChange} onBlur={field.onBlur}
                            disabled={isSubmitting} error={errors.description?.message} />
                    )} />

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">Achievements</Label>
                            <Button type="button" size="sm" variant="outline"
                                onClick={handleAddAchievement} disabled={isSubmitting}>
                                Add Achievement
                            </Button>
                        </div>
                        {achievements.map((achievement, index) => (
                            <div key={index} className="flex items-start gap-2">
                                <div className="flex-1">
                                    <Controller name={`achievements.${index}`} control={control}
                                        render={({ field }) => (
                                            <TextField variant="outlined" id={`education-achievement-${index}`}
                                                name={field.name} label={`Achievement ${index + 1}`}
                                                placeholder="e.g. Graduated with honors"
                                                value={field.value ?? ""} onChange={field.onChange} onBlur={field.onBlur}
                                                disabled={isSubmitting}
                                                error={errors.achievements?.[index]?.message} />
                                        )} />
                                </div>
                                <Button type="button" size="sm" variant="outline" className="mt-7"
                                    onClick={() => handleRemoveAchievement(index)} disabled={isSubmitting}>
                                    Remove
                                </Button>
                            </div>
                        ))}
                        {achievements.length === 0 && (
                            <p className="text-xs text-muted-foreground">Add notable achievements or honors.</p>
                        )}
                        {errors.achievements?.root?.message && (
                            <p className="text-sm text-destructive">{errors.achievements.root.message}</p>
                        )}
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-sm font-semibold">Publishing Settings</h3>
                    <Controller name="isActive" control={control} render={({ field }) => (
                        <SettingSwitch id="education-active" label="Active"
                            description="Show this education on your public portfolio."
                            checked={!!field.value} onCheckedChange={field.onChange}
                            disabled={isSubmitting} />
                    )} />
                    <Controller name="displayOrder" control={control} render={({ field }) => (
                        <TextField variant="outlined" id="education-display-order" name={field.name}
                            type="number" label="Display Order" placeholder="Enter display order"
                            value={String(field.value ?? 0)}
                            onChange={(event) => {
                                const value = event.target.value;
                                field.onChange(value === "" ? 0 : Number(value));
                            }}
                            onBlur={field.onBlur} disabled={isSubmitting}
                            error={errors.displayOrder?.message} hint="Smaller numbers appear first." />
                    )} />
                </div>

                <div className="flex justify-end gap-3 border-t border-border pt-4">
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={isSubmitting} loadingText="Saving...">
                        {initialData ? "Update Education" : "Create Education"}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}
