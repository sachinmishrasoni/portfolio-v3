
import { z } from "zod";

export const exampleFormSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(1, "Please enter your name.")
        .min(2, "Name must be at least 2 characters."),

    email: z
        .string()
        .trim()
        .min(1, "Please enter your email.")
        .email("That email doesn’t look right."),

    password: z
        .string()
        .min(1, "Please choose a password.")
        .min(8, "Use at least 8 characters.")
        .regex(/\d/, "Include at least one number."),

    role: z
        .string()
        .min(1, "Please pick a role."),

    birthDate: z.custom<Date>(
        (value) => value instanceof Date && !Number.isNaN(value.getTime()),
        "Please choose your date of birth."
    ).refine(
        (date) => date <= new Date(),
        "Date of birth can’t be in the future."
    ),

    bio: z
        .string()
        .trim()
        .min(10, "Tell us a little more (at least 10 characters).")
        .max(300, "Keep it under 300 characters."),
});

export type ExampleFormValues = z.infer<typeof exampleFormSchema>;
