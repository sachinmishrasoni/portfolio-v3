
"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import ProjectForm from "@/features/admin/projects/components/form/ProjectForm";
import { createProject } from "@/features/admin/projects/projects.service";
import { uploadCloudinaryImage, deleteCloudinaryImage, uploadProjectImages } from "@/services/cloudinary/cloudinary.client";
import PageHeader from "@/components/common/PageHeader";

import type { ProjectFormValues } from "@/features/admin/projects/project.schema";
import type { CloudinaryProjectImage, ProjectImage, ProjectInput } from "@/features/admin/projects/projects.types";

const CreateProjectPage = () => {
    const router = useRouter();



    const saveProject = async (
        values: ProjectFormValues,
        thumbnail: ProjectImage,
        images: ProjectImage[]
    ) => {
        const projectData: ProjectInput = {
            title: values.title,
            slug: values.slug,
            overview: values.overview,
            description: values.description,
            category: values.category,
            projectType: values.projectType,
            status: values.status,
            mediaMode: values.mediaMode,
            thumbnail,
            images,
            technologies: values.technologies,
            features: values.features,
            role: values.role || undefined,
            challenges: values.challenges || undefined,
            solution: values.solution || undefined,
            startDate: values.startDate.toISOString(),
            endDate: values.endDate?.toISOString(),
            liveUrl: values.liveUrl || undefined,
            githubUrl: values.githubUrl || undefined,
            featured: values.featured,
            published: values.published,
            displayOrder: values.displayOrder,
            ...(values.metaTitle || values.metaDescription
                ? {
                    seo: {
                        ...(values.metaTitle ? { metaTitle: values.metaTitle } : {}),
                        ...(values.metaDescription
                            ? { metaDescription: values.metaDescription }
                            : {}),
                    },
                }
                : {}),
        };

        await createProject(projectData);
    };

    const handleFormSubmit = async (values: ProjectFormValues) => {
        console.log("Form submitted:", values);

        const uploadedImages: CloudinaryProjectImage[] = [];

        try {
            if (!values.thumbnail) {
                throw new Error("Project thumbnail is required.");
            }

            if (values.mediaMode === "image") {
                // Separate new File objects from existing Cloudinary images.
                const thumbnailFile = values.thumbnail instanceof File
                    ? values.thumbnail
                    : null;

                if (!thumbnailFile) {
                    throw new Error("Please select a new project thumbnail.");
                }

                const galleryFiles: File[] = [];
                const existingGalleryImages: ProjectImage[] = [];

                for (const image of values.images ?? []) {
                    if (image instanceof File) {
                        galleryFiles.push(image);
                    } else {
                        if (image.source !== "cloudinary") {
                            throw new Error("Please use Cloudinary images in Image Upload mode.");
                        }

                        existingGalleryImages.push(image);
                    }
                }

                // One API request for thumbnail and all new gallery images.
                const uploaded = await uploadProjectImages({
                    thumbnail: thumbnailFile,
                    images: galleryFiles,
                });

                uploadedImages.push(uploaded.thumbnail, ...uploaded.images);

                const thumbnail: ProjectImage = uploaded.thumbnail;

                const images: ProjectImage[] = [
                    ...existingGalleryImages,
                    ...uploaded.images,
                ];

                await saveProject(values, thumbnail, images);
            } else {
                // URL mode: no Cloudinary upload required.
                const thumbnail = values.thumbnail as ProjectImage;

                if (thumbnail.source !== "external") {
                    throw new Error("Please use an external thumbnail URL in URL mode.");
                }

                const images = (values.images ?? []).map((image) => {
                    if (image instanceof File || image.source !== "external") {
                        throw new Error("Please use external image URLs in URL mode.");
                    }

                    return image;
                });

                await saveProject(values, thumbnail, images);
            }

            toast.success("Project created successfully!");
            // router.push("/admin/projects");
        } catch (error) {
            // Clean up images uploaded during this submission.
            const cleanupResults = await Promise.allSettled(
                uploadedImages.map((image) =>
                    deleteCloudinaryImage(image.publicId)
                )
            );

            const failedCleanups = cleanupResults.filter(
                (result) => result.status === "rejected"
            );

            if (failedCleanups.length > 0) {
                console.error("Some Cloudinary uploads could not be cleaned up:", failedCleanups);
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
