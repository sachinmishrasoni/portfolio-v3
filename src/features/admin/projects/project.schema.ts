
import { z } from "zod";

export const projectFormSchema = z
    .object({
        // Basic Information
        title: z.string().trim().min(1, "Project title is required"),
        slug: z
            .string()
            .trim()
            .min(1, "Slug is required")
            .regex(
                /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                "Enter a valid URL slug"
            ),

        overview: z
            .string()
            .trim()
            .min(1, "Overview is required")
            .max(200, "Maximum 200 characters"),

        description: z.string().trim().min(1, "Description is required"),

        category: z.string().min(1, "Category is required"),

        projectType: z.enum(["professional", "personal"]),

        status: z.enum([
            "Completed",
            "In Progress",
            "On Hold",
            "Archived",
        ]),

        // Media
        thumbnailUrl: z.string().url("Enter a valid thumbnail URL"),
        thumbnailAlt: z.string().optional().default(""),
        imageUrls: z.string().optional().default(""),

        // Project Details
        technologies: z
            .array(z.string())
            .min(1, "Select at least one technology"),

        features: z.array(z.string()).default([]),

        role: z.string().optional().default(""),
        challenges: z.string().optional().default(""),
        solution: z.string().optional().default(""),

        // Timeline
        startDate: z.date({
            error: "Start date is required",
        }),

        endDate: z.date().optional(),

        // Links
        liveUrl: z.union([
            z.literal(""),
            z.string().url("Enter a valid live URL"),
        ]).default(""),

        githubUrl: z.union([
            z.literal(""),
            z.string().url("Enter a valid GitHub URL"),
        ]).default(""),

        // Publishing
        featured: z.boolean().default(false),
        published: z.boolean().default(false),

        displayOrder: z.number().int().min(0).default(0),

        // SEO
        metaTitle: z.string().optional().default(""),

        metaDescription: z
            .string()
            .max(160, "Maximum 160 characters")
            .optional()
            .default(""),
    })
    .superRefine((data, ctx) => {
        if (
            data.endDate &&
            data.endDate.getTime() < data.startDate.getTime()
        ) {
            ctx.addIssue({
                code: "custom",
                path: ["endDate"],
                message: "End date cannot be before start date",
            });
        }

        if (data.status === "Completed" && !data.endDate) {
            ctx.addIssue({
                code: "custom",
                path: ["endDate"],
                message: "End date is required for completed projects",
            });
        }
    });

export type ProjectFormInput = z.input<typeof projectFormSchema>;
export type ProjectFormValues = z.output<typeof projectFormSchema>;
