
"use client";

import { useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";

import { TextField, TextareaField, SelectField, ColorField } from "@/components/ui/forms";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

import {
    SKILL_CATEGORY_OPTIONS,
    SKILL_DEFAULT_VALUES,
} from "../../skill.constants";
import { skillSchema } from "../../skill.schema";
import type { Skill } from "../../skill.types";
import type {
    SkillFormInput,
    SkillFormValues,
} from "../../skill.schema";
import { mapSkillToForm } from "./skill-form.utils";
import SettingSwitch from "@/components/common/SettingSwitch";

interface SkillFormProps {
    initialData?: Skill | null;
    onSubmit: (values: SkillFormValues) => Promise<void> | void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

interface StatusSwitchProps {
    id: string;
    label: string;
    description: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
}

const SkillForm = ({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting = false,
}: SkillFormProps) => {
    const methods = useForm<SkillFormInput, unknown, SkillFormValues>({
        resolver: zodResolver(skillSchema),
        defaultValues: SKILL_DEFAULT_VALUES,
    });

    const {
        handleSubmit,
        control,
        reset,
        watch,
        formState: { errors },
    } = methods;

    const selectedIcon = watch("icon");
    const selectedColor = watch("color");

    useEffect(() => {
        reset(
            initialData
                ? mapSkillToForm(initialData)
                : SKILL_DEFAULT_VALUES
        );
    }, [initialData, reset]);

    const handleFormSubmit = async (values: SkillFormValues) => {
        await onSubmit(values);
    };

    return (
        <FormProvider {...methods}>
            <form
                noValidate
                onSubmit={handleSubmit(handleFormSubmit)}
                className="space-y-4"
            >
                {/* Skill Name and Category */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                id="skill-name"
                                name={field.name}
                                label="Skill Name"
                                placeholder="e.g. React.js"
                                required
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                disabled={isSubmitting}
                                error={errors.name?.message}
                            />
                        )}
                    />

                    <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                            <SelectField
                                variant="outlined"
                                id="skill-category"
                                name={field.name}
                                label="Category"
                                placeholder="Select category"
                                options={SKILL_CATEGORY_OPTIONS}
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

                {/* Iconify Icon and Icon Color */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Controller
                        name="icon"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                id="skill-icon"
                                name={field.name}
                                label="Iconify Icon"
                                placeholder="e.g. logos:react"
                                required
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                disabled={isSubmitting}
                                error={errors.icon?.message}
                            />
                        )}
                    />

                    <Controller
                        name="color"
                        control={control}
                        render={({ field }) => (
                            <ColorField
                                id="skill-color"
                                name={field.name}
                                label="Icon Color"
                                placeholder="#61DAFB"
                                variant="outlined"
                                value={field.value ?? ""}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                disabled={isSubmitting}
                                error={errors.color?.message}
                            />
                        )}
                    />
                </div>

                {/* Icon Preview */}
                {selectedIcon && (
                    <div className="flex items-center gap-3 rounded-xl border border-border p-2">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                            <Icon
                                icon={selectedIcon}
                                width={28}
                                height={28}
                                color={selectedColor || "currentColor"}
                            />
                        </div>

                        <div className="min-w-0">
                            <p className="text-sm font-medium">Icon Preview</p>
                            <p className="truncate text-xs text-muted-foreground">
                                {selectedIcon}
                            </p>
                        </div>
                    </div>
                )}

                {/* Description */}
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <TextareaField
                            variant="outlined"
                            id="skill-description"
                            name={field.name}
                            label="Description"
                            placeholder="Write a short description about this skill"
                            rows={3}
                            maxLength={300}
                            showCount
                            required
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            disabled={isSubmitting}
                            error={errors.description?.message}
                        />
                    )}
                />

                {/* Proficiency Slider */}
                <Controller
                    name="proficiency"
                    control={control}
                    render={({ field }) => (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="skill-proficiency">
                                    Proficiency
                                </Label>

                                <span className="text-sm font-semibold tabular-nums">
                                    {field.value}%
                                </span>
                            </div>

                            <Slider
                                id="skill-proficiency"
                                min={0}
                                max={100}
                                step={5}
                                value={[field.value]}
                                onValueChange={(value) => {
                                    const proficiency =
                                        typeof value === "number" ? value : (value[0] ?? 0);

                                    field.onChange(proficiency);
                                }}
                                disabled={isSubmitting}
                            />

                            {errors.proficiency?.message && (
                                <p className="text-sm text-destructive">
                                    {errors.proficiency.message}
                                </p>
                            )}

                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Beginner</span>
                                <span>Intermediate</span>
                                <span>Expert</span>
                            </div>
                        </div>
                    )}
                />

                {/* Active Skill */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Controller
                        name="isActive"
                        control={control}
                        render={({ field }) => (
                            <SettingSwitch
                                id="skill-active"
                                label="Active"
                                description="Show this skill on your public portfolio."
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
                            id="skill-display-order"
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

                    <Button type="submit" loading={isSubmitting} loadingText="Saving...">
                        {initialData ? "Update Skill" : "Create Skill"}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};

export default SkillForm;
