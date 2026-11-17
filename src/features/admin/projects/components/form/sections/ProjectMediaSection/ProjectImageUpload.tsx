
"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { useFormContext } from "react-hook-form";
import { FiPlus, FiTrash2, FiUploadCloud } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import type { ProjectFormInput } from "../../../../project.schema";

const MAX_GALLERY_IMAGES = 10;

const ProjectImageUpload = () => {
    const {
        watch,
        getValues,
        setValue,
        formState: { isSubmitting, errors },
    } = useFormContext<ProjectFormInput>();

    const thumbnail = watch("thumbnail");
    const images = watch("images") ?? [];

    const [thumbnailPreview, setThumbnailPreview] = useState("");
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

    // Thumbnail preview: File uses an object URL; existing image uses its URL.
    useEffect(() => {
        if (!thumbnail) {
            setThumbnailPreview("");
            return;
        }

        if (!(thumbnail instanceof File)) {
            setThumbnailPreview(thumbnail.url);
            return;
        }

        const preview = URL.createObjectURL(thumbnail);
        setThumbnailPreview(preview);

        return () => URL.revokeObjectURL(preview);
    }, [thumbnail]);

    // Gallery preview supports both new Files and existing ProjectImage objects.
    useEffect(() => {
        const previews = images.map((image) => {
            return image instanceof File
                ? URL.createObjectURL(image)
                : image.url;
        });

        setGalleryPreviews(previews);

        return () => {
            images.forEach((image) => {
                if (image instanceof File) {
                    const preview = previews[images.indexOf(image)];
                    if (preview) URL.revokeObjectURL(preview);
                }
            });
        };
    }, [images]);

    const handleThumbnailChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (file) {
            setValue("thumbnail", file, {
                shouldDirty: true,
                shouldValidate: true,
            });
        }

        event.target.value = "";
    };

    const handleGalleryChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const selectedFiles = Array.from(event.target.files ?? []);
        const currentImages = getValues("images") ?? [];

        if (selectedFiles.length) {
            const remainingSlots = MAX_GALLERY_IMAGES - currentImages.length;
            const filesToAdd = selectedFiles.slice(0, remainingSlots);

            if (filesToAdd.length) {
                setValue("images", [...currentImages, ...filesToAdd], {
                    shouldDirty: true,
                    shouldValidate: true,
                });
            }
        }

        event.target.value = "";
    };

    const removeGalleryImage = (index: number) => {
        setValue(
            "images",
            images.filter((_, imageIndex) => imageIndex !== index),
            {
                shouldDirty: true,
                shouldValidate: true,
            }
        );
    };

    const openThumbnailPicker = () => {
        document.getElementById("project-thumbnail-file")?.click();
    };

    const openGalleryPicker = () => {
        document.getElementById("project-gallery-files")?.click();
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
                                    onClick={openThumbnailPicker}
                                    disabled={isSubmitting}
                                >
                                    <FiUploadCloud />
                                </Button>

                                <Button
                                    type="button"
                                    size="icon"
                                    variant="destructive"
                                    onClick={() =>
                                        setValue("thumbnail", null, {
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
                                    JPG, PNG, WebP or AVIF
                                </p>
                            </div>
                        </label>
                    )}

                    <input
                        id="project-thumbnail-file"
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        className="hidden"
                        disabled={isSubmitting}
                        onChange={handleThumbnailChange}
                    />
                </div>

                {errors.thumbnail?.message && (
                    <p className="text-xs text-destructive">
                        {errors.thumbnail.message}
                    </p>
                )}

                <p className="text-xs text-muted-foreground">
                    Recommended: 1280 × 720 px. Maximum file size: 5 MB.
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
                        {images.length}/{MAX_GALLERY_IMAGES} images
                    </span>
                </div>

                {images.length > 0 && (
                    <div className="w-full overflow-hidden">
                        <div className="flex gap-3 overflow-x-auto pb-2">
                            {images.map((image, index) => (
                                <div
                                    key={
                                        image instanceof File
                                            ? `${image.name}-${image.lastModified}-${index}`
                                            : `${image.url}-${index}`
                                    }
                                    className="group relative h-24 w-40 shrink-0 overflow-hidden rounded-lg border border-border bg-muted/40 sm:h-28 sm:w-44"
                                >
                                    {galleryPreviews[index] && (
                                        <img
                                            src={galleryPreviews[index]}
                                            alt={`Project image ${index + 1}`}
                                            className="size-full object-cover"
                                        />
                                    )}

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

                            {images.length < MAX_GALLERY_IMAGES && (
                                <button
                                    type="button"
                                    onClick={openGalleryPicker}
                                    disabled={isSubmitting}
                                    className="flex h-24 w-40 shrink-0 items-center justify-center rounded-lg border border-dashed border-primary/40 bg-primary/[0.02] text-primary hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50 sm:h-28 sm:w-44"
                                >
                                    <FiPlus size={25} />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {images.length === 0 && (
                    <button
                        type="button"
                        onClick={openGalleryPicker}
                        disabled={isSubmitting}
                        className="flex h-24 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-primary/40 bg-primary/[0.02] text-sm text-primary hover:bg-primary/5"
                    >
                        <FiPlus size={18} />
                        Add project images
                    </button>
                )}

                <input
                    id="project-gallery-files"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    multiple
                    hidden
                    disabled={isSubmitting || images.length >= MAX_GALLERY_IMAGES}
                    onChange={handleGalleryChange}
                />

                {errors.images?.message && (
                    <p className="text-xs text-destructive">
                        {errors.images.message}
                    </p>
                )}

                <p className="text-xs text-muted-foreground">
                    You can add up to 10 images. Each image must be under 5 MB.
                </p>
            </div>
        </div>
    );
};

export default ProjectImageUpload;
