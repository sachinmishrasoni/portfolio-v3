
import type { CloudinaryProjectImage } from "@/features/admin/projects/projects.types";

type UploadImagesInput = {
    files?: File[];
    thumbnail?: File;
    images?: File[];
    folder?: string;
};

type UploadImagesResult = {
    images?: CloudinaryProjectImage[];
    thumbnail?: CloudinaryProjectImage;
};

type ApiResponse<T> = {
    success: boolean;
    data: T;
    message?: string;
};

const parseResponse = async <T>(response: Response): Promise<T> => {
    const result = (await response.json()) as ApiResponse<T>;

    if (!response.ok || !result.success) {
        throw new Error(result.message || "Image operation failed.");
    }

    return result.data;
};

export const uploadCloudinaryImages = async ({
    files,
    thumbnail,
    images = [],
    folder = "portfolio/projects",
}: UploadImagesInput): Promise<UploadImagesResult> => {
    const formData = new FormData();

    formData.append("folder", folder);

    if (thumbnail) {
        formData.append("thumbnail", thumbnail);
        images.forEach((image) => formData.append("images", image));
    } else {
        (files ?? images).forEach((file) => formData.append("files", file));
    }

    const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
    });

    return parseResponse<UploadImagesResult>(response);
};

export const deleteCloudinaryImages = async (
    publicIds: string[],
): Promise<void> => {
    if (!publicIds.length) return;

    const response = await fetch("/api/cloudinary/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicIds }),
    });

    await parseResponse(response);
};
