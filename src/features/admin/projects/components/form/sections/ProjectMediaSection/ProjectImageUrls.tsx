
"use client";

import { Controller, useFormContext } from "react-hook-form";
import { FiTrash2 } from "react-icons/fi";

import {
    TextField,
    TextareaField,
} from "@/components/ui/forms";

import { Button } from "@/components/ui/button";

import type { ProjectFormInput } from "../../../../project.schema";

const ProjectImageUrls = () => {
    const {
        control,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useFormContext<ProjectFormInput>();

    const thumbnailUrl = watch("thumbnailUrl");
    const imageUrls = watch("imageUrls");

    const galleryImages = (imageUrls ?? "")
        .split("\n")
        .map((url) => url.trim())
        .filter(Boolean);

    const removeGalleryImage = (index: number) => {
        const updatedImages = galleryImages.filter(
            (_, i) => i !== index
        );

        setValue("imageUrls", updatedImages.join("\n"), {
            shouldDirty: true,
            shouldValidate: true,
        });
    };

    return (
        <div className="space-y-5">

            {/* Thumbnail URL */}
            <div className="space-y-3">
                <Controller
                    name="thumbnailUrl"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            variant="outlined"
                            id="project-thumbnail-url"
                            name={field.name}
                            label="Thumbnail URL"
                            placeholder="https://example.com/thumbnail.png"
                            required
                            value={field.value ?? ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            disabled={isSubmitting}
                            error={errors.thumbnailUrl?.message}
                        />
                    )}
                />

                {thumbnailUrl && (
                    <div className="aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted/40">
                        <img
                            src={thumbnailUrl}
                            alt="Project thumbnail preview"
                            className="size-full object-cover"
                        />
                    </div>
                )}

                <p className="text-xs text-muted-foreground">
                    Recommended: 1280 × 720 px (JPG, PNG, WebP)
                </p>
            </div>

            {/* Gallery URLs */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                        Project Images
                        <span className="ml-2 text-xs font-normal text-muted-foreground">
                            (Optional)
                        </span>
                    </label>

                    <span className="text-xs text-muted-foreground">
                        {galleryImages.length} images
                    </span>
                </div>

                <Controller
                    name="imageUrls"
                    control={control}
                    render={({ field }) => (
                        <TextareaField
                            variant="outlined"
                            id="project-gallery-urls"
                            name={field.name}
                            label="Image URLs"
                            placeholder={`https://example.com/image-1.png\nhttps://example.com/image-2.png`}
                            hint="Enter one image URL per line."
                            rows={4}
                            value={field.value ?? ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            disabled={isSubmitting}
                            error={errors.imageUrls?.message}
                        />
                    )}
                />

                {/* Gallery Preview */}
                {galleryImages.length > 0 && (
                    <div className="w-full overflow-hidden">
                        <div className="flex gap-3 overflow-x-auto pb-3">
                            {galleryImages.map((url, index) => (
                                <div
                                    key={`${url}-${index}`}
                                    className="group relative h-24 w-40 shrink-0 overflow-hidden rounded-lg border border-border bg-muted/40 sm:h-28 sm:w-44"
                                >
                                    <img
                                        src={url}
                                        alt={`Project image ${index + 1}`}
                                        className="size-full object-cover"
                                        onError={(event) => {
                                            event.currentTarget.style.opacity = "0.3";
                                        }}
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
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectImageUrls;
