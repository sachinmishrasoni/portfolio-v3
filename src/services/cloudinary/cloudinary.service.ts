
import "server-only";

import type {
    UploadApiErrorResponse,
    UploadApiResponse,
} from "cloudinary";

import cloudinary from "@/lib/cloudinary";
import type { CloudinaryProjectImage } from "@/features/admin/projects/projects.types";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
];

type UploadImageInput = {
    file: File;
    folder?: string;
};

export const uploadImage = async ({
    file,
    folder = "portfolio",
}: UploadImageInput): Promise<CloudinaryProjectImage> => {
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        throw new Error("Only JPEG, PNG, WEBP and AVIF images are allowed");
    }

    if (file.size > MAX_FILE_SIZE) {
        throw new Error("Image size must be less than 5 MB");
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        cloudinary.uploader
            .upload_stream(
                { folder, resource_type: "image" },
                (
                    error: UploadApiErrorResponse | undefined,
                    uploadResult: UploadApiResponse | undefined
                ) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    if (!uploadResult) {
                        reject(new Error("Cloudinary upload returned no result"));
                        return;
                    }

                    resolve(uploadResult);
                }
            )
            .end(buffer);
    });

    return {
        url: result.secure_url,
        source: "cloudinary",
        publicId: result.public_id,
        ...(result.asset_id ? { assetId: result.asset_id } : {}),
    };
};

export const deleteImage = async (publicId: string) => {
    if (!publicId.startsWith("portfolio/")) {
        throw new Error("Invalid image public ID");
    }

    const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: "image",
        invalidate: true,
    });

    if (result.result !== "ok" && result.result !== "not found") {
        throw new Error("Failed to delete image from Cloudinary");
    }

    return result;
};
