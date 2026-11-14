"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiCheckCircle, FiLoader, FiSend } from "react-icons/fi";

import { Button } from "@/components/ui/button";

import {
    DateField,
    MultiSelectField,
    RichTextEditor,
    SelectField,
    TextareaField,
    TextField,
    type SelectOption,
} from "@/components/ui/forms";

import {
    exampleFormSchema,
    type ExampleFormValues,
} from "./example-form.schema";

const ROLE_OPTIONS: SelectOption[] = [
    { value: "developer", label: "Developer" },
    { value: "designer", label: "Designer" },
    { value: "manager", label: "Product manager" },
    { value: "student", label: "Student" },
    { value: "other", label: "Other" },
];

const TECH_OPTIONS: SelectOption[] = [
    { value: "nextjs", label: "Next.js" },
    { value: "typescript", label: "TypeScript" },
    { value: "tailwind", label: "Tailwind CSS" },
    { value: "firebase", label: "Firebase" },
];


const BIO_MAX = 300;

const ExampleForm = () => {
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<ExampleFormValues>({
        resolver: zodResolver(exampleFormSchema),

        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            role: "",
            birthDate: undefined,
            bio: "",
            description: "",
            technologies: [],
        },

        mode: "onSubmit",
        reValidateMode: "onBlur",
    });

    const onSubmit = async (values: ExampleFormValues) => {
        setIsSuccess(false);

        try {
            // Convert Date to yyyy-MM-dd before sending to your API.
            const payload = {
                ...values,
                birthDate: values.birthDate.toISOString().split("T")[0],
            };

            // Demo submission. Replace with your API/Firebase call.
            console.log("Form submitted:", payload);

            await new Promise((resolve) => setTimeout(resolve, 1200));

            setIsSuccess(true);
        } catch (error) {
            console.error("Form submission failed:", error);
        }
    };

    const handleReset = () => {
        reset();
        setIsSuccess(false);
    };

    return (
        <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto w-full max-w-2xl rounded-3xl border border-border bg-card p-6 sm:p-8"
        >
            <h2 className="text-xl font-semibold text-foreground">
                Example form
            </h2>

            <p className="mt-1.5 text-sm text-muted-foreground">
                Every field type from{" "}
                <code className="font-mono">
                    components/ui/forms
                </code>.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">

                {/* Full Name */}
                <Controller
                    name="fullName"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            id="example-fullName"
                            name={field.name}
                            label="Full name"
                            placeholder="Sachin Mishra Soni"
                            autoComplete="name"
                            required
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            disabled={isSubmitting}
                            error={errors.fullName?.message}
                        />
                    )}
                />

                {/* Email */}
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            id="example-email"
                            name={field.name}
                            type="email"
                            label="Email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            required
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            disabled={isSubmitting}
                            error={errors.email?.message}
                        />
                    )}
                />

                {/* Password */}
                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            id="example-password"
                            name={field.name}
                            type="password"
                            label="Password"
                            autoComplete="new-password"
                            required
                            className="sm:col-span-2"
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            disabled={isSubmitting}
                            error={errors.password?.message}
                            hint="At least 8 characters, including a number."
                        />
                    )}
                />

                {/* Role */}
                <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                        <SelectField
                            id="example-role"
                            name={field.name}
                            label="Role"
                            placeholder="Choose one"
                            options={ROLE_OPTIONS}
                            required
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            disabled={isSubmitting}
                            error={errors.role?.message}
                        />
                    )}
                />

                {/* Date of Birth */}
                <Controller
                    name="birthDate"
                    control={control}
                    render={({ field }) => (
                        <DateField
                            id="example-birthDate"
                            name={field.name}
                            label="Date of birth"
                            placeholder="Pick a date"
                            // minDate={new Date("1950-01-01")}
                            // maxDate={new Date()}
                            required
                            value={field.value
                                ? `${field.value.getFullYear()}-${String(field.value.getMonth() + 1).padStart(2, "0")}-${String(field.value.getDate()).padStart(2, "0")}`
                                : ""}
                            onChange={(value) => field.onChange(value ? new Date(`${value}T00:00:00`) : undefined)}
                            onBlur={field.onBlur}
                            disabled={isSubmitting}
                            error={errors.birthDate?.message}
                        />
                    )}
                />

                <Controller
                    name="technologies"
                    control={control}
                    render={({ field }) => (
                        <MultiSelectField
                            id="project-technologies"
                            name={field.name}
                            label="Technologies"
                            placeholder="Select technologies"
                            variant="outlined"
                            options={TECH_OPTIONS}
                            creatable
                            required
                            className="sm:col-span-2"
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            disabled={isSubmitting}
                            error={errors.technologies?.message}
                        />
                    )}
                />

                {/* Bio */}
                <Controller
                    name="bio"
                    control={control}
                    render={({ field }) => (
                        <TextareaField
                            id="example-bio"
                            name={field.name}
                            label="About you"
                            placeholder="A few words about what you do…"
                            required
                            rows={4}
                            maxLength={BIO_MAX}
                            showCount
                            className="sm:col-span-2"
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            disabled={isSubmitting}
                            error={errors.bio?.message}
                        />
                    )}
                />

                {/* Description (rich text) */}
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <RichTextEditor
                            id="example-description"
                            name={field.name}
                            label="Description"
                            placeholder="Write something…"
                            required
                            className="sm:col-span-2"
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            disabled={isSubmitting}
                            error={errors.description?.message}
                        />
                    )}
                />
            </div>

            {/* Success Message */}
            {isSuccess && (
                <div
                    role="status"
                    className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4"
                >
                    <p className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        <FiCheckCircle aria-hidden />
                        Submitted successfully. This is what your API would receive:
                    </p>

                    <p className="mt-2 text-xs text-muted-foreground">
                        Check the browser console for the submitted payload.
                    </p>
                </div>
            )}

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
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <FiLoader className="animate-spin" />
                            Submitting…
                        </>
                    ) : (
                        <>
                            <FiSend />
                            Submit
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
};

export default ExampleForm;
