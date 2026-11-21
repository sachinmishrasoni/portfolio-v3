"use client";

import { useState } from "react";
import Image from "next/image";
// import {
//     uploadCloudinaryImage,
//     deleteCloudinaryImage,
// } from "@/services/cloudinary/cloudinary.client";
import type { CloudinaryUploadResult } from "@/types/image.types";
import { deleteCloudinaryImages, uploadCloudinaryImages } from "@/services/cloudinary/cloudinary.client";

export default function CloudinaryTestPage() {
    const [file, setFile] = useState<File | null>(null);
    const [image, setImage] = useState<CloudinaryUploadResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleUpload = async () => {
        if (!file) {
            setMessage("Please select an image first.");
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const result = await uploadCloudinaryImages({
                files: [file],
                folder: "portfolio/projects",
            });

            setImage(result as CloudinaryUploadResult);
            setMessage("Image uploaded successfully!");
        } catch (error) {
            setMessage(
                error instanceof Error ? error.message : "Upload failed"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!image) return;

        try {
            setLoading(true);
            setMessage("");

            await deleteCloudinaryImages([image.publicId]);

            setImage(null);
            setFile(null);
            setMessage("Image deleted successfully!");
        } catch (error) {
            setMessage(
                error instanceof Error ? error.message : "Delete failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-2xl space-y-6 p-6">
            <div>
                <h1 className="text-2xl font-semibold">
                    Cloudinary Service Test
                </h1>
                <p className="text-sm text-muted-foreground">
                    Test image upload and deletion.
                </p>
            </div>

            <div className="space-y-4 rounded-lg border p-5">
                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    disabled={loading || !!image}
                    onChange={(event) =>
                        setFile(event.target.files?.[0] ?? null)
                    }
                />

                <button
                    type="button"
                    onClick={handleUpload}
                    disabled={!file || loading || !!image}
                    className="rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
                >
                    {loading ? "Please wait..." : "Upload Image"}
                </button>

                {image && (
                    <div className="space-y-3">
                        <Image
                            src={image.url}
                            alt="Cloudinary test upload"
                            width={500}
                            height={300}
                            unoptimized
                            className="h-48 w-full rounded-md object-contain"
                        />

                        <div className="break-all text-sm">
                            <p>
                                <strong>URL:</strong> {image.url}
                            </p>
                            <p>
                                <strong>Public ID:</strong> {image.publicId}
                            </p>
                            <p>
                                <strong>Asset ID:</strong> {image.assetId}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={loading}
                            className="rounded-md bg-destructive px-4 py-2 text-white disabled:opacity-50"
                        >
                            {loading ? "Please wait..." : "Delete Image"}
                        </button>
                    </div>
                )}

                {message && (
                    <p className="text-sm" role="status">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}