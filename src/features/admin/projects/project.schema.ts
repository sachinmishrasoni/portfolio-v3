
import { z } from "zod";

export const projectFormSchema = z.object({
    title: z.string().trim().min(1, "Project title is required"),
    slug: z
        .string()
        .trim()
        .min(1, "Slug is required")
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens"),
    description: z.string().trim().min(1, "Description is required"),
    shortDescription: z
        .string()
        .trim()
        .min(1, "Short description is required")
        .max(200, "Maximum 200 characters allowed"),
    thumbnail: z.string().trim().min(1, "Thumbnail is required"),
    images: z.string().optional().default(""),
    technologies: z.string().trim().min(1, "Add at least one technology"),
    category: z.string().min(1, "Please select a category"),
    liveUrl: z
        .string()
        .trim()
        .refine((value) => !value || z.string().url().safeParse(value).success, {
            message: "Enter a valid URL",
        }),
    githubUrl: z
        .string()
        .trim()
        .refine((value) => !value || z.string().url().safeParse(value).success, {
            message: "Enter a valid URL",
        }),
    featured: z.boolean(),
    published: z.boolean(),
    displayOrder: z.number().int().min(0, "Display order cannot be negative"),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
