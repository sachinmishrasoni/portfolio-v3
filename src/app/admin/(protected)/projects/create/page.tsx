
"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import ProjectForm from "@/features/admin/projects/components/form/ProjectForm";
import { deleteCloudinaryImages, uploadCloudinaryImages } from "@/services/cloudinary/cloudinary.client";
import PageHeader from "@/components/common/PageHeader";

import type { ProjectFormValues } from "@/features/admin/projects/project.schema";
import type { CloudinaryProjectImage, ProjectImage, ProjectInput } from "@/features/admin/projects/projects.types";
import { mapProjectFormToInput } from "@/features/admin/projects/components/form/project-form.utils";
import { useCreateProject } from "@/features/admin/projects/hooks/projects.mutations";

const CreateProjectPage = () => {
    const router = useRouter();
    const { mutateAsync: createProjectAsync } = useCreateProject();

    const saveProject = async (
        values: ProjectFormValues,
        thumbnail: ProjectImage,
        images: ProjectImage[],
    ) => {
        const projectData = mapProjectFormToInput(values, thumbnail, images);
        await createProjectAsync(projectData);
    };


    const handleFormSubmit = async (values: ProjectFormValues) => {
        const uploadedImages: CloudinaryProjectImage[] = [];
        let projectSaved = false;

        try {
            if (!values.thumbnail) {
                throw new Error("Project thumbnail is required.");
            }

            let thumbnail: ProjectImage;
            let images: ProjectImage[];

            if (values.mediaMode === "image") {
                // Validate and separate the new thumbnail.
                if (!(values.thumbnail instanceof File)) {
                    throw new Error("Please select a project thumbnail.");
                }

                const thumbnailFile = values.thumbnail;
                const galleryFiles: File[] = [];

                for (const image of values.images ?? []) {
                    if (image instanceof File) {
                        galleryFiles.push(image);
                    } else if (image.source !== "cloudinary") {
                        throw new Error("Please use Cloudinary images in Image Upload mode.");
                    }
                }

                // Upload thumbnail and gallery images in one API request.
                const uploaded = await uploadCloudinaryImages({
                    thumbnail: thumbnailFile,
                    images: galleryFiles,
                });

                if (!uploaded.thumbnail) {
                    throw new Error("Thumbnail upload failed.");
                }

                thumbnail = uploaded.thumbnail;
                images = uploaded.images ?? [];

                uploadedImages.push(
                    uploaded.thumbnail,
                    ...(uploaded.images ?? [])
                );
            } else {
                // URL mode: no Cloudinary upload required.
                if (values.thumbnail instanceof File || values.thumbnail.source !== "external") {
                    throw new Error("Please use an external thumbnail URL in URL mode.");
                }

                thumbnail = values.thumbnail;

                images = (values.images ?? []).map((image): ProjectImage => {
                    if (image instanceof File || image.source !== "external") {
                        throw new Error("Please use external image URLs in URL mode.");
                    }

                    return image;
                });
            }

            // Save project after successful image processing.
            await saveProject(values, thumbnail, images);
            projectSaved = true;

            toast.success("Project created successfully!");
            router.push("/admin/projects");
        } catch (error) {
            // Clean up newly uploaded images only if project saving failed.
            if (!projectSaved && uploadedImages.length) {
                try {
                    await deleteCloudinaryImages(
                        uploadedImages.map((image) => image.publicId)
                    );
                } catch (cleanupError) {
                    console.error("Some Cloudinary uploads could not be cleaned up:", cleanupError);
                }
            }

            console.error("Error creating project:", error);

            toast.error(
                error instanceof Error ? error.message : "Failed to create project."
            );
        }
    };


    return (
        <div className="space-y-6">
            <PageHeader
                title="Add New Project"
                description="Create and manage your portfolio project details."
            />

            <ProjectForm onSubmit={handleFormSubmit} onCancel={() => router.back()} />
        </div>
    );
};

export default CreateProjectPage;
