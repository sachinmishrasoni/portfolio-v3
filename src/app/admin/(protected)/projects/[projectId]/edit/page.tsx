
"use client";

import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import PageHeader from "@/components/common/PageHeader";
import AsyncContent from "@/components/common/AsyncContent";
import ProjectForm from "@/features/admin/projects/components/form/ProjectForm";

import {
    deleteCloudinaryImages,
    uploadCloudinaryImages,
} from "@/services/cloudinary/cloudinary.client";

import type { ProjectFormValues } from "@/features/admin/projects/project.schema";
import type {
    CloudinaryProjectImage,
    ProjectImage,
} from "@/features/admin/projects/projects.types";
import { mapProjectFormToInput } from "@/features/admin/projects/components/form/project-form.utils";
import { useProject } from "@/features/admin/projects/hooks/projects.queries";
import { useUpdateProject } from "@/features/admin/projects/hooks/projects.mutations";

const EditProjectPage = () => {
    const router = useRouter();
    const { projectId } = useParams<{ projectId: string }>();

    const { data: project, isLoading, isError, error, refetch, } = useProject(projectId);
    const { mutateAsync: updateProjectAsync } = useUpdateProject();

    // Build Firestore project payload
    const saveProject = async (
        values: ProjectFormValues,
        thumbnail: ProjectImage,
        images: ProjectImage[],
    ) => {
        const projectData = mapProjectFormToInput(values, thumbnail, images);

        await updateProjectAsync({
            projectId,
            projectData,
        });
    };

    // Handle form submission

    const handleFormSubmit = async (values: ProjectFormValues) => {
        if (!project) return;

        const uploadedImages: CloudinaryProjectImage[] = [];
        let projectSaved = false;

        try {
            if (!values.thumbnail) {
                throw new Error("Project thumbnail is required.");
            }

            let thumbnail: ProjectImage;
            let images: ProjectImage[];

            if (values.mediaMode === "image") {
                // Separate new thumbnail and gallery files from existing images.
                let thumbnailFile: File | null = null;
                let existingThumbnail: ProjectImage | null = null;

                if (values.thumbnail instanceof File) {
                    thumbnailFile = values.thumbnail;
                } else {
                    existingThumbnail = values.thumbnail;

                    if (existingThumbnail.source !== "cloudinary") {
                        throw new Error("Please use a Cloudinary thumbnail in Image Upload mode.");
                    }
                }

                const galleryFiles: File[] = [];

                for (const image of values.images ?? []) {
                    if (image instanceof File) {
                        galleryFiles.push(image);
                    } else if (image.source !== "cloudinary") {
                        throw new Error("Please use Cloudinary images in Image Upload mode.");
                    }
                }

                let uploadedThumbnail: CloudinaryProjectImage | undefined;
                let newGalleryImages: CloudinaryProjectImage[] = [];

                // Upload all new images through a single API request.
                if (thumbnailFile) {
                    const uploaded = await uploadCloudinaryImages({
                        thumbnail: thumbnailFile,
                        images: galleryFiles,
                    });

                    uploadedThumbnail = uploaded.thumbnail;
                    newGalleryImages = uploaded.images ?? [];

                    if (uploaded.thumbnail) {
                        uploadedImages.push(uploaded.thumbnail);
                    }

                    uploadedImages.push(...newGalleryImages);
                } else if (galleryFiles.length) {
                    const uploaded = await uploadCloudinaryImages({
                        files: galleryFiles,
                    });

                    newGalleryImages = uploaded.images ?? [];
                    uploadedImages.push(...newGalleryImages);
                }

                thumbnail = uploadedThumbnail ?? existingThumbnail!;

                // Preserve the original gallery order.
                let uploadedIndex = 0;

                images = (values.images ?? []).map((image): ProjectImage => {
                    if (image instanceof File) {
                        return newGalleryImages[uploadedIndex++];
                    }

                    return image;
                });
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

            // Save updated project before deleting old images.
            await saveProject(values, thumbnail, images);
            projectSaved = true;

            // Find removed Cloudinary images.
            const previousImages = [project.thumbnail, ...project.images];
            const currentImages = [thumbnail, ...images];

            const currentPublicIds = new Set(
                currentImages
                    .filter((image): image is CloudinaryProjectImage => image.source === "cloudinary")
                    .map((image) => image.publicId)
            );

            const removedPublicIds = [
                ...new Set(
                    previousImages
                        .filter((image): image is CloudinaryProjectImage => image.source === "cloudinary")
                        .map((image) => image.publicId)
                        .filter((publicId) => !currentPublicIds.has(publicId))
                ),
            ];

            // Delete all removed images through a single API request.
            let hasCleanupErrors = false;

            if (removedPublicIds.length) {
                try {
                    await deleteCloudinaryImages(removedPublicIds);
                } catch (error) {
                    hasCleanupErrors = true;
                    console.error("Some removed Cloudinary images could not be deleted:", error);
                }
            }

            if (hasCleanupErrors) {
                toast.warning("Project updated, but some old images could not be deleted.");
            } else {
                toast.success("Project updated successfully!");
            }

            router.push("/admin/projects");
        } catch (error) {
            // Clean up newly uploaded images only if saving failed.
            if (!projectSaved && uploadedImages.length) {
                try {
                    await deleteCloudinaryImages(
                        uploadedImages.map((image) => image.publicId)
                    );
                } catch (cleanupError) {
                    console.error("Some new Cloudinary uploads could not be cleaned up:", cleanupError);
                }
            }

            console.error("Error updating project:", error);

            toast.error(
                error instanceof Error ? error.message : "Failed to update project."
            );
        }
    };


    return (
        <AsyncContent
            isLoading={isLoading}
            isError={isError}
            error={error}
            isEmpty={!project}
            onRetry={() => refetch()}
            loadingMessage="Loading project..."
            emptyMessage="Project not found."
        >
            {project && (
                <div className="space-y-6">
                    <PageHeader
                        title="Edit Project"
                        description="Update your portfolio project details."
                    />

                    <ProjectForm
                        initialData={project}
                        onSubmit={handleFormSubmit}
                        onCancel={() => router.back()}
                    />
                </div>
            )}
        </AsyncContent>
    );
};

export default EditProjectPage;
