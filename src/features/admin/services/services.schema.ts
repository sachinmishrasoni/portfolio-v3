
import { z } from "zod";

const optionalUrlSchema = z
    .string()
    .trim()
    .refine(
        (value) => value === "" || z.url().safeParse(value).success,
        "Please enter a valid URL"
    )
    .optional();

export const serviceSchema = z.object({
    title: z
        .string()
        .trim()
        .min(2, "Service title must be at least 2 characters")
        .max(100, "Service title cannot exceed 100 characters"),

    slug: z
        .string()
        .trim()
        .min(2, "Slug must be at least 2 characters")
        .max(100, "Slug cannot exceed 100 characters")
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Slug can contain lowercase letters, numbers, and hyphens only"
        ),

    tagline: z
        .string()
        .trim()
        .min(5, "Tagline must be at least 5 characters")
        .max(150, "Tagline cannot exceed 150 characters"),

    description: z
        .string()
        .trim()
        .min(10, "Description must be at least 10 characters")
        .max(1500, "Description cannot exceed 1500 characters"),

    icon: z
        .string()
        .trim()
        .min(1, "Please select an icon")
        .max(100, "Icon name cannot exceed 100 characters"),

    image: optionalUrlSchema,

    features: z
        .array(
            z
                .string()
                .trim()
                .min(3, "Feature must be at least 3 characters")
                .max(200, "Feature cannot exceed 200 characters")
        )
        .min(1, "Add at least one feature"),

    technologies: z
        .array(
            z
                .string()
                .trim()
                .min(1, "Technology cannot be empty")
                .max(50, "Technology cannot exceed 50 characters")
        ),

    isFeatured: z.boolean(),

    isActive: z.boolean(),

    displayOrder: z
        .number()
        .int("Display order must be a whole number")
        .min(0, "Display order cannot be negative"),
});

export type ServiceFormInput = z.input<typeof serviceSchema>;

export type ServiceFormValues = z.output<typeof serviceSchema>;
