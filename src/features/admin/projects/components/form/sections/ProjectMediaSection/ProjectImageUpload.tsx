
"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
    FiImage,
    FiPlus,
    FiTrash2,
    FiUploadCloud,
} from "react-icons/fi";

import { Button } from "@/components/ui/button";

import type { ProjectFormInput } from "../../../../project.schema";

const ProjectImageUpload = () => {
    const {
        watch,
        setValue,
        formState: { isSubmitting },
    } = useFormContext<ProjectFormInput>();

    const thumbnailFile = watch("thumbnailFile");
    const imageFiles = watch("imageFiles") ?? [];

    const [thumbnailPreview, setThumbnailPreview] = useState("");
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

    // Thumbnail preview
    useEffect(() => {
        if (!thumbnailFile) {
            setThumbnailPreview("");
            return;
        }

        const preview = URL.createObjectURL(thumbnailFile);
        setThumbnailPreview(preview);

        return () => URL.revokeObjectURL(preview);
    }, [thumbnailFile]);

    // Gallery previews
    useEffect(() => {
        const previews = imageFiles.map((file) =>
            URL.createObjectURL(file)
        );

        setGalleryPreviews(previews);

        return () => {
            previews.forEach(URL.revokeObjectURL);
        };
    }, [imageFiles]);

    const handleThumbnailChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (file) {
            setValue("thumbnailFile", file, {
                shouldDirty: true,
                shouldValidate: true,
            });
        }

        event.target.value = "";
    };

    const handleGalleryChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = Array.from(event.target.files ?? []);

        if (files.length) {
            setValue("imageFiles", [...imageFiles, ...files], {
                shouldDirty: true,
                shouldValidate: true,
            });
        }

        event.target.value = "";
    };

    const removeGalleryImage = (index: number) => {
        setValue(
            "imageFiles",
            imageFiles.filter((_, i) => i !== index),
            {
                shouldDirty: true,
                shouldValidate: true,
            }
        );
    };

    return (
        <div className="space-y-5">

            {/* Thumbnail */}
            <div className="space-y-3">
                <label className="text-sm font-medium">
                    Thumbnail <span className="text-destructive">*</span>
                </label>

                <div className="relative w-full overflow-hidden rounded-xl border border-border bg-muted/40">

                    {thumbnailPreview ? (
                        <div className="group relative aspect-video w-full">
                            <img
                                src={thumbnailPreview}
                                alt="Project thumbnail preview"
                                className="size-full object-cover"
                            />

                            <div className="absolute right-3 top-3 flex gap-2">
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="secondary"
                                    onClick={() =>
                                        document
                                            .getElementById("project-thumbnail-file")
                                            ?.click()
                                    }
                                    disabled={isSubmitting}
                                >
                                    <FiUploadCloud />
                                </Button>

                                <Button
                                    type="button"
                                    size="icon"
                                    variant="destructive"
                                    onClick={() =>
                                        setValue("thumbnailFile", null, {
                                            shouldDirty: true,
                                            shouldValidate: true,
                                        })
                                    }
                                    disabled={isSubmitting}
                                >
                                    <FiTrash2 />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <label
                            htmlFor="project-thumbnail-file"
                            className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-3"
                        >
                            <FiUploadCloud size={30} className="text-primary" />

                            <div className="text-center">
                                <p className="text-sm font-medium">
                                    Click to upload thumbnail
                                </p>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    JPG, PNG or WebP
                                </p>
                            </div>
                        </label>
                    )}

                    <input
                        id="project-thumbnail-file"
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        disabled={isSubmitting}
                        onChange={handleThumbnailChange}
                    />
                </div>

                <p className="text-xs text-muted-foreground">
                    Recommended: 1280 × 720 px (JPG, PNG, WebP)
                </p>
            </div>

            {/* Gallery */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                        Project Images
                        <span className="ml-2 text-xs font-normal text-muted-foreground">
                            (Optional)
                        </span>
                    </label>

                    <span className="text-xs text-muted-foreground">
                        {imageFiles.length} images
                    </span>
                </div>

                <div className="w-full overflow-hidden">
                    <div className="flex gap-3 overflow-x-auto pb-3">
                        {imageFiles.map((file, index) => (
                            <div
                                key={`${file.name}-${index}`}
                                className="group relative h-24 w-40 shrink-0 overflow-hidden rounded-lg border border-border sm:h-28 sm:w-44"
                            >
                                <img
                                    src={galleryPreviews[index]}
                                    alt={`Project image ${index + 1}`}
                                    className="size-full object-cover"
                                />

                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute right-2 top-2 size-7"
                                    onClick={() => removeGalleryImage(index)}
                                    disabled={isSubmitting}
                                >
                                    <FiTrash2 size={13} />
                                </Button>
                            </div>
                        ))}

                        {/* Add Image */}
                        <button
                            type="button"
                            onClick={() =>
                                document
                                    .getElementById("project-gallery-files")
                                    ?.click()
                            }
                            disabled={isSubmitting}
                            className="flex h-24 w-40 shrink-0 items-center justify-center rounded-lg border border-dashed border-primary/40 bg-primary/[0.02] text-primary hover:bg-primary/5 sm:h-28 sm:w-44"
                        >
                            <FiPlus size={25} />
                        </button>
                    </div>
                </div>

                <input
                    id="project-gallery-files"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    multiple
                    className="hidden"
                    disabled={isSubmitting}
                    onChange={handleGalleryChange}
                />
            </div>
        </div>
    );
};

export default ProjectImageUpload;
