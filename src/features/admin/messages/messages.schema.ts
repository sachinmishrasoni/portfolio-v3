
import { z } from "zod";

export const messageSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(150, "Email cannot exceed 150 characters"),

  subject: z
    .string()
    .trim()
    .min(3, "Subject must be at least 3 characters")
    .max(150, "Subject cannot exceed 150 characters"),

  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message cannot exceed 5000 characters"),

  phone: z
    .string()
    .trim()
    .max(20, "Phone number cannot exceed 20 characters")
    .optional()
    .or(z.literal("")),

  company: z
    .string()
    .trim()
    .max(100, "Company name cannot exceed 100 characters")
    .optional()
    .or(z.literal("")),
});

export type MessageFormInput = z.input<typeof messageSchema>;

export type MessageFormValues = z.output<typeof messageSchema>;
