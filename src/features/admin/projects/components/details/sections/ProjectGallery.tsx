
"use client";

import { useState } from "react";
import { FiImage, FiX } from "react-icons/fi";
import type { Project, ProjectImage } from "../../../projects.types";

interface ProjectGalleryProps {
    data: Project;
}

const ProjectGallery = ({ data }: ProjectGalleryProps) => {
    const [selectedImage, setSelectedImage] = useState<ProjectImage | null>(null);

    const images = [data.thumbnail, ...data.images];

    return (
        <>
            <div className="rounded-xl border bg-card p-5">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 font-semibold">
                        <FiImage className="text-primary" />
                        Project Gallery
                    </h3>
                    <span className="text-sm text-muted-foreground">
                        {images.length} images
                    </span>
                </div>

                {images.length ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {images.map((image, index) => (
                            <button
                                key={`${image.url}-${index}`}
                                type="button"
                                onClick={() => setSelectedImage(image)}
                                className="group overflow-hidden rounded-lg border text-left"
                            >
                                <img
                                    src={image.url}
                                    alt={`${data.title} image ${index + 1}`}
                                    className="aspect-video w-full object-cover transition-transform group-hover:scale-105"
                                />
                                <p className="p-2 text-xs text-muted-foreground">
                                    {index === 0 ? "Thumbnail" : `Gallery image ${index}`}
                                </p>
                            </button>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">No project images available.</p>
                )}
            </div>

            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        type="button"
                        aria-label="Close image preview"
                        onClick={() => setSelectedImage(null)}
                        className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white"
                    >
                        <FiX size={22} />
                    </button>

                    <img
                        src={selectedImage.url}
                        alt={data.title}
                        className="max-h-[85vh] max-w-full rounded-lg object-contain"
                        onClick={(event) => event.stopPropagation()}
                    />
                </div>
            )}
        </>
    );
};

export default ProjectGallery;
