
import { z } from "zod";

export const skillSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Skill name must be at least 2 characters")
        .max(50, "Skill name cannot exceed 50 characters"),

    description: z
        .string()
        .trim()
        .min(5, "Description must be at least 5 characters")
        .max(300, "Description cannot exceed 300 characters"),

    category: z.enum([
        "frontend",
        "backend",
        "database",
        "devops",
        "tools",
        "other",
    ]),

    proficiency: z
        .number()
        .min(0, "Proficiency must be at least 0")
        .max(100, "Proficiency cannot exceed 100"),

    icon: z
        .string()
        .trim()
        .min(1, "Please select an icon"),

    color: z
        .string()
        .regex(
            /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/,
            "Please enter a valid hex color"
        )
        .optional()
        .or(z.literal("")),

    isActive: z.boolean(),

    displayOrder: z
        .number()
        .int("Display order must be an integer")
        .min(0, "Display order cannot be negative"),
});

// export type SkillFormValues = z.infer<typeof skillSchema>;

export type SkillFormInput = z.input<typeof skillSchema>;
export type SkillFormValues = z.output<typeof skillSchema>;
