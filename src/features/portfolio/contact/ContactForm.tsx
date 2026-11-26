
"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { TextareaField, TextField } from "@/components/ui/forms";

import {
    messageSchema,
    type MessageFormInput,
    type MessageFormValues,
} from "@/features/admin/messages/messages.schema";

import { createMessage } from "@/features/admin/messages/messages.service";
import { FiSend } from "react-icons/fi";

const ContactForm = () => {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<MessageFormInput, unknown, MessageFormValues>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            name: "",
            email: "",
            subject: "",
            message: "",
            phone: "",
            company: "",
        },
        mode: "onSubmit",
        reValidateMode: "onBlur",
    });

    // const onSubmit = async (values: MessageFormValues) => {
    //     try {
    //         await createMessage({
    //             name: values.name,
    //             email: values.email,
    //             subject: values.subject,
    //             message: values.message,
    //             phone: values.phone || "",
    //             company: values.company || "",
    //         });

    //         toast.success("Message sent successfully!", {
    //             description: "Thank you for reaching out. I'll get back to you soon.",
    //         });

    //         reset();
    //     } catch (error) {
    //         console.error("Contact form submission failed:", error);

    //         toast.error("Failed to send message", {
    //             description: "Something went wrong. Please try again.",
    //         });
    //     }
    // };

    const onSubmit = async (values: MessageFormValues) => {
        try {
            // 1. Save the message in Firebase
            await createMessage({
                name: values.name,
                email: values.email,
                subject: values.subject,
                message: values.message,
                phone: values.phone || "",
                company: values.company || "",
            });

            // 2. Send email notification
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            const result = await response.json();

            reset();

            if (!response.ok) {
                toast.warning("Message received, but email notification failed.", {
                    description: "Your message was saved. Please try again later.",
                });
                return;
            }

            toast.success("Message sent successfully!", {
                description: "Thank you for reaching out. I'll get back to you soon.",
            });
        } catch (error) {
            console.error("Contact form submission failed:", error);

            toast.error("Unable to submit your message.", {
                description: "Please try again later.",
            });
        }
    };

    const handleReset = () => {
        reset();
    };

    return (
        <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto w-full max-w-2xl rounded-3xl border border-border bg-card p-6 sm:p-8"
        >
            <h2 className="text-xl font-semibold text-foreground">
                Get In Touch
            </h2>

            <p className="mt-1.5 text-sm text-muted-foreground">
                Have a project, opportunity, or question? Send me a message.
                I'll get back to you as soon as possible.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {/* Full Name */}
                <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            id="contact-name"
                            name={field.name}
                            label="Full Name"
                            placeholder="Enter your full name"
                            autoComplete="name"
                            required
                            value={field.value}
                            onChange={(e) => field.onChange(e)}
                            onBlur={field.onBlur}
                            disabled={isSubmitting}
                            error={errors.name?.message}
                        />
                    )}
                />

                {/* Email */}
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            id="contact-email"
                            name={field.name}
                            type="email"
                            label="Email Address"
                            placeholder="you@example.com"
                            autoComplete="email"
                            required
                            value={field.value}
                            onChange={(e) => field.onChange(e)}
                            onBlur={field.onBlur}
                            disabled={isSubmitting}
                            error={errors.email?.message}
                        />
                    )}
                />

                {/* Phone */}
                <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            id="contact-phone"
                            name={field.name}
                            // type="tel"
                            label="Phone Number"
                            placeholder="Enter your phone number"
                            autoComplete="tel"
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e)}
                            onBlur={field.onBlur}
                            disabled={isSubmitting}
                            error={errors.phone?.message}
                        />
                    )}
                />

                {/* Company */}
                <Controller
                    name="company"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            id="contact-company"
                            name={field.name}
                            label="Company"
                            placeholder="Enter your company name"
                            autoComplete="organization"
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e)}
                            onBlur={field.onBlur}
                            disabled={isSubmitting}
                            error={errors.company?.message}
                        />
                    )}
                />

                {/* Subject */}
                <Controller
                    name="subject"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            id="contact-subject"
                            name={field.name}
                            label="Subject"
                            placeholder="What would you like to discuss?"
                            required
                            className="sm:col-span-2"
                            value={field.value}
                            onChange={(e) => field.onChange(e)}
                            onBlur={field.onBlur}
                            disabled={isSubmitting}
                            error={errors.subject?.message}
                        />
                    )}
                />

                {/* Message */}
                <Controller
                    name="message"
                    control={control}
                    render={({ field }) => (
                        <TextareaField
                            id="contact-message"
                            name={field.name}
                            label="Your Message"
                            placeholder="Write your message here..."
                            required
                            rows={5}
                            className="sm:col-span-2"
                            value={field.value}
                            onChange={(e) => field.onChange(e)}
                            onBlur={field.onBlur}
                            disabled={isSubmitting}
                            error={errors.message?.message}
                        />
                    )}
                />
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    disabled={isSubmitting}
                >
                    Reset
                </Button>

                <Button
                    type="submit"
                    loading={isSubmitting}
                    loadingText="Sending..."
                    startIcon={<FiSend />}
                >
                    Send Message
                </Button>
            </div>
        </form>
    );
};

export default ContactForm;
