
"use client";

import { Controller, useFormContext } from "react-hook-form";
import { FiSettings } from "react-icons/fi";

import { TextField } from "@/components/ui/forms";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import type { ProjectFormInput } from "../../../project.schema";
import ProjectFormSection from "../ProjectFormSection";

interface StatusSwitchProps {
    id: string;
    label: string;
    description: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
}

const StatusSwitch = ({
    id,
    label,
    description,
    checked,
    onCheckedChange,
    disabled,
}: StatusSwitchProps) => {
    return (
        <div className="rounded-xl border border-border p-3">
            <div className="mb-1 flex items-center justify-between gap-3">
                <Label
                    htmlFor={id}
                    className="cursor-pointer text-sm font-medium"
                >
                    {label}
                </Label>

                <Switch
                    id={id}
                    checked={checked}
                    onCheckedChange={onCheckedChange}
                    disabled={disabled}
                    size="sm"
                />
            </div>

            <p className="text-xs leading-4 text-muted-foreground">
                {description}
            </p>
        </div>
    );
};

const PublishingSettingsSection = () => {
    const {
        control,
        formState: { errors, isSubmitting },
    } = useFormContext<ProjectFormInput>();

    return (
        <ProjectFormSection
            icon={FiSettings}
            title="Publishing Settings"
            description="Control how this project appears on your portfolio."
        >
            <div className="grid grid-cols-2 gap-4">

                {/* Featured */}
                <Controller
                    name="featured"
                    control={control}
                    render={({ field }) => (
                        <StatusSwitch
                            id="project-featured"
                            label="Featured"
                            description="Show in featured section (e.g. homepage)."
                            checked={!!field.value}
                            onCheckedChange={field.onChange}
                            disabled={isSubmitting}
                        />
                    )}
                />

                {/* Published */}
                <Controller
                    name="published"
                    control={control}
                    render={({ field }) => (
                        <StatusSwitch
                            id="project-published"
                            label="Published"
                            description="Make this project visible on the public site."
                            checked={!!field.value}
                            onCheckedChange={field.onChange}
                            disabled={isSubmitting}
                        />
                    )}
                />

                {/* Display Order */}
                <div className="col-span-2">
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

            </div>
        </ProjectFormSection>
    );
};

export default PublishingSettingsSection;