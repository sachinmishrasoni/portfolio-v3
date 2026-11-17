
import { z } from "zod";

// Project image schema for existing images
export const projectImageSchema = z.discriminatedUnion("source", [
    z.object({
        url: z.string().url("Invalid image URL"),
        source: z.literal("cloudinary"),
        publicId: z.string().min(1, "Public ID is required"),
        assetId: z.string().optional(),
    }),

    z.object({
        url: z.string().url("Invalid image URL"),
        source: z.literal("external"),
    }),
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_GALLERY_IMAGES = 10;

const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
];

// Image file validation
const imageFileSchema = z
    .instanceof(File)
    .refine(
        (file) => ALLOWED_IMAGE_TYPES.includes(file.type),
        "Only JPEG, PNG, WebP and AVIF images are allowed"
    )
    .refine(
        (file) => file.size <= MAX_FILE_SIZE,
        "Image size must be less than 5 MB"
    );

// Form image can be a new file or existing image
const formImageSchema = z.union([
    imageFileSchema,
    projectImageSchema,
]);

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
        category: z.string().trim().min(1, "Category is required"),
        projectType: z.enum(["professional", "personal"]),
        status: z.enum([
            "completed",
            "in-progress",
            "on-hold",
            "archived",
        ]),

        // Project media
        mediaMode: z.enum(["image", "url"]).default("image"),
        thumbnail: formImageSchema.nullable().default(null),
        images: z
            .array(formImageSchema)
            .max(MAX_GALLERY_IMAGES, "Maximum 10 gallery images allowed")
            .default([]),

        // Project details
        technologies: z
            .array(z.string())
            .min(1, "Select at least one technology"),
        features: z.array(z.string()).default([]),
        role: z.string().optional().default(""),
        challenges: z.string().optional().default(""),
        solution: z.string().optional().default(""),

        // Project timeline
        startDate: z.date(),
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
        metaDescription: z
            .string()
            .max(160, "Maximum 160 characters")
            .optional()
            .default(""),
    })
    .superRefine((data, ctx) => {
        // Validate date range
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

        // Require end date for completed projects
        if (data.status === "completed" && !data.endDate) {
            ctx.addIssue({
                code: "custom",
                path: ["endDate"],
                message: "End date is required for completed projects",
            });
        }

        // Require thumbnail
        if (!data.thumbnail) {
            ctx.addIssue({
                code: "custom",
                path: ["thumbnail"],
                message: "Thumbnail is required",
            });
        }

        // Validate media source according to selected mode
        if (data.mediaMode === "image") {
            // Validate thumbnail
            if (
                data.thumbnail &&
                !(data.thumbnail instanceof File) &&
                data.thumbnail.source !== "cloudinary"
            ) {
                ctx.addIssue({
                    code: "custom",
                    path: ["thumbnail"],
                    message: "Please use a Cloudinary image",
                });
            }

            // Validate gallery images
            data.images.forEach((image, index) => {
                if (
                    !(image instanceof File) &&
                    image.source !== "cloudinary"
                ) {
                    ctx.addIssue({
                        code: "custom",
                        path: ["images", index],
                        message: "Only Cloudinary images are allowed",
                    });
                }
            });
        }

        if (data.mediaMode === "url") {
            // External URL mode does not accept uploaded files
            if (data.thumbnail instanceof File) {
                ctx.addIssue({
                    code: "custom",
                    path: ["thumbnail"],
                    message: "Please use an external thumbnail URL",
                });
            }

            if (
                data.thumbnail &&
                !(data.thumbnail instanceof File) &&
                data.thumbnail.source !== "external"
            ) {
                ctx.addIssue({
                    code: "custom",
                    path: ["thumbnail"],
                    message: "Please use an external thumbnail URL",
                });
            }

            data.images.forEach((image, index) => {
                if (
                    image instanceof File ||
                    image.source !== "external"
                ) {
                    ctx.addIssue({
                        code: "custom",
                        path: ["images", index],
                        message: "Only external image URLs are allowed",
                    });
                }
            });
        }
    });

export type ProjectFormInput = z.input<typeof projectFormSchema>;
export type ProjectFormValues = z.output<typeof projectFormSchema>;
