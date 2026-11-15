import { z } from "zod";

const projectImageSchema = z.object({
    url: z.string().url(),
    path: z.string().optional(),
});

export const firestoreProjectSchema = z.object({
    projectId: z.string().min(1),
    title: z.string().min(1),
    slug: z.string().min(1),
    overview: z.string(),
    description: z.string(),
    category: z.string(),

    projectType: z.enum(["professional", "personal"]),

    status: z.enum([
        "completed",
        "in-progress",
        "on-hold",
        "archived",
    ]),

    thumbnail: projectImageSchema,
    images: z.array(projectImageSchema),

    technologies: z.array(z.string()),
    features: z.array(z.string()),

    role: z.string().optional(),
    challenges: z.string().optional(),
    solution: z.string().optional(),

    startDate: z.string(),
    endDate: z.string().optional(),

    liveUrl: z.string().optional(),
    githubUrl: z.string().optional(),

    featured: z.boolean(),
    published: z.boolean(),
    displayOrder: z.number().int().min(0),

    seo: z.object({
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
    }).optional(),
});

export type FirestoreProjectInput = z.infer<
    typeof firestoreProjectSchema
>;