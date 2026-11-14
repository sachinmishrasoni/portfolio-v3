
"use client";

import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import {
    FiImage,
    FiPlus,
    FiTrash2,
    FiUploadCloud,
    FiLink,
} from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
    TextField,
    TextareaField,
} from "@/components/ui/forms";

import type { ProjectFormInput } from "../../../project.schema";
import ProjectFormSection from "../ProjectFormSection";

const ProjectMediaSection = () => {
    const {
        control,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useFormContext<ProjectFormInput>();

    const [mediaMode, setMediaMode] = useState<"image" | "url">("image");

    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [imageFiles, setImageFiles] = useState<File[]>([]);

    const [thumbnailPreview, setThumbnailPreview] = useState("");
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

    const thumbnailUrl = watch("thumbnailUrl");
    const imageUrls = watch("imageUrls");

    const galleryImages = (imageUrls ?? "")
        .split("\n")
        .map((url) => url.trim())
        .filter(Boolean);

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
            previews.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [imageFiles]);

    const handleRemoveImage = (index: number) => {
        setImageFiles((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    const handleRemoveUrlImage = (index: number) => {
        const updated = galleryImages.filter(
            (_, i) => i !== index
        );

        setValue("imageUrls", updated.join("\n"), {
            shouldDirty: true,
        });
    };

    const handleAddImage = () => {
        document.getElementById("project-gallery-upload")?.click();
    };

    return (
        <ProjectFormSection
            icon={FiImage}
            title="Project Media"
            description="Upload project images and thumbnail."
        >
            <Tabs
                value={mediaMode}
                onValueChange={(value) =>
                    setMediaMode(value as "image" | "url")
                }
                className="w-full"
            >
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="image" className="gap-2">
                        <FiImage size={15} />
                        Image Upload
                    </TabsTrigger>

                    <TabsTrigger value="url" className="gap-2">
                        <FiLink size={15} />
                        Image URLs
                    </TabsTrigger>
                </TabsList>

                {/* IMAGE UPLOAD TAB */}
                <TabsContent value="image" className="space-y-5">

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
                                        alt="Thumbnail preview"
                                        className="size-full object-cover"
                                    />

                                    <div className="absolute right-3 top-3 flex gap-2">
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="secondary"
                                            onClick={() =>
                                                document.getElementById("project-thumbnail-upload")?.click()
                                            }
                                        >
                                            <FiUploadCloud />
                                        </Button>

                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="destructive"
                                            onClick={() => setThumbnailFile(null)}
                                        >
                                            <FiTrash2 />
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <label
                                    htmlFor="project-thumbnail-upload"
                                    className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-3"
                                >
                                    <FiUploadCloud
                                        size={30}
                                        className="text-primary"
                                    />

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
                                id="project-thumbnail-upload"
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                className="hidden"
                                disabled={isSubmitting}
                                onChange={(event) => {
                                    const file = event.target.files?.[0];

                                    if (file) setThumbnailFile(file);

                                    event.target.value = "";
                                }}
                            />
                        </div>

                        <p className="text-xs text-muted-foreground">
                            Recommended: 1280 × 720 px (JPG, PNG, WebP)
                        </p>
                    </div>

                    {/* Project Images */}
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
                                            alt={file.name}
                                            className="size-full object-cover"
                                        />

                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute right-2 top-2 size-7"
                                            onClick={() => handleRemoveImage(index)}
                                            disabled={isSubmitting}
                                        >
                                            <FiTrash2 size={13} />
                                        </Button>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={handleAddImage}
                                    disabled={isSubmitting}
                                    className="flex h-24 w-40 shrink-0 items-center justify-center rounded-lg border border-dashed border-primary/40 bg-primary/[0.02] text-primary hover:bg-primary/5 sm:h-28 sm:w-44"
                                >
                                    <FiPlus size={25} />
                                </button>
                            </div>
                        </div>

                        <input
                            id="project-gallery-upload"
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            multiple
                            className="hidden"
                            disabled={isSubmitting}
                            onChange={(event) => {
                                const files = Array.from(event.target.files ?? []);

                                setImageFiles((prev) => [...prev, ...files]);

                                event.target.value = "";
                            }}
                        />
                    </div>
                </TabsContent>

                {/* IMAGE URL TAB */}
                <TabsContent value="url" className="space-y-5">

                    {/* Thumbnail URL */}
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
                        <div className="aspect-video w-full overflow-hidden rounded-xl border">
                            <img
                                src={thumbnailUrl}
                                alt="Thumbnail preview"
                                className="size-full object-cover"
                            />
                        </div>
                    )}

                    {/* Gallery URLs */}
                    <Controller
                        name="imageUrls"
                        control={control}
                        render={({ field }) => (
                            <TextareaField
                                id="project-gallery-urls"
                                name={field.name}
                                label="Project Image URLs"
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

                    {galleryImages.length > 0 && (
                        <div className="flex gap-3 overflow-x-auto pb-3">
                            {galleryImages.map((url, index) => (
                                <div
                                    key={`${url}-${index}`}
                                    className="group relative h-24 w-40 shrink-0 overflow-hidden rounded-lg border sm:h-28 sm:w-44"
                                >
                                    <img
                                        src={url}
                                        alt={`Project image ${index + 1}`}
                                        className="size-full object-cover"
                                    />

                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute right-2 top-2 size-7"
                                        onClick={() => handleRemoveUrlImage(index)}
                                        disabled={isSubmitting}
                                    >
                                        <FiTrash2 size={13} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </ProjectFormSection>
    );
};

export default ProjectMediaSection;
