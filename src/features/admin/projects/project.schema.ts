import { z } from "zod";

export const projectFormSchema = z
    .object({
        // Basic information
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
            "completed",
            "in-progress",
            "on-hold",
            "archived",
        ]),

        // Project media
        mediaMode: z.enum(["image", "url"]).default("image"),
        thumbnailFile: z.instanceof(File).nullable().default(null),
        imageFiles: z.array(z.instanceof(File)).default([]),
        thumbnailUrl: z.string().default(""),
        imageUrls: z.string().default(""),

        // Project details
        technologies: z.array(z.string()).min(1, "Select at least one technology"),
        features: z.array(z.string()).default([]),
        role: z.string().optional().default(""),
        challenges: z.string().optional().default(""),
        solution: z.string().optional().default(""),

        // Project timeline
        startDate: z.date().optional(),
        endDate: z.date().optional(),

        // Project links
        liveUrl: z.union([
            z.literal(""),
            z.string().url("Enter a valid live URL"),
        ]).default(""),

        githubUrl: z.union([
            z.literal(""),
            z.string().url("Enter a valid GitHub URL"),
        ]).default(""),

        // Publishing settings
        featured: z.boolean().default(false),
        published: z.boolean().default(false),
        displayOrder: z.number().int().min(0).default(0),

        // SEO settings
        metaTitle: z.string().optional().default(""),
        metaDescription: z.string().max(160, "Maximum 160 characters").optional().default(""),
    })
    .superRefine((data, ctx) => {
        // Validate start date
        if (!data.startDate) {
            ctx.addIssue({
                code: "custom",
                path: ["startDate"],
                message: "Start date is required",
            });
        }

        // Validate date range
        if (
            data.startDate &&
            data.endDate &&
            data.endDate.getTime() < data.startDate.getTime()
        ) {
            ctx.addIssue({
                code: "custom",
                path: ["endDate"],
                message: "End date cannot be before start date",
            });
        }

        // Require end date for completed projects
        if (data.status === "completed" && !data.endDate) {
            ctx.addIssue({
                code: "custom",
                path: ["endDate"],
                message: "End date is required for completed projects",
            });
        }

        // Validate thumbnail based on media mode
        if (data.mediaMode === "image" && !data.thumbnailFile) {
            ctx.addIssue({
                code: "custom",
                path: ["thumbnailFile"],
                message: "Thumbnail is required",
            });
        }

        if (data.mediaMode === "url" && !z.string().url().safeParse(data.thumbnailUrl).success) {
            ctx.addIssue({
                code: "custom",
                path: ["thumbnailUrl"],
                message: "Enter a valid thumbnail URL",
            });
        }
    });

export type ProjectFormInput = z.input<typeof projectFormSchema>;
export type ProjectFormValues = z.output<typeof projectFormSchema>;
