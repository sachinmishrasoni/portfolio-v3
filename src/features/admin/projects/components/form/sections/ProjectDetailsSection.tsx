
"use client";

import { Controller, useFormContext } from "react-hook-form";
import { FiLayers } from "react-icons/fi";

import {
    MultiSelectField,
    RichTextEditor,
    TextareaField,
    TextField,
    type SelectOption,
} from "@/components/ui/forms";

import type { ProjectFormInput } from "../../../project.schema";
import ProjectFormSection from "../ProjectFormSection";

const TECH_OPTIONS: SelectOption[] = [
    { value: "nextjs", label: "Next.js" },
    { value: "react", label: "React" },
    { value: "typescript", label: "TypeScript" },
    { value: "javascript", label: "JavaScript" },
    { value: "tailwind", label: "Tailwind CSS" },
    { value: "firebase", label: "Firebase" },
    { value: "nodejs", label: "Node.js" },
    { value: "mongodb", label: "MongoDB" },
    { value: "prisma", label: "Prisma" },
    { value: "nextauth", label: "NextAuth" },
];

const ProjectDetailsSection = () => {
    const {
        control,
        formState: { errors, isSubmitting },
    } = useFormContext<ProjectFormInput>();

    return (
        <ProjectFormSection
            icon={FiLayers}
            title="Project Details"
            description="Add technologies, features and your contribution."
        >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Technologies */}
                <Controller
                    name="technologies"
                    control={control}
                    render={({ field }) => (
                        <MultiSelectField
                            id="project-technologies"
                            name={field.name}
                            label="Technologies"
                            placeholder="Select technologies"
                            options={TECH_OPTIONS}
                            variant="outlined"
                            creatable
                            required
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            disabled={isSubmitting}
                            error={errors.technologies?.message}
                        />
                    )}
                />

                {/* Role */}
                <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            variant="outlined"
                            id="project-role"
                            name={field.name}
                            label="Your Role"
                            placeholder="Frontend Developer"
                            value={field.value ?? ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            disabled={isSubmitting}
                            error={errors.role?.message}
                        />
                    )}
                />

            </div>

            {/* Features */}
            <Controller
                name="features"
                control={control}
                render={({ field }) => (
                    <MultiSelectField
                        id="project-features"
                        name={field.name}
                        label="Key Features"
                        placeholder="Add project features"
                        options={[]}
                        variant="outlined"
                        creatable
                        value={field.value ?? []}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        disabled={isSubmitting}
                        error={errors.features?.message}
                    />
                )}
            />

            {/* Challenges */}
            <Controller
                name="challenges"
                control={control}
                render={({ field }) => (
                    <TextareaField
                        variant="outlined"
                        id="project-challenges"
                        name={field.name}
                        label="Challenges"
                        placeholder="What technical challenges did you face?"
                        rows={4}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        disabled={isSubmitting}
                        error={errors.challenges?.message}
                    />
                )}
            />

            {/* Solution */}
            <Controller
                name="solution"
                control={control}
                render={({ field }) => (
                    <RichTextEditor
                        id="project-solution"
                        name={field.name}
                        label="Solution"
                        placeholder="Explain how you solved the challenges..."
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        disabled={isSubmitting}
                        error={errors.solution?.message}
                    />
                )}
            />
        </ProjectFormSection>
    );
};

export default ProjectDetailsSection;
