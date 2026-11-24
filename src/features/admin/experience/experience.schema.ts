
import { z } from "zod";

// Converts string or Date input into a validated Date.
const dateSchema = z
    .union([z.string(), z.date()])
    .optional()
    .transform((value, ctx) => {
        if (value === undefined || value === "") {
            return undefined;
        }

        if (value instanceof Date) {
            if (Number.isNaN(value.getTime())) {
                ctx.addIssue({
                    code: "custom",
                    message: "Please select a valid date",
                });

                return z.NEVER;
            }

            return value;
        }

        const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

        if (!match) {
            ctx.addIssue({
                code: "custom",
                message: "Please select a valid date",
            });

            return z.NEVER;
        }

        const [, year, month, day] = match;

        // Use local date construction to avoid timezone shifts.
        const date = new Date(
            Number(year),
            Number(month) - 1,
            Number(day)
        );

        if (
            date.getFullYear() !== Number(year) ||
            date.getMonth() !== Number(month) - 1 ||
            date.getDate() !== Number(day)
        ) {
            ctx.addIssue({
                code: "custom",
                message: "Please select a valid date",
            });

            return z.NEVER;
        }

        return date;
    });

const optionalUrlSchema = z
    .string()
    .trim()
    .refine(
        (value) => value === "" || z.url().safeParse(value).success,
        "Please enter a valid URL"
    );

export const experienceSchema = z
    .object({
        company: z
            .string()
            .trim()
            .min(2, "Company name must be at least 2 characters")
            .max(100, "Company name cannot exceed 100 characters"),

        companyLogo: optionalUrlSchema.optional(),

        companyWebsite: optionalUrlSchema.optional(),

        designation: z
            .string()
            .trim()
            .min(2, "Designation must be at least 2 characters")
            .max(100, "Designation cannot exceed 100 characters"),

        employmentType: z.enum([
            "full-time",
            "part-time",
            "internship",
            "contract",
            "freelance",
        ]),

        workMode: z.enum(["onsite", "remote", "hybrid"]),

        location: z
            .string()
            .trim()
            .min(2, "Location must be at least 2 characters")
            .max(100, "Location cannot exceed 100 characters"),

        startDate: dateSchema,

        endDate: dateSchema.nullable(),

        isCurrent: z.boolean(),

        description: z
            .string()
            .trim()
            .min(10, "Description must be at least 10 characters")
            .max(1000, "Description cannot exceed 1000 characters"),

        responsibilities: z
            .array(
                z
                    .string()
                    .trim()
                    .min(3, "Responsibility must be at least 3 characters")
                    .max(300, "Responsibility cannot exceed 300 characters")
            )
            .min(1, "Add at least one responsibility"),

        technologies: z.array(
            z
                .string()
                .trim()
                .min(1, "Technology cannot be empty")
                .max(50, "Technology cannot exceed 50 characters")
        ),

        isActive: z.boolean(),

        displayOrder: z
            .number()
            .int("Display order must be a whole number")
            .min(0, "Display order cannot be negative"),
    })
    .superRefine((data, ctx) => {
        // Start date is required.
        if (!data.startDate) {
            ctx.addIssue({
                code: "custom",
                path: ["startDate"],
                message: "Start date is required",
            });
        }

        // Current employment must not have an end date.
        if (data.isCurrent && data.endDate) {
            ctx.addIssue({
                code: "custom",
                path: ["endDate"],
                message: "End date must be empty for current employment",
            });
        }

        // Previous employment must have an end date.
        if (!data.isCurrent && !data.endDate) {
            ctx.addIssue({
                code: "custom",
                path: ["endDate"],
                message: "End date is required",
            });
        }

        // End date must not be before start date.
        if (
            data.startDate &&
            data.endDate &&
            data.endDate < data.startDate
        ) {
            ctx.addIssue({
                code: "custom",
                path: ["endDate"],
                message: "End date cannot be before start date",
            });
        }
    })
    .transform((data) => ({
        ...data,
        startDate: data.startDate!,
        endDate: data.endDate ?? null,
    }));

// Form input types (DateField can provide strings).
export type ExperienceFormInput = z.input<typeof experienceSchema>;

// Validated output types (dates are converted into Date objects).
export type ExperienceFormValues = z.output<typeof experienceSchema>;
