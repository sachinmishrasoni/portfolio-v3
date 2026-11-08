
import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "Please enter your email.")
        .email("Please enter a valid email address."),

    password: z
        .string()
        .min(1, "Please enter your password.")
        .min(8, "Password must be at least 8 characters."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
