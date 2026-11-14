
"use client";

import { useEffect } from "react";

import {
    FormProvider,
    useForm,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import type { Project } from "../../projects.types";

import {
    projectFormSchema,
    type ProjectFormInput,
    type ProjectFormValues,
} from "../../project.schema";

import BasicInformationSection from "./sections/BasicInformationSection";
import ProjectContentSection from "./sections/ProjectContentSection";
import ProjectDetailsSection from "./sections/ProjectDetailsSection";
import ProjectMediaSection from "./sections/ProjectMediaSection";
import ProjectTimelineSection from "./sections/ProjectTimelineSection";
import ProjectLinksSection from "./sections/ProjectLinksSection";
import PublishingSettingsSection from "./sections/PublishingSettingsSection";
import ProjectSEOSection from "./sections/ProjectSEOSection";

import ProjectFormActions from "./ProjectFormActions";
import { mapProjectToForm } from "./project-form.utils";

interface ProjectFormProps {
    initialData?: Project;
    onSubmit: (values: ProjectFormValues) => Promise<void> | void;
    onCancel?: () => void;
}

const DEFAULT_VALUES: ProjectFormInput = {
    title: "",
    slug: "",
    overview: "",
    description: "",
    category: "",
    projectType: "personal",
    status: "In Progress",

    thumbnailUrl: "",
    thumbnailAlt: "",
    imageUrls: "",

    technologies: [],
    features: [],
    role: "",
    challenges: "",
    solution: "",

    startDate: undefined,
    endDate: undefined,

    liveUrl: "",
    githubUrl: "",

    featured: false,
    published: false,
    displayOrder: 0,

    metaTitle: "",
    metaDescription: "",
};

const ProjectForm = ({
    initialData,
    onSubmit,
    onCancel,
}: ProjectFormProps) => {
    const methods = useForm<
        ProjectFormInput,
        unknown,
        ProjectFormValues
    >({
        resolver: zodResolver(projectFormSchema),
        defaultValues: DEFAULT_VALUES,
        mode: "onSubmit",
        reValidateMode: "onBlur",
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    // Populate form when editing an existing project.
    useEffect(() => {
        if (initialData) {
            reset(mapProjectToForm(initialData));
        } else {
            reset(DEFAULT_VALUES);
        }
    }, [initialData, reset]);

    const handleFormSubmit = async (values: ProjectFormValues) => {
        await onSubmit(values);
    };

    return (
        <FormProvider {...methods}>
            <form
                noValidate
                onSubmit={handleSubmit(handleFormSubmit)}
                className="w-full space-y-4"
            >
                <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-12">

                    {/* LEFT COLUMN */}
                    <div className="space-y-4 xl:col-span-7">

                        <BasicInformationSection
                            projectId={initialData?.projectId}
                        />

                        <ProjectContentSection />

                        <ProjectDetailsSection />

                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="space-y-4 xl:col-span-5">
                        <ProjectMediaSection />
                        <ProjectTimelineSection />

                        <ProjectLinksSection />

                        <PublishingSettingsSection />

                        <ProjectSEOSection />


                    </div>
                </div>

                <ProjectFormActions
                    isSubmitting={isSubmitting}
                    isEdit={!!initialData}
                    onCancel={onCancel}
                />
            </form>
        </FormProvider>
    );
};

export default ProjectForm;
