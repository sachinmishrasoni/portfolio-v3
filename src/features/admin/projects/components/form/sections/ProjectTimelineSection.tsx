
"use client";

import { Controller, useFormContext } from "react-hook-form";
import { FiCalendar } from "react-icons/fi";

import { DateField } from "@/components/ui/forms";

import type { ProjectFormInput } from "../../../project.schema";
import ProjectFormSection from "../ProjectFormSection";

const toDateInput = (date?: Date) => {
    if (!date) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const parseDate = (value: string) => {
    if (!value) return undefined;

    const [year, month, day] = value.split("-").map(Number);

    return new Date(year, month - 1, day);
};

const getDuration = (start?: Date, end?: Date) => {
    if (!start || !end) return null;

    const startTime = new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate()
    ).getTime();

    const endTime = new Date(
        end.getFullYear(),
        end.getMonth(),
        end.getDate()
    ).getTime();

    const days = Math.floor(
        (endTime - startTime) / 86400000
    );

    if (days < 0) return null;

    const months = Math.floor(days / 30);
    const remainingDays = days % 30;

    if (months === 0 && remainingDays === 0) {
        return "1 day";
    }

    return [
        months ? `${months} ${months === 1 ? "month" : "months"}` : "",
        remainingDays ? `${remainingDays} days` : "",
    ]
        .filter(Boolean)
        .join(" ");
};

const ProjectTimelineSection = () => {
    const {
        control,
        watch,
        formState: { errors, isSubmitting },
    } = useFormContext<ProjectFormInput>();

    const startDate = watch("startDate");
    const endDate = watch("endDate");

    const duration = getDuration(startDate, endDate);

    return (
        <ProjectFormSection
            icon={FiCalendar}
            title="Project Timeline"
            description="Specify your project working period."
        >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
                <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => (
                        <DateField
                            variant="outlined"
                            id="project-start-date"
                            name={field.name}
                            label="Start Date"
                            placeholder="Select start date"
                            required
                            value={field.value ? toDateInput(field.value) : ""}
                            onChange={(value) =>
                                field.onChange(parseDate(value))
                            }
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
                            variant="outlined"
                            id="project-end-date"
                            name={field.name}
                            label="End Date"
                            placeholder="Select end date"
                            value={field.value ? toDateInput(field.value) : ""}
                            onChange={(value) =>
                                field.onChange(value ? parseDate(value) : undefined)
                            }
                            onBlur={field.onBlur}
                            disabled={isSubmitting}
                            error={errors.endDate?.message}
                        />
                    )}
                />

                {duration && (
                    <div className="col-span-2">
                        <p className="text-xs text-muted-foreground">
                            Project Duration: <span className="font-semibold text-primary">{duration}</span>
                        </p>
                    </div>
                )}

                {!endDate && startDate && (
                    <div className="col-span-2">
                        <p className="text-xs text-muted-foreground">
                            This project is ongoing.
                        </p>
                    </div>
                )}
            </div>
        </ProjectFormSection>
    );
};

export default ProjectTimelineSection;
