
"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { useFormContext } from "react-hook-form";
import { FiTrash2 } from "react-icons/fi";

import { TextField, TextareaField } from "@/components/ui/forms";
import { Button } from "@/components/ui/button";
import type { ProjectFormInput } from "../../../../project.schema";

const MAX_GALLERY_IMAGES = 10;

type ProjectImageValue = NonNullable<ProjectFormInput["images"]>[number];
type ExistingProjectImage = Exclude<ProjectImageValue, File>;

const isExistingProjectImage = (image: ProjectImageValue): image is ExistingProjectImage =>
    !(image instanceof File);

const ProjectImageUrls = () => {
    const { watch, setValue, formState: { errors, isSubmitting } } = useFormContext<ProjectFormInput>();

    const thumbnail = watch("thumbnail");
    const images = watch("images") ?? [];

    const [galleryInput, setGalleryInput] = useState("");

    const thumbnailUrl = thumbnail && isExistingProjectImage(thumbnail) ? thumbnail.url : "";
    const galleryImages = images.filter(isExistingProjectImage);

    useEffect(() => {
        setGalleryInput(galleryImages.map((image) => image.url).join("\n"));
    }, [images]);

    const handleThumbnailUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
        const url = event.target.value.trim();

        setValue("thumbnail", url ? { url, source: "external" } : null, {
            shouldDirty: true,
            shouldValidate: true,
        });
    };

    const handleGalleryUrlsChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const value = event.target.value;
        setGalleryInput(value);

        const urls = value.split(/\r?\n/).map((url) => url.trim()).filter(Boolean).slice(0, MAX_GALLERY_IMAGES);

        setValue("images", urls.map((url) => ({ url, source: "external" as const })), {
            shouldDirty: true,
            shouldValidate: true,
        });
    };

    const removeGalleryImage = (index: number) => {
        const updatedImages = galleryImages.filter((_, imageIndex) => imageIndex !== index);
        const updatedUrls = updatedImages.map((image) => image.url);

        setGalleryInput(updatedUrls.join("\n"));
        setValue("images", updatedImages, {
            shouldDirty: true,
            shouldValidate: true,
        });
    };

    return (
        <div className="space-y-5">
            <div className="space-y-3">
                <TextField
                    variant="outlined"
                    id="project-thumbnail-url"
                    name="thumbnail"
                    label="Thumbnail URL"
                    placeholder="https://example.com/thumbnail.png"
                    required
                    value={thumbnailUrl}
                    onChange={handleThumbnailUrlChange}
                    disabled={isSubmitting}
                    error={errors.thumbnail?.message}
                />

                {thumbnailUrl && (
                    <div className="aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted/40">
                        <img src={thumbnailUrl} alt="Project thumbnail preview" className="size-full object-cover" />
                    </div>
                )}

                <p className="text-xs text-muted-foreground">Recommended: 1280 × 720 px. Use a publicly accessible image URL.</p>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label htmlFor="project-gallery-urls" className="text-sm font-medium">
                        Project Images <span className="ml-2 text-xs font-normal text-muted-foreground">(Optional)</span>
                    </label>
                    <span className="text-xs text-muted-foreground">{galleryImages.length}/{MAX_GALLERY_IMAGES} images</span>
                </div>

                <TextareaField
                    variant="outlined"
                    id="project-gallery-urls"
                    name="images"
                    label="Image URLs"
                    placeholder={"https://example.com/image-1.png\nhttps://example.com/image-2.png"}
                    hint="Enter one image URL per line."
                    rows={4}
                    value={galleryInput}
                    onChange={handleGalleryUrlsChange}
                    disabled={isSubmitting}
                    error={errors.images?.message}
                />

                {galleryImages.length > 0 && (
                    <div className="w-full overflow-hidden">
                        <div className="flex gap-3 overflow-x-auto pb-3">
                            {galleryImages.map((image, index) => (
                                <div key={`${image.url}-${index}`} className="group relative h-24 w-40 shrink-0 overflow-hidden rounded-lg border border-border bg-muted/40 sm:h-28 sm:w-44">
                                    <img
                                        src={image.url}
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

                {errors.images?.message && <p className="text-xs text-destructive">{errors.images.message}</p>}
            </div>
        </div>
    );
};

export default ProjectImageUrls;
